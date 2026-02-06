// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use axum::{
    extract::{Json, State},
    http::{HeaderMap, StatusCode},
    routing::{get, post},
    Router,
};
use once_cell::sync::Lazy;
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::process::Command;
use std::sync::{Arc, Mutex};
use tower_http::cors::CorsLayer;

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WebhookRequest {
    id: String,
    timestamp: String,
    method: String,
    path: String,
    headers: HashMap<String, String>,
    body: String,
    status_code: u16,
    error_reason: Option<String>,
}

#[derive(Clone)]
struct WebhookState {
    requests: Arc<Mutex<Vec<WebhookRequest>>>,
    auth_method: Arc<Mutex<String>>,
    auth_value: Arc<Mutex<String>>,
}

static WEBHOOK_STATE: Lazy<WebhookState> = Lazy::new(|| WebhookState {
    requests: Arc::new(Mutex::new(Vec::new())),
    auth_method: Arc::new(Mutex::new(String::new())),
    auth_value: Arc::new(Mutex::new(String::new())),
});

type ServerHandle = tokio::task::JoinHandle<()>;
static SERVER_HANDLE: Lazy<Arc<Mutex<Option<ServerHandle>>>> =
    Lazy::new(|| Arc::new(Mutex::new(None)));

async fn handle_webhook(
    State(state): State<WebhookState>,
    headers: HeaderMap,
    body: String,
) -> (StatusCode, Json<serde_json::Value>) {
    let auth_method = state.auth_method.lock().unwrap().clone();
    let auth_value = state.auth_value.lock().unwrap().clone();

    let mut status_code = 200;
    let mut error_reason: Option<String> = None;

    // Verify authentication
    if !auth_method.is_empty() && !auth_value.is_empty() {
        let auth_valid = match auth_method.as_str() {
            "bearer" => {
                if let Some(auth_header) = headers.get("authorization") {
                    if let Ok(value) = auth_header.to_str() {
                        value == format!("Bearer {}", auth_value) || value == auth_value
                    } else {
                        false
                    }
                } else {
                    false
                }
            }
            "api-key" => {
                if let Some(api_key) = headers.get("x-api-key") {
                    if let Ok(value) = api_key.to_str() {
                        value == auth_value
                    } else {
                        false
                    }
                } else {
                    false
                }
            }
            "basic" => {
                if let Some(auth_header) = headers.get("authorization") {
                    if let Ok(value) = auth_header.to_str() {
                        value == format!("Basic {}", auth_value) || value == auth_value
                    } else {
                        false
                    }
                } else {
                    false
                }
            }
            _ => true,
        };

        if !auth_valid {
            status_code = 401;
            error_reason = Some("Authentication failed: Invalid credentials".to_string());
        }
    }

    // Convert headers to HashMap
    let headers_map: HashMap<String, String> = headers
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect();

    // Create request record
    let request = WebhookRequest {
        id: uuid::Uuid::new_v4().to_string(),
        timestamp: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
        method: "POST".to_string(),
        path: "/webhook".to_string(),
        headers: headers_map,
        body: body.clone(),
        status_code,
        error_reason: error_reason.clone(),
    };

    // Store request
    state.requests.lock().unwrap().push(request);

    // Return response
    let response_body = if status_code == 200 {
        serde_json::json!({
            "success": true,
            "message": "Webhook received successfully"
        })
    } else {
        serde_json::json!({
            "success": false,
            "error": error_reason.unwrap_or_else(|| "Unknown error".to_string())
        })
    };

    (
        StatusCode::from_u16(status_code).unwrap(),
        Json(response_body),
    )
}

async fn health_check() -> &'static str {
    "Webhook server is running"
}

#[tauri::command(rename_all = "camelCase")]
async fn start_webhook_server(
    port: u16,
    auth_method: String,
    auth_value: String,
) -> Result<String, String> {
    // Check if server is already running
    {
        let handle_guard = SERVER_HANDLE.lock().unwrap();
        if handle_guard.is_some() {
            return Err("Server is already running".to_string());
        }
    }

    // Clear previous requests and update auth config
    WEBHOOK_STATE.requests.lock().unwrap().clear();
    *WEBHOOK_STATE.auth_method.lock().unwrap() = auth_method;
    *WEBHOOK_STATE.auth_value.lock().unwrap() = auth_value;

    let app = Router::new()
        .route("/webhook", post(handle_webhook))
        .route("/health", get(health_check))
        .layer(CorsLayer::permissive())
        .with_state(WEBHOOK_STATE.clone());

    let addr = format!("0.0.0.0:{}", port);
    let listener = match tokio::net::TcpListener::bind(&addr).await {
        Ok(l) => l,
        Err(e) => return Err(format!("Failed to bind to {}: {}", addr, e)),
    };

    let handle = tokio::spawn(async move {
        if let Err(e) = axum::serve(listener, app).await {
            eprintln!("Server error: {}", e);
        }
    });

    // Store the handle
    *SERVER_HANDLE.lock().unwrap() = Some(handle);

    Ok(format!("http://localhost:{}/webhook", port))
}

#[tauri::command]
async fn stop_webhook_server() -> Result<(), String> {
    let mut handle_guard = SERVER_HANDLE.lock().unwrap();
    if let Some(handle) = handle_guard.take() {
        handle.abort();
        Ok(())
    } else {
        Err("No server is running".to_string())
    }
}

#[tauri::command]
fn get_webhook_requests() -> Vec<WebhookRequest> {
    WEBHOOK_STATE.requests.lock().unwrap().clone()
}

#[tauri::command]
fn clear_webhook_requests() {
    WEBHOOK_STATE.requests.lock().unwrap().clear();
}

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SendWebhookResponse {
    status_code: u16,
    headers: HashMap<String, String>,
    body: String,
    error_reason: Option<String>,
}

#[tauri::command(rename_all = "camelCase")]
async fn send_webhook_request(
    url: String,
    method: String,
    headers: HashMap<String, String>,
    body: String,
) -> Result<SendWebhookResponse, String> {
    let client = reqwest::Client::new();

    let mut request_builder = match method.to_uppercase().as_str() {
        "GET" => client.get(&url),
        "POST" => client.post(&url),
        "PUT" => client.put(&url),
        "DELETE" => client.delete(&url),
        "PATCH" => client.patch(&url),
        _ => return Err(format!("Unsupported HTTP method: {}", method)),
    };

    for (key, value) in &headers {
        request_builder = request_builder.header(key.as_str(), value.as_str());
    }

    if !body.is_empty() && method.to_uppercase() != "GET" {
        request_builder = request_builder
            .header("content-type", "application/json")
            .body(body);
    }

    match request_builder.send().await {
        Ok(response) => {
            let status_code = response.status().as_u16();
            let resp_headers: HashMap<String, String> = response
                .headers()
                .iter()
                .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
                .collect();
            let resp_body = response.text().await.unwrap_or_default();

            let error_reason = if status_code >= 400 {
                Some(format!(
                    "HTTP {}: {}",
                    status_code,
                    resp_body.chars().take(200).collect::<String>()
                ))
            } else {
                None
            };

            Ok(SendWebhookResponse {
                status_code,
                headers: resp_headers,
                body: resp_body,
                error_reason,
            })
        }
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn calculate_digit(cpf: &[u32], inicial_weight: u32) -> u32 {
    let sum: u32 = cpf
        .iter()
        .enumerate()
        .map(|(i, &digit)| digit * (inicial_weight - i as u32))
        .sum();

    let rest: u32 = sum % 11;
    if rest < 2 {
        0
    } else {
        11 - rest
    }
}

#[tauri::command(rename_all = "camelCase")]
fn gerar_cpf(com_mascara: bool) -> String {
    let mut rng = rand::rng();

    let mut cpf: Vec<u32> = (0..9).map(|_| rng.random_range(0..10)).collect();

    let first_digit = calculate_digit(&cpf, 10);
    cpf.push(first_digit);

    let second_digit = calculate_digit(&cpf, 11);
    cpf.push(second_digit);

    // Formatar o CPF: XXX.XXX.XXX-XX
    if com_mascara {
        format!(
            "{}{}{}.{}{}{}.{}{}{}-{}{}",
            cpf[0], cpf[1], cpf[2], cpf[3], cpf[4], cpf[5], cpf[6], cpf[7], cpf[8], cpf[9], cpf[10]
        )
    } else {
        cpf.iter().map(|d| d.to_string()).collect::<String>()
    }
}

#[tauri::command(rename_all = "camelCase")]
fn gerar_cnpj(com_mascara: bool) -> String {
    let mut rng = rand::rng();

    // 8 dígitos aleatórios (raiz) + 4 dígitos do número de ordem (0001 para matriz)
    let mut cnpj: Vec<u32> = (0..8).map(|_| rng.random_range(0..10)).collect();
    cnpj.extend_from_slice(&[0, 0, 0, 1]); // Número de ordem da filial (0001 = matriz)

    let first_weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let second_weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let first_digit = {
        let sum: u32 = cnpj
            .iter()
            .zip(first_weights.iter())
            .map(|(&digit, &weight)| digit * weight)
            .sum();

        let rest = sum % 11;
        if rest < 2 {
            0
        } else {
            11 - rest
        }
    };
    cnpj.push(first_digit);

    let second_digit = {
        let sum: u32 = cnpj
            .iter()
            .zip(second_weights.iter())
            .map(|(&digit, &weight)| digit * weight)
            .sum();

        let rest = sum % 11;
        if rest < 2 {
            0
        } else {
            11 - rest
        }
    };
    cnpj.push(second_digit);

    // Formatar o CNPJ: XX.XXX.XXX/XXXX-XX
    if com_mascara {
        format!(
            "{}{}.{}{}{}.{}{}{}/{}{}{}{}-{}{}",
            cnpj[0],
            cnpj[1],
            cnpj[2],
            cnpj[3],
            cnpj[4],
            cnpj[5],
            cnpj[6],
            cnpj[7],
            cnpj[8],
            cnpj[9],
            cnpj[10],
            cnpj[11],
            cnpj[12],
            cnpj[13]
        )
    } else {
        cnpj.iter().map(|d| d.to_string()).collect::<String>()
    }
}

#[tauri::command(rename_all = "camelCase")]
fn validar_cpf(cpf_input: &str) -> Result<bool, String> {
    // Remove caracteres não numéricos
    let digits: Vec<u32> = cpf_input
        .chars()
        .filter(|c| c.is_ascii_digit())
        .filter_map(|c| c.to_digit(10))
        .collect();

    if digits.len() != 11 {
        return Err("CPF deve conter exatamente 11 dígitos".into());
    }

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if digits.windows(2).all(|w| w[0] == w[1]) {
        return Ok(false);
    }

    // Validação do primeiro dígito verificador
    let first_digit = calculate_digit(&digits[..9], 10);
    if first_digit != digits[9] {
        return Ok(false);
    }

    // Validação do segundo dígito verificador
    let second_digit = calculate_digit(&digits[..10], 11);
    if second_digit != digits[10] {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command(rename_all = "camelCase")]
fn validar_cnpj(cnpj_input: &str) -> Result<bool, String> {
    // Remove caracteres não numéricos
    let digits: Vec<u32> = cnpj_input
        .chars()
        .filter(|c| c.is_ascii_digit())
        .filter_map(|c| c.to_digit(10))
        .collect();

    if digits.len() != 14 {
        return Err("CNPJ deve conter exatamente 14 dígitos".into());
    }

    // Verifica se todos os dígitos são iguais
    if digits.windows(2).all(|w| w[0] == w[1]) {
        return Ok(false);
    }

    let first_weights: [u32; 12] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let second_weights: [u32; 13] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    // Primeiro dígito verificador
    let sum: u32 = digits[..12]
        .iter()
        .zip(first_weights.iter())
        .map(|(&d, &w)| d * w)
        .sum();
    let rest = sum % 11;
    let first_digit = if rest < 2 { 0 } else { 11 - rest };

    if first_digit != digits[12] {
        return Ok(false);
    }

    // Segundo dígito verificador
    let sum: u32 = digits[..13]
        .iter()
        .zip(second_weights.iter())
        .map(|(&d, &w)| d * w)
        .sum();
    let rest = sum % 11;
    let second_digit = if rest < 2 { 0 } else { 11 - rest };

    if second_digit != digits[13] {
        return Ok(false);
    }

    Ok(true)
}

// ==================== COLOR PICKER ====================

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PixelColor {
    r: u8,
    g: u8,
    b: u8,
    hex: String,
    rgb: String,
    cmyk: String,
}

fn rgb_to_cmyk(r: u8, g: u8, b: u8) -> (f64, f64, f64, f64) {
    if r == 0 && g == 0 && b == 0 {
        return (0.0, 0.0, 0.0, 100.0);
    }

    let r_prime = r as f64 / 255.0;
    let g_prime = g as f64 / 255.0;
    let b_prime = b as f64 / 255.0;

    let k = 1.0 - r_prime.max(g_prime).max(b_prime);
    let c = (1.0 - r_prime - k) / (1.0 - k);
    let m = (1.0 - g_prime - k) / (1.0 - k);
    let y = (1.0 - b_prime - k) / (1.0 - k);

    (c * 100.0, m * 100.0, y * 100.0, k * 100.0)
}

fn build_pixel_color(r: u8, g: u8, b: u8) -> Result<PixelColor, String> {
    let hex = format!("#{:02X}{:02X}{:02X}", r, g, b);
    let rgb_str = format!("rgb({}, {}, {})", r, g, b);
    let (c, m, y_val, k) = rgb_to_cmyk(r, g, b);
    let cmyk = format!("cmyk({:.0}%, {:.0}%, {:.0}%, {:.0}%)", c, m, y_val, k);

    Ok(PixelColor {
        r,
        g,
        b,
        hex,
        rgb: rgb_str,
        cmyk,
    })
}

// ---- Windows: Win32 API (GetDC + GetPixel) ----
#[cfg(target_os = "windows")]
fn platform_get_pixel_color(x: i32, y: i32) -> Result<PixelColor, String> {
    use std::ptr;

    #[link(name = "user32")]
    extern "system" {
        fn GetDC(hWnd: *mut std::ffi::c_void) -> *mut std::ffi::c_void;
        fn ReleaseDC(hWnd: *mut std::ffi::c_void, hDC: *mut std::ffi::c_void) -> i32;
    }

    #[link(name = "gdi32")]
    extern "system" {
        fn GetPixel(hdc: *mut std::ffi::c_void, x: i32, y: i32) -> u32;
    }

    unsafe {
        let hdc = GetDC(ptr::null_mut());
        if hdc.is_null() {
            return Err("Falha ao obter Device Context da tela".to_string());
        }

        let color = GetPixel(hdc, x, y);
        ReleaseDC(ptr::null_mut(), hdc);

        if color == 0xFFFFFFFF {
            return Err("Falha ao capturar pixel (coordenada fora da tela)".to_string());
        }

        // COLORREF format: 0x00BBGGRR
        let r = (color & 0xFF) as u8;
        let g = ((color >> 8) & 0xFF) as u8;
        let b = ((color >> 16) & 0xFF) as u8;

        build_pixel_color(r, g, b)
    }
}

// ---- macOS: screencapture + BMP parsing ----
#[cfg(target_os = "macos")]
fn platform_get_pixel_color(x: i32, y: i32) -> Result<PixelColor, String> {
    let tmp_path = "/tmp/fd4d_pixel.bmp";

    let output = Command::new("screencapture")
        .args([
            "-R",
            &format!("{},{},1,1", x, y),
            "-t",
            "bmp",
            "-x",
            tmp_path,
        ])
        .output()
        .map_err(|e| format!("Falha ao executar screencapture: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("screencapture falhou: {}", stderr));
    }

    let data = std::fs::read(tmp_path).map_err(|e| format!("Falha ao ler arquivo BMP: {}", e))?;
    let _ = std::fs::remove_file(tmp_path);

    if data.len() < 30 {
        return Err("Arquivo BMP inválido".to_string());
    }

    // BMP header: pixel data offset at bytes 10-13 (little-endian u32)
    let offset = u32::from_le_bytes([data[10], data[11], data[12], data[13]]) as usize;
    if data.len() < offset + 3 {
        return Err("Dados de pixel BMP inválidos".to_string());
    }

    // BMP armazena pixels como BGR
    let b = data[offset];
    let g = data[offset + 1];
    let r = data[offset + 2];

    build_pixel_color(r, g, b)
}

// ---- Linux: Wayland (grim) ou X11 (x11rb) ----
#[cfg(target_os = "linux")]
fn is_wayland() -> bool {
    std::env::var("WAYLAND_DISPLAY").is_ok()
        || std::env::var("XDG_SESSION_TYPE")
            .map(|s| s == "wayland")
            .unwrap_or(false)
}

#[cfg(target_os = "linux")]
fn get_pixel_color_wayland(x: i32, y: i32) -> Result<PixelColor, String> {
    let output = Command::new("grim")
        .args(["-g", &format!("{},{} 1x1", x, y), "-t", "ppm", "-"])
        .output()
        .map_err(|e| {
            format!(
                "Falha ao executar grim: {}. Instale com: sudo dnf install grim",
                e
            )
        })?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("grim falhou: {}", stderr));
    }

    // Parse PPM (P6): "P6\n1 1\n255\n" seguido de 3 bytes RGB
    let data = &output.stdout;
    let mut newline_count = 0;
    let mut header_end = 0;
    for (i, &byte) in data.iter().enumerate() {
        if byte == b'\n' {
            newline_count += 1;
            if newline_count == 3 {
                header_end = i + 1;
                break;
            }
        }
    }

    if header_end == 0 || data.len() < header_end + 3 {
        return Err("Formato PPM inválido".to_string());
    }

    build_pixel_color(data[header_end], data[header_end + 1], data[header_end + 2])
}

#[cfg(target_os = "linux")]
fn get_pixel_color_x11(x: i32, y: i32) -> Result<PixelColor, String> {
    use x11rb::connection::Connection;
    use x11rb::protocol::xproto::{ConnectionExt, ImageFormat};

    let (conn, screen_num) =
        x11rb::connect(None).map_err(|e| format!("Falha ao conectar ao X11: {}", e))?;

    let screen = &conn.setup().roots[screen_num];
    let root = screen.root;

    let image = conn
        .get_image(ImageFormat::Z_PIXMAP, root, x as i16, y as i16, 1, 1, !0)
        .map_err(|e| format!("Falha ao capturar imagem: {}", e))?
        .reply()
        .map_err(|e| format!("Falha ao obter resposta: {}", e))?;

    let data = &image.data;
    if data.len() < 3 {
        return Err("Dados de pixel inválidos".to_string());
    }

    // X11 retorna formato BGR(A)
    build_pixel_color(data[2], data[1], data[0])
}

#[cfg(target_os = "linux")]
fn platform_get_pixel_color(x: i32, y: i32) -> Result<PixelColor, String> {
    if is_wayland() {
        get_pixel_color_wayland(x, y)
    } else {
        get_pixel_color_x11(x, y)
    }
}

#[tauri::command(rename_all = "camelCase")]
fn get_pixel_color(x: i32, y: i32) -> Result<PixelColor, String> {
    platform_get_pixel_color(x, y)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            gerar_cpf,
            gerar_cnpj,
            validar_cpf,
            validar_cnpj,
            start_webhook_server,
            stop_webhook_server,
            get_webhook_requests,
            clear_webhook_requests,
            send_webhook_request,
            get_pixel_color
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

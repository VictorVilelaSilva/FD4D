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
            send_webhook_request
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use serde::{Deserialize, Serialize};

#[cfg(any(target_os = "linux", target_os = "macos"))]
use std::process::Command;

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

    let offset = u32::from_le_bytes([data[10], data[11], data[12], data[13]]) as usize;
    if data.len() < offset + 3 {
        return Err("Dados de pixel BMP inválidos".to_string());
    }

    let b = data[offset];
    let g = data[offset + 1];
    let r = data[offset + 2];

    build_pixel_color(r, g, b)
}

// ---- Linux: Portal XDG (ashpd) com fallback para hyprpicker ----
#[cfg(target_os = "linux")]
fn is_wayland() -> bool {
    std::env::var("WAYLAND_DISPLAY").is_ok()
        || std::env::var("XDG_SESSION_TYPE")
            .map(|s| s == "wayland")
            .unwrap_or(false)
}

#[cfg(target_os = "linux")]
async fn pick_color_via_portal() -> Result<PixelColor, String> {
    use ashpd::desktop::Color;

    let response = Color::pick()
        .send()
        .await
        .map_err(|e| format!("Erro ao invocar portal de cor: {}", e))?
        .response()
        .map_err(|e| format!("Seleção cancelada ou falhou: {}", e))?;

    let r = (response.red() * 255.0).round() as u8;
    let g = (response.green() * 255.0).round() as u8;
    let b = (response.blue() * 255.0).round() as u8;

    build_pixel_color(r, g, b)
}

#[cfg(target_os = "linux")]
fn pick_color_via_hyprpicker() -> Result<PixelColor, String> {
    let output = Command::new("hyprpicker")
        .args(["-a", "-f", "hex"])
        .output()
        .map_err(|e| {
            format!(
                "Falha ao executar hyprpicker: {}. Instale com: sudo dnf install hyprpicker",
                e
            )
        })?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("hyprpicker falhou: {}", stderr));
    }

    let hex_str = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let hex_clean = hex_str.trim_start_matches('#');
    if hex_clean.len() < 6 {
        return Err(format!("Formato hex inválido do hyprpicker: {}", hex_str));
    }

    let r = u8::from_str_radix(&hex_clean[0..2], 16)
        .map_err(|e| format!("Erro ao parsear R: {}", e))?;
    let g = u8::from_str_radix(&hex_clean[2..4], 16)
        .map_err(|e| format!("Erro ao parsear G: {}", e))?;
    let b = u8::from_str_radix(&hex_clean[4..6], 16)
        .map_err(|e| format!("Erro ao parsear B: {}", e))?;

    build_pixel_color(r, g, b)
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

    build_pixel_color(data[2], data[1], data[0])
}

#[cfg(target_os = "linux")]
fn platform_get_pixel_color(x: i32, y: i32) -> Result<PixelColor, String> {
    if is_wayland() {
        Err("Captura por coordenada não suportada no Wayland. Use pick_color_portal.".to_string())
    } else {
        get_pixel_color_x11(x, y)
    }
}

#[tauri::command(rename_all = "camelCase")]
pub fn get_pixel_color(x: i32, y: i32) -> Result<PixelColor, String> {
    platform_get_pixel_color(x, y)
}

#[cfg(target_os = "linux")]
#[tauri::command(rename_all = "camelCase")]
pub async fn pick_color_portal() -> Result<PixelColor, String> {
    match pick_color_via_portal().await {
        Ok(color) => return Ok(color),
        Err(portal_err) => {
            eprintln!("Portal falhou: {}. Tentando hyprpicker...", portal_err);
        }
    }

    match pick_color_via_hyprpicker() {
        Ok(color) => Ok(color),
        Err(hyprpicker_err) => Err(format!(
            "Nenhum método de captura disponível.\n\
             Portal XDG: verifique se xdg-desktop-portal-hyprland está instalado e rodando.\n\
             hyprpicker: {}.\n\
             Instale com: sudo dnf install xdg-desktop-portal-hyprland hyprpicker",
            hyprpicker_err
        )),
    }
}

#[cfg(not(target_os = "linux"))]
#[tauri::command(rename_all = "camelCase")]
pub async fn pick_color_portal() -> Result<PixelColor, String> {
    Err(
        "pick_color_portal só é suportado no Linux. Use get_pixel_color no Windows/macOS."
            .to_string(),
    )
}

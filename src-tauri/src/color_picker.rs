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

// ---- Windows: Win32 API com mouse hook interativo (baseado em wcolor) ----
#[cfg(target_os = "windows")]
#[allow(non_snake_case, non_camel_case_types, dead_code)]
mod win_ffi {
    use std::ffi::c_void;

    pub type WPARAM = usize;
    pub type LPARAM = isize;
    pub type LRESULT = isize;

    pub const WH_MOUSE_LL: i32 = 14;
    pub const WM_LBUTTONDOWN: u32 = 0x0201;

    pub const IDC_CROSS: *const u16 = 32515 as *const u16;
    pub const OCR_NORMAL: u32 = 32512;
    pub const OCR_IBEAM: u32 = 32513;
    pub const OCR_HAND: u32 = 32649;
    pub const OCR_APPSTARTING: u32 = 32650;
    pub const OCR_SIZEALL: u32 = 32646;
    pub const OCR_SIZENESW: u32 = 32643;
    pub const OCR_SIZENS: u32 = 32645;
    pub const OCR_SIZENWSE: u32 = 32642;
    pub const OCR_SIZEWE: u32 = 32644;
    pub const SPI_SETCURSORS: u32 = 0x0057;

    #[repr(C)]
    pub struct POINT {
        pub x: i32,
        pub y: i32,
    }

    impl Default for POINT {
        fn default() -> Self {
            POINT { x: 0, y: 0 }
        }
    }

    #[repr(C)]
    pub struct MSG {
        pub hwnd: *mut c_void,
        pub message: u32,
        pub wParam: WPARAM,
        pub lParam: LPARAM,
        pub time: u32,
        pub pt: POINT,
    }

    impl Default for MSG {
        fn default() -> Self {
            unsafe { std::mem::zeroed() }
        }
    }

    pub type HOOKPROC = Option<unsafe extern "system" fn(i32, WPARAM, LPARAM) -> LRESULT>;

    #[link(name = "user32")]
    extern "system" {
        pub fn GetDC(hWnd: *mut c_void) -> *mut c_void;
        pub fn ReleaseDC(hWnd: *mut c_void, hDC: *mut c_void) -> i32;
        pub fn SetWindowsHookExW(
            idHook: i32,
            lpfn: HOOKPROC,
            hmod: *mut c_void,
            dwThreadId: u32,
        ) -> *mut c_void;
        pub fn UnhookWindowsHookEx(hhk: *mut c_void) -> i32;
        pub fn CallNextHookEx(
            hhk: *mut c_void,
            nCode: i32,
            wParam: WPARAM,
            lParam: LPARAM,
        ) -> LRESULT;
        pub fn GetMessageW(
            lpMsg: *mut MSG,
            hWnd: *mut c_void,
            wMsgFilterMin: u32,
            wMsgFilterMax: u32,
        ) -> i32;
        pub fn PostQuitMessage(nExitCode: i32);
        pub fn GetCursorPos(lpPoint: *mut POINT) -> i32;
        pub fn LoadCursorW(hInstance: *mut c_void, lpCursorName: *const u16) -> *mut c_void;
        pub fn SetSystemCursor(hcur: *mut c_void, id: u32) -> i32;
        pub fn CopyIcon(hIcon: *mut c_void) -> *mut c_void;
        pub fn SystemParametersInfoW(
            uiAction: u32,
            uiParam: u32,
            pvParam: *mut c_void,
            fWinIni: u32,
        ) -> i32;
    }

    #[link(name = "gdi32")]
    extern "system" {
        pub fn GetPixel(hdc: *mut c_void, x: i32, y: i32) -> u32;
    }
}

/// Callback do mouse hook global - intercepta clique esquerdo para capturar cor
#[cfg(target_os = "windows")]
unsafe extern "system" fn low_mouse_proc(
    code: i32,
    w_param: win_ffi::WPARAM,
    l_param: win_ffi::LPARAM,
) -> win_ffi::LRESULT {
    if code < 0 {
        return win_ffi::CallNextHookEx(std::ptr::null_mut(), code, w_param, l_param);
    }

    if w_param as u32 == win_ffi::WM_LBUTTONDOWN {
        win_ffi::PostQuitMessage(0);
        return -1; // Engole o clique para não interagir com janelas
    }

    win_ffi::CallNextHookEx(std::ptr::null_mut(), code, w_param, l_param)
}

#[cfg(target_os = "windows")]
fn platform_get_pixel_color(x: i32, y: i32) -> Result<PixelColor, String> {
    unsafe {
        let hdc = win_ffi::GetDC(std::ptr::null_mut());
        if hdc.is_null() {
            return Err("Falha ao obter Device Context da tela".to_string());
        }

        let color = win_ffi::GetPixel(hdc, x, y);
        win_ffi::ReleaseDC(std::ptr::null_mut(), hdc);

        if color == 0xFFFFFFFF {
            return Err("Falha ao capturar pixel (coordenada fora da tela)".to_string());
        }

        let r = (color & 0xFF) as u8;
        let g = ((color >> 8) & 0xFF) as u8;
        let b = ((color >> 16) & 0xFF) as u8;

        build_pixel_color(r, g, b)
    }
}

#[cfg(target_os = "windows")]
fn set_all_cursors_to_cross() {
    unsafe {
        let cross = win_ffi::LoadCursorW(std::ptr::null_mut(), win_ffi::IDC_CROSS);
        if cross.is_null() {
            return;
        }
        let cursor_ids = [
            win_ffi::OCR_NORMAL,
            win_ffi::OCR_IBEAM,
            win_ffi::OCR_HAND,
            win_ffi::OCR_APPSTARTING,
            win_ffi::OCR_SIZEALL,
            win_ffi::OCR_SIZENESW,
            win_ffi::OCR_SIZENS,
            win_ffi::OCR_SIZENWSE,
            win_ffi::OCR_SIZEWE,
        ];
        for id in cursor_ids {
            let copy = win_ffi::CopyIcon(cross);
            if !copy.is_null() {
                win_ffi::SetSystemCursor(copy, id);
            }
        }
    }
}

#[cfg(target_os = "windows")]
fn restore_system_cursors() {
    unsafe {
        win_ffi::SystemParametersInfoW(
            win_ffi::SPI_SETCURSORS,
            0,
            std::ptr::null_mut(),
            0,
        );
    }
}

/// Color picker interativo para Windows: instala mouse hook global,
/// aguarda clique do usuário, captura posição do cursor e lê o pixel.
/// Lógica baseada no projeto wcolor (https://github.com/Elvyria/wcolor)
#[cfg(target_os = "windows")]
fn pick_color_interactive() -> Result<PixelColor, String> {
    unsafe {
        set_all_cursors_to_cross();

        // Instala hook global de mouse de baixo nível
        let hook = win_ffi::SetWindowsHookExW(
            win_ffi::WH_MOUSE_LL,
            Some(low_mouse_proc),
            std::ptr::null_mut(),
            0,
        );

        if hook.is_null() {
            restore_system_cursors();
            return Err("Falha ao instalar mouse hook para captura de cor".to_string());
        }

        // Message loop - bloqueia até PostQuitMessage ser chamado pelo hook (no clique)
        let mut msg = win_ffi::MSG::default();
        win_ffi::GetMessageW(&mut msg, std::ptr::null_mut(), 0, 0);

        // Remove o hook após o clique e restaura cursores
        win_ffi::UnhookWindowsHookEx(hook);
        restore_system_cursors();

        // Captura posição do cursor no momento do clique
        let mut p = win_ffi::POINT::default();
        win_ffi::GetCursorPos(&mut p);

        // Lê a cor do pixel na posição do cursor
        let dc = win_ffi::GetDC(std::ptr::null_mut());
        if dc.is_null() {
            return Err("Falha ao obter Device Context da tela".to_string());
        }

        let color = win_ffi::GetPixel(dc, p.x, p.y);
        win_ffi::ReleaseDC(std::ptr::null_mut(), dc);

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

#[cfg(target_os = "windows")]
#[tauri::command(rename_all = "camelCase")]
pub async fn pick_color_portal() -> Result<PixelColor, String> {
    // Executa o picker interativo em thread bloqueante para não travar o runtime tokio
    tokio::task::spawn_blocking(|| pick_color_interactive())
        .await
        .map_err(|e| format!("Erro na task de captura: {}", e))?
}

#[cfg(target_os = "macos")]
#[tauri::command(rename_all = "camelCase")]
pub async fn pick_color_portal() -> Result<PixelColor, String> {
    Err("pick_color_portal ainda não suportado no macOS. Use get_pixel_color.".to_string())
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod color_picker;
mod cpf_cnpj;
mod webhook;

pub use color_picker::{get_pixel_color, pick_color_portal};
pub use cpf_cnpj::{gerar_cnpj, gerar_cpf, validar_cnpj, validar_cpf};
pub use webhook::{
    clear_webhook_requests, get_webhook_requests, send_webhook_request, start_webhook_server,
    stop_webhook_server,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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
            get_pixel_color,
            pick_color_portal
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

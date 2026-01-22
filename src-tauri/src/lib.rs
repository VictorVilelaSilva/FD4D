// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use rand::Rng;

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

#[tauri::command]
fn generate_cpf(with_mask: bool) -> String {
    let mut rng = rand::rng();

    let mut cpf: Vec<u32> = (0..9).map(|_| rng.random_range(0..10)).collect();

    let frist_digit = calculate_digit(&cpf, 10);
    cpf.push(frist_digit);

    let second_digit = calculate_digit(&cpf, 11);
    cpf.push(second_digit);

    //formatar o CPF
    if with_mask {
        format!(
            "{}{}{}.{}{}{}.{}{}{}-{}{}",
            cpf[0], cpf[1], cpf[2], cpf[3], cpf[4], cpf[5], cpf[6], cpf[7], cpf[8], cpf[9], cpf[10]
        )
    } else {
        cpf.iter().map(|d| d.to_string()).collect::<String>()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, generate_cpf])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

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
            validar_cnpj
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

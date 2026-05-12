use rand::Rng;

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
pub fn gerar_cpf(com_mascara: bool) -> String {
    let mut rng = rand::rng();

    let mut cpf: Vec<u32> = (0..9).map(|_| rng.random_range(0..10)).collect();

    let first_digit = calculate_digit(&cpf, 10);
    cpf.push(first_digit);

    let second_digit = calculate_digit(&cpf, 11);
    cpf.push(second_digit);

    if com_mascara {
        format!(
            "{}{}{}.{}{}{}.{}{}{}-{}{}",
            cpf[0], cpf[1], cpf[2], cpf[3], cpf[4], cpf[5], cpf[6], cpf[7], cpf[8], cpf[9], cpf[10]
        )
    } else {
        cpf.iter().map(|d| d.to_string()).collect::<String>()
    }
}

// Valor do caractere segundo IN RFB 2.229/2024: ord(c) - 48.
// '0'..'9' -> 0..9; 'A'..'Z' -> 17..42.
fn cnpj_char_value(c: char) -> Option<u32> {
    if c.is_ascii_digit() || ('A'..='Z').contains(&c) {
        Some((c as u32) - 48)
    } else {
        None
    }
}

fn cnpj_dv(chars: &[char], weights: &[u32]) -> u32 {
    let sum: u32 = chars
        .iter()
        .zip(weights.iter())
        .map(|(&c, &w)| cnpj_char_value(c).unwrap_or(0) * w)
        .sum();
    let rest = sum % 11;
    if rest < 2 { 0 } else { 11 - rest }
}

#[tauri::command(rename_all = "camelCase")]
pub fn gerar_cnpj(com_mascara: bool, alfanumerico: bool) -> String {
    let mut rng = rand::rng();

    let alfa_charset: Vec<char> = ('0'..='9').chain('A'..='Z').collect();

    let mut cnpj: Vec<char> = if alfanumerico {
        let base: Vec<char> = (0..8)
            .map(|_| alfa_charset[rng.random_range(0..alfa_charset.len())])
            .collect();
        let ordem: Vec<char> = (0..4)
            .map(|_| alfa_charset[rng.random_range(0..alfa_charset.len())])
            .collect();
        [base, ordem].concat()
    } else {
        let mut v: Vec<char> = (0..8)
            .map(|_| char::from_digit(rng.random_range(0..10), 10).unwrap())
            .collect();
        v.extend(['0', '0', '0', '1']);
        v
    };

    let first_weights: [u32; 12] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let second_weights: [u32; 13] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let first_digit = cnpj_dv(&cnpj, &first_weights);
    cnpj.push(char::from_digit(first_digit, 10).unwrap());

    let second_digit = cnpj_dv(&cnpj, &second_weights);
    cnpj.push(char::from_digit(second_digit, 10).unwrap());

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
        cnpj.iter().collect::<String>()
    }
}

#[tauri::command(rename_all = "camelCase")]
pub fn validar_cpf(cpf_input: &str) -> Result<bool, String> {
    let digits: Vec<u32> = cpf_input
        .chars()
        .filter(|c| c.is_ascii_digit())
        .filter_map(|c| c.to_digit(10))
        .collect();

    if digits.len() != 11 {
        return Err("CPF deve conter exatamente 11 dígitos".into());
    }

    if digits.windows(2).all(|w| w[0] == w[1]) {
        return Ok(false);
    }

    let first_digit = calculate_digit(&digits[..9], 10);
    if first_digit != digits[9] {
        return Ok(false);
    }

    let second_digit = calculate_digit(&digits[..10], 11);
    if second_digit != digits[10] {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command(rename_all = "camelCase")]
pub fn validar_cnpj(cnpj_input: &str) -> Result<bool, String> {
    // Mantém apenas caracteres válidos do CNPJ alfanumérico (0-9, A-Z, em uppercase).
    let chars: Vec<char> = cnpj_input
        .chars()
        .map(|c| c.to_ascii_uppercase())
        .filter(|c| c.is_ascii_digit() || ('A'..='Z').contains(c))
        .collect();

    if chars.len() != 14 {
        return Err("CNPJ deve conter exatamente 14 caracteres (alfanuméricos)".into());
    }

    // Os dois últimos dígitos (DVs) precisam ser numéricos.
    if !chars[12].is_ascii_digit() || !chars[13].is_ascii_digit() {
        return Ok(false);
    }

    if chars.windows(2).all(|w| w[0] == w[1]) {
        return Ok(false);
    }

    let first_weights: [u32; 12] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let second_weights: [u32; 13] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let first_digit = cnpj_dv(&chars[..12], &first_weights);
    if first_digit != chars[12].to_digit(10).unwrap() {
        return Ok(false);
    }

    let second_digit = cnpj_dv(&chars[..13], &second_weights);
    if second_digit != chars[13].to_digit(10).unwrap() {
        return Ok(false);
    }

    Ok(true)
}

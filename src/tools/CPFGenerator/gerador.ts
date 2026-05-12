import { invoke } from "@tauri-apps/api/core";

export async function gerarCpf(comMascara: boolean): Promise<string> {
    return invoke<string>("gerar_cpf", { comMascara });
}

export async function gerarCnpj(comMascara: boolean, alfanumerico: boolean): Promise<string> {
    return invoke<string>("gerar_cnpj", { comMascara, alfanumerico });
}

export async function copiarParaClipboard(texto: string): Promise<void> {
    await navigator.clipboard.writeText(texto);
}

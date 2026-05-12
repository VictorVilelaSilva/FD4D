import { invoke } from "@tauri-apps/api/core";

export type ResultadoValidacao = "idle" | "valido" | "invalido" | "erro";

export function formatarCpfInput(valor: string): string {
    const n = valor.replace(/\D/g, "").slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
    if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

export function formatarCnpjInput(valor: string): string {
    // CNPJ alfanumérico (IN RFB 2.229/2024):
    // posições 1-12 aceitam [0-9A-Z]; DVs (posições 13-14) apenas [0-9].
    const upper = valor.toUpperCase();
    const base = upper.replace(/[^0-9A-Z]/g, "").slice(0, 12);
    const rest = upper.replace(/[^0-9A-Z]/g, "").slice(12, 14).replace(/\D/g, "");
    const full = base + rest;

    if (full.length <= 2) return full;
    if (full.length <= 5) return `${full.slice(0, 2)}.${full.slice(2)}`;
    if (full.length <= 8) return `${full.slice(0, 2)}.${full.slice(2, 5)}.${full.slice(5)}`;
    if (full.length <= 12) return `${full.slice(0, 2)}.${full.slice(2, 5)}.${full.slice(5, 8)}/${full.slice(8)}`;
    return `${full.slice(0, 2)}.${full.slice(2, 5)}.${full.slice(5, 8)}/${full.slice(8, 12)}-${full.slice(12)}`;
}

export interface ResultadoValidar {
    resultado: ResultadoValidacao;
    mensagem: string;
}

export async function validarCpf(cpfInput: string): Promise<ResultadoValidar> {
    const valido = await invoke<boolean>("validar_cpf", { cpfInput });
    return {
        resultado: valido ? "valido" : "invalido",
        mensagem: valido ? "CPF válido!" : "CPF inválido!",
    };
}

export async function validarCnpj(cnpjInput: string): Promise<ResultadoValidar> {
    const valido = await invoke<boolean>("validar_cnpj", { cnpjInput });
    return {
        resultado: valido ? "valido" : "invalido",
        mensagem: valido ? "CNPJ válido!" : "CNPJ inválido!",
    };
}

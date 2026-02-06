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
  const n = valor.replace(/\D/g, "").slice(0, 14);
  if (n.length <= 2) return n;
  if (n.length <= 5) return `${n.slice(0, 2)}.${n.slice(2)}`;
  if (n.length <= 8) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5)}`;
  if (n.length <= 12) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8)}`;
  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12)}`;
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

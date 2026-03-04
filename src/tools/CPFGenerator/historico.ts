const STORAGE_KEY_CPF = "fd4d_historico_cpf";
const STORAGE_KEY_CNPJ = "fd4d_historico_cnpj";
const MAX_ITEMS = 10;

export interface HistoricoItem {
    valor: string;
    timestamp: number;
}

function getStorageKey(tipo: "cpf" | "cnpj"): string {
    return tipo === "cpf" ? STORAGE_KEY_CPF : STORAGE_KEY_CNPJ;
}

export function obterHistorico(tipo: "cpf" | "cnpj"): HistoricoItem[] {
    try {
        const raw = localStorage.getItem(getStorageKey(tipo));
        if (!raw) return [];
        return JSON.parse(raw) as HistoricoItem[];
    } catch {
        return [];
    }
}

export function adicionarAoHistorico(tipo: "cpf" | "cnpj", valor: string): void {
    const historico = obterHistorico(tipo);
    historico.unshift({ valor, timestamp: Date.now() });
    if (historico.length > MAX_ITEMS) {
        historico.length = MAX_ITEMS;
    }
    localStorage.setItem(getStorageKey(tipo), JSON.stringify(historico));
}

export function limparHistorico(tipo: "cpf" | "cnpj"): void {
    localStorage.removeItem(getStorageKey(tipo));
}

export function formatarTimestamp(timestamp: number): string {
    const data = new Date(timestamp);
    return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

import { invoke } from "@tauri-apps/api/core";

/* ===== Tipos ===== */
export type AuthMethod = "none" | "bearer" | "api-key" | "basic";

export interface WebhookRequest {
    id: string;
    timestamp: string;
    method: string;
    path: string;
    headers: Record<string, string>;
    body: string;
    statusCode: number;
    errorReason: string | null;
}

export interface SendWebhookResponse {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
    errorReason: string | null;
}

export interface RequestEntry {
    id: string;
    timestamp: string;
    direction: "sent" | "received";
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
    statusCode: number;
    errorReason: string | null;
}

/* ===== Opções de Autenticação ===== */
export const AUTH_OPTIONS: { value: AuthMethod; label: string }[] = [
    { value: "none", label: "Nenhuma" },
    { value: "bearer", label: "Bearer Token" },
    { value: "api-key", label: "API Key" },
    { value: "basic", label: "Basic Auth" },
];

/* ===== Comandos Tauri ===== */
export async function startServer(
    port: number,
    authMethod: string,
    authValue: string
): Promise<string> {
    return invoke<string>("start_webhook_server", { port, authMethod, authValue });
}

export async function stopServer(): Promise<void> {
    await invoke("stop_webhook_server");
}

export async function getServerRequests(): Promise<WebhookRequest[]> {
    return invoke<WebhookRequest[]>("get_webhook_requests");
}

export async function clearServerRequests(): Promise<void> {
    await invoke("clear_webhook_requests");
}

export async function sendWebhookRequest(
    url: string,
    method: string,
    headers: Record<string, string>,
    body: string
): Promise<SendWebhookResponse> {
    return invoke<SendWebhookResponse>("send_webhook_request", {
        url,
        method,
        headers,
        body,
    });
}

/* ===== Helpers ===== */
export function buildAuthHeaders(
    method: AuthMethod,
    value: string
): Record<string, string> {
    if (!value || method === "none") return {};

    switch (method) {
        case "bearer":
            return { Authorization: `Bearer ${value}` };
        case "api-key":
            return { "X-API-Key": value };
        case "basic":
            return { Authorization: `Basic ${value}` };
        default:
            return {};
    }
}

export function formatTimestamp(): string {
    return new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function truncateBody(body: string, maxLen = 120): string {
    if (!body) return "(vazio)";
    return body.length > maxLen ? body.slice(0, maxLen) + "…" : body;
}

export function isSuccessStatus(code: number): boolean {
    return code >= 200 && code < 300;
}

export function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
}

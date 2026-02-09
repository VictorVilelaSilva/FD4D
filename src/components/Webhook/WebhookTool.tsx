import { useState, useEffect, useRef, useCallback } from "react";
import { BorderBeam } from "../ui/border-beam";
import { ShimmerButton } from "../ui/shimmer-button";
import RequestCard from "./RequestCard";
import {
    type AuthMethod,
    type RequestEntry,
    AUTH_OPTIONS,
    startServer,
    stopServer,
    getServerRequests,
    clearServerRequests,
    sendWebhookRequest,
    buildAuthHeaders,
    formatTimestamp,
} from "./logic";
import "./Webhook.css";

/* ===== Ícones ===== */
const IconeWebhook = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
        <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
        <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
        <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8H12" />
    </svg>
);

const IconeEnviar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

export default function WebhookTool() {
    /* ===== Estado do Servidor ===== */
    const [port, setPort] = useState(3000);
    const [authMethod, setAuthMethod] = useState<AuthMethod>("none");
    const [authValue, setAuthValue] = useState("");
    const [serverRunning, setServerRunning] = useState(false);
    const [serverUrl, setServerUrl] = useState("");
    const [serverLoading, setServerLoading] = useState(false);

    /* ===== Estado do Envio ===== */
    const [targetUrl, setTargetUrl] = useState("");
    const [reqBody, setReqBody] = useState('{\n  "event": "test",\n  "data": "hello"\n}');
    const [sending, setSending] = useState(false);

    /* ===== Lista de Requests ===== */
    const [requests, setRequests] = useState<RequestEntry[]>([]);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    /* ===== Polling das requests recebidas ===== */
    const pollRequests = useCallback(async () => {
        if (!serverRunning) return;
        try {
            const received = await getServerRequests();
            setRequests(prev => {
                const sentOnly = prev.filter(r => r.direction === "sent");
                const receivedEntries: RequestEntry[] = received.map(r => ({
                    id: r.id,
                    timestamp: r.timestamp,
                    direction: "received",
                    method: r.method,
                    url: r.path,
                    headers: r.headers,
                    body: r.body,
                    statusCode: r.statusCode,
                    errorReason: r.errorReason,
                }));
                return [...sentOnly, ...receivedEntries].sort(
                    (a, b) => b.timestamp.localeCompare(a.timestamp)
                );
            });
        } catch { /* silently ignore polling errors */ }
    }, [serverRunning]);

    useEffect(() => {
        if (serverRunning) {
            pollingRef.current = setInterval(pollRequests, 800);
        }
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [serverRunning, pollRequests]);

    /* ===== Atualiza URL alvo quando server inicia ===== */
    useEffect(() => {
        if (serverUrl && !targetUrl) {
            setTargetUrl(serverUrl);
        }
    }, [serverUrl, targetUrl]);

    /* ===== Handlers ===== */
    async function handleToggleServer() {
        setServerLoading(true);
        try {
            if (serverRunning) {
                await stopServer();
                setServerRunning(false);
                setServerUrl("");
            } else {
                const url = await startServer(
                    port,
                    authMethod === "none" ? "" : authMethod,
                    authValue
                );
                setServerRunning(true);
                setServerUrl(url);
            }
        } catch (error) {
            console.error("Erro no servidor:", error);
        } finally {
            setServerLoading(false);
        }
    }

    async function handleSendRequest() {
        if (!targetUrl.trim()) return;
        setSending(true);
        try {
            const headers = buildAuthHeaders(authMethod, authValue);
            const response = await sendWebhookRequest(targetUrl, "POST", headers, reqBody);

            const entry: RequestEntry = {
                id: crypto.randomUUID(),
                timestamp: formatTimestamp(),
                direction: "sent",
                method: "POST",
                url: targetUrl,
                headers: response.headers,
                body: response.body,
                statusCode: response.statusCode,
                errorReason: response.errorReason,
            };
            setRequests(prev => [entry, ...prev]);
        } catch (error) {
            const entry: RequestEntry = {
                id: crypto.randomUUID(),
                timestamp: formatTimestamp(),
                direction: "sent",
                method: "POST",
                url: targetUrl,
                headers: {},
                body: "",
                statusCode: 0,
                errorReason: String(error),
            };
            setRequests(prev => [entry, ...prev]);
        } finally {
            setSending(false);
        }
    }

    async function handleClearRequests() {
        setRequests([]);
        if (serverRunning) {
            try { await clearServerRequests(); } catch { /* ignore */ }
        }
    }

    return (
        <div className="webhook-container">
            {/* ===== Painel de Configuração ===== */}
            <div className="ferramenta webhook-config">
                <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
                <h1><IconeWebhook /> Webhook Tester</h1>

                {/* Configuração do Servidor */}
                <div className="config-section">
                    <span className="section-label">Servidor Local</span>
                    <div className="config-row">
                        <div className="field">
                            <label className="field-label">Porta</label>
                            <input
                                type="number"
                                className="webhook-input small"
                                value={port}
                                onChange={e => setPort(Number(e.target.value))}
                                disabled={serverRunning}
                                min={1024}
                                max={65535}
                            />
                        </div>
                        <div className="field grow">
                            <label className="field-label">Autenticação</label>
                            <select
                                className="webhook-select"
                                value={authMethod}
                                onChange={e => setAuthMethod(e.target.value as AuthMethod)}
                                disabled={serverRunning}
                            >
                                {AUTH_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {authMethod !== "none" && (
                        <div className="field">
                            <label className="field-label">
                                {authMethod === "bearer" && "Token"}
                                {authMethod === "api-key" && "API Key"}
                                {authMethod === "basic" && "Credenciais (base64)"}
                            </label>
                            <input
                                type="text"
                                className="webhook-input"
                                placeholder="Insira o valor de autenticação"
                                value={authValue}
                                onChange={e => setAuthValue(e.target.value)}
                                disabled={serverRunning}
                            />
                        </div>
                    )}

                    <ShimmerButton
                        shimmerColor={serverRunning ? "#ef4444" : "#a855f7"}
                        shimmerSize="0.06em"
                        shimmerDuration="2.5s"
                        background={serverRunning ? "#7f1d1d" : "var(--bg-accent)"}
                        borderRadius="8px"
                        className="btn-server"
                        onClick={handleToggleServer}
                        disabled={serverLoading}
                    >
                        {serverLoading ? "..." : serverRunning ? "Parar Servidor" : "Iniciar Servidor"}
                    </ShimmerButton>

                    {serverRunning && (
                        <div className="server-status">
                            <span className="status-dot active" />
                            <span className="status-text">Ativo em {serverUrl}</span>
                        </div>
                    )}
                </div>

                {/* Envio de Request */}
                <div className="config-section">
                    <span className="section-label">Enviar Request</span>
                    <div className="field">
                        <label className="field-label">URL de destino</label>
                        <input
                            type="text"
                            className="webhook-input"
                            placeholder="http://localhost:3000/webhook"
                            value={targetUrl}
                            onChange={e => setTargetUrl(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label className="field-label">Body (JSON)</label>
                        <textarea
                            className="webhook-textarea"
                            rows={4}
                            value={reqBody}
                            onChange={e => setReqBody(e.target.value)}
                        />
                    </div>

                    <ShimmerButton
                        shimmerColor="#a855f7"
                        shimmerSize="0.06em"
                        shimmerDuration="2.5s"
                        background="var(--bg-accent)"
                        borderRadius="8px"
                        className="btn-send"
                        onClick={handleSendRequest}
                        disabled={sending || !targetUrl.trim()}
                    >
                        <IconeEnviar />
                        {sending ? "Enviando..." : "Enviar Request"}
                    </ShimmerButton>
                </div>
            </div>

            {/* ===== Lista de Requests ===== */}
            <div className="ferramenta webhook-requests">
                <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
                <div className="requests-header">
                    <h2>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                        </svg>
                        Requests ({requests.length})
                    </h2>
                    {requests.length > 0 && (
                        <button className="btn-clear" onClick={handleClearRequests}>
                            Limpar
                        </button>
                    )}
                </div>

                <div className="requests-list" ref={listRef}>
                    {requests.length === 0 ? (
                        <div className="empty-state">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                strokeLinejoin="round" className="empty-icon">
                                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                            </svg>
                            <p>Nenhuma request ainda</p>
                            <span>Inicie o servidor e envie um request para começar</span>
                        </div>
                    ) : (
                        requests.map(entry => (
                            <RequestCard key={entry.id} entry={entry} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

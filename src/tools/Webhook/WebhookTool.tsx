import { useState, useEffect, useRef, useCallback } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { useWebhookServer } from "./useWebhookServer";
import { ServerConfigSection } from "./components/ServerConfigSection";
import { SendRequestSection } from "./components/SendRequestSection";
import { RequestsPanel } from "./components/RequestsPanel";
import {
    type RequestEntry,
    getServerRequests,
    clearServerRequests,
    sendWebhookRequest,
    buildAuthHeaders,
    formatTimestamp,
} from "./logic";
import "./Webhook.css";
import { Webhook } from "lucide-react";

export default function WebhookTool() {
    const server = useWebhookServer();

    const [targetUrl, setTargetUrl] = useState("");
    const [reqBody, setReqBody] = useState('{\n  "event": "test",\n  "data": "hello"\n}');
    const [sending, setSending] = useState(false);
    const [requests, setRequests] = useState<RequestEntry[]>([]);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const pollRequests = useCallback(async () => {
        if (!server.serverRunning) return;
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
    }, [server.serverRunning]);

    useEffect(() => {
        if (server.serverRunning) {
            pollingRef.current = setInterval(pollRequests, 800);
        }
        return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }, [server.serverRunning, pollRequests]);

    useEffect(() => {
        if (server.serverUrl && !targetUrl) setTargetUrl(server.serverUrl);
    }, [server.serverUrl, targetUrl]);

    async function handleSendRequest() {
        if (!targetUrl.trim()) return;
        setSending(true);
        try {
            const headers = buildAuthHeaders(server.authMethod, server.authValue);
            const response = await sendWebhookRequest(targetUrl, "POST", headers, reqBody);
            setRequests(prev => [{ id: crypto.randomUUID(), timestamp: formatTimestamp(), direction: "sent", method: "POST", url: targetUrl, headers: response.headers, body: response.body, statusCode: response.statusCode, errorReason: response.errorReason }, ...prev]);
        } catch (error) {
            setRequests(prev => [{ id: crypto.randomUUID(), timestamp: formatTimestamp(), direction: "sent", method: "POST", url: targetUrl, headers: {}, body: "", statusCode: 0, errorReason: String(error) }, ...prev]);
        } finally {
            setSending(false);
        }
    }

    async function handleClearRequests() {
        setRequests([]);
        if (server.serverRunning) {
            try { await clearServerRequests(); } catch { /* ignore */ }
        }
    }

    return (
        <div className="webhook-container">
            <div className="ferramenta webhook-config">
                <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
                <h1>
                    <Webhook />Webhook Tester
                </h1>

                <ServerConfigSection
                    port={server.port}
                    authMethod={server.authMethod}
                    authValue={server.authValue}
                    serverRunning={server.serverRunning}
                    serverLoading={server.serverLoading}
                    serverUrl={server.serverUrl}
                    onPortChange={server.setPort}
                    onAuthMethodChange={server.setAuthMethod}
                    onAuthValueChange={server.setAuthValue}
                    onToggleServer={server.handleToggleServer}
                />

                <SendRequestSection
                    targetUrl={targetUrl}
                    reqBody={reqBody}
                    sending={sending}
                    onTargetUrlChange={setTargetUrl}
                    onReqBodyChange={setReqBody}
                    onSend={handleSendRequest}
                />
            </div>

            <RequestsPanel requests={requests} onClear={handleClearRequests} />
        </div>
    );
}

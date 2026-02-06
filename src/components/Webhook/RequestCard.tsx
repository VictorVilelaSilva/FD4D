import { useState } from "react";
import type { RequestEntry } from "./logic";
import { isSuccessStatus, truncateBody, copyToClipboard } from "./logic";

interface Props {
    entry: RequestEntry;
}

export default function RequestCard({ entry }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [copiado, setCopiado] = useState<string | null>(null);

    const success = isSuccessStatus(entry.statusCode);

    async function handleCopy(text: string, field: string) {
        try {
            await copyToClipboard(text);
            setCopiado(field);
            setTimeout(() => setCopiado(null), 2000);
        } catch (err) {
            console.error("Erro ao copiar:", err);
        }
    }

    const headersStr = JSON.stringify(entry.headers, null, 2);
    const bodyStr = entry.body || "(vazio)";

    return (
        <div className={`request-card ${success ? "success" : "error"}`}>
            <div
                className="request-card-header"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="request-card-meta">
                    <span className={`status-badge ${success ? "badge-success" : "badge-error"}`}>
                        {entry.statusCode}
                    </span>
                    <span className="request-method">{entry.method}</span>
                    <span className="request-url">{entry.url}</span>
                </div>
                <div className="request-card-right">
                    <span className="request-time">{entry.timestamp}</span>
                    <svg
                        className={`chevron ${expanded ? "expanded" : ""}`}
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            {entry.errorReason && (
                <div className="request-error-reason">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {entry.errorReason}
                </div>
            )}

            {!expanded && entry.body && (
                <div className="request-preview">
                    {truncateBody(entry.body)}
                </div>
            )}

            {expanded && (
                <div className="request-card-details">
                    <div className="detail-section">
                        <div className="detail-header">
                            <span className="detail-label">Headers</span>
                            <button
                                className={`btn-copy-sm ${copiado === "headers" ? "copied" : ""}`}
                                onClick={() => handleCopy(headersStr, "headers")}
                            >
                                {copiado === "headers" ? "✓" : "Copiar"}
                            </button>
                        </div>
                        <pre className="detail-content">{headersStr}</pre>
                    </div>

                    <div className="detail-section">
                        <div className="detail-header">
                            <span className="detail-label">Body</span>
                            <button
                                className={`btn-copy-sm ${copiado === "body" ? "copied" : ""}`}
                                onClick={() => handleCopy(bodyStr, "body")}
                            >
                                {copiado === "body" ? "✓" : "Copiar"}
                            </button>
                        </div>
                        <pre className="detail-content">{bodyStr}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

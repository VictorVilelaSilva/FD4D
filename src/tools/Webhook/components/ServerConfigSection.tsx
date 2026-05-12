import { ShimmerButton } from "@/components/ui/shimmer-button";
import { type AuthMethod, AUTH_OPTIONS } from "../logic";

interface ServerConfigSectionProps {
    port: number;
    authMethod: AuthMethod;
    authValue: string;
    serverRunning: boolean;
    serverLoading: boolean;
    serverUrl: string;
    onPortChange: (port: number) => void;
    onAuthMethodChange: (method: AuthMethod) => void;
    onAuthValueChange: (value: string) => void;
    onToggleServer: () => void;
}

export function ServerConfigSection({
    port, authMethod, authValue, serverRunning, serverLoading, serverUrl,
    onPortChange, onAuthMethodChange, onAuthValueChange, onToggleServer,
}: ServerConfigSectionProps) {
    return (
        <div className="config-section">
            <span className="section-label">Servidor Local</span>
            <div className="config-row">
                <div className="field">
                    <label className="field-label">Porta</label>
                    <input
                        type="number"
                        className="webhook-input small"
                        value={port}
                        onChange={e => onPortChange(Number(e.target.value))}
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
                        onChange={e => onAuthMethodChange(e.target.value as AuthMethod)}
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
                        onChange={e => onAuthValueChange(e.target.value)}
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
                onClick={onToggleServer}
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
    );
}

import { ShimmerButton } from "@/components/ui/shimmer-button";

const IconeEnviar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

interface SendRequestSectionProps {
    targetUrl: string;
    reqBody: string;
    sending: boolean;
    onTargetUrlChange: (url: string) => void;
    onReqBodyChange: (body: string) => void;
    onSend: () => void;
}

export function SendRequestSection({
    targetUrl, reqBody, sending, onTargetUrlChange, onReqBodyChange, onSend,
}: SendRequestSectionProps) {
    return (
        <div className="config-section">
            <span className="section-label">Enviar Request</span>
            <div className="field">
                <label className="field-label">URL de destino</label>
                <input
                    type="text"
                    className="webhook-input"
                    placeholder="http://localhost:3000/webhook"
                    value={targetUrl}
                    onChange={e => onTargetUrlChange(e.target.value)}
                />
            </div>
            <div className="field">
                <label className="field-label">Body (JSON)</label>
                <textarea
                    className="webhook-textarea"
                    rows={4}
                    value={reqBody}
                    onChange={e => onReqBodyChange(e.target.value)}
                />
            </div>
            <ShimmerButton
                shimmerColor="#a855f7"
                shimmerSize="0.06em"
                shimmerDuration="2.5s"
                background="var(--bg-accent)"
                borderRadius="8px"
                className="btn-send"
                onClick={onSend}
                disabled={sending || !targetUrl.trim()}
            >
                <IconeEnviar />
                {sending ? "Enviando..." : "Enviar Request"}
            </ShimmerButton>
        </div>
    );
}

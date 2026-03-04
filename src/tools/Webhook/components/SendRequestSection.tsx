import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Send } from "lucide-react";

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
                <Send size={16} />
                {sending ? "Enviando..." : "Enviar Request"}
            </ShimmerButton>
        </div>
    );
}

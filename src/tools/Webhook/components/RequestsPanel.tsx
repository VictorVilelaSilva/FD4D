import { BorderBeam } from "@/components/ui/border-beam";
import RequestCard from "./RequestCard";
import { type RequestEntry } from "../logic";

const IconeInbox = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
);

interface RequestsPanelProps {
    requests: RequestEntry[];
    onClear: () => void;
}

export function RequestsPanel({ requests, onClear }: RequestsPanelProps) {
    return (
        <div className="ferramenta webhook-requests">
            <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
            <div className="requests-header">
                <h2>
                    <IconeInbox />
                    Requests ({requests.length})
                </h2>
                {requests.length > 0 && (
                    <button className="btn-clear" onClick={onClear}>
                        Limpar
                    </button>
                )}
            </div>

            <div className="requests-list">
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
    );
}

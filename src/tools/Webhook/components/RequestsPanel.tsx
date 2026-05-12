import { BorderBeam } from "@/components/ui/border-beam";
import RequestCard from "./RequestCard";
import { type RequestEntry } from "../logic";
import { Inbox } from "lucide-react";

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
                    <Inbox size={18} className="inline-icon" />
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
                        <Inbox size={40} className="empty-icon" />
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

import { useState } from "react";
import { HistoricoItem, formatarTimestamp, limparHistorico, obterHistorico } from "./historico";
import { copiarParaClipboard } from "./gerador";

interface HistoricoModalProps {
    tipo: "cpf" | "cnpj";
    aberto: boolean;
    onFechar: () => void;
}

const IconeCopiar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const IconeCopiado = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconeLixeira = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

function HistoricoModal({ tipo, aberto, onFechar }: HistoricoModalProps) {
    const [itens, setItens] = useState<HistoricoItem[]>([]);
    const [copiadoIdx, setCopiadoIdx] = useState<number | null>(null);

    const titulo = tipo === "cpf" ? "CPF" : "CNPJ";

    function atualizar() {
        setItens(obterHistorico(tipo));
    }

    function handleLimpar() {
        limparHistorico(tipo);
        setItens([]);
    }

    async function handleCopiar(valor: string, idx: number) {
        try {
            await copiarParaClipboard(valor);
            setCopiadoIdx(idx);
            setTimeout(() => setCopiadoIdx(null), 2000);
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    }

    if (!aberto) return null;

    if (itens.length === 0 && aberto) {
        const fresh = obterHistorico(tipo);
        if (fresh.length !== itens.length) {
            setTimeout(() => atualizar(), 0);
        }
    }

    return (
        <div className="historico-overlay" onClick={onFechar}>
            <div className="historico-modal" onClick={(e) => e.stopPropagation()}>
                <div className="historico-header">
                    <h2>Histórico de {titulo}</h2>
                    <button className="historico-fechar" onClick={onFechar}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {itens.length === 0 ? (
                    <div className="historico-vazio">
                        <span>Nenhum {titulo} gerado ainda.</span>
                    </div>
                ) : (
                    <>
                        <ul className="historico-lista">
                            {itens.map((item, idx) => (
                                <li key={`${item.timestamp}-${idx}`} className="historico-item">
                                    <div className="historico-item-info">
                                        <span className="historico-valor">{item.valor}</span>
                                        <span className="historico-data">{formatarTimestamp(item.timestamp)}</span>
                                    </div>
                                    <button
                                        className={`historico-copiar ${copiadoIdx === idx ? "copiado" : ""}`}
                                        onClick={() => handleCopiar(item.valor, idx)}
                                        title="Copiar"
                                    >
                                        {copiadoIdx === idx ? <IconeCopiado /> : <IconeCopiar />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="historico-footer">
                            <button className="historico-limpar" onClick={handleLimpar}>
                                <IconeLixeira /> Limpar histórico
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default HistoricoModal;

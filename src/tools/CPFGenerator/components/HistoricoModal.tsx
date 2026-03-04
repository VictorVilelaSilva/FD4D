import { useState, useEffect } from "react";
import { HistoricoItem, formatarTimestamp, limparHistorico, obterHistorico } from "../historico";
import { copiarParaClipboard } from "../gerador";
import { Copy, CopyCheck, Shredder, X } from "lucide-react";

interface HistoricoModalProps {
    tipo: "cpf" | "cnpj";
    aberto: boolean;
    onFechar: () => void;
}


function HistoricoModal({ tipo, aberto, onFechar }: HistoricoModalProps) {
    const [itens, setItens] = useState<HistoricoItem[]>([]);
    const [copiadoIdx, setCopiadoIdx] = useState<number | null>(null);

    const titulo = tipo === "cpf" ? "CPF" : "CNPJ";

    useEffect(() => {
        if (aberto) {
            setItens(obterHistorico(tipo));
        }
    }, [aberto, tipo]);

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

    return (
        <div className="historico-overlay" onClick={onFechar}>
            <div className="historico-modal" onClick={(e) => e.stopPropagation()}>
                <div className="historico-header">
                    <h2>Histórico de {titulo}</h2>
                    <button className="historico-fechar" onClick={onFechar}>
                        <X size={20} />
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
                                        {copiadoIdx === idx ? <CopyCheck size={16} /> : <Copy size={16} />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="historico-footer">
                            <button className="historico-limpar" onClick={handleLimpar}>
                                <Shredder size={16} /> Limpar histórico
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default HistoricoModal;

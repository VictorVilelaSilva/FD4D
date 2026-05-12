import { BorderBeam } from "@/components/ui/border-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { Copy, CopyCheck, File, FileSearch } from "lucide-react";


export interface CardGeradorProps {
    titulo: string;
    label: string;
    valor: string;
    valorKey: number;
    copiado: boolean;
    comMascara: boolean;
    onToggleMascara: (checked: boolean) => void;
    mascaraExemplo: string;
    onGerar: () => void;
    onCopiar: () => void;
    onAbrirHistorico: () => void;
}

export function CardGerador({
    titulo, label, valor, valorKey, copiado,
    comMascara, onToggleMascara, mascaraExemplo,
    onGerar, onCopiar, onAbrirHistorico,
}: CardGeradorProps) {
    return (
        <div className="ferramenta">
            <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
            <div className="ferramenta-header">
                <h1><File size={25} /> {titulo}</h1>
                <button className="btn-historico" onClick={onAbrirHistorico} title="Ver histórico">
                    <FileSearch size={25} />
                </button>
            </div>

            <div className="opcoes">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={comMascara}
                        onChange={(e) => onToggleMascara(e.target.checked)}
                    />
                    Com máscara ({mascaraExemplo})
                </label>
            </div>

            <ShimmerButton
                shimmerColor="#a855f7"
                shimmerSize="0.06em"
                shimmerDuration="2.5s"
                background="var(--bg-accent)"
                borderRadius="8px"
                className="btn-gerar"
                onClick={onGerar}
            >
                Gerar {titulo.replace("Gerador de ", "")}
            </ShimmerButton>

            <div className={`resultado-container ${valor ? "visivel" : ""}`}>
                <div className="resultado">
                    <span className="resultado-label">{label}:</span>
                    <div className="resultado-valor">
                        {valor ? (
                            <TypingAnimation
                                key={valorKey}
                                duration={60}
                                className="typing-value"
                                showCursor={true}
                                blinkCursor={true}
                                cursorStyle="line"
                                startOnView={false}
                            >
                                {valor}
                            </TypingAnimation>
                        ) : (
                            <span className="placeholder-value">---</span>
                        )}
                    </div>
                    <button
                        className={`btn-copiar ${copiado ? "copiado" : ""}`}
                        onClick={onCopiar}
                        disabled={!valor}
                        title="Copiar para área de transferência"
                    >
                        {copiado ? (<><CopyCheck size={16} />Copiado!</>) : (<><Copy size={16} /> Copiar</>)}
                    </button>
                </div>
            </div>
        </div>
    );
}
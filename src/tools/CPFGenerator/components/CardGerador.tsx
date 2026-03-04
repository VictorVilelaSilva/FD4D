import { BorderBeam } from "@/components/ui/border-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TypingAnimation } from "@/components/ui/typing-animation";

const IconeDocumento = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
    </svg>
);

const IconeCopiado = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconeCopiar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const IconeHistorico = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <rect width="24" height="24" fill="none" />
        <path fill="none" stroke="currentColor" strokeWidth="1.9" d="M4.998 7V1H19.5L23 4.5V23h-6m1-22v5h5M10 23a7 7 0 1 0 0-14a7 7 0 0 0 0 14Zm0-11v4l3 3" />
    </svg>
);

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
                <h1><IconeDocumento /> {titulo}</h1>
                <button className="btn-historico" onClick={onAbrirHistorico} title="Ver histórico">
                    <IconeHistorico />
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
                        {copiado ? (<><IconeCopiado /> Copiado!</>) : (<><IconeCopiar /> Copiar</>)}
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { BorderBeam } from "../ui/border-beam";
import { ShimmerButton } from "../ui/shimmer-button";
import { TypingAnimation } from "../ui/typing-animation";
import { gerarCpf, gerarCnpj, copiarParaClipboard } from "./gerador";
import "./GeradorCPFCNPJ.css";

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

interface CardGeradorProps {
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
}

function CardGerador({
    titulo, label, valor, valorKey, copiado,
    comMascara, onToggleMascara, mascaraExemplo,
    onGerar, onCopiar,
}: CardGeradorProps) {
    return (
        <div className="ferramenta">
            <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
            <h1><IconeDocumento /> {titulo}</h1>

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

function GeradorCPFCNPJ() {
    const [cpf, setCpf] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [comMascara, setComMascara] = useState(true);
    const [copiadoCpf, setCopiadoCpf] = useState(false);
    const [copiadoCnpj, setCopiadoCnpj] = useState(false);
    const [cpfKey, setCpfKey] = useState(0);
    const [cnpjKey, setCnpjKey] = useState(0);

    async function handleGerarCpf() {
        try {
            setCpf(await gerarCpf(comMascara));
            setCpfKey((prev) => prev + 1);
            setCopiadoCpf(false);
        } catch (error) {
            console.error("Erro ao gerar CPF:", error);
        }
    }

    async function handleGerarCnpj() {
        try {
            setCnpj(await gerarCnpj(comMascara));
            setCnpjKey((prev) => prev + 1);
            setCopiadoCnpj(false);
        } catch (error) {
            console.error("Erro ao gerar CNPJ:", error);
        }
    }

    async function handleCopiar(texto: string, tipo: "cpf" | "cnpj") {
        try {
            await copiarParaClipboard(texto);
            const setter = tipo === "cpf" ? setCopiadoCpf : setCopiadoCnpj;
            setter(true);
            setTimeout(() => setter(false), 2000);
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    }

    return (
        <>
            <CardGerador
                titulo="Gerador de CPF"
                label="CPF Gerado"
                valor={cpf}
                valorKey={cpfKey}
                copiado={copiadoCpf}
                comMascara={comMascara}
                onToggleMascara={setComMascara}
                mascaraExemplo="XXX.XXX.XXX-XX"
                onGerar={handleGerarCpf}
                onCopiar={() => handleCopiar(cpf, "cpf")}
            />
            <CardGerador
                titulo="Gerador de CNPJ"
                label="CNPJ Gerado"
                valor={cnpj}
                valorKey={cnpjKey}
                copiado={copiadoCnpj}
                comMascara={comMascara}
                onToggleMascara={setComMascara}
                mascaraExemplo="XX.XXX.XXX/0001-XX"
                onGerar={handleGerarCnpj}
                onCopiar={() => handleCopiar(cnpj, "cnpj")}
            />
        </>
    );
}

export default GeradorCPFCNPJ;
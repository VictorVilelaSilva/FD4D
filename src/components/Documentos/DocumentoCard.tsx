import { useState } from "react";
import { BorderBeam } from "../ui/border-beam";
import { ShimmerButton } from "../ui/shimmer-button";
import { TypingAnimation } from "../ui/typing-animation";
import {
    gerarCpf,
    gerarCnpj,
    copiarParaClipboard,
} from "../CPFGenerator/gerador";
import { adicionarAoHistorico } from "../CPFGenerator/historico";
import HistoricoModal from "../CPFGenerator/HistoricoModal";
import {
    type ResultadoValidacao,
    formatarCpfInput,
    formatarCnpjInput,
    validarCpf,
    validarCnpj,
} from "../ValidadorCPFCNPJ/validador";
import "../CPFGenerator/GeradorCPFCNPJ.css";
import "../ValidadorCPFCNPJ/ValidadorCPFCNPJ.css";
import "./DocumentoCard.css";

type Tipo = "cpf" | "cnpj";
type Aba = "gerar" | "validar";

const IconeDocumento = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
    </svg>
);
const IconeValidar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
    </svg>
);

const IconeValidarTitulo = ({ tipo }: { tipo: Tipo }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
        <path d="M9 12l2 2 4-4" />
        {tipo === "cpf" ? (
            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" />
        ) : (
            <rect x="2" y="3" width="20" height="18" rx="2" />
        )}
    </svg>
);
const IconeCopiado = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconeCopiar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
const IconeHistorico = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><path fill="none" stroke="currentColor" strokeWidth="1.9" d="M4.998 7V1H19.5L23 4.5V23h-6m1-22v5h5M10 23a7 7 0 1 0 0-14a7 7 0 0 0 0 14Zm0-11v4l3 3" /></svg>
);
const IconeCheck = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconeX = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconeLimpar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

function Toggle({
    checked,
    onChange,
    children,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    children: React.ReactNode;
}) {
    return (
        <label className="toggle">
            <input
                type="checkbox"
                className="toggle-input"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="toggle-track" aria-hidden="true">
                <span className="toggle-thumb" />
            </span>
            <span className="toggle-text">{children}</span>
        </label>
    );
}

const NOMES: Record<Tipo, string> = { cpf: "CPF", cnpj: "CNPJ" };
const MASCARA: Record<Tipo, string> = {
    cpf: "XXX.XXX.XXX-XX",
    cnpj: "XX.XXX.XXX/0001-XX",
};
const PLACEHOLDER: Record<Tipo, string> = {
    cpf: "000.000.000-00",
    cnpj: "00.000.000/0000-00",
};
const MAXLENGTH: Record<Tipo, number> = { cpf: 14, cnpj: 18 };

function PanelGerar({ tipo }: { tipo: Tipo }) {
    const [valor, setValor] = useState("");
    const [comMascara, setComMascara] = useState(true);
    const [alfanumerico, setAlfanumerico] = useState(false);
    const [copiado, setCopiado] = useState(false);
    const [valorKey, setValorKey] = useState(0);
    const [historicoAberto, setHistoricoAberto] = useState(false);

    async function handleGerar() {
        try {
            const novo =
                tipo === "cpf"
                    ? await gerarCpf(comMascara)
                    : await gerarCnpj(comMascara, alfanumerico);
            setValor(novo);
            setValorKey((k) => k + 1);
            setCopiado(false);
            adicionarAoHistorico(tipo, novo);
        } catch (error) {
            console.error(`Erro ao gerar ${tipo.toUpperCase()}:`, error);
        }
    }

    async function handleCopiar() {
        try {
            await copiarParaClipboard(valor);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    }

    const nome = NOMES[tipo];

    return (
        <>
            <div className="ferramenta-header">
                <h1>Gerador de {nome}</h1>
                <button
                    className="btn-historico"
                    onClick={() => setHistoricoAberto(true)}
                    title="Ver histórico"
                >
                    <IconeHistorico />
                </button>
            </div>

            <div className="opcoes opcoes-toggles">
                <Toggle checked={comMascara} onChange={setComMascara}>
                    Com máscara <span className="toggle-hint">({MASCARA[tipo]})</span>
                </Toggle>
                {tipo === "cnpj" && (
                    <Toggle checked={alfanumerico} onChange={setAlfanumerico}>
                        Alfanumérico <span className="toggle-hint">(novo formato)</span>
                    </Toggle>
                )}
            </div>

            <ShimmerButton
                shimmerColor="#a855f7"
                shimmerSize="0.06em"
                shimmerDuration="2.5s"
                background="var(--bg-accent)"
                borderRadius="8px"
                className="btn-gerar"
                onClick={handleGerar}
            >
                Gerar {nome}
            </ShimmerButton>

            <div className={`resultado-container ${valor ? "visivel" : ""}`}>
                <div className="resultado">
                    <span className="resultado-label">{nome} Gerado:</span>
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
                        onClick={handleCopiar}
                        disabled={!valor}
                        title="Copiar para área de transferência"
                    >
                        {copiado ? (<><IconeCopiado /> Copiado!</>) : (<><IconeCopiar /> Copiar</>)}
                    </button>
                </div>
            </div>

            {historicoAberto && (
                <HistoricoModal
                    tipo={tipo}
                    aberto={true}
                    onFechar={() => setHistoricoAberto(false)}
                />
            )}
        </>
    );
}

function PanelValidar({ tipo }: { tipo: Tipo }) {
    const [input, setInput] = useState("");
    const [resultado, setResultado] = useState<ResultadoValidacao>("idle");
    const [mensagem, setMensagem] = useState("");
    const [validando, setValidando] = useState(false);

    const nome = NOMES[tipo];

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatado =
            tipo === "cpf"
                ? formatarCpfInput(e.target.value)
                : formatarCnpjInput(e.target.value);
        setInput(formatado);
        if (resultado !== "idle") {
            setResultado("idle");
            setMensagem("");
        }
    }

    async function handleValidar() {
        if (!input.trim()) return;
        setValidando(true);
        setResultado("idle");
        try {
            const r = tipo === "cpf" ? await validarCpf(input) : await validarCnpj(input);
            setResultado(r.resultado);
            setMensagem(r.mensagem);
        } catch (error) {
            setResultado("erro");
            console.error(`Erro ao validar ${nome}:`, error);
            setMensagem(`Ocorreu um erro ao validar o ${nome}. Tente novamente.`);
        } finally {
            setValidando(false);
        }
    }

    function handleLimpar() {
        setInput("");
        setResultado("idle");
        setMensagem("");
    }

    const inputClasses = [
        "validador-input",
        resultado === "valido" ? "input-valido" : "",
        resultado === "invalido" || resultado === "erro" ? "input-invalido" : "",
    ].filter(Boolean).join(" ");

    return (
        <>
            <h1><IconeValidarTitulo tipo={tipo} /> Validador de {nome}</h1>

            <div className="validador-input-group">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder={PLACEHOLDER[tipo]}
                        value={input}
                        onChange={handleChange}
                        onKeyDown={(e) => e.key === "Enter" && handleValidar()}
                        maxLength={MAXLENGTH[tipo]}
                    />
                    {input && (
                        <button className="btn-limpar" onClick={handleLimpar} title="Limpar">
                            <IconeLimpar />
                        </button>
                    )}
                </div>

                <ShimmerButton
                    shimmerColor="#a855f7"
                    shimmerSize="0.06em"
                    shimmerDuration="2.5s"
                    background="var(--bg-accent)"
                    borderRadius="8px"
                    className="btn-validar"
                    onClick={handleValidar}
                    disabled={!input.trim() || validando}
                >
                    {validando ? "Validando..." : "Validar"}
                </ShimmerButton>
            </div>

            {resultado !== "idle" && (
                <div className={`validador-resultado ${resultado}`}>
                    <div className="resultado-icon">
                        {resultado === "valido" ? <IconeCheck /> : <IconeX />}
                    </div>
                    <span className="resultado-texto">{mensagem}</span>
                </div>
            )}
        </>
    );
}

interface DocumentoCardProps {
    tipo: Tipo;
}

function DocumentoCard({ tipo }: DocumentoCardProps) {
    const [aba, setAba] = useState<Aba>("gerar");
    const nome = NOMES[tipo];

    return (
        <div className="doc-card">
            <div className="doc-tabs" role="tablist" aria-label={`Modo do ${nome}`}>
                <button
                    role="tab"
                    aria-selected={aba === "gerar"}
                    className={`doc-tab ${aba === "gerar" ? "active" : ""}`}
                    onClick={() => setAba("gerar")}
                >
                    <span className="doc-tab-icon"><IconeDocumento /></span>
                    <span className="doc-tab-label">Gerar {nome}</span>
                </button>
                <button
                    role="tab"
                    aria-selected={aba === "validar"}
                    className={`doc-tab ${aba === "validar" ? "active" : ""}`}
                    onClick={() => setAba("validar")}
                >
                    <span className="doc-tab-icon"><IconeValidar /></span>
                    <span className="doc-tab-label">Validar {nome}</span>
                </button>
            </div>

            <div className={`ferramenta doc-card-body ${aba === "validar" ? "validador" : ""}`}>
                <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
                {aba === "gerar" ? <PanelGerar tipo={tipo} /> : <PanelValidar tipo={tipo} />}
            </div>
        </div>
    );
}

export default DocumentoCard;

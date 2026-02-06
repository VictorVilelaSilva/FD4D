import { useState } from "react";
import { BorderBeam } from "../ui/border-beam";
import { ShimmerButton } from "../ui/shimmer-button";
import {
    type ResultadoValidacao,
    formatarCpfInput,
    formatarCnpjInput,
    validarCpf,
    validarCnpj,
} from "./validador";
import "./ValidadorCPFCNPJ.css";

const IconeCheck = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconeX = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconeLimpar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

interface CampoValidadorProps {
    titulo: string; icone: React.ReactNode; placeholder: string;
    valor: string; resultado: ResultadoValidacao; mensagem: string;
    validando: boolean; maxLength: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onValidar: () => void; onLimpar: () => void;
}

function CampoValidador({
    titulo, icone, placeholder, valor, resultado,
    mensagem, validando, maxLength, onChange,
    onKeyDown, onValidar, onLimpar,
}: CampoValidadorProps) {
    const inputClasses = [
        "validador-input",
        resultado === "valido" ? "input-valido" : "",
        resultado === "invalido" || resultado === "erro" ? "input-invalido" : "",
    ].filter(Boolean).join(" ");

    return (
        <div className="ferramenta validador">
            <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
            <h1>{icone} {titulo}</h1>

            <div className="validador-input-group">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder={placeholder}
                        value={valor}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        maxLength={maxLength}
                    />
                    {valor && (
                        <button className="btn-limpar" onClick={onLimpar} title="Limpar">
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
                    onClick={onValidar}
                    disabled={!valor.trim() || validando}
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
        </div>
    );
}

function ValidadorCPFCNPJ() {
    const [cpfInput, setCpfInput] = useState("");
    const [cnpjInput, setCnpjInput] = useState("");
    const [cpfRes, setCpfRes] = useState<ResultadoValidacao>("idle");
    const [cnpjRes, setCnpjRes] = useState<ResultadoValidacao>("idle");
    const [cpfMsg, setCpfMsg] = useState("");
    const [cnpjMsg, setCnpjMsg] = useState("");
    const [validandoCpf, setValidandoCpf] = useState(false);
    const [validandoCnpj, setValidandoCnpj] = useState(false);

    function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCpfInput(formatarCpfInput(e.target.value));
        if (cpfRes !== "idle") { setCpfRes("idle"); setCpfMsg(""); }
    }

    function handleCnpjChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCnpjInput(formatarCnpjInput(e.target.value));
        if (cnpjRes !== "idle") { setCnpjRes("idle"); setCnpjMsg(""); }
    }

    async function handleValidarCpf() {
        if (!cpfInput.trim()) return;
        setValidandoCpf(true);
        setCpfRes("idle");
        try {
            const { resultado, mensagem } = await validarCpf(cpfInput);
            setCpfRes(resultado);
            setCpfMsg(mensagem);
        } catch (error) {
            setCpfRes("erro");
            console.error("Erro ao validar CPF:", error);
            setCpfMsg("Ocorreu um erro ao validar o CPF. Tente novamente.");
        } finally {
            setValidandoCpf(false);
        }
    }

    async function handleValidarCnpj() {
        if (!cnpjInput.trim()) return;
        setValidandoCnpj(true);
        setCnpjRes("idle");
        try {
            const { resultado, mensagem } = await validarCnpj(cnpjInput);
            setCnpjRes(resultado);
            setCnpjMsg(mensagem);
        } catch (error) {
            setCnpjRes("erro");
            console.error("Erro ao validar CNPJ:", error);
            setCnpjMsg("Ocorreu um erro ao validar o CNPJ. Tente novamente.");
        } finally {
            setValidandoCnpj(false);
        }
    }

    const iconeValidar = (paths: React.ReactNode) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
            <path d="M9 12l2 2 4-4" />
            {paths}
        </svg>
    );

    return (
        <>
            <CampoValidador
                titulo="Validador de CPF"
                icone={iconeValidar(<path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" />)}
                placeholder="000.000.000-00"
                valor={cpfInput}
                resultado={cpfRes}
                mensagem={cpfMsg}
                validando={validandoCpf}
                maxLength={14}
                onChange={handleCpfChange}
                onKeyDown={(e) => e.key === "Enter" && handleValidarCpf()}
                onValidar={handleValidarCpf}
                onLimpar={() => { setCpfInput(""); setCpfRes("idle"); setCpfMsg(""); }}
            />
            <CampoValidador
                titulo="Validador de CNPJ"
                icone={iconeValidar(<rect x="2" y="3" width="20" height="18" rx="2" />)}
                placeholder="00.000.000/0000-00"
                valor={cnpjInput}
                resultado={cnpjRes}
                mensagem={cnpjMsg}
                validando={validandoCnpj}
                maxLength={18}
                onChange={handleCnpjChange}
                onKeyDown={(e) => e.key === "Enter" && handleValidarCnpj()}
                onValidar={handleValidarCnpj}
                onLimpar={() => { setCnpjInput(""); setCnpjRes("idle"); setCnpjMsg(""); }}
            />
        </>
    );
}

export default ValidadorCPFCNPJ;
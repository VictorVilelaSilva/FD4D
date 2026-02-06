import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { BorderBeam } from "../ui/border-beam";
import { ShimmerButton } from "../ui/shimmer-button";
import "./ValidadorCPFCNPJ.css";

type ResultadoValidacao = "idle" | "valido" | "invalido" | "erro";

function ValidadorCPFCNPJ() {
    const [cpfInput, setCpfInput] = useState("");
    const [cnpjInput, setCnpjInput] = useState("");
    const [cpfResultado, setCpfResultado] = useState<ResultadoValidacao>("idle");
    const [cnpjResultado, setCnpjResultado] = useState<ResultadoValidacao>("idle");
    const [cpfMensagem, setCpfMensagem] = useState("");
    const [cnpjMensagem, setCnpjMensagem] = useState("");
    const [validandoCpf, setValidandoCpf] = useState(false);
    const [validandoCnpj, setValidandoCnpj] = useState(false);

    function formatarCpfInput(valor: string) {
        const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
        let formatado = apenasNumeros;
        if (apenasNumeros.length > 3) {
            formatado = apenasNumeros.slice(0, 3) + "." + apenasNumeros.slice(3);
        }
        if (apenasNumeros.length > 6) {
            formatado = formatado.slice(0, 7) + "." + apenasNumeros.slice(6);
        }
        if (apenasNumeros.length > 9) {
            formatado = formatado.slice(0, 11) + "-" + apenasNumeros.slice(9);
        }
        return formatado;
    }

    function formatarCnpjInput(valor: string) {
        const apenasNumeros = valor.replace(/\D/g, "").slice(0, 14);
        let formatado = apenasNumeros;
        if (apenasNumeros.length > 2) {
            formatado = apenasNumeros.slice(0, 2) + "." + apenasNumeros.slice(2);
        }
        if (apenasNumeros.length > 5) {
            formatado = formatado.slice(0, 6) + "." + apenasNumeros.slice(5);
        }
        if (apenasNumeros.length > 8) {
            formatado = formatado.slice(0, 10) + "/" + apenasNumeros.slice(8);
        }
        if (apenasNumeros.length > 12) {
            formatado = formatado.slice(0, 15) + "-" + apenasNumeros.slice(12);
        }
        return formatado;
    }

    function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatado = formatarCpfInput(e.target.value);
        setCpfInput(formatado);
        if (cpfResultado !== "idle") {
            setCpfResultado("idle");
            setCpfMensagem("");
        }
    }

    function handleCnpjChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatado = formatarCnpjInput(e.target.value);
        setCnpjInput(formatado);
        if (cnpjResultado !== "idle") {
            setCnpjResultado("idle");
            setCnpjMensagem("");
        }
    }

    async function handleValidarCpf() {
        if (!cpfInput.trim()) return;

        setValidandoCpf(true);
        setCpfResultado("idle");

        try {
            const valido = await invoke<boolean>("validar_cpf", {
                cpfInput: cpfInput,
            });

            if (valido) {
                setCpfResultado("valido");
                setCpfMensagem("CPF válido!");
            } else {
                setCpfResultado("invalido");
                setCpfMensagem("CPF inválido!");
            }
        } catch (error) {
            setCpfResultado("erro");
            setCpfMensagem(String(error));
        } finally {
            setValidandoCpf(false);
        }
    }

    async function handleValidarCnpj() {
        if (!cnpjInput.trim()) return;

        setValidandoCnpj(true);
        setCnpjResultado("idle");

        try {
            const valido = await invoke<boolean>("validar_cnpj", {
                cnpjInput: cnpjInput,
            });

            if (valido) {
                setCnpjResultado("valido");
                setCnpjMensagem("CNPJ válido!");
            } else {
                setCnpjResultado("invalido");
                setCnpjMensagem("CNPJ inválido!");
            }
        } catch (error) {
            setCnpjResultado("erro");
            setCnpjMensagem(String(error));
        } finally {
            setValidandoCnpj(false);
        }
    }

    function handleCpfKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleValidarCpf();
        }
    }

    function handleCnpjKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleValidarCnpj();
        }
    }

    function limparCpf() {
        setCpfInput("");
        setCpfResultado("idle");
        setCpfMensagem("");
    }

    function limparCnpj() {
        setCnpjInput("");
        setCnpjResultado("idle");
        setCnpjMensagem("");
    }

    return (
        <>
            {/* Validador CPF */}
            <div className="ferramenta validador">
                <BorderBeam
                    size={80}
                    duration={8}
                    colorFrom="#8c52ff"
                    colorTo="#a855f7"
                    borderWidth={1}
                />
                <h1>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="inline-icon"
                    >
                        <path d="M9 12l2 2 4-4" />
                        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" />
                    </svg>
                    Validador de CPF
                </h1>

                <div className="validador-input-group">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className={`validador-input ${cpfResultado === "valido" ? "input-valido" : ""} ${cpfResultado === "invalido" || cpfResultado === "erro" ? "input-invalido" : ""}`}
                            placeholder="000.000.000-00"
                            value={cpfInput}
                            onChange={handleCpfChange}
                            onKeyDown={handleCpfKeyDown}
                            maxLength={14}
                        />
                        {cpfInput && (
                            <button
                                className="btn-limpar"
                                onClick={limparCpf}
                                title="Limpar"
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
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
                        onClick={handleValidarCpf}
                        disabled={!cpfInput.trim() || validandoCpf}
                    >
                        {validandoCpf ? "Validando..." : "Validar"}
                    </ShimmerButton>
                </div>

                {cpfResultado !== "idle" && (
                    <div className={`validador-resultado ${cpfResultado}`}>
                        <div className="resultado-icon">
                            {cpfResultado === "valido" ? (
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            )}
                        </div>
                        <span className="resultado-texto">{cpfMensagem}</span>
                    </div>
                )}
            </div>

            {/* Validador CNPJ */}
            <div className="ferramenta validador">
                <BorderBeam
                    size={80}
                    duration={8}
                    colorFrom="#8c52ff"
                    colorTo="#a855f7"
                    borderWidth={1}
                />
                <h1>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="inline-icon"
                    >
                        <path d="M9 12l2 2 4-4" />
                        <rect x="2" y="3" width="20" height="18" rx="2" />
                    </svg>
                    Validador de CNPJ
                </h1>

                <div className="validador-input-group">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className={`validador-input ${cnpjResultado === "valido" ? "input-valido" : ""} ${cnpjResultado === "invalido" || cnpjResultado === "erro" ? "input-invalido" : ""}`}
                            placeholder="00.000.000/0000-00"
                            value={cnpjInput}
                            onChange={handleCnpjChange}
                            onKeyDown={handleCnpjKeyDown}
                            maxLength={18}
                        />
                        {cnpjInput && (
                            <button
                                className="btn-limpar"
                                onClick={limparCnpj}
                                title="Limpar"
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
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
                        onClick={handleValidarCnpj}
                        disabled={!cnpjInput.trim() || validandoCnpj}
                    >
                        {validandoCnpj ? "Validando..." : "Validar"}
                    </ShimmerButton>
                </div>

                {cnpjResultado !== "idle" && (
                    <div className={`validador-resultado ${cnpjResultado}`}>
                        <div className="resultado-icon">
                            {cnpjResultado === "valido" ? (
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            )}
                        </div>
                        <span className="resultado-texto">{cnpjMensagem}</span>
                    </div>
                )}
            </div>
        </>
    );
}

export default ValidadorCPFCNPJ;

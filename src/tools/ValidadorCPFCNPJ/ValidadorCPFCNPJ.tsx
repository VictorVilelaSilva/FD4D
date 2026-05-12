import { type ResultadoValidacao } from "./validador";
import { useValidador } from "./useValidador";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Check, X, CircleCheck, SquareCheck } from "lucide-react";
import "./ValidadorCPFCNPJ.css";

interface CampoValidadorProps {
    titulo: string;
    icone: React.ReactNode;
    placeholder: string;
    valor: string;
    resultado: ResultadoValidacao;
    mensagem: string;
    validando: boolean;
    maxLength: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onValidar: () => void;
    onLimpar: () => void;
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
                            <X size={14} />
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
                        {resultado === "valido" ? <Check size={22} /> : <X size={22} />}
                    </div>
                    <span className="resultado-texto">{mensagem}</span>
                </div>
            )}
        </div>
    );
}

function ValidadorCPFCNPJ() {
    const cpf = useValidador("cpf");
    const cnpj = useValidador("cnpj");

    return (
        <>
            <CampoValidador
                titulo="Validador de CPF"
                icone={<CircleCheck size={24} className="inline-icon" />}
                placeholder="000.000.000-00"
                valor={cpf.input}
                resultado={cpf.resultado}
                mensagem={cpf.mensagem}
                validando={cpf.validando}
                maxLength={14}
                onChange={cpf.handleChange}
                onKeyDown={(e) => e.key === "Enter" && cpf.handleValidar()}
                onValidar={cpf.handleValidar}
                onLimpar={cpf.handleLimpar}
            />
            <CampoValidador
                titulo="Validador de CNPJ"
                icone={<SquareCheck size={24} className="inline-icon" />}
                placeholder="00.000.000/0000-00"
                valor={cnpj.input}
                resultado={cnpj.resultado}
                mensagem={cnpj.mensagem}
                validando={cnpj.validando}
                maxLength={18}
                onChange={cnpj.handleChange}
                onKeyDown={(e) => e.key === "Enter" && cnpj.handleValidar()}
                onValidar={cnpj.handleValidar}
                onLimpar={cnpj.handleLimpar}
            />
        </>
    );
}

export default ValidadorCPFCNPJ;

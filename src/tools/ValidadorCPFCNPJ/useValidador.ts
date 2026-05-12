import { useState } from "react";
import {
    type ResultadoValidacao,
    formatarCpfInput,
    formatarCnpjInput,
    validarCpf,
    validarCnpj,
} from "./validador";

export function useValidador(tipo: "cpf" | "cnpj") {
    const [input, setInput] = useState("");
    const [resultado, setResultado] = useState<ResultadoValidacao>("idle");
    const [mensagem, setMensagem] = useState("");
    const [validando, setValidando] = useState(false);

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
            const validarFn = tipo === "cpf" ? validarCpf : validarCnpj;
            const { resultado: res, mensagem: msg } = await validarFn(input);
            setResultado(res);
            setMensagem(msg);
        } catch (error) {
            setResultado("erro");
            console.error(`Erro ao validar ${tipo.toUpperCase()}:`, error);
            setMensagem(
                `Ocorreu um erro ao validar o ${tipo.toUpperCase()}. Tente novamente.`
            );
        } finally {
            setValidando(false);
        }
    }

    function handleLimpar() {
        setInput("");
        setResultado("idle");
        setMensagem("");
    }

    return { input, resultado, mensagem, validando, handleChange, handleValidar, handleLimpar };
}

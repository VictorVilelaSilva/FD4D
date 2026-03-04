import { useState } from "react";
import { gerarCpf, gerarCnpj, copiarParaClipboard } from "./gerador";
import { adicionarAoHistorico } from "./historico";

export function useGerador(tipo: "cpf" | "cnpj") {
    const [valor, setValor] = useState("");
    const [valorKey, setValorKey] = useState(0);
    const [copiado, setCopiado] = useState(false);
    const [comMascara, setComMascara] = useState(true);

    const gerarFn = tipo === "cpf" ? gerarCpf : gerarCnpj;

    async function handleGerar() {
        try {
            const novoValor = await gerarFn(comMascara);
            setValor(novoValor);
            setValorKey((prev) => prev + 1);
            setCopiado(false);
            adicionarAoHistorico(tipo, novoValor);
        } catch (error) {
            console.error(`Erro ao gerar ${tipo.toUpperCase()}:`, error);
        }
    }

    async function handleCopiar() {
        if (!valor) return;
        try {
            await copiarParaClipboard(valor);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    }

    return { valor, valorKey, copiado, comMascara, setComMascara, handleGerar, handleCopiar };
}

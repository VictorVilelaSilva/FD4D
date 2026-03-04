import { useState } from "react";
import { useGerador } from "./useGerador";
import { CardGerador } from "./components/CardGerador";
import HistoricoModal from "./components/HistoricoModal";
import "./GeradorCPFCNPJ.css";

function GeradorCPFCNPJ() {
    const cpf = useGerador("cpf");
    const cnpj = useGerador("cnpj");
    const [historicoAberto, setHistoricoAberto] = useState<"cpf" | "cnpj" | null>(null);

    return (
        <>
            <CardGerador
                titulo="Gerador de CPF"
                label="CPF Gerado"
                valor={cpf.valor}
                valorKey={cpf.valorKey}
                copiado={cpf.copiado}
                comMascara={cpf.comMascara}
                onToggleMascara={cpf.setComMascara}
                mascaraExemplo="XXX.XXX.XXX-XX"
                onGerar={cpf.handleGerar}
                onCopiar={cpf.handleCopiar}
                onAbrirHistorico={() => setHistoricoAberto("cpf")}
            />
            <CardGerador
                titulo="Gerador de CNPJ"
                label="CNPJ Gerado"
                valor={cnpj.valor}
                valorKey={cnpj.valorKey}
                copiado={cnpj.copiado}
                comMascara={cnpj.comMascara}
                onToggleMascara={cnpj.setComMascara}
                mascaraExemplo="XX.XXX.XXX/0001-XX"
                onGerar={cnpj.handleGerar}
                onCopiar={cnpj.handleCopiar}
                onAbrirHistorico={() => setHistoricoAberto("cnpj")}
            />
            {historicoAberto && (
                <HistoricoModal
                    tipo={historicoAberto}
                    aberto={true}
                    onFechar={() => setHistoricoAberto(null)}
                />
            )}
        </>
    );
}

export default GeradorCPFCNPJ;

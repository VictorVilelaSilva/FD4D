import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./GeradorCPFCNPJ.css";

function GeradorCPFCNPJ() {
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [comMascara, setComMascara] = useState(true);
  const [copiadoCpf, setCopiadoCpf] = useState(false);
  const [copiadoCnpj, setCopiadoCnpj] = useState(false);

  async function handleGerarCpf() {
    try {
      const cpfGerado = await invoke<string>("gerar_cpf", {
        comMascara: comMascara,
      });
      console.log(cpfGerado);
      setCpf(cpfGerado);
      setCopiadoCpf(false);
    } catch (error) {
      console.error("Erro ao gerar CPF:", error);
    }
  }

  async function handleGerarCnpj() {
    try {
      const cnpjGerado = await invoke<string>("gerar_cnpj", {
        comMascara: comMascara,
      });
      console.log(cnpjGerado);
      setCnpj(cnpjGerado);
      setCopiadoCnpj(false);
    } catch (error) {
      console.error("Erro ao gerar CNPJ:", error);
    }
  }

  async function copiarParaClipboard(texto: string, tipo: "cpf" | "cnpj") {
    try {
      await navigator.clipboard.writeText(texto);
      if (tipo === "cpf") {
        setCopiadoCpf(true);
        setTimeout(() => setCopiadoCpf(false), 2000);
      } else {
        setCopiadoCnpj(true);
        setTimeout(() => setCopiadoCnpj(false), 2000);
      }
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  }

  return (
    <>
      <div className="ferramenta">
        <h1>📄 Gerador de CPF</h1>

        <div className="opcoes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={comMascara}
              onChange={(e) => setComMascara(e.target.checked)}
            />
            Com máscara (XXX.XXX.XXX-XX)
          </label>
        </div>

        <button className="btn-primary" onClick={handleGerarCpf}>
          Gerar CPF
        </button>

        <div className={`resultado-container ${cpf ? "visivel" : ""}`}>
          <div className="resultado">
            <span className="resultado-label">CPF Gerado:</span>
            <code className="resultado-valor">{cpf || "---"}</code>
            <button
              className={`btn-copiar ${copiadoCpf ? "copiado" : ""}`}
              onClick={() => copiarParaClipboard(cpf, "cpf")}
              disabled={!cpf}
              title="Copiar para área de transferência"
            >
              {copiadoCpf ? "✓ Copiado!" : "📋 Copiar"}
            </button>
          </div>
        </div>
      </div>

      <div className="ferramenta">
        <h1>📄 Gerador de CNPJ</h1>

        <div className="opcoes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={comMascara}
              onChange={(e) => setComMascara(e.target.checked)}
            />
            Com máscara (XX.XXX.XXX/0001-XX)
          </label>
        </div>

        <button className="btn-primary" onClick={handleGerarCnpj}>
          Gerar CNPJ
        </button>

        <div className={`resultado-container ${cnpj ? "visivel" : ""}`}>
          <div className="resultado">
            <span className="resultado-label">CNPJ Gerado:</span>
            <code className="resultado-valor">{cnpj || "---"}</code>
            <button
              className={`btn-copiar ${copiadoCnpj ? "copiado" : ""}`}
              onClick={() => copiarParaClipboard(cnpj, "cnpj")}
              disabled={!cnpj}
              title="Copiar para área de transferência"
            >
              {copiadoCnpj ? "✓ Copiado!" : "📋 Copiar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GeradorCPFCNPJ;
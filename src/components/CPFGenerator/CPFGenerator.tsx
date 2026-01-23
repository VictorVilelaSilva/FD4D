import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./GeradorCPF.css";

function GeradorCPF() {
  const [cpf, setCpf] = useState("");
  const [comMascara, setComMascara] = useState(true);

  async function handleGerarCpf() {
    try {
      const cpfGerado = await invoke<string>("gerar_cpf", {
        comMascara: comMascara,
      });
      setCpf(cpfGerado);
    } catch (error) {
      console.error("Erro ao gerar CPF:", error);
    }
  }

  return (
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

      {cpf && (
        <div className="resultado">
          <p>CPF Gerado:</p>
          <code>{cpf}</code>
        </div>
      )}
    </div>
  );
}

export default GeradorCPF;
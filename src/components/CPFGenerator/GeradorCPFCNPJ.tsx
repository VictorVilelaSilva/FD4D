import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { BorderBeam } from "../ui/border-beam";
import { ShimmerButton } from "../ui/shimmer-button";
import { TypingAnimation } from "../ui/typing-animation";
import "./GeradorCPFCNPJ.css";

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
      const cpfGerado = await invoke<string>("gerar_cpf", {
        comMascara: comMascara,
      });
      setCpf(cpfGerado);
      setCpfKey((prev) => prev + 1);
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
      setCnpj(cnpjGerado);
      setCnpjKey((prev) => prev + 1);
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
        <BorderBeam
          size={80}
          duration={8}
          colorFrom="#8c52ff"
          colorTo="#a855f7"
          borderWidth={1}
        />
        <h1>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <path d="M9 7h6" />
            <path d="M9 11h6" />
            <path d="M9 15h4" />
          </svg>
          Gerador de CPF
        </h1>

        <div className="opcoes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={comMascara}
              onChange={(e) => setComMascara(e.target.checked)}
            />
            Com mascara (XXX.XXX.XXX-XX)
          </label>
        </div>

        <ShimmerButton
          shimmerColor="#a855f7"
          shimmerSize="0.06em"
          shimmerDuration="2.5s"
          background="var(--bg-accent)"
          borderRadius="8px"
          className="btn-gerar"
          onClick={handleGerarCpf}
        >
          Gerar CPF
        </ShimmerButton>

        <div className={`resultado-container ${cpf ? "visivel" : ""}`}>
          <div className="resultado">
            <span className="resultado-label">CPF Gerado:</span>
            <div className="resultado-valor">
              {cpf ? (
                <TypingAnimation
                  key={cpfKey}
                  duration={60}
                  className="typing-value"
                  showCursor={true}
                  blinkCursor={true}
                  cursorStyle="line"
                  startOnView={false}
                >
                  {cpf}
                </TypingAnimation>
              ) : (
                <span className="placeholder-value">---</span>
              )}
            </div>
            <button
              className={`btn-copiar ${copiadoCpf ? "copiado" : ""}`}
              onClick={() => copiarParaClipboard(cpf, "cpf")}
              disabled={!cpf}
              title="Copiar para area de transferencia"
            >
              {copiadoCpf ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="ferramenta">
        <BorderBeam
          size={80}
          duration={8}
          delay={3}
          colorFrom="#8c52ff"
          colorTo="#a855f7"
          borderWidth={1}
        />
        <h1>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-icon">
            <path d="M4 7V4h16v3" />
            <path d="M9 20h6" />
            <path d="M12 4v16" />
          </svg>
          Gerador de CNPJ
        </h1>

        <div className="opcoes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={comMascara}
              onChange={(e) => setComMascara(e.target.checked)}
            />
            Com mascara (XX.XXX.XXX/0001-XX)
          </label>
        </div>

        <ShimmerButton
          shimmerColor="#a855f7"
          shimmerSize="0.06em"
          shimmerDuration="2.5s"
          background="var(--bg-accent)"
          borderRadius="8px"
          className="btn-gerar"
          onClick={handleGerarCnpj}
        >
          Gerar CNPJ
        </ShimmerButton>

        <div className={`resultado-container ${cnpj ? "visivel" : ""}`}>
          <div className="resultado">
            <span className="resultado-label">CNPJ Gerado:</span>
            <div className="resultado-valor">
              {cnpj ? (
                <TypingAnimation
                  key={cnpjKey}
                  duration={60}
                  className="typing-value"
                  showCursor={true}
                  blinkCursor={true}
                  cursorStyle="line"
                  startOnView={false}
                >
                  {cnpj}
                </TypingAnimation>
              ) : (
                <span className="placeholder-value">---</span>
              )}
            </div>
            <button
              className={`btn-copiar ${copiadoCnpj ? "copiado" : ""}`}
              onClick={() => copiarParaClipboard(cnpj, "cnpj")}
              disabled={!cnpj}
              title="Copiar para area de transferencia"
            >
              {copiadoCnpj ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GeradorCPFCNPJ;

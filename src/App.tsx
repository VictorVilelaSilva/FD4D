import { useState } from "react";
import WebhookTool from "./components/Webhook/WebhookTool";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import "./App.css";
import DockNav from "./components/Dock/Dock";
import GeradorCPFCNPJ from "./components/CPFGenerator/GeradorCPFCNPJ";
import ValidadorCPFCNPJ from "./components/ValidadorCPFCNPJ/ValidadorCPFCNPJ";
import { RetroGrid } from "./components/ui/retro-grid";
import { DotPattern } from "./components/ui/dot-pattern";
import { AuroraText } from "./components/ui/aurora-text";
import { SparklesText } from "./components/ui/sparkles-text";

function App() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState("home");

  const isHome = ferramentaAtiva === "home";

  return (
    <div className="app-container">
      {/* Background condicional: RetroGrid na home, DotPattern nas outras */}
      {isHome ? (
        <RetroGrid
          className="opacity-30"
          angle={65}
          cellSize={50}
          opacity={0.3}
          darkLineColor="rgba(140, 82, 255, 0.25)"
          lightLineColor="rgba(140, 82, 255, 0.15)"
        />
      ) : (
        <DotPattern
          className="opacity-20"
          width={24}
          height={24}
          cr={1.2}
        />
      )}

      <main className="conteudo">
        {isHome && (
          <div className="home-welcome">
            <div className="brand-logo">
              <span className="brand-line-from bevan-regular">FROM</span>
              <span className="brand-line-dev bevan-regular">
                <SparklesText
                  sparklesCount={6}
                  colors={{ first: "#8c52ff", second: "#a855f7" }}
                >
                  DEV
                </SparklesText>
              </span>
              <span className="brand-line brand-line-last bevan-regular">
                <AuroraText
                  className="brand-accent"
                  colors={["#8c52ff", "#a855f7", "#7c3aed", "#c084fc"]}
                  speed={2}
                >
                  4
                </AuroraText>
                DEVS
              </span>
            </div>
          </div>
        )}
        {ferramentaAtiva === "cpf/cnpj" && <GeradorCPFCNPJ />}
        {ferramentaAtiva === "validador" && <ValidadorCPFCNPJ />}
        {ferramentaAtiva === "webhook" && <WebhookTool />}
        {ferramentaAtiva === "colorpicker" && <ColorPicker />}
      </main>

      <DockNav
        ferramentaAtiva={ferramentaAtiva}
        setFerramentaAtiva={setFerramentaAtiva}
      />
    </div>
  );
}

export default App;

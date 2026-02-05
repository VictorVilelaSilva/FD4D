import { useState } from "react";
import Webhook from "./components/Webhook";
import ColorPicker from "./components/ColorPicker";
import "./App.css";
import Dock from "./components/Dock/Dock";
import GeradorCPFCNPJ from "./components/CPFGenerator/GeradorCPFCNPJ";
import { DotPattern } from "./components/ui/dot-pattern";
import { AuroraText } from "./components/ui/aurora-text";
import { SparklesText } from "./components/ui/sparkles-text";

function App() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState("home");

  return (
    <div className="app-container">
      {/* Background Pattern */}
      <DotPattern
        className="opacity-30"
        width={24}
        height={24}
        cr={1.5}
      />

      <main className="conteudo">
        {ferramentaAtiva === "home" && (
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
        {ferramentaAtiva === "webhook" && <Webhook />}
        {ferramentaAtiva === "colorpicker" && <ColorPicker />}
      </main>

      <Dock
        ferramentaAtiva={ferramentaAtiva}
        setFerramentaAtiva={setFerramentaAtiva}
      />
    </div>
  );
}

export default App;
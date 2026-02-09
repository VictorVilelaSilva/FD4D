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
import { BlurFade } from "./components/ui/blur-fade";
import { TypingAnimation } from "./components/ui/typing-animation";

function App() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState("home");

  const isHome = ferramentaAtiva === "home";

  return (
    <div className="app-container">
      {/* Background condicional: RetroGrid na home, DotPattern nas outras */}
      {isHome ? (
        <RetroGrid
          className="opacity-30"
          angle={30}
          cellSize={150}
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
                </AuroraText>ṕ
                DEVS
              </span>
            </div>

            <BlurFade delay={0.3} duration={0.6} direction="up">
              <p className="home-subtitle">
                Uma ferramenta feita{" "}
                <TypingAnimation
                  className="home-subtitle-typing"
                  words={["por um desenvolvedor.", "para desenvolvedores."]}
                  typeSpeed={80}
                  deleteSpeed={50}
                  pauseDelay={2000}
                  delay={800}
                  loop
                  showCursor
                  cursorStyle="line"
                  cursorColor="var(--bg-accent)"
                />
              </p>
            </BlurFade>
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

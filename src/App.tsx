import { useState } from "react";
import WebhookTool from "./tools/Webhook/WebhookTool";
import ColorPicker from "./tools/ColorPicker/ColorPicker";
import "./App.css";
import "./styles/tools.css";
import DockNav from "./components/Dock/Dock";
import GeradorCPFCNPJ from "./tools/CPFGenerator/GeradorCPFCNPJ";
import ValidadorCPFCNPJ from "./tools/ValidadorCPFCNPJ/ValidadorCPFCNPJ";
import HomePage from "./components/Home/HomePage";
import { DotPattern } from "./components/ui/dot-pattern";
import { AnimatedThemeToggler } from "./components/ui/animated-theme-toggler";
import { Particles } from "./components/ui/particles";
import { Meteors } from "./components/ui/meteors";
import UpdateChecker from "./tools/UpdateChecker/UpdateChecker";

function App() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState("home");

  const isHome = ferramentaAtiva === "home";

  return (
    <div className="app-container">
      <UpdateChecker />

      {/* Theme Toggle */}
      <AnimatedThemeToggler className="theme-toggle-btn" />

      {/* Background condicional: Particles + Meteors na home, DotPattern nas outras */}
      {isHome ? (
        <>
          <Particles
            className="absolute inset-0 pointer-events-none"
            quantity={150}
            ease={80}
            color="#8c52ff"
            size={1}
            staticity={60}
          />
          <Meteors number={30} />
        </>
      ) : (
        <DotPattern
          className="opacity-20"
          width={24}
          height={24}
          cr={1.2}
        />
      )}

      <main className="conteudo">
        <div className={`tool-wrapper ${isHome ? "active" : ""}`}>
          <HomePage />
        </div>
        <div className={`tool-wrapper ${ferramentaAtiva === "cpf/cnpj" ? "active" : ""}`}>
          <GeradorCPFCNPJ />
        </div>
        <div className={`tool-wrapper ${ferramentaAtiva === "validador" ? "active" : ""}`}>
          <ValidadorCPFCNPJ />
        </div>
        <div className={`tool-wrapper ${ferramentaAtiva === "webhook" ? "active" : ""}`}>
          <WebhookTool />
        </div>
        <div className={`tool-wrapper ${ferramentaAtiva === "colorpicker" ? "active" : ""}`}>
          <ColorPicker />
        </div>
      </main>

      <DockNav
        ferramentaAtiva={ferramentaAtiva}
        setFerramentaAtiva={setFerramentaAtiva}
      />
    </div>
  );
}

export default App;

import { useState } from "react";
import Webhook from "./components/Webhook";
import ColorPicker from "./components/ColorPicker";
import "./App.css";
import Dock from "./components/Dock/Dock";
import GeradorCPFCNPJ from "./components/CPFGenerator/GeradorCPFCNPJ";

function App() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState("cpf/cnpj");

  return (
    <div className="app-container">
      <main className="conteudo">
        {ferramentaAtiva === "home" && (
          <div className="home-welcome">
            <h1>FD4D</h1>
            <p>Ferramentas para Desenvolvedores</p>
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
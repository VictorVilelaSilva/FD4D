import { useState } from "react";
import Webhook from "./components/Webhook";
import ColorPicker from "./components/ColorPicker";
import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import GeradorCPFCNPJ from "./components/CPFGenerator/GeradorCPFCNPJ";

function App() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState("cpf/cnpj");

  return (
    <div className="app-container">
      <Sidebar
        ferramentaAtiva={ferramentaAtiva}
        setFerramentaAtiva={setFerramentaAtiva}
      />

      <main className="conteudo">
        {ferramentaAtiva === "cpf/cnpj" && <GeradorCPFCNPJ />}
        {ferramentaAtiva === "webhook" && <Webhook />}
        {ferramentaAtiva === "colorpicker" && <ColorPicker />}
      </main>
    </div>
  );
}

export default App;
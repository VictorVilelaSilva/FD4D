import { useState } from "react";
import Webhook from "./components/Webhook";
import ColorPicker from "./components/ColorPicker";
import "./App.css";
import GeradorCPF from "./components/CPFGenerator/CPFGenerator";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState("cpf");

  return (
    <div className="app-container">
      <Sidebar
        ferramentaAtiva={ferramentaAtiva}
        setFerramentaAtiva={setFerramentaAtiva}
      />

      <main className="conteudo">
        {ferramentaAtiva === "cpf" && <GeradorCPF />}
        {ferramentaAtiva === "webhook" && <Webhook />}
        {ferramentaAtiva === "colorpicker" && <ColorPicker />}
      </main>
    </div>
  );
}

export default App;
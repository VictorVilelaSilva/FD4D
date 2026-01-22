import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [cpf, setCpf] = useState("");
  const [withMask, setWithMask] = useState(true);

  async function handleGerarCpf() {
    try {
      const generatedCpf = await invoke<string>("generate_cpf", {
        withMask: withMask,
      });
      setCpf(generatedCpf);
    } catch (error) {
      console.error("Erro ao gerar CPF:", error);
    }
  }


  return (
    <div className="container">
      <h1>Gerador de CPF</h1>

      <div className="row">
        <label>
          <input
            type="checkbox"
            checked={withMask}
            onChange={(e) => setWithMask(e.target.checked)}
          />
          Com Máscara
        </label>
      </div>

      <button onClick={handleGerarCpf}>Gerar CPF</button>
      {cpf && (
        <div className="result">
          <p>CPF Gerado:</p>
          <code>{cpf}</code>
        </div>
      )}
    </div>
  );
}

export default App;

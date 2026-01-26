import { useState } from "react";
import Contador from "./components/Contador";

function App() {
  const [numero, setNumero] = useState(0);

  function aumentar() {
    setNumero(numero + 1);
  }

  return (

    <div>
      <h1>Total Geral: {numero}</h1>
      {/* Quero que este comece do zero */}
      <Contador valorInicial={numero} acao={aumentar} />

    </div>
  )
}

export default App;
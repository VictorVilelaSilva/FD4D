
function Contador({ valorInicial, acao }: { valorInicial: number, acao: () => void }) {


    return (
        <button onClick={acao}>
            Contagem: {valorInicial}
        </button>
    );
}

export default Contador;
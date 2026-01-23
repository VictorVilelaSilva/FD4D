import "./Sidebar.css";

interface SidebarProps {
    ferramentaAtiva: string;
    setFerramentaAtiva: (ferramenta: string) => void;
}

function Sidebar({ ferramentaAtiva, setFerramentaAtiva }: SidebarProps) {
    const ferramentas = [
        { id: "cpf", nome: "CPF/CNPJ", icone: "📄" },
        { id: "webhook", nome: "Webhook", icone: "🔗" },
        { id: "colorpicker", nome: "Color Picker", icone: "🎨" },
    ];

    return (
        <aside className="sidebar">
            <h2>🛠️ Dev Tools</h2>
            <nav>
                {ferramentas.map((ferramenta) => (
                    <button
                        key={ferramenta.id}
                        className={`sidebar-item ${ferramentaAtiva === ferramenta.id ? "active" : ""
                            }`}
                        onClick={() => setFerramentaAtiva(ferramenta.id)}
                    >
                        <span className="icone">{ferramenta.icone}</span>
                        <span className="nome">{ferramenta.nome}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
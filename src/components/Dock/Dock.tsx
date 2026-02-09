import { useState } from "react";
import { Dock as MagicDock, DockIcon } from "../ui/dock";
import "./Dock.css";

interface DockNavProps {
  ferramentaAtiva: string;
  setFerramentaAtiva: (ferramenta: string) => void;
}

function DockNav({ ferramentaAtiva, setFerramentaAtiva }: DockNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const ferramentas = [
    {
      id: "home",
      nome: "Home",
      icone: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "cpf/cnpj",
      nome: "CPF/CNPJ",
      icone: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h4" />
        </svg>
      ),
    },
    {
      id: "validador",
      nome: "Validador CPF/CNPJ",
      icone: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12l2 2 4-4" />
          <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" />
        </svg>
      ),
    },
    {
      id: "webhook",
      nome: "Webhook",
      icone: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
          <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
          <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8H12" />
        </svg>
      ),
    },
    {
      id: "colorpicker",
      nome: "Color Picker",
      icone: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4" />
          <path d="m6.8 14-3.5 2" />
          <path d="m20.7 16-3.5-2" />
          <path d="M6.8 10 3.3 8" />
          <path d="m20.7 8-3.5 2" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="dock-nav">
      <MagicDock
        iconSize={42}
        iconMagnification={64}
        iconDistance={120}
        direction="bottom"
        className="dock-bar"
      >
        {ferramentas.map((ferramenta) => (
          <DockIcon
            key={ferramenta.id}
            className={`dock-icon-item ${ferramentaAtiva === ferramenta.id ? "active" : ""}`}
            onClick={() => setFerramentaAtiva(ferramenta.id)}
            onMouseEnter={() => setHoveredItem(ferramenta.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="dock-icon-inner">
              {ferramenta.icone}
              <span
                className={`dock-tooltip ${hoveredItem === ferramenta.id ? "visible" : ""}`}
              >
                {ferramenta.nome}
              </span>
            </div>
          </DockIcon>
        ))}
      </MagicDock>
    </nav>
  );
}

export default DockNav;

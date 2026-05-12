import { useState } from "react";
import { Dock as MagicDock, DockIcon } from "../ui/dock";
import "./Dock.css";
import { File, House, Pipette, Webhook } from "lucide-react";

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
        <House />
      ),
    },
    {
      id: "documentos",
      nome: "Documentos (CPF/CNPJ)",
      icone: (
        <File />
      ),
    },
    {
      id: "webhook",
      nome: "Webhook",
      icone: (
        <Webhook />
      ),
    },
    {
      id: "colorpicker",
      nome: "Color Picker",
      icone: (
        <Pipette />
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

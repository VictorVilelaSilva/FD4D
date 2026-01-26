import { useRef, useState } from "react";
import "./Dock.css";

interface DockProps {
  ferramentaAtiva: string;
  setFerramentaAtiva: (ferramenta: string) => void;
}

function Dock({ ferramentaAtiva, setFerramentaAtiva }: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const ferramentas = [
    {
      id: "home",
      nome: "Home",
      icone: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "cpf/cnpj",
      nome: "CPF/CNPJ",
      icone: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: "webhook",
      nome: "Webhook",
      icone: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    {
      id: "colorpicker",
      nome: "Color Picker",
      icone: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="10.5" r="2.5" />
          <circle cx="8.5" cy="7.5" r="2.5" />
          <circle cx="6.5" cy="12.5" r="2.5" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
        </svg>
      ),
    },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  const getScale = (index: number): number => {
    if (mouseX === null) return 1;

    const itemWidth = 56; // largura do item + gap
    const itemCenter = index * itemWidth + itemWidth / 2;
    const distance = Math.abs(mouseX - itemCenter);
    const maxDistance = 100;
    const maxScale = 1.5;

    if (distance > maxDistance) return 1;

    const scale = 1 + (maxScale - 1) * (1 - distance / maxDistance);
    return scale;
  };

  return (
    <nav className="dock">
      <div
        className="dock-container"
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {ferramentas.map((ferramenta, index) => {
          const scale = getScale(index);
          const isHovered = hoveredItem === ferramenta.id;
          const tooltipOffset = 60 + (scale - 1) * 48;
          return (
            <div key={ferramenta.id} className="dock-item-wrapper">
              <span
                className={`dock-tooltip ${isHovered ? "visible" : ""}`}
                style={{
                  bottom: `${tooltipOffset}px`,
                }}
              >
                {ferramenta.nome}
              </span>
              <button
                className={`dock-item ${ferramentaAtiva === ferramenta.id ? "active" : ""}`}
                onClick={() => setFerramentaAtiva(ferramenta.id)}
                onMouseEnter={() => setHoveredItem(ferramenta.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  transform: `scale(${scale}) translateY(${(scale - 1) * -20}px)`,
                }}
              >
                {ferramenta.icone}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default Dock;

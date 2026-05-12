import { Info } from "lucide-react";

export function ColorPickerInstructions() {
    return (
        <div className="picker-instructions">
            <div className="instruction-item">
                <Info size={14} />
                <span>Clique em <strong>"Capturar Cor da Tela"</strong> para abrir o seletor</span>
            </div>
            <div className="instruction-item">
                <Info size={14} />
                <span>O seletor nativo do sistema será aberto</span>
            </div>
            <div className="instruction-item">
                <Info size={14} />
                <span>Clique em qualquer pixel da tela para capturar a cor</span>
            </div>
        </div>
    );
}

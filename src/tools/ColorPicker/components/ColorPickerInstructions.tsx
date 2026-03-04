const IconeInfo = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);

export function ColorPickerInstructions() {
    return (
        <div className="picker-instructions">
            <div className="instruction-item">
                <IconeInfo />
                <span>Clique em <strong>"Capturar Cor da Tela"</strong> para abrir o seletor</span>
            </div>
            <div className="instruction-item">
                <IconeInfo />
                <span>O seletor nativo do sistema será aberto</span>
            </div>
            <div className="instruction-item">
                <IconeInfo />
                <span>Clique em qualquer pixel da tela para capturar a cor</span>
            </div>
        </div>
    );
}

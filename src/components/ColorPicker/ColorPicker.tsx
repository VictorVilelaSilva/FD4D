import { useState } from "react";
import { BorderBeam } from "../ui/border-beam";
import { MagicCard } from "../ui/magic-card";
import { BlurFade } from "../ui/blur-fade";
import { ShimmerButton } from "../ui/shimmer-button";
import { pickColorFromScreen, copiarParaClipboard, getContrastColor, PixelColor } from "./logic";
import "./ColorPicker.css";

const IconePipeta = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
    </svg>
);

const IconeCopiar = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const IconeCopiado = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconeInfo = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);

interface CopyButtonProps {
    value: string;
    copiado: boolean;
    onCopy: () => void;
}

function CopyButton({ value, copiado, onCopy }: CopyButtonProps) {
    return (
        <button
            className={`btn-copy-value ${copiado ? "copiado" : ""}`}
            onClick={onCopy}
            disabled={!value}
            title="Copiar"
        >
            {copiado ? <IconeCopiado /> : <IconeCopiar />}
        </button>
    );
}

interface ColorValueRowProps {
    label: string;
    value: string;
    placeholder: string;
    copiado: boolean;
    onCopy: () => void;
}

function ColorValueRow({ label, value, placeholder, copiado, onCopy }: ColorValueRowProps) {
    return (
        <div className="color-value-row">
            <span className="color-value-label">{label}</span>
            <span className={`color-value-text ${!value ? "placeholder" : ""}`}>
                {value || placeholder}
            </span>
            <CopyButton value={value} copiado={copiado} onCopy={onCopy} />
        </div>
    );
}

function ColorPicker() {
    const [cor, setCor] = useState<PixelColor | null>(null);
    const [picking, setPicking] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [copiadoHex, setCopiadoHex] = useState(false);
    const [copiadoRgb, setCopiadoRgb] = useState(false);
    const [copiadoCmyk, setCopiadoCmyk] = useState(false);

    async function handlePickColor() {
        setPicking(true);
        setErro(null);
        try {
            const color = await pickColorFromScreen();
            setCor(color);
        } catch (error) {
            console.error("Erro ao capturar cor:", error);
            setErro(String(error));
        } finally {
            setPicking(false);
        }
    }

    async function handleCopy(value: string, tipo: "hex" | "rgb" | "cmyk") {
        try {
            await copiarParaClipboard(value);
            const setters = { hex: setCopiadoHex, rgb: setCopiadoRgb, cmyk: setCopiadoCmyk };
            setters[tipo](true);
            setTimeout(() => setters[tipo](false), 2000);
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    }

    const previewStyle = cor ? {
        backgroundColor: cor.hex,
        color: getContrastColor(cor.hex),
    } : undefined;

    return (
        <div className="color-picker-container">
            <BlurFade delay={0.1} direction="up">
                <MagicCard
                    className="color-picker-card"
                    gradientFrom="#8c52ff"
                    gradientTo="#a855f7"
                    gradientColor="rgba(140, 82, 255, 0.15)"
                >
                    <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
                    <div className="color-picker-card-inner">
                        <h1 className="color-picker-header">
                            <IconePipeta />
                            Color Picker
                        </h1>

                        <div className="color-preview-section">
                            <div
                                className={`color-preview-box ${!cor ? "color-preview-placeholder" : ""}`}
                                style={previewStyle}
                            >
                                {cor ? cor.hex : "Nenhuma cor selecionada"}
                            </div>

                            <ShimmerButton
                                shimmerColor="#a855f7"
                                shimmerSize="0.06em"
                                shimmerDuration="2.5s"
                                background={picking ? "#27ae60" : "var(--bg-accent)"}
                                borderRadius="8px"
                                className="btn-gerar"
                                onClick={handlePickColor}
                                disabled={picking}
                            >
                                {picking ? "Selecionando..." : "Capturar Cor da Tela"}
                            </ShimmerButton>

                            {erro && (
                                <div className="picker-status active" style={{ borderColor: "#e74c3c", color: "#e74c3c", background: "rgba(231,76,60,0.1)" }}>
                                    <span>❌ {erro}</span>
                                </div>
                            )}
                        </div>

                        <div className="color-values-section">
                            <ColorValueRow
                                label="HEX"
                                value={cor?.hex || ""}
                                placeholder="#------"
                                copiado={copiadoHex}
                                onCopy={() => cor && handleCopy(cor.hex, "hex")}
                            />
                            <ColorValueRow
                                label="RGB"
                                value={cor?.rgb || ""}
                                placeholder="rgb(-, -, -)"
                                copiado={copiadoRgb}
                                onCopy={() => cor && handleCopy(cor.rgb, "rgb")}
                            />
                            <ColorValueRow
                                label="CMYK"
                                value={cor?.cmyk || ""}
                                placeholder="cmyk(-%, -%, -%, -%)"
                                copiado={copiadoCmyk}
                                onCopy={() => cor && handleCopy(cor.cmyk, "cmyk")}
                            />
                        </div>

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
                    </div>
                </MagicCard>
            </BlurFade>
        </div>
    );
}

export default ColorPicker;

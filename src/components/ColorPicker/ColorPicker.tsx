import { useState, useEffect, useCallback, useRef } from "react";
import { BorderBeam } from "../ui/border-beam";
import { MagicCard } from "../ui/magic-card";
import { BlurFade } from "../ui/blur-fade";
import { ShimmerButton } from "../ui/shimmer-button";
import { getPixelColor, copiarParaClipboard, getContrastColor, PixelColor } from "./logic";
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
    const [copiadoHex, setCopiadoHex] = useState(false);
    const [copiadoRgb, setCopiadoRgb] = useState(false);
    const [copiadoCmyk, setCopiadoCmyk] = useState(false);
    const pickingRef = useRef(false);
    const throttleRef = useRef(false);

    const handlePickColor = useCallback(async (e: MouseEvent) => {
        if (!pickingRef.current || throttleRef.current) return;

        throttleRef.current = true;
        setTimeout(() => { throttleRef.current = false; }, 100);

        try {
            const color = await getPixelColor(e.screenX, e.screenY);
            setCor(color);
        } catch (error) {
            console.error("Erro ao capturar cor:", error);
        }
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape" && pickingRef.current) {
            pickingRef.current = false;
            setPicking(false);
        }
    }, []);

    const handleClick = useCallback((e: MouseEvent) => {
        if (pickingRef.current) {
            e.preventDefault();
            pickingRef.current = false;
            setPicking(false);
        }
    }, []);

    useEffect(() => {
        if (picking) {
            window.addEventListener("mousemove", handlePickColor);
            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("click", handleClick);
        }
        return () => {
            window.removeEventListener("mousemove", handlePickColor);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", handleClick);
        };
    }, [picking, handlePickColor, handleKeyDown, handleClick]);

    function startPicking() {
        pickingRef.current = true;
        setPicking(true);
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
                                onClick={startPicking}
                                disabled={picking}
                            >
                                {picking ? "Capturando... (clique para parar)" : "Iniciar Captura"}
                            </ShimmerButton>

                            <div className={`picker-status ${picking ? "active" : "inactive"}`}>
                                <span>{picking ? "🎯 Mova o mouse para capturar cores" : "⏸️ Captura pausada"}</span>
                            </div>
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
                                <span>Clique em <strong>"Iniciar Captura"</strong> para começar</span>
                            </div>
                            <div className="instruction-item">
                                <IconeInfo />
                                <span>Mova o mouse pela tela para ver as cores</span>
                            </div>
                            <div className="instruction-item">
                                <IconeInfo />
                                <span>Pressione <span className="instruction-key">ESC</span> ou clique para parar</span>
                            </div>
                        </div>
                    </div>
                </MagicCard>
            </BlurFade>
        </div>
    );
}

export default ColorPicker;

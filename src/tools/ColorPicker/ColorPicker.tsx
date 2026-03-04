import { useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { pickColorFromScreen, copiarParaClipboard, getContrastColor, PixelColor } from "./logic";
import { ColorValuesSection } from "./components/ColorValuesSection";
import { ColorPickerInstructions } from "./components/ColorPickerInstructions";
import "./ColorPicker.css";

const IconePipeta = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
    </svg>
);

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

                        <ColorValuesSection
                            cor={cor}
                            copiadoHex={copiadoHex}
                            copiadoRgb={copiadoRgb}
                            copiadoCmyk={copiadoCmyk}
                            onCopy={handleCopy}
                        />

                        <ColorPickerInstructions />
                    </div>
                </MagicCard>
            </BlurFade>
        </div>
    );
}

export default ColorPicker;

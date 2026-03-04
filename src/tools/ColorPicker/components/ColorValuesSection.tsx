import { type PixelColor } from "../logic";
import { Copy, Check } from "lucide-react";

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
            {copiado ? <Check size={12} /> : <Copy size={12} />}
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

interface ColorValuesSectionProps {
    cor: PixelColor | null;
    copiadoHex: boolean;
    copiadoRgb: boolean;
    copiadoCmyk: boolean;
    onCopy: (value: string, tipo: "hex" | "rgb" | "cmyk") => void;
}

export function ColorValuesSection({
    cor, copiadoHex, copiadoRgb, copiadoCmyk, onCopy,
}: ColorValuesSectionProps) {
    return (
        <div className="color-values-section">
            <ColorValueRow
                label="HEX"
                value={cor?.hex || ""}
                placeholder="#------"
                copiado={copiadoHex}
                onCopy={() => cor && onCopy(cor.hex, "hex")}
            />
            <ColorValueRow
                label="RGB"
                value={cor?.rgb || ""}
                placeholder="rgb(-, -, -)"
                copiado={copiadoRgb}
                onCopy={() => cor && onCopy(cor.rgb, "rgb")}
            />
            <ColorValueRow
                label="CMYK"
                value={cor?.cmyk || ""}
                placeholder="cmyk(-%, -%, -%, -%)"
                copiado={copiadoCmyk}
                onCopy={() => cor && onCopy(cor.cmyk, "cmyk")}
            />
        </div>
    );
}

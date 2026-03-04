import { type PixelColor } from "../logic";

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

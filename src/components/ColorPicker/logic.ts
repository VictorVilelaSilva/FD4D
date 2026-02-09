import { invoke } from "@tauri-apps/api/core";

export interface PixelColor {
    r: number;
    g: number;
    b: number;
    hex: string;
    rgb: string;
    cmyk: string;
}

/**
 * Invoca o seletor de cor nativo do sistema via portal XDG (Wayland)
 * com fallback para hyprpicker.
 */
export async function pickColorFromScreen(): Promise<PixelColor> {
    return invoke<PixelColor>("pick_color_portal");
}

/**
 * Captura cor por coordenada de pixel (funciona apenas em X11/Windows/macOS).
 * @deprecated Use pickColorFromScreen() para compatibilidade com Wayland.
 */
export async function getPixelColor(x: number, y: number): Promise<PixelColor> {
    return invoke<PixelColor>("get_pixel_color", { x: Math.round(x), y: Math.round(y) });
}

export async function copiarParaClipboard(texto: string): Promise<void> {
    await navigator.clipboard.writeText(texto);
}

export function getContrastColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

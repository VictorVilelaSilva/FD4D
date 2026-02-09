# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Pré-requisitos (Linux/Wayland)

Para o Color Picker funcionar no Wayland (ex: Hyprland/Nobara), é necessário ter os portais do sistema e uma ferramenta de fallback instalados:

- `xdg-desktop-portal-hyprland`
- `xdg-desktop-portal-gtk`
- `hyprpicker`

Exemplo (Fedora/Nobara):

```
sudo dnf install xdg-desktop-portal-hyprland xdg-desktop-portal-gtk hyprpicker
```

Se o portal não estiver ativo, o app tentará usar `hyprpicker` automaticamente.

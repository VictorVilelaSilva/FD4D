# FD4D - GitHub Copilot Instructions

## Visão Geral da Arquitetura

FD4D é um aplicativo desktop **híbrido com dupla implementação**: uma versão **Tkinter (Python)** legacy e uma **Tauri + React + TypeScript** moderna. O projeto está migrando da versão Python para a versão Tauri.

### Estrutura Principal

- **`main.py`** - Aplicação Tkinter legacy (funcional)
- **`src/`** - Nova aplicação React/TypeScript (em desenvolvimento)
- **`src-tauri/`** - Backend Rust para comunicação com sistema
- **`assets/functions/`** - Lógica Python reutilizada (geração CPF/CNPJ)

## Padrões de Desenvolvimento

### Frontend (React + TypeScript)
- **Roteamento por Estado**: Usa `useState` para alternar ferramentas (`home`, `cpf/cnpj`, `webhook`, `colorpicker`)
- **Componentes de UI**: Biblioteca custom em `src/components/ui/` com animações (Motion.js)
- **Styling**: TailwindCSS 4.0 + CSS Variables em `src/styles/variables.css`
- **Utilitário cn()**: Função `cn()` em `src/lib/utils.ts` para merge de classes Tailwind

### Backend (Tauri + Rust)
- **Comandos Tauri**: Funções Rust expostas via `#[tauri::command]`
- **Convenção de Naming**: Use `camelCase` no frontend e `snake_case` no Rust
- **Exemplo**: `invoke("gerar_cpf", { comMascara: true })` chama `fn gerar_cpf(com_mascara: bool)`

### Integração Frontend-Backend
```tsx
// Padrão para chamar comandos Rust
import { invoke } from "@tauri-apps/api/core";

const resultado = await invoke<string>("nome_comando", {
  parametro: valor
});
```

## Convenções Específicas do Projeto

### Sistema de Cores
- **Primary Brand**: `#8c52ff` (roxo)
- **Gradients**: Sempre usar `#8c52ff` → `#a855f7` → `#7c3aed`
- **CSS Variables**: Definidas em `:root` em `variables.css`

### Componentes de UI
- **BorderBeam**: Bordas animadas com gradiente da marca
- **TypingAnimation**: Efeito de digitação para valores gerados
- **ShimmerButton**: Botões com efeito brilho
- **Key Reset Pattern**: Use `key={estado}` para reanimadar componentes

### Estado e UX
- **Feedback de Cópia**: Estados temporários para feedback visual (2s timeout)
- **Loading States**: Sempre desativar botões durante operações async
- **Error Handling**: Console.error + fallback visual

## Comandos de Desenvolvimento

```bash
# Frontend (Vite)
npm run dev

# Tauri Development
npm run tauri dev

# Build Completo
npm run build
npm run tauri build
```

## Estrutura de Arquivo por Ferramenta

### Adicionando Nova Ferramenta
1. Criar componente em `src/components/NomeFerramenta/`
2. Adicionar entrada no array `ferramentas` em `Dock.tsx`
3. Adicionar case no `App.tsx` para renderização
4. Implementar comandos Rust se necessário em `src-tauri/src/lib.rs`

### Padrão de Componente
```tsx
function NomeFerramenta() {
  const [estado, setEstado] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleAcao() {
    setCarregando(true);
    try {
      const resultado = await invoke<string>("comando_rust");
      setEstado(resultado);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="ferramenta">
      <BorderBeam /* props padrão */ />
      {/* Conteúdo */}
    </div>
  );
}
```

## Arquivos Críticos

- **`src/App.tsx`** - Roteamento principal e layouts
- **`src/components/Dock/Dock.tsx`** - Navegação entre ferramentas  
- **`src-tauri/src/lib.rs`** - Comandos backend disponíveis
- **`src/styles/variables.css`** - Sistema de design global
- **`vite.config.ts`** - Configuração Tauri + Vite

## Dependências Externas

- **Tauri v2**: Desktop app framework (Rust + WebView)
- **Motion.js**: Animações (sucessor do Framer Motion)
- **TailwindCSS 4.0**: Styling com CSS-in-JS

## Migração Legacy

**IMPORTANTE**: Ao trabalhar no projeto, priorize a implementação Tauri sobre a versão Python. A versão `main.py` deve ser mantida para referência, mas novas funcionalidades devem ser implementadas na stack React/Rust.
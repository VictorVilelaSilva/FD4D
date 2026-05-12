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

## Ícones

**SEMPRE** use ícones da biblioteca `lucide-react`. Nunca use SVGs inline, emojis ou outras bibliotecas de ícones.

```tsx
import { Copy, CopyCheck, File, FileSearch, Settings } from "lucide-react";

// Uso correto
<File size={25} />
<Copy size={16} />
```

- Pesquise o ícone adequado em https://lucide.dev/icons antes de escolher
- Defina `size` explicitamente (pequenos: `16`, médios: `20`, grandes: `25`)
- Nunca substitua por caracteres Unicode ou texto

## Componentização

A componentização é **fundamental** para manter o projeto escalável e legível. Cada ferramenta deve ser dividida em peças pequenas e reutilizáveis com responsabilidades únicas.

### Princípios
- **Responsabilidade única**: cada componente faz uma coisa só
- **Props tipadas**: sempre defina interfaces TypeScript para as props (`interface NomeProps`)
- **Lógica separada da UI**: extraia hooks customizados (`useNomeFerramenta.ts`) para encapsular estado e efeitos
- **Lógica pura separada**: funções utilitárias sem React vão em `logic.ts` ou `nomeFerramenta.ts`
- **Componente raiz enxuto**: o arquivo principal da ferramenta (`NomeFerramenta.tsx`) deve apenas compor subcomponentes e conectar ao hook

### O que NÃO fazer
- Não coloque toda a lógica num único arquivo monolítico
- Não misture chamadas `invoke` diretamente no JSX; coloque-as no hook customizado
- Não repita estruturas de UI; extraia em subcomponentes reutilizáveis

## Estrutura de Arquivo por Ferramenta

### Organização de Diretório

Cada ferramenta **deve** seguir esta estrutura de pastas:

```
src/tools/NomeFerramenta/
├── NomeFerramenta.tsx        # Componente raiz — apenas composição e roteamento de props
├── NomeFerramenta.css        # Estilos específicos da ferramenta
├── useNomeFerramenta.ts      # Hook customizado — todo o estado e efeitos
├── logic.ts                  # Lógica pura (sem React): cálculos, formatações, validações
└── components/               # Subcomponentes da ferramenta
    ├── SecaoA.tsx
    ├── SecaoB.tsx
    └── ...
```

**Referência real:** veja `src/tools/CPFGenerator/` como exemplo canônico:
```
CPFGenerator/
├── GeradorCPFCNPJ.tsx        # Raiz
├── GeradorCPFCNPJ.css
├── useGerador.ts             # Hook com toda a lógica de estado
├── gerador.ts                # Lógica pura de geração
├── historico.ts              # Lógica pura do histórico
└── components/
    ├── CardGerador.tsx       # Subcomponente reutilizável por CPF e CNPJ
    └── HistoricoModal.tsx
```

### Passos para Adicionar Nova Ferramenta
1. Criar diretório `src/tools/NomeFerramenta/` com a estrutura acima
2. Implementar lógica pura em `logic.ts`
3. Implementar estado e efeitos em `useNomeFerramenta.ts`
4. Criar subcomponentes em `components/`
5. Compor tudo em `NomeFerramenta.tsx`
6. Adicionar entrada no array `ferramentas` em `Dock.tsx` (com ícone do `lucide-react`)
7. Adicionar case no `App.tsx` para renderização
8. Implementar comandos Rust se necessário em `src-tauri/src/lib.rs`

### Padrão de Componente Raiz
```tsx
import { useNomeFerramenta } from "./useNomeFerramenta";
import { SecaoA } from "./components/SecaoA";
import { SecaoB } from "./components/SecaoB";

export function NomeFerramenta() {
  const { estado, carregando, handleAcao } = useNomeFerramenta();

  return (
    <div className="ferramenta">
      <BorderBeam size={80} duration={8} colorFrom="#8c52ff" colorTo="#a855f7" borderWidth={1} />
      <SecaoA estado={estado} onAcao={handleAcao} />
      <SecaoB carregando={carregando} />
    </div>
  );
}
```

### Padrão de Hook Customizado
```tsx
// useNomeFerramenta.ts
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export function useNomeFerramenta() {
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

  return { estado, carregando, handleAcao };
}
```

### Padrão de Subcomponente
```tsx
// components/SecaoA.tsx
import { SomeIcon } from "lucide-react";

interface SecaoAProps {
  estado: string;
  onAcao: () => void;
}

export function SecaoA({ estado, onAcao }: SecaoAProps) {
  return (
    <div className="secao-a">
      <SomeIcon size={20} />
      {/* conteúdo */}
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
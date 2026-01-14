# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FD4D (From Dev for Dev) is a cross-platform Electron + React desktop application that provides developer utility tools. It uses a **plugin-based architecture** where tools are registered in a central registry and rendered dynamically.

**Tech Stack:**
- Electron 28 (main + renderer processes)
- React 18 with TypeScript 5
- Vite 5 (build tool with HMR)
- CSS-in-JS (inline styles with theme system)

## Commands

### Development
```bash
npm install              # Install dependencies
npm run electron:dev     # Start dev server + launch Electron app with HMR
npm run dev             # Start Vite dev server only (no Electron)
```

### Building
```bash
npm run build           # Build for all platforms (Windows, macOS, Linux)
npm run build:win       # Build Windows installer (NSIS + portable)
npm run build:mac       # Build macOS installer (DMG + ZIP)
npm run build:linux     # Build Linux packages (AppImage + DEB)
npm run electron:build  # Same as npm run build
```

**Output:** All builds go to `release/` directory

### Other
```bash
npm run preview         # Preview production build (Vite only, no Electron)
```

**Note:** No test runner is configured. No linting is configured.

## Architecture

### Plugin System (Tool Registry)

The core architectural pattern is a **singleton Tool Registry** that manages all tools without requiring modifications to core code.

**Tool Registration Flow:**
1. Create tool component in `src/tools/[ToolName]/[ToolName].tsx`
2. Import and register in `src/App.tsx` using `toolRegistry.registerMany()`
3. Tool automatically appears in sidebar and is rendered when selected

**Tool Interface** (`src/tools/registry.ts`):
```typescript
interface Tool {
  id: string                    // Unique kebab-case identifier
  name: string                  // Display name
  description: string           // Shown in sidebar and header
  icon: string | ReactNode      // Emoji or React component
  category: 'generator' | 'encoder' | 'converter' | 'utility' | 'other'
  component: React.ComponentType // The tool's React component
  shortcut?: string             // Optional keyboard shortcut
  tags?: string[]              // For search/filtering
}
```

**Adding a New Tool:**
```typescript
// 1. Create src/tools/MyTool/MyTool.tsx
export const MyTool: React.FC = () => { /* implementation */ }

// 2. Register in src/App.tsx
import { MyTool } from './tools/MyTool/MyTool'

toolRegistry.registerMany([
  // ... existing tools
  createTool({
    id: 'my-tool',
    name: 'My Tool',
    description: 'What it does',
    icon: '🔧',
    category: 'utility',
    component: MyTool,
    tags: ['keyword1', 'keyword2'],
  }),
])
```

**Important:** Each tool is self-contained. No tool communicates with another. State is managed locally within each tool component using React hooks.

### Design System

All styling uses the centralized theme at `src/theme/theme.ts`. **Never hardcode colors, spacing, or other design tokens.**

```typescript
import { theme } from '../../theme/theme'

const style: React.CSSProperties = {
  background: theme.colors.background.card,     // Not '#232946'
  padding: theme.spacing.md,                    // Not '16px'
  borderRadius: theme.borderRadius.md,          // Not '8px'
  fontSize: theme.typography.fontSize.base,     // Not '16px'
  color: theme.colors.text.primary,            // Not '#EAEAEA'
}
```

**Theme Structure:**
- `colors` - Full palette including primary, secondary, accent, backgrounds, text, status colors
- `spacing` - Scale from xs (4px) to 3xl (64px)
- `typography` - Font families, sizes, weights, line heights
- `borderRadius` - Border rounding values
- `shadows` - Shadow definitions including glow effects
- `transitions` - Animation timing (fast: 150ms, normal: 250ms, slow: 350ms)
- `zIndex` - Stacking order values

### Project Structure

```
src/
├── App.tsx                   # Tool registration happens here
├── main.tsx                  # React entry point, global styles
├── components/
│   ├── Layout/
│   │   ├── AppLayout.tsx    # Main container, sidebar toggle, tool rendering
│   │   └── Sidebar.tsx      # Navigation, category grouping
│   └── shared/              # Reusable UI components
│       ├── Button.tsx       # 5 variants, hover effects
│       ├── CopyButton.tsx   # Copy to clipboard with "Copied!" feedback
│       └── ToolCard.tsx     # Container for tool content
├── tools/
│   ├── [ToolName]/          # Each tool in own directory
│   │   └── [ToolName].tsx
│   └── registry.ts          # Tool registry implementation
├── utils/                   # Pure functions (no React)
│   ├── cpf.ts              # CPF generation/validation algorithms
│   ├── cnpj.ts             # CNPJ generation/validation algorithms
│   └── clipboard.ts        # Cross-platform clipboard API wrapper
└── theme/
    └── theme.ts            # Single source of truth for design tokens

electron/
└── main.ts                 # Electron main process, window management
```

### State Management

Uses **React's built-in state** only:
- `useState` for component-local state
- `useEffect` for side effects (e.g., keyboard shortcuts)
- Props for passing data down

**No global state library** (Redux, Zustand, etc.) because tools are independent and don't share state.

### Styling Approach

Uses **inline styles** (CSS-in-JS) because:
- No CSS bundling needed
- Type-safe with TypeScript autocomplete
- No class name conflicts
- Direct access to theme values
- Dynamic styles based on props/state

**Pattern:**
```typescript
const myStyle: React.CSSProperties = {
  property: theme.values.something
}

<div style={myStyle}>...</div>
```

### Electron-Specific Notes

**Main Process** (`electron/main.ts`):
- Creates BrowserWindow with 1200x800 default size
- Loads Vite dev server (dev) or bundled files (prod)
- Dark background color: `#1a1a2e`
- AutoHideMenuBar enabled
- DevTools open automatically in dev mode

**Renderer Process** (all React code in `src/`):
- `nodeIntegration: true` and `contextIsolation: false` in webPreferences
- Can use Node.js APIs directly from React components

### Current Tools

**Generators (category: 'generator'):**
- CPF Generator - Valid Brazilian CPF with check digits, bulk generation up to 100
- CNPJ Generator - Valid Brazilian CNPJ with check digits, bulk generation up to 100
- UUID Generator - UUID v4, supports uppercase/lowercase, dash removal

**Utilities (category: 'utility'):**
- CPF Validator - Validates CPF format, length, check digits
- CNPJ Validator - Validates CNPJ format, length, check digits

### Sidebar Toggle Feature

AppLayout includes a toggle button (top-left) to hide/show the sidebar:
- **Button position:** `264px` from left when visible, `16px` when hidden
- **Keyboard shortcut:** `Ctrl+B` (Windows/Linux) or `Cmd+B` (macOS)
- **Animation:** Smooth slide with `transform: translateX()` (250ms)
- **Icon:** `◀` when visible, `▶` when hidden

### Algorithm Implementations

**CPF Check Digits** (`src/utils/cpf.ts`):
- First 9 digits are random
- Check digits calculated using weighted sum modulo 11
- Weights for 1st digit: 10, 9, 8, 7, 6, 5, 4, 3, 2
- Weights for 2nd digit: 11, 10, 9, 8, 7, 6, 5, 4, 3, 2
- If remainder < 2, digit is 0, else digit is 11 - remainder

**CNPJ Check Digits** (`src/utils/cnpj.ts`):
- First 8 digits are base number, next 4 are branch (0001 for HQ)
- Check digits calculated using weighted sum modulo 11
- Weights for 1st digit: 5,4,3,2,9,8,7,6,5,4,3,2
- Weights for 2nd digit: 6,5,4,3,2,9,8,7,6,5,4,3,2
- Same remainder rule as CPF

### Common Patterns

**Tool Component Structure:**
```typescript
export const ToolName: React.FC = () => {
  const [state, setState] = useState(initialValue)

  const handleAction = () => { /* logic */ }

  // Define all styles as objects
  const containerStyle: React.CSSProperties = { /* ... */ }

  return (
    <div style={containerStyle}>
      <ToolCard>
        {/* controls */}
      </ToolCard>

      {result && (
        <ToolCard title="Result">
          {/* output */}
          <CopyButton text={result} />
        </ToolCard>
      )}

      <ToolCard>
        {/* info/help text */}
      </ToolCard>
    </div>
  )
}
```

**Shared Components Usage:**
```typescript
// Button with variants
<Button variant="primary" size="lg" onClick={handleClick}>
  Text
</Button>

// Copy button with success feedback
<CopyButton text={dataToCopy} variant="primary" successMessage="Copied!" />

// Tool card container
<ToolCard title="Optional Title">
  {children}
</ToolCard>
```

### TypeScript Notes

- Full type coverage, no `any` types used
- Use `React.FC` for functional components
- Use `React.CSSProperties` for inline style objects
- Import types from dependencies when needed (e.g., `ButtonHTMLAttributes`)

### Development Workflow

1. **Make changes** - Edit files in `src/`
2. **Hot reload** - Vite updates instantly, Electron reloads automatically
3. **Check DevTools** - Opens automatically in dev mode
4. **Build when ready** - Use platform-specific build commands

### Files Not to Modify

- `vite.config.ts` - Vite and Electron plugin configuration (working correctly)
- `electron/main.ts` - Main process setup (working correctly)
- `src/main.tsx` - React entry point with global styles (working correctly)
- `tsconfig.json` / `tsconfig.node.json` - TypeScript config (working correctly)

### Documentation

- `README.md` - Complete user guide, setup instructions, tool addition guide
- `ARCHITECTURE.md` - Deep dive into architecture and design patterns
- `EXAMPLE_NEW_TOOL.md` - Step-by-step example of adding Base64 encoder
- `PROJECT_SUMMARY.md` - High-level overview
- `QUICK_START.md` - 5-minute getting started guide
- `SIDEBAR_TOGGLE_FEATURE.md` - Documentation of sidebar toggle feature

**When adding a new tool:** Follow the pattern in `EXAMPLE_NEW_TOOL.md` which shows complete implementation of a Base64 encoder/decoder tool.

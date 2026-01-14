# FD4D - From Dev for Dev

A modern, cross-platform developer utility toolkit built with Electron and React. FD4D provides a collection of essential tools for developers, starting with Brazilian document generators (CPF, CNPJ) and UUID generation, with an extensible architecture for adding more tools easily.

![FD4D Banner](docs/banner.png)

## Features

- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Modern UI**: Beautiful, dark-themed interface with smooth animations
- **Extensible Architecture**: Plugin-based system for easy tool addition
- **Type-Safe**: Built with TypeScript for reliability
- **Fast & Responsive**: Powered by Vite for lightning-fast development
- **Offline-First**: All tools work completely offline

## Current Tools

### 🇧🇷 CPF Generator
Generate valid Brazilian CPF (Cadastro de Pessoas Físicas) numbers with proper digit verification. Supports:
- Single or bulk generation (up to 100 at once)
- Formatted or raw output
- Built-in validation
- One-click copy to clipboard

### 🏢 CNPJ Generator
Generate valid Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica) numbers. Features:
- Bulk generation support
- Format customization
- Validation checking
- Quick copy functionality

### 🔑 UUID Generator
Generate UUIDs (Universally Unique Identifiers) version 4. Options include:
- Multiple UUID generation
- Uppercase/lowercase formatting
- Dash removal option
- Instant clipboard copy

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Project Structure](#project-structure)
- [Adding New Tools](#adding-new-tools)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn**

### Setup Steps

1. **Clone the repository** (or extract the source code):
   ```bash
   cd fd4d
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required packages including:
   - Electron
   - React 18
   - Vite
   - TypeScript
   - UUID library

3. **Verify installation**:
   ```bash
   npm run electron:dev
   ```

   The app should open in a new window.

## Development

### Running in Development Mode

```bash
npm run electron:dev
```

This command:
- Starts the Vite development server
- Launches Electron with hot-reload enabled
- Opens DevTools automatically
- Watches for file changes

The app will reload automatically when you make changes to the source code.

### Development Tips

- **DevTools**: Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS) to open DevTools
- **Reload**: Press `Ctrl+R` (Windows/Linux) or `Cmd+R` (macOS) to reload the app
- **File Watching**: Vite provides instant hot module replacement (HMR)

## Building

### Build for All Platforms

```bash
npm run build
```

This creates production builds for Windows, macOS, and Linux in the `release/` directory.

### Platform-Specific Builds

#### Windows
```bash
npm run build:win
```
Outputs:
- NSIS installer (`.exe`)
- Portable version (`.exe`)

#### macOS
```bash
npm run build:mac
```
Outputs:
- DMG installer (`.dmg`)
- ZIP archive (`.zip`)

#### Linux
```bash
npm run build:linux
```
Outputs:
- AppImage (`.AppImage`)
- Debian package (`.deb`)

### Build Configuration

Build settings are configured in `package.json` under the `build` section. You can customize:
- App ID and name
- Icons and assets
- Installer behavior
- Target formats

## Project Structure

```
fd4d/
├── electron/                # Electron main process
│   └── main.ts             # Main process entry point
│
├── src/                    # React application source
│   ├── components/         # React components
│   │   ├── Layout/        # Layout components
│   │   │   ├── AppLayout.tsx    # Main app layout
│   │   │   └── Sidebar.tsx      # Navigation sidebar
│   │   └── shared/        # Shared/reusable components
│   │       ├── Button.tsx       # Button component
│   │       ├── CopyButton.tsx   # Copy to clipboard button
│   │       └── ToolCard.tsx     # Tool container card
│   │
│   ├── tools/             # Tool implementations
│   │   ├── CPFGenerator/
│   │   │   └── CPFGenerator.tsx
│   │   ├── CNPJGenerator/
│   │   │   └── CNPJGenerator.tsx
│   │   ├── UUIDGenerator/
│   │   │   └── UUIDGenerator.tsx
│   │   └── registry.ts    # Tool registry system
│   │
│   ├── theme/             # Design system
│   │   └── theme.ts       # Theme configuration
│   │
│   ├── utils/             # Utility functions
│   │   ├── cpf.ts        # CPF generation/validation
│   │   ├── cnpj.ts       # CNPJ generation/validation
│   │   └── clipboard.ts  # Clipboard operations
│   │
│   ├── App.tsx           # Root React component
│   ├── main.tsx          # React entry point
│   └── vite-env.d.ts     # Vite type definitions
│
├── index.html            # HTML template
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md            # This file
```

## Adding New Tools

One of FD4D's core features is its extensibility. Here's how to add a new tool in 5 steps:

### Step-by-Step Guide

#### 1. Create the Tool Component

Create a new directory under `src/tools/` for your tool:

```bash
mkdir src/tools/Base64Encoder
```

Create your tool component `src/tools/Base64Encoder/Base64Encoder.tsx`:

```tsx
import React, { useState } from 'react'
import { theme } from '../../theme/theme'
import { ToolCard } from '../../components/shared/ToolCard'
import { Button } from '../../components/shared/Button'
import { CopyButton } from '../../components/shared/CopyButton'

export const Base64Encoder: React.FC = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input))
      } else {
        setOutput(atob(input))
      }
    } catch (error) {
      setOutput('Error: Invalid input')
    }
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '150px',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
    background: theme.colors.background.tertiary,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.mono,
    resize: 'vertical',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }}>
      <ToolCard>
        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{ display: 'flex', gap: theme.spacing.sm }}>
            <input
              type="radio"
              checked={mode === 'encode'}
              onChange={() => setMode('encode')}
            />
            Encode
          </label>
          <label style={{ display: 'flex', gap: theme.spacing.sm }}>
            <input
              type="radio"
              checked={mode === 'decode'}
              onChange={() => setMode('decode')}
            />
            Decode
          </label>
        </div>

        <textarea
          style={textareaStyle}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter text to ${mode}...`}
        />

        <div style={{ marginTop: theme.spacing.md }}>
          <Button onClick={handleProcess}>
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </Button>
        </div>
      </ToolCard>

      {output && (
        <ToolCard title="Result">
          <div style={{
            ...textareaStyle,
            minHeight: '100px',
            wordBreak: 'break-all',
          }}>
            {output}
          </div>
          <div style={{ marginTop: theme.spacing.md }}>
            <CopyButton text={output} />
          </div>
        </ToolCard>
      )}
    </div>
  )
}
```

#### 2. Create Utility Functions (Optional)

If your tool needs complex logic, create utility functions in `src/utils/`:

```typescript
// src/utils/base64.ts
export function encodeBase64(input: string): string {
  return btoa(input)
}

export function decodeBase64(input: string): string {
  return atob(input)
}
```

#### 3. Register the Tool

Open `src/App.tsx` and add your tool to the registry:

```tsx
import { Base64Encoder } from './tools/Base64Encoder/Base64Encoder'

// Inside the toolRegistry.registerMany() call, add:
createTool({
  id: 'base64-encoder',
  name: 'Base64 Encoder',
  description: 'Encode and decode Base64 strings',
  icon: '🔐',
  category: 'encoder',
  component: Base64Encoder,
  tags: ['base64', 'encode', 'decode', 'conversion'],
})
```

#### 4. Test Your Tool

Run the development server:

```bash
npm run electron:dev
```

Your new tool should appear in the sidebar under the "Encoders" category.

#### 5. Done!

That's it! Your tool is now integrated into FD4D and ready to use.

### Tool Configuration Options

When registering a tool, you can configure:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (use kebab-case) |
| `name` | string | Yes | Display name shown in UI |
| `description` | string | Yes | Brief description of the tool |
| `icon` | string \| ReactNode | Yes | Emoji or custom icon component |
| `category` | string | Yes | Category: 'generator', 'encoder', 'converter', 'utility', 'other' |
| `component` | React.ComponentType | Yes | The React component to render |
| `shortcut` | string | No | Keyboard shortcut (e.g., 'ctrl+shift+b') |
| `tags` | string[] | No | Searchable tags for the tool |

### Best Practices

1. **Component Organization**: Keep each tool in its own directory
2. **Reusable Components**: Use shared components (Button, CopyButton, ToolCard)
3. **Theme Consistency**: Always use values from `theme.ts`
4. **Error Handling**: Add try-catch blocks for operations that might fail
5. **User Feedback**: Provide clear feedback for user actions (loading states, success messages)
6. **TypeScript**: Define proper types for your tool's state and props
7. **Accessibility**: Include proper ARIA labels and keyboard navigation

## Architecture

### Tool Registry System

FD4D uses a plugin-based architecture centered around the **Tool Registry**. This system allows:

- **Decoupled Tools**: Each tool is independent and self-contained
- **Easy Registration**: Tools are registered declaratively in `App.tsx`
- **Dynamic Loading**: Tools are loaded and rendered dynamically
- **Type Safety**: Full TypeScript support for tool definitions

### Key Components

#### Tool Registry (`src/tools/registry.ts`)
The central registry that manages all tools. Provides methods to:
- Register tools
- Query tools by ID, category, or tags
- Search tools

#### AppLayout (`src/components/Layout/AppLayout.tsx`)
The main layout component that:
- Manages active tool state
- Renders the sidebar and content area
- Handles tool switching

#### Sidebar (`src/components/Layout/Sidebar.tsx`)
Navigation component that:
- Lists all registered tools
- Groups tools by category
- Highlights the active tool

### Design System

The design system (`src/theme/theme.ts`) provides:
- **Color Palette**: Comprehensive color scheme for dark theme
- **Typography**: Font families, sizes, and weights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corner values
- **Shadows**: Shadow definitions for depth
- **Transitions**: Animation timing values

All components use the design system for visual consistency.

## Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing the bug
2. **Suggest Features**: Share ideas for new tools or improvements
3. **Submit PRs**: Fork the repo and submit pull requests
4. **Improve Docs**: Help improve documentation
5. **Share Tools**: Create and share new tools

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-tool`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "Add Base64 encoder tool"`
6. Push to your fork: `git push origin feature/my-new-tool`
7. Open a Pull Request

## Troubleshooting

### Common Issues

#### Port Already in Use
If port 5173 is already in use, modify `vite.config.ts`:
```ts
server: {
  port: 5174, // Change to an available port
}
```

#### Build Fails
- Ensure all dependencies are installed: `npm install`
- Clear build cache: `rm -rf dist dist-electron release`
- Try building again

#### App Won't Start
- Check Node.js version: `node --version` (should be 18+)
- Verify Electron is installed: `npm list electron`
- Check console for error messages

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Built with:
- [Electron](https://www.electronjs.org/) - Cross-platform desktop apps
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [UUID](https://github.com/uuidjs/uuid) - UUID generation

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review this README for common problems

---

**FD4D** - Made with ❤️ by developers, for developers.

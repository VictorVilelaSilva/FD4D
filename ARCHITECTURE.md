# FD4D Architecture Documentation

This document explains the architectural decisions, design patterns, and extensibility system used in FD4D.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Tool Registry System](#tool-registry-system)
5. [Design System](#design-system)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Extensibility](#extensibility)

## Overview

FD4D is built with a modular, plugin-based architecture that prioritizes:
- **Extensibility**: Easy addition of new tools
- **Type Safety**: Full TypeScript support
- **Maintainability**: Clean separation of concerns
- **Performance**: Fast development and runtime performance
- **Cross-Platform**: Consistent behavior across Windows, macOS, and Linux

## Technology Stack

### Core Technologies

- **Electron**: Desktop application framework
  - Enables cross-platform deployment
  - Provides native OS integration
  - Handles main process (Node.js) and renderer process (browser)

- **React 18**: UI library
  - Component-based architecture
  - Hooks for state management
  - Virtual DOM for performance

- **TypeScript**: Type-safe JavaScript
  - Compile-time type checking
  - Enhanced IDE support
  - Better documentation through types

- **Vite**: Build tool
  - Lightning-fast hot module replacement (HMR)
  - Optimized production builds
  - Native ES modules support

### Key Dependencies

- **uuid**: Standard UUID generation library
- **electron-builder**: Automated cross-platform builds
- **vite-plugin-electron**: Seamless Electron + Vite integration

## Project Structure

```
fd4d/
├── electron/               # Electron main process
│   └── main.ts            # Application entry, window management
│
├── src/                   # React renderer process
│   ├── components/        # UI components
│   │   ├── Layout/       # App structure
│   │   └── shared/       # Reusable components
│   │
│   ├── tools/            # Tool implementations
│   │   ├── [ToolName]/   # Each tool in its own directory
│   │   └── registry.ts   # Tool registration system
│   │
│   ├── theme/            # Design system
│   │   └── theme.ts      # All design tokens
│   │
│   ├── utils/            # Utility functions
│   │   └── *.ts          # Pure functions for logic
│   │
│   ├── App.tsx           # Root component, tool registration
│   └── main.tsx          # React entry point, global styles
│
├── Configuration files
└── Documentation
```

### Directory Organization Principles

1. **Feature-Based**: Tools are organized by feature (CPF, CNPJ, UUID)
2. **Separation of Concerns**: UI, logic, and styling are separated
3. **Colocation**: Related files are kept together
4. **Flat Structure**: Avoid deep nesting for easier navigation

## Tool Registry System

The heart of FD4D's extensibility is the **Tool Registry System**.

### Architecture

```typescript
Tool Interface
     ↓
Tool Registry (Singleton)
     ↓
App.tsx (Registration)
     ↓
AppLayout (Rendering)
```

### Components

#### 1. Tool Interface (`src/tools/registry.ts`)

Defines the contract all tools must follow:

```typescript
interface Tool {
  id: string              // Unique identifier
  name: string            // Display name
  description: string     // Brief description
  icon: string | ReactNode // Visual identifier
  category: string        // For grouping
  component: ComponentType // React component
  shortcut?: string       // Optional keyboard shortcut
  tags?: string[]         // For search/filtering
}
```

#### 2. Tool Registry Class

Manages all registered tools:

```typescript
class ToolRegistry {
  private tools: Map<string, Tool>

  register(tool: Tool): void
  getTool(id: string): Tool | undefined
  getAllTools(): Tool[]
  getToolsByCategory(category: string): Tool[]
  searchTools(query: string): Tool[]
}
```

**Design Decisions:**
- **Singleton Pattern**: Only one registry instance exists
- **Map Storage**: O(1) lookup by ID
- **Type Safety**: Full TypeScript support
- **Validation**: Prevents duplicate IDs

#### 3. Tool Registration

Tools are registered in `App.tsx`:

```typescript
toolRegistry.registerMany([
  createTool({
    id: 'cpf-generator',
    name: 'CPF Generator',
    // ... other properties
    component: CPFGenerator,
  }),
  // ... more tools
])
```

**Benefits:**
- **Declarative**: Clear, readable tool definitions
- **Centralized**: All tools registered in one place
- **Type-Safe**: TypeScript ensures correct configuration
- **Easy to Add**: Just add another entry to the array

### Tool Lifecycle

1. **Registration**: Tool is registered in `App.tsx`
2. **Discovery**: Registry stores tool configuration
3. **Display**: Sidebar queries registry for all tools
4. **Selection**: User clicks tool in sidebar
5. **Rendering**: AppLayout renders the tool's component
6. **Interaction**: User interacts with the tool

## Design System

Located in `src/theme/theme.ts`, the design system provides:

### Structure

```typescript
export const theme = {
  colors: { /* color palette */ },
  spacing: { /* spacing scale */ },
  typography: { /* fonts, sizes, weights */ },
  borderRadius: { /* corner rounding */ },
  shadows: { /* shadow definitions */ },
  transitions: { /* animation timing */ },
  breakpoints: { /* responsive breakpoints */ },
  zIndex: { /* stacking order */ },
}
```

### Design Decisions

1. **Single Source of Truth**: All design values in one file
2. **Type Safety**: Exported as `const` for inference
3. **Consistency**: All components use the same values
4. **Maintainability**: Easy to update theme globally
5. **Dark Theme**: Optimized for reduced eye strain

### Usage Pattern

```typescript
import { theme } from '../../theme/theme'

const buttonStyle = {
  background: theme.colors.primary,
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.md,
}
```

## Component Architecture

### Component Hierarchy

```
App
 └── AppLayout
      ├── Sidebar
      │    └── Tool List Items
      └── Tool Component
           └── ToolCards
                ├── Buttons
                ├── CopyButtons
                └── Custom UI
```

### Component Types

#### 1. Layout Components

**Purpose**: Structure the application

- `AppLayout`: Main container, manages active tool
- `Sidebar`: Navigation, tool selection

**Characteristics:**
- Stateful (manage navigation state)
- Compose other components
- Handle routing/navigation logic

#### 2. Shared Components

**Purpose**: Reusable UI elements

- `Button`: Styled button with variants
- `CopyButton`: Button with clipboard functionality
- `ToolCard`: Container for tool content

**Characteristics:**
- Stateless or minimal state
- Generic, reusable
- Accept style customization via props

#### 3. Tool Components

**Purpose**: Implement specific tool functionality

- `CPFGenerator`, `CNPJGenerator`, `UUIDGenerator`

**Characteristics:**
- Self-contained
- Manage own state
- Use shared components
- Follow consistent layout patterns

### Styling Approach

**CSS-in-JS (Inline Styles)**

Chosen for:
- **No Build Step**: No CSS bundling needed
- **Type Safety**: TypeScript autocomplete for styles
- **Scoping**: No class name conflicts
- **Dynamic**: Easy to compute styles based on props/state
- **Theme Integration**: Direct access to theme values

Pattern:
```typescript
const style: React.CSSProperties = {
  property: theme.values.something
}

<div style={style}>...</div>
```

## State Management

### Strategy

FD4D uses **React's built-in state management**:

- `useState`: Component-local state
- `useEffect`: Side effects (if needed)
- Props: Pass data down component tree

### Why No Global State Library?

- **Simplicity**: Each tool is independent
- **No Shared State**: Tools don't need to communicate
- **Performance**: No unnecessary re-renders
- **Learning Curve**: Easier for contributors

### State Organization

```typescript
// Tool-level state
const [value, setValue] = useState('')
const [options, setOptions] = useState({...})

// Layout-level state (navigation)
const [activeToolId, setActiveToolId] = useState(...)
```

## Extensibility

### Adding a New Tool

The system is designed to make adding tools as easy as possible:

1. **Create Component**: Build your React component
2. **Register**: Add to registry in `App.tsx`
3. **Done**: Tool automatically appears in sidebar

### Extension Points

1. **Tool Registry**: Add new tools
2. **Utility Functions**: Add new `utils/*.ts` files
3. **Shared Components**: Create reusable UI components
4. **Theme**: Extend design system

### Plugin System Benefits

- **Zero Core Changes**: Add tools without modifying core code
- **Independent Development**: Tools don't affect each other
- **Easy Testing**: Test tools in isolation
- **Quick Iteration**: Add/remove tools quickly

### Future Extensibility

Potential enhancements:

1. **External Plugins**: Load tools from external files
2. **Settings System**: Per-tool configuration
3. **Tool Communication**: Message passing between tools
4. **Keyboard Shortcuts**: Global shortcut system
5. **Tool Marketplace**: Share/download community tools

## Best Practices

### Adding New Features

1. **Check Existing Patterns**: Look at existing tools for consistency
2. **Use Shared Components**: Don't reinvent the wheel
3. **Follow Theme**: Use design system values
4. **Type Everything**: Leverage TypeScript
5. **Keep It Simple**: KISS principle

### Performance Considerations

1. **Lazy Loading**: Could add React.lazy() for large tools
2. **Memoization**: Use React.memo() for expensive components
3. **Virtual Scrolling**: For large lists (future enhancement)
4. **Code Splitting**: Vite handles this automatically

### Security

1. **Input Validation**: Validate all user inputs
2. **No Eval**: Never use `eval()` or `Function()`
3. **Sanitize Output**: Escape user-generated content
4. **Electron Security**: Context isolation enabled

## Testing Strategy

While not implemented in MVP, recommended approach:

1. **Unit Tests**: Test utility functions (CPF, CNPJ validation)
2. **Component Tests**: React Testing Library
3. **E2E Tests**: Playwright or Spectron
4. **Type Checking**: `tsc --noEmit` in CI/CD

## Build & Distribution

### Development Build

```bash
npm run electron:dev
```

- Vite dev server with HMR
- Electron in dev mode
- DevTools enabled

### Production Build

```bash
npm run build
```

- Vite optimizes React code
- TypeScript compilation
- Electron Builder packages app
- Platform-specific installers

### Build Output

- **Windows**: NSIS installer, portable EXE
- **macOS**: DMG, ZIP
- **Linux**: AppImage, DEB

## Conclusion

FD4D's architecture prioritizes:
- **Developer Experience**: Easy to understand and extend
- **User Experience**: Fast, responsive, intuitive
- **Maintainability**: Clean code, clear patterns
- **Scalability**: Easy to add new tools

The plugin-based system ensures that the app can grow without becoming complex or unwieldy.

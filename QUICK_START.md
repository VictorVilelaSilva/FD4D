# FD4D Quick Start Guide

Get up and running with FD4D in less than 5 minutes!

## Prerequisites Check

Before you start, make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm or yarn installed (`npm --version`)

## Installation (2 minutes)

### Step 1: Navigate to the project directory
```bash
cd fd4d
```

### Step 2: Install dependencies
```bash
npm install
```

This will install:
- Electron 28
- React 18
- TypeScript 5
- Vite 5
- All other required packages

Wait for the installation to complete (usually 1-2 minutes).

## Running the App (30 seconds)

### Development Mode
```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server (http://localhost:5173)
2. Launch the Electron app
3. Open DevTools automatically
4. Enable hot-reload for instant updates

The app should open in a new window within seconds!

## First Steps

Once the app opens:

1. **Explore the Sidebar**: See all available tools (CPF, CNPJ, UUID)
2. **Generate a CPF**: Click "CPF Generator" → Click "Generate CPF"
3. **Copy to Clipboard**: Click the "Copy to Clipboard" button
4. **Try Other Tools**: Navigate between tools using the sidebar

## Building for Production (5 minutes)

### Build for Your Platform
```bash
npm run build
```

Or build for specific platforms:
```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

The built app will be in the `release/` directory.

## Common Issues & Solutions

### Port 5173 Already in Use
```bash
# Edit vite.config.ts and change the port
server: {
  port: 5174
}
```

### Installation Fails
```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Electron Won't Start
```bash
# Reinstall Electron
npm uninstall electron
npm install electron --save-dev
```

## Project Structure Overview

```
fd4d/
├── electron/           # Electron main process
├── src/               # React application
│   ├── components/    # UI components
│   ├── tools/        # Tool implementations
│   ├── theme/        # Design system
│   └── utils/        # Helper functions
├── package.json      # Dependencies & scripts
└── README.md        # Full documentation
```

## What's Next?

### For Users
- Explore all three tools
- Try bulk generation features
- Use keyboard shortcuts

### For Developers
- Read `ARCHITECTURE.md` to understand the design
- Check `EXAMPLE_NEW_TOOL.md` to add your first tool
- Browse the codebase to see implementation patterns

## Key Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run electron:dev` | Start development mode |
| `npm run build` | Build for all platforms |
| `npm run build:win` | Build for Windows |
| `npm run build:mac` | Build for macOS |
| `npm run build:linux` | Build for Linux |

## Development Tips

1. **Hot Reload**: Changes to React code reload instantly
2. **DevTools**: Press `Ctrl+Shift+I` (Win/Linux) or `Cmd+Option+I` (Mac)
3. **Reload App**: Press `Ctrl+R` (Win/Linux) or `Cmd+R` (Mac)
4. **Console Logs**: Check DevTools console for debug output

## Getting Help

If you run into issues:

1. Check this guide first
2. Read `README.md` for detailed information
3. Review `ARCHITECTURE.md` for design decisions
4. Look at existing code for examples

## Adding Your First Tool (Quick Version)

1. Create component: `src/tools/MyTool/MyTool.tsx`
2. Register in `src/App.tsx`:
   ```typescript
   import { MyTool } from './tools/MyTool/MyTool'

   createTool({
     id: 'my-tool',
     name: 'My Tool',
     description: 'What it does',
     icon: '🔧',
     category: 'utility',
     component: MyTool,
   })
   ```
3. Restart dev server
4. Done!

For a complete example, see `EXAMPLE_NEW_TOOL.md`.

## Success Indicators

You'll know everything is working when:
- ✅ App window opens without errors
- ✅ Sidebar shows 3 tools (CPF, CNPJ, UUID)
- ✅ Clicking a tool loads its interface
- ✅ Generate buttons create valid data
- ✅ Copy buttons work and show "Copied!" feedback

## Next Steps

Now that you're up and running:

1. **Explore the codebase**: Browse the well-organized file structure
2. **Read the docs**: Check out README.md and ARCHITECTURE.md
3. **Add a tool**: Follow EXAMPLE_NEW_TOOL.md
4. **Customize**: Modify the theme in `src/theme/theme.ts`
5. **Build**: Create production builds for distribution

---

**Congratulations!** You're now ready to use and extend FD4D! 🎉

For more detailed information, refer to:
- `README.md` - Complete user and developer guide
- `ARCHITECTURE.md` - Technical architecture details
- `EXAMPLE_NEW_TOOL.md` - Step-by-step tool creation
- `PROJECT_SUMMARY.md` - High-level project overview

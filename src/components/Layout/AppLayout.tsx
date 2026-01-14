import React, { useState, useEffect } from 'react'
import { theme } from '../../theme/theme'
import { Sidebar } from './Sidebar'
import { toolRegistry } from '../../tools/registry'

export const AppLayout: React.FC = () => {
  const tools = toolRegistry.getAllTools()
  const [activeToolId, setActiveToolId] = useState(tools[0]?.id || '')
  const [sidebarVisible, setSidebarVisible] = useState(true)

  const activeTool = toolRegistry.getTool(activeToolId)
  const ActiveToolComponent = activeTool?.component

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  // Keyboard shortcut: Ctrl/Cmd + B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sidebarVisible])

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    background: theme.colors.background.primary,
    fontFamily: theme.typography.fontFamily.primary,
  }

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing['2xl'],
  }

  const headerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  }

  const toolTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  }

  const toolDescStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  }

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xl,
  }

  const toggleButtonStyle: React.CSSProperties = {
    position: 'fixed',
    top: theme.spacing.md,
    left: sidebarVisible ? '264px' : theme.spacing.md,
    zIndex: theme.zIndex.sticky,
    background: theme.colors.background.card,
    border: `2px solid ${theme.colors.primary}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    transition: `all ${theme.transitions.normal}`,
    boxShadow: theme.shadows.lg,
    fontWeight: theme.typography.fontWeight.bold,
  }

  const sidebarContainerStyle: React.CSSProperties = {
    transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
    transition: `transform ${theme.transitions.normal}`,
    position: 'relative',
    zIndex: theme.zIndex.fixed,
  }

  return (
    <div style={layoutStyle}>
      <div style={sidebarContainerStyle}>
        <Sidebar
          tools={tools}
          activeToolId={activeToolId}
          onToolSelect={setActiveToolId}
        />
      </div>

      <button
        style={toggleButtonStyle}
        onClick={toggleSidebar}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = theme.colors.primary
          e.currentTarget.style.color = theme.colors.white
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = theme.shadows.glow
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = theme.colors.background.card
          e.currentTarget.style.color = theme.colors.primary
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = theme.shadows.lg
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        title={sidebarVisible ? 'Hide sidebar (Ctrl/Cmd + B)' : 'Show sidebar (Ctrl/Cmd + B)'}
        aria-label={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        {sidebarVisible ? '◀' : '▶'}
      </button>

      <main style={contentStyle}>
        {activeTool && ActiveToolComponent ? (
          <>
            <header style={headerStyle}>
              <h1 style={toolTitleStyle}>
                <span style={{ fontSize: theme.typography.fontSize['3xl'] }}>
                  {typeof activeTool.icon === 'string' ? activeTool.icon : activeTool.icon}
                </span>
                {activeTool.name}
              </h1>
              <p style={toolDescStyle}>{activeTool.description}</p>
            </header>
            <ActiveToolComponent />
          </>
        ) : (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: '64px', marginBottom: theme.spacing.lg }}>🛠️</div>
            <div>No tools available</div>
            <div style={{ fontSize: theme.typography.fontSize.base, marginTop: theme.spacing.sm }}>
              Register tools to get started
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

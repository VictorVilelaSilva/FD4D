import React, { useState, useEffect } from 'react'
import { theme } from '../../theme/theme'
import { Sidebar } from './Sidebar'
import { toolRegistry } from '../../tools/registry'

export const AppLayout: React.FC = () => {
  const tools = toolRegistry.getAllTools()
  const [activeToolId, setActiveToolId] = useState(tools[0]?.id || '')
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [infoOpen, setInfoOpen] = useState(false)

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

  const infoButtonStyle: React.CSSProperties = {
    marginLeft: 'auto',
    background: theme.colors.background.card,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.full,
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.bold,
    transition: theme.transitions.fast,
  }

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: '#00000066',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndex.modal,
  }

  const modalStyle: React.CSSProperties = {
    background: theme.colors.background.card,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.lg,
    width: 'min(720px, 90vw)',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: theme.shadows.lg,
  }

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xl,
  }

  const modalBodyStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
    fontSize: theme.typography.fontSize.base,
  }

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xl,
    lineHeight: 1,
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
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                <h1 style={toolTitleStyle}>
                  <span style={{ fontSize: theme.typography.fontSize['3xl'] }}>
                    {typeof activeTool.icon === 'string' ? activeTool.icon : activeTool.icon}
                  </span>
                  {activeTool.name}
                </h1>
                <button
                  style={infoButtonStyle}
                  title={`About ${activeTool.name}`}
                  onClick={() => setInfoOpen(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primary
                    e.currentTarget.style.borderColor = theme.colors.primary
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.text.secondary
                    e.currentTarget.style.borderColor = theme.colors.border.default
                  }}
                  aria-label={`More info about ${activeTool.name}`}
                >
                  i
                </button>
              </div>
              <p style={toolDescStyle}>{activeTool.description}</p>
            </header>
            <ActiveToolComponent />

            {infoOpen && (
              <div style={modalOverlayStyle} onClick={() => setInfoOpen(false)}>
                <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                  <div style={modalHeaderStyle}>
                    <span>About {activeTool.name}</span>
                    <button style={closeButtonStyle} onClick={() => setInfoOpen(false)} aria-label="Close info">×</button>
                  </div>
                  <div style={modalBodyStyle}>
                    {((ActiveToolComponent as any)?.infoContent) || (
                      <div>{activeTool.description}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
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

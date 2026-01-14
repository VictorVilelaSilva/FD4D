import React from 'react'
import { theme } from '../../theme/theme'
import { Tool } from '../../tools/registry'

interface SidebarProps {
  tools: Tool[]
  activeToolId: string
  onToolSelect: (toolId: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ tools, activeToolId, onToolSelect }) => {
  const sidebarStyle: React.CSSProperties = {
    width: '280px',
    height: '100vh',
    background: theme.colors.background.secondary,
    borderRight: `1px solid ${theme.colors.border.default}`,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  }

  const headerStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    borderBottom: `1px solid ${theme.colors.border.default}`,
  }

  const logoStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  }

  const taglineStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.primary,
  }

  const toolsListStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    flex: 1,
  }

  const categoryHeaderStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: `${theme.spacing.md} ${theme.spacing.sm}`,
    fontFamily: theme.typography.fontFamily.primary,
  }

  const toolItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    background: isActive ? theme.colors.primaryAlpha : 'transparent',
    color: isActive ? theme.colors.primary : theme.colors.text.primary,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: isActive ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
    border: isActive ? `1px solid ${theme.colors.primary}` : '1px solid transparent',
  })

  const iconStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    width: '24px',
    textAlign: 'center',
  }

  // Group tools by category
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, Tool[]>)

  const categoryNames: Record<string, string> = {
    generator: 'Generators',
    encoder: 'Encoders',
    converter: 'Converters',
    utility: 'Utilities',
    other: 'Other',
  }

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        <div style={logoStyle}>FD4D</div>
        <div style={taglineStyle}>From Dev for Dev</div>
      </div>

      <div style={toolsListStyle}>
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category}>
            <div style={categoryHeaderStyle}>
              {categoryNames[category] || category}
            </div>
            {categoryTools.map((tool) => (
              <div
                key={tool.id}
                style={toolItemStyle(tool.id === activeToolId)}
                onClick={() => onToolSelect(tool.id)}
                onMouseEnter={(e) => {
                  if (tool.id !== activeToolId) {
                    e.currentTarget.style.background = theme.colors.background.hover
                  }
                }}
                onMouseLeave={(e) => {
                  if (tool.id !== activeToolId) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={iconStyle}>
                  {typeof tool.icon === 'string' ? tool.icon : tool.icon}
                </span>
                <div>
                  <div>{tool.name}</div>
                  {tool.description && (
                    <div
                      style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: '2px',
                      }}
                    >
                      {tool.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.border.default}`,
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.tertiary,
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily.primary,
        }}
      >
        v1.0.0 - Built with Electron + React
      </div>
    </aside>
  )
}

import React from 'react'
import { theme } from '../../theme/theme'

interface ToolCardProps {
  title?: string
  children: React.ReactNode
}

export const ToolCard: React.FC<ToolCardProps> = ({ title, children }) => {
  const cardStyle: React.CSSProperties = {
    background: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border.default}`,
    transition: theme.transitions.normal,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily.primary,
  }

  return (
    <div style={cardStyle}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      {children}
    </div>
  )
}

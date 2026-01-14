import React, { ButtonHTMLAttributes } from 'react'
import { theme } from '../../theme/theme'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        background: theme.colors.primary,
        color: theme.colors.white,
        hoverBackground: theme.colors.primaryLight,
      },
      secondary: {
        background: theme.colors.secondary,
        color: theme.colors.white,
        hoverBackground: theme.colors.secondaryLight,
      },
      success: {
        background: theme.colors.success,
        color: theme.colors.white,
        hoverBackground: theme.colors.accentLight,
      },
      danger: {
        background: theme.colors.error,
        color: theme.colors.white,
        hoverBackground: theme.colors.errorLight,
      },
      ghost: {
        background: 'transparent',
        color: theme.colors.text.primary,
        hoverBackground: theme.colors.background.hover,
      },
    }
    return variants[variant]
  }

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        fontSize: theme.typography.fontSize.sm,
      },
      md: {
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        fontSize: theme.typography.fontSize.base,
      },
      lg: {
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.lg,
      },
    }
    return sizes[size]
  }

  const variantStyles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  const buttonStyle: React.CSSProperties = {
    background: disabled ? theme.colors.background.tertiary : variantStyles.background,
    color: disabled ? theme.colors.text.disabled : variantStyles.color,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: theme.transitions.normal,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    outline: 'none',
    ...style,
  }

  return (
    <button
      style={buttonStyle}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = variantStyles.hoverBackground
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = theme.shadows.md
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = variantStyles.background
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

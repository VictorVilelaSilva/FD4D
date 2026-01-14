/**
 * FD4D Design System
 *
 * A comprehensive design system with carefully chosen colors,
 * spacing, typography, and other design tokens for a modern,
 * professional developer tool interface.
 */

export const theme = {
  colors: {
    // Primary palette - Deep blue with tech vibes
    primary: '#6C63FF',
    primaryLight: '#8B85FF',
    primaryDark: '#5449E0',
    primaryAlpha: 'rgba(108, 99, 255, 0.1)',

    // Secondary palette - Complementary purple
    secondary: '#A855F7',
    secondaryLight: '#C084FC',
    secondaryDark: '#9333EA',

    // Accent colors
    accent: '#10B981',
    accentLight: '#34D399',
    accentDark: '#059669',

    // Background colors - Dark theme
    background: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      tertiary: '#0f1729',
      card: '#232946',
      hover: '#2d3561',
    },

    // Text colors
    text: {
      primary: '#EAEAEA',
      secondary: '#B8B8D1',
      tertiary: '#9191A8',
      disabled: '#5F5F7E',
      inverse: '#1a1a2e',
    },

    // Status colors
    success: '#10B981',
    successLight: '#D1FAE5',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // Border colors
    border: {
      default: '#363B5E',
      light: '#4A5177',
      dark: '#1F2437',
    },

    // Utility
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"Fira Code", "Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(108, 99, 255, 0.3)',
    glowAccent: '0 0 20px rgba(16, 185, 129, 0.3)',
  },

  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
  },
} as const

export type Theme = typeof theme

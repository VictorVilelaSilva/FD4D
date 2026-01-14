/**
 * FD4D Design System
 *
 * A comprehensive design system with carefully chosen colors,
 * spacing, typography, and other design tokens for a modern,
 * professional developer tool interface.
 *
 * Color palette based on FD4D branding with the purple "4".
 */

export const theme = {
  colors: {
    // Primary palette - FD4D Purple (the "4")
    primary: '#9F6DFF',
    primaryLight: '#B794FF',
    primaryDark: '#8257E5',
    primaryAlpha: 'rgba(159, 109, 255, 0.1)',

    // Secondary palette - Deeper purple tones
    secondary: '#8257E5',
    secondaryLight: '#9F6DFF',
    secondaryDark: '#6B46C1',
    secondaryAlpha: 'rgba(130, 87, 229, 0.1)',

    // Accent colors - Cyan/Teal for contrast
    accent: '#58A6FF',
    accentLight: '#79B8FF',
    accentDark: '#388BFD',
    accentAlpha: 'rgba(88, 166, 255, 0.1)',

    // Background colors - GitHub-inspired dark theme
    background: {
      primary: '#0D1117',
      secondary: '#161B22',
      tertiary: '#0A0D12',
      card: '#1C2128',
      hover: '#21262D',
    },

    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#C9D1D9',
      tertiary: '#8B949E',
      disabled: '#484F58',
      inverse: '#0D1117',
    },

    // Status colors
    success: '#3FB950',
    successLight: '#56D364',
    successAlpha: 'rgba(63, 185, 80, 0.1)',
    error: '#F85149',
    errorLight: '#FF7B72',
    errorAlpha: 'rgba(248, 81, 73, 0.1)',
    warning: '#D29922',
    warningLight: '#E3B341',
    warningAlpha: 'rgba(210, 153, 34, 0.1)',
    info: '#58A6FF',
    infoLight: '#79B8FF',
    infoAlpha: 'rgba(88, 166, 255, 0.1)',

    // Border colors
    border: {
      default: '#30363D',
      light: '#484F58',
      dark: '#21262D',
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
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(159, 109, 255, 0.3)',
    glowAccent: '0 0 20px rgba(88, 166, 255, 0.3)',
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

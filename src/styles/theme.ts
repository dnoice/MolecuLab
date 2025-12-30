/**
 * ============================================================================
 * MolecuLab Theme Configuration
 * Cyberpunk/Sci-Fi Laboratory Aesthetic
 * ============================================================================
 */

export const theme = {
  colors: {
    // Backgrounds
    bgDeep: '#0a0a0f',
    bgDark: '#12121a',
    bgCard: 'rgba(20, 20, 35, 0.7)',
    bgGlass: 'rgba(30, 30, 50, 0.4)',
    bgHover: 'rgba(0, 245, 255, 0.05)',
    bgActive: 'rgba(0, 245, 255, 0.1)',

    // Neon accents
    neonCyan: '#00f5ff',
    neonMagenta: '#ff00ff',
    neonGold: '#ffd700',
    neonGreen: '#00ff88',
    neonRed: '#ff3366',
    neonBlue: '#3366ff',
    neonPurple: '#9933ff',
    neonOrange: '#ff8800',

    // Semantic colors
    success: '#00ff88',
    warning: '#ffd700',
    error: '#ff3366',
    info: '#00f5ff',

    // Text
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.4)',
    textDisabled: 'rgba(255, 255, 255, 0.2)',

    // Element colors (CPK-inspired for molecular visualization)
    elementC: '#00ffcc',
    elementH: '#ffffff',
    elementO: '#ff3366',
    elementN: '#3366ff',
    elementS: '#ffd700',
    elementP: '#ff8800',
    elementF: '#90e050',
    elementCl: '#1ff01f',
    elementBr: '#a62929',
    elementI: '#940094',
  },

  glows: {
    cyan: '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
    magenta: '0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)',
    gold: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
    green: '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)',
    red: '0 0 20px rgba(255, 51, 102, 0.5), 0 0 40px rgba(255, 51, 102, 0.3)',
    blue: '0 0 20px rgba(51, 102, 255, 0.5), 0 0 40px rgba(51, 102, 255, 0.3)',
  },

  borders: {
    glow: '1px solid rgba(0, 245, 255, 0.3)',
    subtle: '1px solid rgba(255, 255, 255, 0.1)',
    magenta: '1px solid rgba(255, 0, 255, 0.3)',
    success: '1px solid rgba(0, 255, 136, 0.3)',
    error: '1px solid rgba(255, 51, 102, 0.3)',
    focus: '2px solid rgba(0, 245, 255, 0.6)',
  },

  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '28px',
    full: '9999px',
  },

  fonts: {
    display: "'Orbitron', monospace",
    mono: "'JetBrains Mono', monospace",
    body: "'Outfit', sans-serif",
  },

  fontSizes: {
    '2xs': '9px',
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.2em',
  },

  spacing: {
    '0': '0',
    px: '1px',
    '0.5': '2px',
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '8': '32px',
    '10': '40px',
    '12': '48px',
    '16': '64px',
    '20': '80px',
    '24': '96px',
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Media query helpers
  media: {
    xs: '@media (min-width: 480px)',
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
    xl: '@media (min-width: 1280px)',
    '2xl': '@media (min-width: 1536px)',
    motion: '@media (prefers-reduced-motion: no-preference)',
    dark: '@media (prefers-color-scheme: dark)',
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    spring: '0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  shadows: {
    glass: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 10px 40px rgba(0, 0, 0, 0.4)',
    card: '0 4px 20px rgba(0, 0, 0, 0.3)',
    neon: '0 0 30px rgba(0, 245, 255, 0.4)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.5)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
    focus: '0 0 0 3px rgba(0, 245, 255, 0.3)',
  },

  zIndex: {
    hide: -1,
    base: 0,
    background: 0,
    content: 1,
    docked: 10,
    dropdown: 100,
    sticky: 200,
    banner: 300,
    overlay: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    toast: 800,
    maximum: 9999,
  },

  // Animation durations
  durations: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing functions
  easings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  },
} as const;

// Type for the theme
export type Theme = typeof theme;

// Helper type for color keys
export type ThemeColor = keyof typeof theme.colors;

// Helper type for spacing keys
export type ThemeSpacing = keyof typeof theme.spacing;

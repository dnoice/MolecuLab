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

    // Neon accents
    neonCyan: '#00f5ff',
    neonMagenta: '#ff00ff',
    neonGold: '#ffd700',
    neonGreen: '#00ff88',
    neonRed: '#ff3366',
    neonBlue: '#3366ff',

    // Text
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.4)',

    // Element colors (CPK-inspired)
    elementC: '#00ffcc', // Carbon - cyan-green
    elementH: '#ffffff', // Hydrogen - white
    elementO: '#ff3366', // Oxygen - red
    elementN: '#3366ff', // Nitrogen - blue
    elementS: '#ffd700', // Sulfur - yellow
    elementP: '#ff8800', // Phosphorus - orange
  },

  glows: {
    cyan: '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
    magenta: '0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)',
    gold: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
    green: '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)',
    red: '0 0 20px rgba(255, 51, 102, 0.5), 0 0 40px rgba(255, 51, 102, 0.3)',
  },

  borders: {
    glow: '1px solid rgba(0, 245, 255, 0.3)',
    subtle: '1px solid rgba(255, 255, 255, 0.1)',
    magenta: '1px solid rgba(255, 0, 255, 0.3)',
  },

  radius: {
    lg: '20px',
    md: '12px',
    sm: '8px',
    full: '9999px',
  },

  fonts: {
    display: "'Orbitron', monospace",
    mono: "'JetBrains Mono', monospace",
    body: "'Outfit', sans-serif",
  },

  fontSizes: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },

  shadows: {
    glass: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 10px 40px rgba(0, 0, 0, 0.4)',
    card: '0 4px 20px rgba(0, 0, 0, 0.3)',
    neon: '0 0 30px rgba(0, 245, 255, 0.4)',
  },

  zIndex: {
    background: 0,
    content: 1,
    overlay: 10,
    modal: 100,
    tooltip: 1000,
  },
} as const;

// Type for the theme
export type Theme = typeof theme;

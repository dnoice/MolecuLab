/**
 * ============================================================================
 * MolecuLab Style Mixins
 * Reusable styled-components CSS snippets
 * ============================================================================
 */
import { css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT MIXINS
// ═══════════════════════════════════════════════════════════════════════════

/** Flexbox center (both axes) */
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/** Flexbox space-between */
export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/** Flexbox column centered */
export const flexColumnCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/** Absolute fill parent */
export const absoluteFill = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/** Fixed fill viewport */
export const fixedFill = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

// ═══════════════════════════════════════════════════════════════════════════
// GLASSMORPHISM MIXINS
// ═══════════════════════════════════════════════════════════════════════════

/** Standard glass panel effect */
export const glassPanel = css`
  background: ${({ theme }) => theme.colors.bgGlass};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: ${({ theme }) => theme.borders.glow};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.glass};
`;

/** Subtle glass effect for nested elements */
export const glassSubtle = css`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: ${({ theme }) => theme.borders.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
`;

/** Dark glass for overlays */
export const glassDark = css`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`;

// ═══════════════════════════════════════════════════════════════════════════
// TEXT MIXINS
// ═══════════════════════════════════════════════════════════════════════════

/** Truncate text with ellipsis */
export const textTruncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/** Clamp text to N lines */
export const textClamp = (lines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/** Gradient text effect */
export const gradientText = css`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neonCyan},
    ${({ theme }) => theme.colors.neonMagenta}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

/** Monospace display text */
export const displayText = css`
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: ${({ theme }) => theme.letterSpacing.wide};
  text-transform: uppercase;
`;

/** Code/mono text */
export const monoText = css`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE MIXINS
// ═══════════════════════════════════════════════════════════════════════════

/** Standard hover glow effect */
export const hoverGlow = css`
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.neonCyan};
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
  }
`;

/** Button base styles */
export const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['2']};
  padding: ${({ theme }) => `${theme.spacing['3']} ${theme.spacing['4']}`};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacing.wide};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  user-select: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/** Focus visible ring */
export const focusRing = css`
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/** Hide scrollbar but keep functionality */
export const hideScrollbar = css`
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/** Custom scrollbar styling */
export const customScrollbar = css`
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 245, 255, 0.3);
    border-radius: 4px;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(0, 245, 255, 0.5);
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY MIXINS
// ═══════════════════════════════════════════════════════════════════════════

/** Visually hidden but accessible */
export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

/** Prevent text selection */
export const noSelect = css`
  user-select: none;
  -webkit-user-select: none;
`;

/** Aspect ratio container */
export const aspectRatio = (ratio: number) => css`
  aspect-ratio: ${ratio};

  @supports not (aspect-ratio: 1) {
    &::before {
      content: '';
      float: left;
      padding-top: ${100 / ratio}%;
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }
`;

/** Size shorthand */
export const size = (width: string, height?: string) => css`
  width: ${width};
  height: ${height || width};
`;

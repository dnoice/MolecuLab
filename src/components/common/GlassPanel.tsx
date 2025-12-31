/**
 * ============================================================================
 * GlassPanel Component
 * Foundation glassmorphic container with cyberpunk aesthetics
 * ============================================================================
 */
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Theme } from '@/styles/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type GlowColor = 'cyan' | 'magenta' | 'gold' | 'green' | 'red' | 'none';
type PanelVariant = 'default' | 'subtle' | 'dark' | 'solid';

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: PanelVariant;
  /** Border glow color */
  glow?: GlowColor;
  /** Padding size from theme spacing */
  padding?: keyof Theme['spacing'];
  /** Border radius from theme */
  borderRadius?: keyof Theme['radius'];
  /** Enable animated glow effect */
  animate?: boolean;
  /** Content */
  children?: ReactNode;
  /** Additional className */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const glowPulse = keyframes`
  0%, 100% {
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.1),
      0 0 20px var(--glow-color, rgba(0, 245, 255, 0.3)),
      0 0 40px var(--glow-color, rgba(0, 245, 255, 0.1));
  }
  50% {
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.1),
      0 0 30px var(--glow-color, rgba(0, 245, 255, 0.5)),
      0 0 60px var(--glow-color, rgba(0, 245, 255, 0.2));
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const glowColors: Record<GlowColor, string> = {
  cyan: 'rgba(0, 245, 255, 0.3)',
  magenta: 'rgba(255, 0, 255, 0.3)',
  gold: 'rgba(255, 215, 0, 0.3)',
  green: 'rgba(0, 255, 136, 0.3)',
  red: 'rgba(255, 51, 102, 0.3)',
  none: 'transparent',
};

const borderColors: Record<GlowColor, string> = {
  cyan: 'rgba(0, 245, 255, 0.3)',
  magenta: 'rgba(255, 0, 255, 0.3)',
  gold: 'rgba(255, 215, 0, 0.3)',
  green: 'rgba(0, 255, 136, 0.3)',
  red: 'rgba(255, 51, 102, 0.3)',
  none: 'rgba(255, 255, 255, 0.1)',
};

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.bgGlass};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: ${({ theme }) => theme.shadows.glass};
  `,
  subtle: css`
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
  `,
  dark: css`
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  `,
  solid: css`
    background: ${({ theme }) => theme.colors.bgCard};
    box-shadow: ${({ theme }) => theme.shadows.card};
  `,
};

interface StyledPanelProps {
  $variant: PanelVariant;
  $glow: GlowColor;
  $padding: keyof Theme['spacing'];
  $borderRadius: keyof Theme['radius'];
  $animate: boolean;
}

const StyledPanel = styled.div<StyledPanelProps>`
  position: relative;
  padding: ${({ theme, $padding }) => theme.spacing[$padding]};
  border-radius: ${({ theme, $borderRadius }) => theme.radius[$borderRadius]};
  border: 1px solid ${({ $glow }) => borderColors[$glow]};
  transition: all ${({ theme }) => theme.transitions.normal};

  /* Variant styles */
  ${({ $variant }) => variantStyles[$variant]}

  /* Glow effect */
  --glow-color: ${({ $glow }) => glowColors[$glow]};

  ${({ $glow, $animate }) =>
    $glow !== 'none' &&
    $animate &&
    css`
      animation: ${glowPulse} 3s ease-in-out infinite;
    `}

  /* Hover enhancement */
  &:hover {
    ${({ $glow }) =>
      $glow !== 'none' &&
      css`
        border-color: ${borderColors[$glow].replace('0.3', '0.5')};
        box-shadow: 0 0 25px var(--glow-color);
      `}
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      variant = 'default',
      glow = 'cyan',
      padding = '4',
      borderRadius = 'lg',
      animate = false,
      children,
      className,
      ...props
    },
    ref
  ) => (
      <StyledPanel
        ref={ref}
        className={className}
        $variant={variant}
        $glow={glow}
        $padding={padding}
        $borderRadius={borderRadius}
        $animate={animate}
        {...props}
      >
        {children}
      </StyledPanel>
    )
);

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;

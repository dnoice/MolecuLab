/**
 * ============================================================================
 * GlassCard Component
 * Interactive glassmorphic card with hover effects and click support
 * ============================================================================
 */
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Theme } from '@/styles/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type CardVariant = 'default' | 'outlined' | 'elevated';
type GlowColor = 'cyan' | 'magenta' | 'gold' | 'green' | 'none';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: CardVariant;
  /** Border/hover glow color */
  glowColor?: GlowColor;
  /** Padding from theme spacing */
  padding?: keyof Theme['spacing'];
  /** Whether card is interactive (clickable) */
  interactive?: boolean;
  /** Selected state */
  selected?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Header content */
  header?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Main content */
  children?: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const selectPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px var(--glow-color), 0 0 40px var(--glow-color);
  }
  50% {
    box-shadow: 0 0 30px var(--glow-color), 0 0 60px var(--glow-color);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const glowColors: Record<GlowColor, string> = {
  cyan: 'rgba(0, 245, 255, 0.4)',
  magenta: 'rgba(255, 0, 255, 0.4)',
  gold: 'rgba(255, 215, 0, 0.4)',
  green: 'rgba(0, 255, 136, 0.4)',
  none: 'transparent',
};

const borderColors: Record<GlowColor, string> = {
  cyan: 'rgba(0, 245, 255, 0.3)',
  magenta: 'rgba(255, 0, 255, 0.3)',
  gold: 'rgba(255, 215, 0, 0.3)',
  green: 'rgba(0, 255, 136, 0.3)',
  none: 'rgba(255, 255, 255, 0.1)',
};

interface StyledCardProps {
  $variant: CardVariant;
  $glowColor: GlowColor;
  $padding: keyof Theme['spacing'];
  $interactive: boolean;
  $selected: boolean;
  $disabled: boolean;
}

const StyledCard = styled.div<StyledCardProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};

  --glow-color: ${({ $glowColor }) => glowColors[$glowColor]};
  --border-color: ${({ $glowColor }) => borderColors[$glowColor]};

  /* Base styles */
  background: ${({ theme }) => theme.colors.bgGlass};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);

  /* Variant styles */
  ${({ $variant, theme }) =>
    $variant === 'elevated' &&
    css`
      box-shadow: ${theme.shadows.elevated};
    `}

  ${({ $variant }) =>
    $variant === 'outlined' &&
    css`
      background: transparent;
      backdrop-filter: none;
    `}

  /* Interactive styles */
  ${({ $interactive, $disabled }) =>
    $interactive &&
    !$disabled &&
    css`
      cursor: pointer;
      user-select: none;

      &:hover {
        transform: translateY(-2px);
        border-color: ${({ theme }) => theme.colors.neonCyan};
        box-shadow: 0 0 25px var(--glow-color), 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    `}

  /* Selected state */
  ${({ $selected, $glowColor }) =>
    $selected &&
    css`
      border-color: ${borderColors[$glowColor].replace('0.3', '0.8')};
      animation: ${selectPulse} 2s ease-in-out infinite;
    `}

  /* Disabled state */
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}

  /* Focus visible */
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
`;

const CardHeader = styled.div<{ $padding: keyof Theme['spacing'] }>`
  padding: ${({ theme, $padding }) => theme.spacing[$padding]};
  padding-bottom: ${({ theme }) => theme.spacing['2']};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  /* Gradient shine effect on header */
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 245, 255, 0.3),
      transparent
    );
  }
`;

const CardBody = styled.div<{ $padding: keyof Theme['spacing'] }>`
  flex: 1;
  padding: ${({ theme, $padding }) => theme.spacing[$padding]};
`;

const CardFooter = styled.div<{ $padding: keyof Theme['spacing'] }>`
  padding: ${({ theme, $padding }) => theme.spacing[$padding]};
  padding-top: ${({ theme }) => theme.spacing['2']};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      glowColor = 'cyan',
      padding = '4',
      interactive = false,
      selected = false,
      disabled = false,
      header,
      footer,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (interactive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <StyledCard
        ref={ref}
        $variant={variant}
        $glowColor={glowColor}
        $padding={padding}
        $interactive={interactive}
        $selected={selected}
        $disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={interactive && !disabled ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        aria-pressed={interactive ? selected : undefined}
        aria-disabled={disabled}
        {...props}
      >
        {header && <CardHeader $padding={padding}>{header}</CardHeader>}
        <CardBody $padding={padding}>{children}</CardBody>
        {footer && <CardFooter $padding={padding}>{footer}</CardFooter>}
      </StyledCard>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;

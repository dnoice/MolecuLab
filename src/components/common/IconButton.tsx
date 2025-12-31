/**
 * ============================================================================
 * IconButton Component
 * Compact icon-only button with tooltip support and glow effects
 * ============================================================================
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type IconButtonVariant = 'default' | 'ghost' | 'filled' | 'danger';
type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: IconButtonVariant;
  /** Size variant */
  size?: IconButtonSize;
  /** Icon element */
  icon: ReactNode;
  /** Accessible label (required for a11y) */
  'aria-label': string;
  /** Enable glow on hover */
  glow?: boolean;
  /** Active/pressed state */
  active?: boolean;
  /** Round shape (circle) */
  round?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const pulseRing = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const sizeConfig = {
  sm: { size: 28, iconSize: 14 },
  md: { size: 36, iconSize: 18 },
  lg: { size: 44, iconSize: 22 },
};

const variantStyles = {
  default: css`
    background: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover:not(:disabled) {
      background: rgba(0, 245, 255, 0.1);
      color: ${({ theme }) => theme.colors.neonCyan};
      border-color: ${({ theme }) => theme.colors.neonCyan};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
  filled: css`
    background: ${({ theme }) => theme.colors.neonCyan};
    color: ${({ theme }) => theme.colors.bgDeep};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.neonMagenta};
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
    }
  `,
  danger: css`
    background: rgba(255, 51, 102, 0.1);
    color: ${({ theme }) => theme.colors.neonRed};
    border: 1px solid rgba(255, 51, 102, 0.3);

    &:hover:not(:disabled) {
      background: rgba(255, 51, 102, 0.2);
      border-color: ${({ theme }) => theme.colors.neonRed};
      box-shadow: 0 0 15px rgba(255, 51, 102, 0.3);
    }
  `,
};

interface StyledIconButtonProps {
  $variant: IconButtonVariant;
  $size: IconButtonSize;
  $glow: boolean;
  $active: boolean;
  $round: boolean;
}

const StyledIconButton = styled.button<StyledIconButtonProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  /* Size */
  width: ${({ $size }) => sizeConfig[$size].size}px;
  height: ${({ $size }) => sizeConfig[$size].size}px;
  border-radius: ${({ $round, theme }) => ($round ? theme.radius.full : theme.radius.sm)};

  /* Icon size */
  svg,
  img {
    width: ${({ $size }) => sizeConfig[$size].iconSize}px;
    height: ${({ $size }) => sizeConfig[$size].iconSize}px;
  }

  /* Variant */
  ${({ $variant }) => variantStyles[$variant]}

  /* Active state */
  ${({ $active }) =>
    $active &&
    css`
      background: rgba(0, 245, 255, 0.2) !important;
      color: ${({ theme }) => theme.colors.neonCyan} !important;
      border-color: ${({ theme }) => theme.colors.neonCyan} !important;
    `}

  /* Glow on hover */
  ${({ $glow }) =>
    $glow &&
    css`
      &:hover:not(:disabled)::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        animation: ${pulseRing} 0.6s ease-out;
        border: 2px solid ${({ theme }) => theme.colors.neonCyan};
        pointer-events: none;
      }
    `}

  /* Click effect */
  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Focus visible */
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
    transform: none !important;

    &::after {
      animation: none !important;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      glow = false,
      active = false,
      round = false,
      disabled,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => (
      <StyledIconButton
        ref={ref}
        $variant={variant}
        $size={size}
        $glow={glow}
        $active={active}
        $round={round}
        disabled={disabled}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </StyledIconButton>
    )
);

IconButton.displayName = 'IconButton';

export default IconButton;

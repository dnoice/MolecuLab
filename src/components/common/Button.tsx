/**
 * ============================================================================
 * Button Component
 * Cyberpunk-styled button with variants, loading states, and glow effects
 * ============================================================================
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Enable glow effect */
  glow?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon on the left */
  leftIcon?: ReactNode;
  /** Icon on the right */
  rightIcon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Content */
  children?: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px var(--glow-color), 0 0 40px var(--glow-color);
  }
  50% {
    box-shadow: 0 0 30px var(--glow-color), 0 0 60px var(--glow-color);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing['2']} ${theme.spacing['3']}`};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    gap: ${({ theme }) => theme.spacing['1']};
    min-height: 32px;
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing['3']} ${theme.spacing['4']}`};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    gap: ${({ theme }) => theme.spacing['2']};
    min-height: 40px;
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing['4']} ${theme.spacing['6']}`};
    font-size: ${({ theme }) => theme.fontSizes.md};
    gap: ${({ theme }) => theme.spacing['2']};
    min-height: 48px;
  `,
};

const variantStyles = {
  primary: css`
    --glow-color: rgba(0, 245, 255, 0.4);
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.neonCyan},
      ${({ theme }) => theme.colors.neonBlue}
    );
    color: ${({ theme }) => theme.colors.bgDeep};
    border: none;
    text-shadow: none;

    &:hover:not(:disabled) {
      background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.neonCyan},
        ${({ theme }) => theme.colors.neonMagenta}
      );
      box-shadow: 0 0 25px var(--glow-color);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `,
  secondary: css`
    --glow-color: rgba(0, 245, 255, 0.3);
    background: rgba(0, 245, 255, 0.1);
    color: ${({ theme }) => theme.colors.neonCyan};
    border: 1px solid ${({ theme }) => theme.colors.neonCyan};

    &:hover:not(:disabled) {
      background: rgba(0, 245, 255, 0.2);
      box-shadow: 0 0 20px var(--glow-color);
    }
  `,
  ghost: css`
    --glow-color: rgba(255, 255, 255, 0.2);
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
      color: ${({ theme }) => theme.colors.textPrimary};
      border-color: rgba(255, 255, 255, 0.1);
    }
  `,
  danger: css`
    --glow-color: rgba(255, 51, 102, 0.4);
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.neonRed},
      #cc0033
    );
    color: white;
    border: none;

    &:hover:not(:disabled) {
      box-shadow: 0 0 25px var(--glow-color);
    }
  `,
  success: css`
    --glow-color: rgba(0, 255, 136, 0.4);
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.neonGreen},
      #00cc6a
    );
    color: ${({ theme }) => theme.colors.bgDeep};
    border: none;

    &:hover:not(:disabled) {
      box-shadow: 0 0 25px var(--glow-color);
    }
  `,
};

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $glow: boolean;
  $loading: boolean;
  $fullWidth: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacing.wide};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;

  /* Size */
  ${({ $size }) => sizeStyles[$size]}

  /* Variant */
  ${({ $variant }) => variantStyles[$variant]}

  /* Full width */
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  /* Glow effect */
  ${({ $glow }) =>
    $glow &&
    css`
      animation: ${pulseGlow} 2s ease-in-out infinite;
    `}

  /* Loading state */
  ${({ $loading }) =>
    $loading &&
    css`
      pointer-events: none;
      color: transparent !important;

      /* Shimmer effect */
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        background-size: 200% 100%;
        animation: ${shimmer} 1.5s linear infinite;
      }
    `}

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
  }

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

const Spinner = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1em;
    height: 1em;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      glow = false,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $glow={glow}
        $loading={loading}
        $fullWidth={fullWidth}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Spinner aria-hidden="true" />}
        {leftIcon && <IconWrapper aria-hidden="true">{leftIcon}</IconWrapper>}
        {children}
        {rightIcon && <IconWrapper aria-hidden="true">{rightIcon}</IconWrapper>}
      </StyledButton>
    )
);

Button.displayName = 'Button';

export default Button;

/**
 * ============================================================================
 * Chip Component
 * Tags, pills, and molecule selectors with cyberpunk styling
 * ============================================================================
 */
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type ChipVariant = 'default' | 'element' | 'group' | 'property' | 'outline';
type ChipSize = 'sm' | 'md' | 'lg';
type ChipColor = 'cyan' | 'magenta' | 'gold' | 'green' | 'red' | 'blue' | 'purple';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: ChipVariant;
  /** Color theme */
  color?: ChipColor;
  /** Size */
  size?: ChipSize;
  /** Left icon or element symbol */
  leftIcon?: ReactNode;
  /** Right icon */
  rightIcon?: ReactNode;
  /** Whether chip can be removed */
  removable?: boolean;
  /** Callback when remove is clicked */
  onRemove?: () => void;
  /** Selected/active state */
  selected?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Clickable */
  clickable?: boolean;
  /** Content */
  children?: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const popIn = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px var(--chip-color);
  }
  50% {
    box-shadow: 0 0 16px var(--chip-color);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const colorMap: Record<ChipColor, { bg: string; border: string; text: string; glow: string }> = {
  cyan: {
    bg: 'rgba(0, 245, 255, 0.15)',
    border: 'rgba(0, 245, 255, 0.4)',
    text: '#00f5ff',
    glow: 'rgba(0, 245, 255, 0.5)',
  },
  magenta: {
    bg: 'rgba(255, 0, 255, 0.15)',
    border: 'rgba(255, 0, 255, 0.4)',
    text: '#ff00ff',
    glow: 'rgba(255, 0, 255, 0.5)',
  },
  gold: {
    bg: 'rgba(255, 215, 0, 0.15)',
    border: 'rgba(255, 215, 0, 0.4)',
    text: '#ffd700',
    glow: 'rgba(255, 215, 0, 0.5)',
  },
  green: {
    bg: 'rgba(0, 255, 136, 0.15)',
    border: 'rgba(0, 255, 136, 0.4)',
    text: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.5)',
  },
  red: {
    bg: 'rgba(255, 51, 102, 0.15)',
    border: 'rgba(255, 51, 102, 0.4)',
    text: '#ff3366',
    glow: 'rgba(255, 51, 102, 0.5)',
  },
  blue: {
    bg: 'rgba(51, 102, 255, 0.15)',
    border: 'rgba(51, 102, 255, 0.4)',
    text: '#3366ff',
    glow: 'rgba(51, 102, 255, 0.5)',
  },
  purple: {
    bg: 'rgba(153, 51, 255, 0.15)',
    border: 'rgba(153, 51, 255, 0.4)',
    text: '#9933ff',
    glow: 'rgba(153, 51, 255, 0.5)',
  },
};

const sizeStyles = {
  sm: css`
    padding: 2px 8px;
    font-size: 10px;
    gap: 4px;
  `,
  md: css`
    padding: 4px 12px;
    font-size: 12px;
    gap: 6px;
  `,
  lg: css`
    padding: 6px 16px;
    font-size: 14px;
    gap: 8px;
  `,
};

interface StyledChipProps {
  $variant: ChipVariant;
  $color: ChipColor;
  $size: ChipSize;
  $selected: boolean;
  $disabled: boolean;
  $clickable: boolean;
}

const StyledChip = styled.span<StyledChipProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.fast};
  animation: ${popIn} 0.2s ease-out;

  /* Color variables */
  --chip-bg: ${({ $color }) => colorMap[$color].bg};
  --chip-border: ${({ $color }) => colorMap[$color].border};
  --chip-text: ${({ $color }) => colorMap[$color].text};
  --chip-color: ${({ $color }) => colorMap[$color].glow};

  /* Base styles */
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  color: var(--chip-text);

  /* Size */
  ${({ $size }) => sizeStyles[$size]}

  /* Variant: element (for chemical elements) */
  ${({ $variant }) =>
    $variant === 'element' &&
    css`
      font-weight: ${({ theme }) => theme.fontWeights.bold};
      min-width: 28px;
      text-align: center;
    `}

  /* Variant: outline */
  ${({ $variant }) =>
    $variant === 'outline' &&
    css`
      background: transparent;
    `}

  /* Clickable */
  ${({ $clickable, $disabled }) =>
    $clickable &&
    !$disabled &&
    css`
      cursor: pointer;
      user-select: none;

      &:hover {
        background: var(--chip-bg);
        filter: brightness(1.3);
        border-color: var(--chip-text);
        box-shadow: 0 0 12px var(--chip-color);
      }

      &:active {
        transform: scale(0.95);
      }
    `}

  /* Selected */
  ${({ $selected }) =>
    $selected &&
    css`
      background: var(--chip-text);
      color: ${({ theme }) => theme.colors.bgDeep};
      animation: ${pulseGlow} 2s ease-in-out infinite;
    `}

  /* Disabled */
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    `}

  /* Focus */
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1em;
    height: 1em;
  }
`;

const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 4px;
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant = 'default',
      color = 'cyan',
      size = 'md',
      leftIcon,
      rightIcon,
      removable = false,
      onRemove,
      selected = false,
      disabled = false,
      clickable = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (disabled) return;
      onClick?.(e);
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onRemove?.();
    };

    return (
      <StyledChip
        ref={ref}
        $variant={variant}
        $color={color}
        $size={size}
        $selected={selected}
        $disabled={disabled}
        $clickable={clickable || !!onClick}
        onClick={handleClick}
        tabIndex={clickable && !disabled ? 0 : undefined}
        role={clickable ? 'button' : undefined}
        aria-pressed={clickable ? selected : undefined}
        aria-disabled={disabled}
        {...props}
      >
        {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
        {children}
        {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
        {removable && (
          <RemoveButton
            type="button"
            onClick={handleRemove}
            aria-label="Remove"
            disabled={disabled}
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </RemoveButton>
        )}
      </StyledChip>
    );
  }
);

Chip.displayName = 'Chip';

export default Chip;

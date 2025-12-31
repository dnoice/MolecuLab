/**
 * ============================================================================
 * ProgressBar Component
 * Neon-styled progress indicator with glow effects
 * ============================================================================
 */
import { forwardRef, type HTMLAttributes } from 'react';
import styled, { css, keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type ProgressVariant = 'default' | 'gradient' | 'striped';
type ProgressSize = 'sm' | 'md' | 'lg';
type ProgressColor = 'cyan' | 'magenta' | 'gold' | 'green' | 'red';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Visual variant */
  variant?: ProgressVariant;
  /** Size */
  size?: ProgressSize;
  /** Color */
  color?: ProgressColor;
  /** Show percentage label */
  showLabel?: boolean;
  /** Animate the progress fill */
  animated?: boolean;
  /** Indeterminate loading state */
  indeterminate?: boolean;
  /** Accessible label */
  label?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const stripe = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 40px 0; }
`;

const indeterminateSlide = keyframes`
  0% {
    left: -40%;
    width: 40%;
  }
  50% {
    left: 20%;
    width: 60%;
  }
  100% {
    left: 100%;
    width: 40%;
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px var(--progress-glow);
  }
  50% {
    box-shadow: 0 0 16px var(--progress-glow);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const colorMap: Record<ProgressColor, { color: string; glow: string; gradient: string }> = {
  cyan: {
    color: '#00f5ff',
    glow: 'rgba(0, 245, 255, 0.6)',
    gradient: 'linear-gradient(90deg, #00f5ff, #3366ff)',
  },
  magenta: {
    color: '#ff00ff',
    glow: 'rgba(255, 0, 255, 0.6)',
    gradient: 'linear-gradient(90deg, #ff00ff, #9933ff)',
  },
  gold: {
    color: '#ffd700',
    glow: 'rgba(255, 215, 0, 0.6)',
    gradient: 'linear-gradient(90deg, #ffd700, #ff8800)',
  },
  green: {
    color: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.6)',
    gradient: 'linear-gradient(90deg, #00ff88, #00cc6a)',
  },
  red: {
    color: '#ff3366',
    glow: 'rgba(255, 51, 102, 0.6)',
    gradient: 'linear-gradient(90deg, #ff3366, #cc0033)',
  },
};

const sizeConfig = {
  sm: { height: 4, fontSize: '10px' },
  md: { height: 8, fontSize: '11px' },
  lg: { height: 12, fontSize: '12px' },
};

interface TrackProps {
  $size: ProgressSize;
}

const Track = styled.div<TrackProps>`
  position: relative;
  width: 100%;
  height: ${({ $size }) => sizeConfig[$size].height}px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

interface FillProps {
  $value: number;
  $variant: ProgressVariant;
  $color: ProgressColor;
  $animated: boolean;
  $indeterminate: boolean;
}

const Fill = styled.div<FillProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.full};
  transition: width ${({ theme }) => theme.transitions.normal};

  --progress-color: ${({ $color }) => colorMap[$color].color};
  --progress-glow: ${({ $color }) => colorMap[$color].glow};
  --progress-gradient: ${({ $color }) => colorMap[$color].gradient};

  /* Width from value (unless indeterminate) */
  width: ${({ $value, $indeterminate }) => ($indeterminate ? '40%' : `${$value}%`)};

  /* Base color */
  background: var(--progress-color);

  /* Glow effect */
  box-shadow: 0 0 8px var(--progress-glow);
  animation: ${glowPulse} 2s ease-in-out infinite;

  /* Gradient variant */
  ${({ $variant }) =>
    $variant === 'gradient' &&
    css`
      background: var(--progress-gradient);
    `}

  /* Striped variant */
  ${({ $variant, $animated }) =>
    $variant === 'striped' &&
    css`
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 40px 40px;

      ${$animated &&
      css`
        animation: ${stripe} 1s linear infinite, ${glowPulse} 2s ease-in-out infinite;
      `}
    `}

  /* Indeterminate animation */
  ${({ $indeterminate }) =>
    $indeterminate &&
    css`
      animation: ${indeterminateSlide} 1.5s ease-in-out infinite, ${glowPulse} 2s ease-in-out infinite;
    `}

  /* Shimmer effect when animated */
  ${({ $animated, $variant }) =>
    $animated &&
    $variant === 'default' &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        background-size: 200% 100%;
        animation: ${shimmer} 2s linear infinite;
      }
    `}

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;

    &::after {
      animation: none !important;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
  width: 100%;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface LabelTextProps {
  $size: ProgressSize;
  $color: ProgressColor;
}

const LabelText = styled.span<LabelTextProps>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ $size }) => sizeConfig[$size].fontSize};
  color: ${({ $color }) => colorMap[$color].color};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PercentLabel = styled(LabelText)`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      color = 'cyan',
      showLabel = false,
      animated = false,
      indeterminate = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const displayPercentage = Math.round(percentage);

    return (
      <Wrapper ref={ref} {...props}>
        {(showLabel || label) && (
          <LabelRow>
            {label && (
              <LabelText $size={size} $color={color}>
                {label}
              </LabelText>
            )}
            {showLabel && !indeterminate && (
              <PercentLabel $size={size} $color={color}>
                {displayPercentage}%
              </PercentLabel>
            )}
          </LabelRow>
        )}
        <Track
          $size={size}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || 'Progress'}
        >
          <Fill
            $value={percentage}
            $variant={variant}
            $color={color}
            $animated={animated}
            $indeterminate={indeterminate}
          />
        </Track>
      </Wrapper>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;

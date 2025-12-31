/**
 * ============================================================================
 * Loader Component
 * Multiple loading indicator variants with cyberpunk aesthetics
 * ============================================================================
 */
import { forwardRef, type HTMLAttributes } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'orbital';
type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';
type LoaderColor = 'cyan' | 'magenta' | 'gold' | 'white';

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: LoaderVariant;
  /** Size */
  size?: LoaderSize;
  /** Color */
  color?: LoaderColor;
  /** Accessible label */
  label?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const orbit = keyframes`
  0% {
    transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px var(--loader-color), 0 0 16px var(--loader-color);
  }
  50% {
    box-shadow: 0 0 16px var(--loader-color), 0 0 32px var(--loader-color);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const colorMap: Record<LoaderColor, string> = {
  cyan: '#00f5ff',
  magenta: '#ff00ff',
  gold: '#ffd700',
  white: '#ffffff',
};

const sizeConfig = {
  sm: { size: 16, stroke: 2, dotSize: 4 },
  md: { size: 24, stroke: 3, dotSize: 6 },
  lg: { size: 36, stroke: 4, dotSize: 8 },
  xl: { size: 48, stroke: 5, dotSize: 10 },
};

interface LoaderWrapperProps {
  $size: LoaderSize;
  $color: LoaderColor;
}

const LoaderWrapper = styled.div<LoaderWrapperProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  --loader-size: ${({ $size }) => sizeConfig[$size].size}px;
  --loader-color: ${({ $color }) => colorMap[$color]};
  --loader-stroke: ${({ $size }) => sizeConfig[$size].stroke}px;
  --dot-size: ${({ $size }) => sizeConfig[$size].dotSize}px;
`;

// Spinner variant
const SpinnerLoader = styled.div`
  width: var(--loader-size);
  height: var(--loader-size);
  border: var(--loader-stroke) solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--loader-color);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;

  /* Gradient effect */
  background: conic-gradient(
    from 0deg,
    transparent,
    var(--loader-color) 30%,
    transparent 60%
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - var(--loader-stroke)),
    black calc(100% - var(--loader-stroke))
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - var(--loader-stroke)),
    black calc(100% - var(--loader-stroke))
  );

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    border-top-color: var(--loader-color);
    background: none;
  }
`;

// Dots variant
const DotsLoader = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--dot-size) * 0.5);
`;

const Dot = styled.span<{ $delay: number }>`
  width: var(--dot-size);
  height: var(--dot-size);
  background: var(--loader-color);
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${({ $delay }) => $delay}s;
  box-shadow: 0 0 8px var(--loader-color);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Pulse variant
const PulseLoader = styled.div`
  width: var(--loader-size);
  height: var(--loader-size);
  background: var(--loader-color);
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite, ${glowPulse} 1.5s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
    transform: none;
  }
`;

// Orbital variant
const OrbitalLoader = styled.div`
  width: var(--loader-size);
  height: var(--loader-size);
  position: relative;
  --orbit-radius: calc(var(--loader-size) * 0.35);

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(var(--dot-size) * 0.8);
    height: calc(var(--dot-size) * 0.8);
    margin: calc(var(--dot-size) * -0.4);
    background: var(--loader-color);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--loader-color);
    animation: ${orbit} 1.2s linear infinite;
  }

  &::after {
    animation-delay: -0.6s;
    background: ${({ theme }) => theme.colors.neonMagenta};
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.neonMagenta};
  }

  /* Center dot */
  & > span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(var(--dot-size) * 0.5);
    height: calc(var(--dot-size) * 0.5);
    margin: calc(var(--dot-size) * -0.25);
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 4px white;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
      transform: none;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      variant = 'spinner',
      size = 'md',
      color = 'cyan',
      label = 'Loading...',
      ...props
    },
    ref
  ) => {
    const renderLoader = () => {
      switch (variant) {
        case 'dots':
          return (
            <DotsLoader>
              <Dot $delay={-0.32} />
              <Dot $delay={-0.16} />
              <Dot $delay={0} />
            </DotsLoader>
          );
        case 'pulse':
          return <PulseLoader />;
        case 'orbital':
          return (
            <OrbitalLoader>
              <span />
            </OrbitalLoader>
          );
        case 'spinner':
        default:
          return <SpinnerLoader />;
      }
    };

    return (
      <LoaderWrapper
        ref={ref}
        $size={size}
        $color={color}
        role="status"
        aria-label={label}
        {...props}
      >
        {renderLoader()}
        <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
          {label}
        </span>
      </LoaderWrapper>
    );
  }
);

Loader.displayName = 'Loader';

export default Loader;

/**
 * ============================================================================
 * Toggle Component
 * On/off switch with cyberpunk glow effects
 * ============================================================================
 */
import { forwardRef, type InputHTMLAttributes } from 'react';
import styled, { css, keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type ToggleSize = 'sm' | 'md' | 'lg';
type ToggleColor = 'cyan' | 'magenta' | 'green' | 'gold';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Size variant */
  size?: ToggleSize;
  /** Active color */
  color?: ToggleColor;
  /** Label text */
  label?: string;
  /** Label position */
  labelPosition?: 'left' | 'right';
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px var(--toggle-glow), inset 0 0 8px var(--toggle-glow);
  }
  50% {
    box-shadow: 0 0 16px var(--toggle-glow), inset 0 0 12px var(--toggle-glow);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const colorMap: Record<ToggleColor, { active: string; glow: string }> = {
  cyan: { active: '#00f5ff', glow: 'rgba(0, 245, 255, 0.6)' },
  magenta: { active: '#ff00ff', glow: 'rgba(255, 0, 255, 0.6)' },
  green: { active: '#00ff88', glow: 'rgba(0, 255, 136, 0.6)' },
  gold: { active: '#ffd700', glow: 'rgba(255, 215, 0, 0.6)' },
};

const sizeConfig = {
  sm: { width: 36, height: 20, thumb: 14, slide: 16 },
  md: { width: 44, height: 24, thumb: 18, slide: 20 },
  lg: { width: 56, height: 30, thumb: 24, slide: 26 },
};

interface ToggleWrapperProps {
  $disabled: boolean;
}

const ToggleWrapper = styled.label<ToggleWrapperProps>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  user-select: none;
`;

const ToggleLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

interface ToggleTrackProps {
  $size: ToggleSize;
  $color: ToggleColor;
  $checked: boolean;
}

const ToggleTrack = styled.span<ToggleTrackProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $size }) => sizeConfig[$size].width}px;
  height: ${({ $size }) => sizeConfig[$size].height}px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all ${({ theme }) => theme.transitions.fast};

  --toggle-glow: ${({ $color }) => colorMap[$color].glow};
  --slide-distance: ${({ $size }) => sizeConfig[$size].slide}px;

  /* Checked state */
  ${({ $checked, $color }) =>
    $checked &&
    css`
      background: ${colorMap[$color].active}33;
      border-color: ${colorMap[$color].active};
      animation: ${glowPulse} 2s ease-in-out infinite;
    `}

  /* Focus visible (from input) */
  input:focus-visible + & {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

interface ToggleThumbProps {
  $size: ToggleSize;
  $color: ToggleColor;
  $checked: boolean;
}

const ToggleThumb = styled.span<ToggleThumbProps>`
  position: absolute;
  left: 3px;
  width: ${({ $size }) => sizeConfig[$size].thumb}px;
  height: ${({ $size }) => sizeConfig[$size].thumb}px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.spring};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  /* Checked state */
  ${({ $checked, $color, $size }) =>
    $checked &&
    css`
      transform: translateX(${sizeConfig[$size].slide}px);
      background: ${colorMap[$color].active};
      box-shadow: 0 0 12px ${colorMap[$color].glow};
    `}

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }
`;

const HiddenInput = styled.input`
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

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      size = 'md',
      color = 'cyan',
      label,
      labelPosition = 'right',
      checked,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const isChecked = !!checked;

    return (
      <ToggleWrapper $disabled={disabled} className={className}>
        {label && labelPosition === 'left' && <ToggleLabel>{label}</ToggleLabel>}

        <HiddenInput
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          {...props}
        />

        <ToggleTrack $size={size} $color={color} $checked={isChecked}>
          <ToggleThumb $size={size} $color={color} $checked={isChecked} />
        </ToggleTrack>

        {label && labelPosition === 'right' && <ToggleLabel>{label}</ToggleLabel>}
      </ToggleWrapper>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;

/**
 * ============================================================================
 * Input Component
 * Cyberpunk-styled text input with glow effects and validation states
 * ============================================================================
 */
import React, { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type InputVariant = 'default' | 'filled' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual variant */
  variant?: InputVariant;
  /** Size */
  size?: InputSize;
  /** Error message */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Left element (icon, text, etc.) */
  leftElement?: ReactNode;
  /** Right element (icon, button, etc.) */
  rightElement?: ReactNode;
  /** Full width */
  fullWidth?: boolean;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const sizeConfig = {
  sm: { height: 32, fontSize: '12px', padding: '0 10px', iconSize: 14 },
  md: { height: 40, fontSize: '14px', padding: '0 14px', iconSize: 16 },
  lg: { height: 48, fontSize: '16px', padding: '0 18px', iconSize: 18 },
};

interface WrapperProps {
  $fullWidth: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

interface InputContainerProps {
  $variant: InputVariant;
  $size: InputSize;
  $hasError: boolean;
  $hasSuccess: boolean;
  $disabled: boolean;
  $focused: boolean;
}

const InputContainer = styled.div<InputContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  height: ${({ $size }) => sizeConfig[$size].height}px;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  overflow: hidden;

  /* Base variant styles */
  ${({ $variant }) => {
    switch ($variant) {
      case 'filled':
        return css`
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid transparent;
        `;
      case 'ghost':
        return css`
          background: transparent;
          border: 1px solid transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
        `;
      default:
        return css`
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        `;
    }
  }}

  /* Error state */
  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.neonRed};
      animation: ${shake} 0.4s ease;
    `}

  /* Success state */
  ${({ $hasSuccess, theme }) =>
    $hasSuccess &&
    css`
      border-color: ${theme.colors.neonGreen};
    `}

  /* Disabled state */
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  /* Focus state */
  ${({ $focused, $hasError, $hasSuccess, theme }) =>
    $focused &&
    !$hasError &&
    !$hasSuccess &&
    css`
      border-color: ${theme.colors.neonCyan};
      box-shadow: 0 0 0 2px rgba(0, 245, 255, 0.2), 0 0 20px rgba(0, 245, 255, 0.1);
    `}

  /* Hover state */
  &:hover:not([data-disabled='true']) {
    border-color: rgba(0, 245, 255, 0.5);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
  }
`;

interface StyledInputProps {
  $size: InputSize;
  $hasLeftElement: boolean;
  $hasRightElement: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  flex: 1;
  width: 100%;
  height: 100%;
  padding: ${({ $size }) => sizeConfig[$size].padding};
  padding-left: ${({ $hasLeftElement, $size }) =>
    $hasLeftElement ? `${sizeConfig[$size].iconSize + 24}px` : undefined};
  padding-right: ${({ $hasRightElement, $size }) =>
    $hasRightElement ? `${sizeConfig[$size].iconSize + 24}px` : undefined};
  background: transparent;
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ $size }) => sizeConfig[$size].fontSize};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:disabled {
    cursor: not-allowed;
  }

  /* Autofill styling */
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.3) inset !important;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.textPrimary} !important;
  }
`;

interface ElementWrapperProps {
  $position: 'left' | 'right';
  $size: InputSize;
}

const ElementWrapper = styled.span<ElementWrapperProps>`
  position: absolute;
  ${({ $position }) => $position}: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;

  svg {
    width: ${({ $size }) => sizeConfig[$size].iconSize}px;
    height: ${({ $size }) => sizeConfig[$size].iconSize}px;
  }

  /* Allow click on right element (for clear buttons, etc.) */
  ${({ $position }) =>
    $position === 'right' &&
    css`
      pointer-events: auto;

      button {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: inherit;
        display: flex;

        &:hover {
          color: ${({ theme }) => theme.colors.textPrimary};
        }
      }
    `}
`;

interface HelperTextProps {
  $error: boolean;
  $success: boolean;
}

const HelperText = styled.span<HelperTextProps>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $error, $success, theme }) => {
    if ($error) return theme.colors.neonRed;
    if ($success) return theme.colors.neonGreen;
    return theme.colors.textMuted;
  }};
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error,
      success = false,
      leftElement,
      rightElement,
      fullWidth = false,
      label,
      helperText,
      disabled = false,
      onFocus,
      onBlur,
      id,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || React.useId();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    return (
      <Wrapper $fullWidth={fullWidth}>
        {label && <Label htmlFor={inputId}>{label}</Label>}

        <InputContainer
          $variant={variant}
          $size={size}
          $hasError={!!error}
          $hasSuccess={success}
          $disabled={disabled}
          $focused={focused}
          data-disabled={disabled}
        >
          {leftElement && (
            <ElementWrapper $position="left" $size={size}>
              {leftElement}
            </ElementWrapper>
          )}

          <StyledInput
            ref={ref}
            id={inputId}
            $size={size}
            $hasLeftElement={!!leftElement}
            $hasRightElement={!!rightElement}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={!!error}
            aria-describedby={error || helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {rightElement && (
            <ElementWrapper $position="right" $size={size}>
              {rightElement}
            </ElementWrapper>
          )}
        </InputContainer>

        {(error || helperText) && (
          <HelperText id={`${inputId}-helper`} $error={!!error} $success={success}>
            {error || helperText}
          </HelperText>
        )}
      </Wrapper>
    );
  }
);

Input.displayName = 'Input';

export default Input;

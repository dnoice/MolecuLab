/**
 * ============================================================================
 * Select Component
 * Cyberpunk-styled dropdown select with glass panel options
 * ============================================================================
 */
import React, {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import styled, { css, keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  /** Current value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Options list */
  options: SelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: string;
  /** Label */
  label?: string;
  /** Full width */
  fullWidth?: boolean;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const sizeConfig = {
  sm: { height: 32, fontSize: '12px', padding: '0 12px' },
  md: { height: 40, fontSize: '14px', padding: '0 16px' },
  lg: { height: 48, fontSize: '16px', padding: '0 20px' },
};

interface WrapperProps {
  $fullWidth: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '200px')};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

interface TriggerProps {
  $size: 'sm' | 'md' | 'lg';
  $open: boolean;
  $hasError: boolean;
  $disabled: boolean;
}

const Trigger = styled.button<TriggerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['2']};
  height: ${({ $size }) => sizeConfig[$size].height}px;
  padding: ${({ $size }) => sizeConfig[$size].padding};
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: 100%;
  text-align: left;

  ${({ $open, theme }) =>
    $open &&
    css`
      border-color: ${theme.colors.neonCyan};
      box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
    `}

  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.neonRed};
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  &:hover:not(:disabled) {
    border-color: rgba(0, 245, 255, 0.5);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const TriggerContent = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  flex: 1;
  min-width: 0;
`;

interface TriggerTextProps {
  $size: 'sm' | 'md' | 'lg';
  $isPlaceholder: boolean;
}

const TriggerText = styled.span<TriggerTextProps>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ $size }) => sizeConfig[$size].fontSize};
  color: ${({ $isPlaceholder, theme }) =>
    $isPlaceholder ? theme.colors.textMuted : theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface ChevronProps {
  $open: boolean;
}

const Chevron = styled.span<ChevronProps>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: transform ${({ theme }) => theme.transitions.fast};
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};

  svg {
    width: 14px;
    height: 14px;
  }
`;

interface DropdownProps {
  $visible: boolean;
}

const Dropdown = styled.div<DropdownProps>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  background: rgba(20, 20, 35, 0.95);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: ${({ theme }) => theme.radius.md};
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  animation: ${fadeIn} 0.15s ease-out;

  display: ${({ $visible }) => ($visible ? 'block' : 'none')};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 245, 255, 0.3);
    border-radius: 3px;
  }
`;

interface OptionProps {
  $highlighted: boolean;
  $selected: boolean;
  $disabled: boolean;
}

const Option = styled.button<OptionProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing['3']} ${theme.spacing['4']}`};
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      background: rgba(0, 245, 255, 0.1);
    `}

  ${({ $selected, theme }) =>
    $selected &&
    css`
      color: ${theme.colors.neonCyan};
      background: rgba(0, 245, 255, 0.15);
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.4;
      cursor: not-allowed;
    `}

  &:hover:not(:disabled) {
    background: rgba(0, 245, 255, 0.1);
  }
`;

const OptionIcon = styled.span`
  display: flex;
  align-items: center;
  color: inherit;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CheckMark = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.neonCyan};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ErrorText = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.neonRed};
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder = 'Select...',
      disabled = false,
      error,
      label,
      fullWidth = false,
      size = 'md',
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = useCallback(
      (option: SelectOption) => {
        if (option.disabled) return;
        onChange?.(option.value);
        setOpen(false);
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!open) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setHighlightedIndex(0);
          }
          return;
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex((prev) => {
              let next = prev + 1;
              while (next < options.length && options[next].disabled) next++;
              return next < options.length ? next : prev;
            });
            break;
          case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex((prev) => {
              let next = prev - 1;
              while (next >= 0 && options[next].disabled) next--;
              return next >= 0 ? next : prev;
            });
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (highlightedIndex >= 0) {
              handleSelect(options[highlightedIndex]);
            }
            break;
          case 'Escape':
            setOpen(false);
            break;
        }
      },
      [open, options, highlightedIndex, handleSelect]
    );

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <Wrapper ref={wrapperRef} $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}

        <Trigger
          ref={ref}
          type="button"
          $size={size}
          $open={open}
          $hasError={!!error}
          $disabled={disabled}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <TriggerContent>
            {selectedOption?.icon && <OptionIcon>{selectedOption.icon}</OptionIcon>}
            <TriggerText $size={size} $isPlaceholder={!selectedOption}>
              {selectedOption?.label || placeholder}
            </TriggerText>
          </TriggerContent>
          <Chevron $open={open}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Chevron>
        </Trigger>

        <Dropdown $visible={open} role="listbox">
          {options.map((option, index) => (
            <Option
              key={option.value}
              type="button"
              $highlighted={index === highlightedIndex}
              $selected={option.value === value}
              $disabled={!!option.disabled}
              disabled={option.disabled}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
              {option.label}
              {option.value === value && (
                <CheckMark>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </CheckMark>
              )}
            </Option>
          ))}
        </Dropdown>

        {error && <ErrorText>{error}</ErrorText>}
      </Wrapper>
    );
  }
);

Select.displayName = 'Select';

export default Select;

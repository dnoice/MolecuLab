/**
 * ============================================================================
 * SearchInput Component
 * Specialized search input with suggestions and cyberpunk styling
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

export interface SearchSuggestion {
  id: string;
  label: string;
  category?: string;
  icon?: ReactNode;
}

export interface SearchInputProps {
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Suggestions list */
  suggestions?: SearchSuggestion[];
  /** When a suggestion is selected */
  onSelect?: (suggestion: SearchSuggestion) => void;
  /** Submit handler */
  onSubmit?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Show clear button */
  clearable?: boolean;
  /** Auto focus */
  autoFocus?: boolean;
  /** Full width */
  fullWidth?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 245, 255, 0.4);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface WrapperProps {
  $fullWidth: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '320px')};
`;

interface ContainerProps {
  $focused: boolean;
  $disabled: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing['4']};
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radius.lg};
  backdrop-filter: blur(10px);
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $focused, theme }) =>
    $focused &&
    css`
      border-color: ${theme.colors.neonCyan};
      animation: ${pulseGlow} 2s ease-in-out infinite;
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  &:hover:not([data-disabled='true']) {
    border-color: rgba(0, 245, 255, 0.5);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.neonCyan};

  &::after {
    content: '';
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 51, 102, 0.2);
    color: ${({ theme }) => theme.colors.neonRed};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

interface SuggestionsProps {
  $visible: boolean;
}

const Suggestions = styled.div<SuggestionsProps>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 280px;
  overflow-y: auto;
  background: rgba(20, 20, 35, 0.95);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: ${({ theme }) => theme.radius.md};
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  animation: ${fadeIn} 0.2s ease-out;

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

interface SuggestionItemProps {
  $highlighted: boolean;
}

const SuggestionItem = styled.button<SuggestionItemProps>`
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

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      background: rgba(0, 245, 255, 0.1);
    `}

  &:hover {
    background: rgba(0, 245, 255, 0.1);
  }
`;

const SuggestionIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SuggestionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SuggestionLabel = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SuggestionCategory = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const NoResults = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      suggestions = [],
      onSelect,
      onSubmit,
      placeholder = 'Search...',
      loading = false,
      disabled = false,
      clearable = true,
      autoFocus = false,
      fullWidth = false,
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const showSuggestions = focused && value.length > 0 && suggestions.length > 0;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setHighlightedIndex(-1);
      },
      [onChange]
    );

    const handleClear = useCallback(() => {
      onChange('');
      setHighlightedIndex(-1);
    }, [onChange]);

    const handleSelect = useCallback(
      (suggestion: SearchSuggestion) => {
        onSelect?.(suggestion);
        onChange(suggestion.label);
        setFocused(false);
      },
      [onSelect, onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) {
          if (e.key === 'Enter') {
            onSubmit?.(value);
          }
          return;
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : 0
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : suggestions.length - 1
            );
            break;
          case 'Enter':
            e.preventDefault();
            if (highlightedIndex >= 0) {
              handleSelect(suggestions[highlightedIndex]);
            } else {
              onSubmit?.(value);
            }
            break;
          case 'Escape':
            setFocused(false);
            break;
        }
      },
      [showSuggestions, suggestions, highlightedIndex, handleSelect, onSubmit, value]
    );

    // Close suggestions on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setFocused(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <Wrapper ref={wrapperRef} $fullWidth={fullWidth}>
        <Container $focused={focused} $disabled={disabled} data-disabled={disabled}>
          <SearchIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </SearchIcon>

          <Input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />

          {loading && <Spinner />}

          {clearable && value && !loading && (
            <ClearButton onClick={handleClear} aria-label="Clear search">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l6 6M9 3l-6 6" />
              </svg>
            </ClearButton>
          )}
        </Container>

        <Suggestions $visible={showSuggestions} role="listbox">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.id}
                $highlighted={index === highlightedIndex}
                onClick={() => handleSelect(suggestion)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                {suggestion.icon && (
                  <SuggestionIcon>{suggestion.icon}</SuggestionIcon>
                )}
                <SuggestionContent>
                  <SuggestionLabel>{suggestion.label}</SuggestionLabel>
                  {suggestion.category && (
                    <SuggestionCategory>{suggestion.category}</SuggestionCategory>
                  )}
                </SuggestionContent>
              </SuggestionItem>
            ))
          ) : (
            <NoResults>No results found</NoResults>
          )}
        </Suggestions>
      </Wrapper>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;

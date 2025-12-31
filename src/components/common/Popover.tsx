/**
 * ============================================================================
 * Popover Component
 * Rich content popover with click-triggered display
 * ============================================================================
 */
import React, { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  /** Popover content */
  content: ReactNode;
  /** Placement relative to trigger */
  placement?: PopoverPlacement;
  /** Title for popover header */
  title?: string;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open change handler */
  onOpenChange?: (open: boolean) => void;
  /** Close on click outside */
  closeOnClickOutside?: boolean;
  /** Close on Escape key */
  closeOnEsc?: boolean;
  /** Trigger element */
  children: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Trigger = styled.span`
  display: inline-flex;
  cursor: pointer;
`;

interface PopoverBoxProps {
  $placement: PopoverPlacement;
}

const PopoverBox = styled.div<PopoverBoxProps>`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.popover};
  min-width: 200px;
  max-width: 320px;
  background: rgba(20, 20, 35, 0.98);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: ${({ theme }) => theme.radius.md};
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 245, 255, 0.15);
  animation: ${fadeIn} 0.2s ease-out;
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.neonCyan};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

interface ArrowProps {
  $placement: PopoverPlacement;
}

const Arrow = styled.span<ArrowProps>`
  position: absolute;
  width: 12px;
  height: 12px;
  background: rgba(20, 20, 35, 0.98);
  border: 1px solid rgba(0, 245, 255, 0.3);
  transform: rotate(45deg);

  ${({ $placement }) => {
    switch ($placement) {
      case 'top':
        return `
          bottom: -7px;
          left: 50%;
          margin-left: -6px;
          border-top: none;
          border-left: none;
        `;
      case 'bottom':
        return `
          top: -7px;
          left: 50%;
          margin-left: -6px;
          border-bottom: none;
          border-right: none;
        `;
      case 'left':
        return `
          right: -7px;
          top: 50%;
          margin-top: -6px;
          border-bottom: none;
          border-left: none;
        `;
      case 'right':
        return `
          left: -7px;
          top: 50%;
          margin-top: -6px;
          border-top: none;
          border-right: none;
        `;
    }
  }}
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const OFFSET = 12;

export const Popover: React.FC<PopoverProps> = ({
  content,
  placement = 'bottom',
  title,
  open: controlledOpen,
  onOpenChange,
  closeOnClickOutside = true,
  closeOnEsc = true,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        y = triggerRect.top - popoverRect.height - OFFSET;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        y = triggerRect.bottom + OFFSET;
        break;
      case 'left':
        x = triggerRect.left - popoverRect.width - OFFSET;
        y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + OFFSET;
        y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        break;
    }

    // Keep within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - popoverRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - popoverRect.height - 8));

    setPosition({ x, y });
  }, [placement]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // Click outside handler
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        popoverRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnClickOutside, setOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, setOpen]);

  const handleTriggerClick = () => {
    setOpen(!isOpen);
  };

  return (
    <>
      <Trigger
        ref={triggerRef}
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {children}
      </Trigger>

      {isOpen &&
        createPortal(
          <PopoverBox
            ref={popoverRef}
            $placement={placement}
            style={{ left: position.x, top: position.y }}
            role="dialog"
          >
            <Arrow $placement={placement} />
            {title && (
              <Header>
                <Title>{title}</Title>
                <CloseButton onClick={() => setOpen(false)} aria-label="Close">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l6 6M9 3l-6 6" />
                  </svg>
                </CloseButton>
              </Header>
            )}
            <Body>{content}</Body>
          </PopoverBox>,
          document.body
        )}
    </>
  );
};

export default Popover;

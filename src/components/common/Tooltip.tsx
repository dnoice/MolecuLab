/**
 * ============================================================================
 * Tooltip Component
 * Informative hover tooltip with glass styling
 * ============================================================================
 */
import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode;
  /** Placement relative to trigger */
  placement?: TooltipPlacement;
  /** Delay before showing (ms) */
  delay?: number;
  /** Show arrow pointer */
  arrow?: boolean;
  /** Disabled state */
  disabled?: boolean;
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
`;

interface TooltipBoxProps {
  $placement: TooltipPlacement;
  $arrow: boolean;
}

const TooltipBox = styled.div<TooltipBoxProps>`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  padding: ${({ theme }) => `${theme.spacing['2']} ${theme.spacing['3']}`};
  background: rgba(20, 20, 35, 0.95);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: ${({ theme }) => theme.radius.sm};
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 245, 255, 0.2);
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  animation: ${fadeIn} 0.15s ease-out;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

interface ArrowProps {
  $placement: TooltipPlacement;
}

const Arrow = styled.span<ArrowProps>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(20, 20, 35, 0.95);
  border: 1px solid rgba(0, 245, 255, 0.3);
  transform: rotate(45deg);

  ${({ $placement }) => {
    switch ($placement) {
      case 'top':
        return `
          bottom: -5px;
          left: 50%;
          margin-left: -4px;
          border-top: none;
          border-left: none;
        `;
      case 'bottom':
        return `
          top: -5px;
          left: 50%;
          margin-left: -4px;
          border-bottom: none;
          border-right: none;
        `;
      case 'left':
        return `
          right: -5px;
          top: 50%;
          margin-top: -4px;
          border-bottom: none;
          border-left: none;
        `;
      case 'right':
        return `
          left: -5px;
          top: 50%;
          margin-top: -4px;
          border-top: none;
          border-right: none;
        `;
    }
  }}
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const OFFSET = 8;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  delay = 200,
  arrow = true,
  disabled = false,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - OFFSET;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + OFFSET;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - OFFSET;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + OFFSET;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Keep within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

    setPosition({ x, y });
  };

  useEffect(() => {
    if (visible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [visible, placement]);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Trigger
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </Trigger>

      {visible &&
        createPortal(
          <TooltipBox
            ref={tooltipRef}
            $placement={placement}
            $arrow={arrow}
            style={{ left: position.x, top: position.y }}
            role="tooltip"
          >
            {content}
            {arrow && <Arrow $placement={placement} />}
          </TooltipBox>,
          document.body
        )}
    </>
  );
};

export default Tooltip;

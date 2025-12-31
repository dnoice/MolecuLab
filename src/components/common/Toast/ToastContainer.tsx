/**
 * ============================================================================
 * ToastContainer Component
 * Container for rendering toast notifications
 * ============================================================================
 */
import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Toast, type ToastData } from './Toast';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  position?: ToastPosition;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top: 20px; right: 20px;',
  'top-left': 'top: 20px; left: 20px;',
  'bottom-right': 'bottom: 20px; right: 20px;',
  'bottom-left': 'bottom: 20px; left: 20px;',
  'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
  'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);',
};

interface ContainerProps {
  $position: ToastPosition;
}

const Container = styled.div<ContainerProps>`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
  pointer-events: none;
  ${({ $position }) => positionStyles[$position]}

  > * {
    pointer-events: auto;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  position = 'top-right',
}) => {
  // Create portal to render at document root
  return createPortal(
    <Container $position={position}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </Container>,
    document.body
  );
};

export default ToastContainer;

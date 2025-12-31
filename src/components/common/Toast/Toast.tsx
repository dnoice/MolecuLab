/**
 * ============================================================================
 * Toast Component
 * Notification toast with cyberpunk styling and animations
 * ============================================================================
 */
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progressShrink = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const typeConfig: Record<ToastType, { color: string; glow: string; icon: string }> = {
  info: {
    color: '#00f5ff',
    glow: 'rgba(0, 245, 255, 0.4)',
    icon: 'ℹ',
  },
  success: {
    color: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.4)',
    icon: '✓',
  },
  warning: {
    color: '#ffd700',
    glow: 'rgba(255, 215, 0, 0.4)',
    icon: '⚠',
  },
  error: {
    color: '#ff3366',
    glow: 'rgba(255, 51, 102, 0.4)',
    icon: '✕',
  },
};

interface WrapperProps {
  $type: ToastType;
  $exiting: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 420px;
  background: rgba(20, 20, 35, 0.95);
  border: 1px solid ${({ $type }) => typeConfig[$type].color}40;
  border-radius: ${({ theme }) => theme.radius.md};
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 20px ${({ $type }) => typeConfig[$type].glow};
  overflow: hidden;
  animation: ${({ $exiting }) => ($exiting ? slideOut : slideIn)} 0.3s ease-out forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

interface ContentProps {
  $type: ToastType;
}

const Content = styled.div<ContentProps>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']};
`;

const IconWrapper = styled.span<ContentProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $type }) => typeConfig[$type].color}20;
  color: ${({ $type }) => typeConfig[$type].color};
  font-size: 14px;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h4`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Message = styled.p`
  margin: ${({ theme }) => theme.spacing['1']} 0 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const ActionButton = styled.button<ContentProps>`
  margin-top: ${({ theme }) => theme.spacing['2']};
  padding: ${({ theme }) => `${theme.spacing['1']} ${theme.spacing['2']}`};
  background: transparent;
  border: 1px solid ${({ $type }) => typeConfig[$type].color}60;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $type }) => typeConfig[$type].color};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $type }) => typeConfig[$type].color}20;
    border-color: ${({ $type }) => typeConfig[$type].color};
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  flex-shrink: 0;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

interface ProgressBarProps {
  $type: ToastType;
  $duration: number;
  $paused: boolean;
}

const ProgressBar = styled.div<ProgressBarProps>`
  height: 3px;
  background: ${({ $type }) => typeConfig[$type].color};
  box-shadow: 0 0 8px ${({ $type }) => typeConfig[$type].glow};
  animation: ${progressShrink} ${({ $duration }) => $duration}ms linear forwards;
  animation-play-state: ${({ $paused }) => ($paused ? 'paused' : 'running')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    width: 100%;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  action,
  onDismiss,
}) => {
  const [exiting, setExiting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (duration === 0 || paused) return;

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, paused, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <Wrapper
      $type={type}
      $exiting={exiting}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Content $type={type}>
        <IconWrapper $type={type}>{typeConfig[type].icon}</IconWrapper>
        <TextContent>
          <Title>{title}</Title>
          {message && <Message>{message}</Message>}
          {action && (
            <ActionButton $type={type} onClick={action.onClick}>
              {action.label}
            </ActionButton>
          )}
        </TextContent>
        <CloseButton onClick={handleDismiss} aria-label="Dismiss">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </CloseButton>
      </Content>
      {duration > 0 && <ProgressBar $type={type} $duration={duration} $paused={paused} />}
    </Wrapper>
  );
};

export default Toast;

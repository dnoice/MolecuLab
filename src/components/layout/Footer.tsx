/**
 * ============================================================================
 * Footer Component
 * Application status bar with system info and controls
 * ============================================================================
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface FooterProps {
  status?: 'ready' | 'loading' | 'error';
  statusMessage?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const FooterWrapper = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 ${({ theme }) => theme.spacing['3']};
  background: ${({ theme }) => theme.glass.dark};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  user-select: none;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
`;

interface StatusIndicatorProps {
  $status: 'ready' | 'loading' | 'error';
}

const StatusIndicator = styled.div<StatusIndicatorProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $status, theme }) => {
      switch ($status) {
        case 'ready':
          return theme.colors.success;
        case 'loading':
          return theme.colors.warning;
        case 'error':
          return theme.colors.error;
        default:
          return theme.colors.textMuted;
      }
    }};
    box-shadow: 0 0 6px
      ${({ $status, theme }) => {
        switch ($status) {
          case 'ready':
            return theme.colors.success;
          case 'loading':
            return theme.colors.warning;
          case 'error':
            return theme.colors.error;
          default:
            return 'transparent';
        }
      }};
    ${({ $status }) =>
      $status === 'loading' &&
      `
      animation: ${pulse} 1.5s ease-in-out infinite;
    `}
  }

  .message {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Footer: React.FC<FooterProps> = ({
  status = 'ready',
  statusMessage,
}) => {
  const getStatusMessage = () => {
    if (statusMessage) return statusMessage;
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'loading':
        return 'Loading...';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <FooterWrapper>
      <Section>
        <StatusIndicator $status={status}>
          <span className="dot" />
          <span className="message">{getStatusMessage()}</span>
        </StatusIndicator>
      </Section>
    </FooterWrapper>
  );
};

export default Footer;

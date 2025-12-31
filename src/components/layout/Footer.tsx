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
  atomCount?: number;
  bondCount?: number;
  fps?: number;
  zoomLevel?: number;
  renderMode?: string;
  status?: 'ready' | 'loading' | 'error';
  statusMessage?: string;
  onZoomChange?: (zoom: number) => void;
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

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};

  span.label {
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  span.value {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  span.unit {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 10px;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background: ${({ theme }) => theme.colors.border};
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

const ZoomControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const ZoomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
    border-color: ${({ theme }) => theme.colors.primary}60;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ZoomValue = styled.span`
  min-width: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RenderBadge = styled.span`
  padding: ${({ theme }) => `${theme.spacing['0.5']} ${theme.spacing['2']}`};
  background: ${({ theme }) => theme.colors.secondary}20;
  border: 1px solid ${({ theme }) => theme.colors.secondary}40;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 10px;
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Footer: React.FC<FooterProps> = ({
  atomCount = 0,
  bondCount = 0,
  fps,
  zoomLevel = 100,
  renderMode = 'Ball & Stick',
  status = 'ready',
  statusMessage,
  onZoomChange,
}) => {
  const handleZoomIn = () => {
    const newZoom = Math.min(400, zoomLevel + 25);
    onZoomChange?.(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(25, zoomLevel - 25);
    onZoomChange?.(newZoom);
  };

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

        <Divider />

        <Stat>
          <span className="label">Atoms:</span>
          <span className="value">{atomCount}</span>
        </Stat>

        <Stat>
          <span className="label">Bonds:</span>
          <span className="value">{bondCount}</span>
        </Stat>

        {fps !== undefined && (
          <>
            <Divider />
            <Stat>
              <span className="value">{fps}</span>
              <span className="unit">FPS</span>
            </Stat>
          </>
        )}
      </Section>

      <Section>
        <RenderBadge>{renderMode}</RenderBadge>

        <Divider />

        <ZoomControl>
          <ZoomButton onClick={handleZoomOut} disabled={zoomLevel <= 25}>
            −
          </ZoomButton>
          <ZoomValue>{zoomLevel}%</ZoomValue>
          <ZoomButton onClick={handleZoomIn} disabled={zoomLevel >= 400}>
            +
          </ZoomButton>
        </ZoomControl>
      </Section>
    </FooterWrapper>
  );
};

export default Footer;

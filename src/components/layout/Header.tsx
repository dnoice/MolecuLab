/**
 * ============================================================================
 * Header Component
 * Application header with logo, navigation, and controls
 * ============================================================================
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { IconButton } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface HeaderProps {
  onMenuToggle?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const orbitalSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.glass.dark};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(20px);
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.header};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary}40,
      ${({ theme }) => theme.colors.secondary}40,
      transparent
    );
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  cursor: pointer;
  user-select: none;

  &:hover .logo-icon {
    animation: ${orbitalSpin} 2s linear infinite;
  }
`;

const LogoIcon = styled.div`
  position: relative;
  width: 36px;
  height: 36px;

  .nucleus {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.primary};
  }

  .orbital {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
    border: 1px solid ${({ theme }) => theme.colors.primary}60;
    border-radius: 50%;
    animation: ${pulseGlow} 2s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      top: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: ${({ theme }) => theme.colors.secondary};
      border-radius: 50%;
      box-shadow: 0 0 8px ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 1;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoSubtitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 ${({ theme }) => theme.spacing['2']};
`;

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 4.5h12M3 9h12M3 13.5h12" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="9" r="2.5" />
    <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4" />
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="9" r="7" />
    <path d="M6.5 6.5a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2.5 2-2.5 3.5M9 13.5v.01" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  onSettingsClick,
  onHelpClick,
}) => {
  return (
    <HeaderWrapper>
      <LeftSection>
        <IconButton
          aria-label="Toggle menu"
          onClick={onMenuToggle}
          variant="ghost"
          size="md"
          icon={<MenuIcon />}
        />

        <LogoWrapper>
          <LogoIcon className="logo-icon">
            <div className="nucleus" />
            <div className="orbital" />
          </LogoIcon>
          <LogoText>
            <LogoTitle>
              Molecu<span>Lab</span>
            </LogoTitle>
            <LogoSubtitle>Quantum Design Studio</LogoSubtitle>
          </LogoText>
        </LogoWrapper>
      </LeftSection>

      <RightSection>
        <IconButton
          aria-label="Settings"
          onClick={onSettingsClick}
          variant="ghost"
          size="md"
          icon={<SettingsIcon />}
        />

        <Divider />

        <IconButton
          aria-label="Help"
          onClick={onHelpClick}
          variant="ghost"
          size="md"
          icon={<HelpIcon />}
        />
      </RightSection>
    </HeaderWrapper>
  );
};

export default Header;

/**
 * ============================================================================
 * ✒ Metadata
 *    - Title: HeaderNav Component (MolecuLab Edition - v1.0)
 *    - File Name: HeaderNav.tsx
 *    - Relative Path: src/components/layout/HeaderNav.tsx
 *    - Artifact Type: component
 *    - Version: 1.0.0
 *    - Date: 2025-12-30
 *    - Update: Monday, December 30, 2025
 *    - Author: Dennis 'dnoice' Smaltz
 *    - A.I. Acknowledgement: Anthropic - Claude Opus 4.5
 *    - Signature:  ︻デ═—··· 🎯 | Aim Twice, Shoot Once!
 *
 * ✒ Description:
 *    Simple dropdown navigation menu with app-level items like About,
 *    Settings, Help, and other general app controls.
 *
 * ✒ Key Features:
 *    - Animated dropdown reveal
 *    - Glassmorphism styling with neon accents
 *    - Simple menu items: About, Settings, Help, etc.
 *    - Click-outside to close
 *    - Keyboard navigation support
 * ============================================================================
 */
import React, { useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface NavMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  divider?: boolean;
  onClick?: () => void;
}

export interface NavMenuSection {
  id: string;
  label: string;
  items: NavMenuItem[];
}

export interface HeaderNavProps {
  isOpen: boolean;
  onClose: () => void;
  onAbout?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  onKeyboardShortcuts?: () => void;
  onDocumentation?: () => void;
  onCheckUpdates?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface NavWrapperProps {
  $isOpen: boolean;
  $isClosing: boolean;
}

const NavWrapper = styled.div<NavWrapperProps>`
  position: absolute;
  top: 100%;
  left: ${({ theme }) => theme.spacing['4']};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  min-width: 220px;
  background: ${({ theme }) => theme.glass.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  padding: ${({ theme }) => theme.spacing['2']};
  margin-top: ${({ theme }) => theme.spacing['2']};
  display: ${({ $isOpen, $isClosing }) => ($isOpen || $isClosing ? 'block' : 'none')};
  animation: ${({ $isClosing }) =>
    $isClosing
      ? css`${slideUp} 0.15s ease-out forwards`
      : css`${slideDown} 0.2s ease-out`};

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 16px;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.glass.medium};
    border-left: 1px solid ${({ theme }) => theme.colors.border};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    transform: rotate(45deg);
  }
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => `${theme.spacing['2']} ${theme.spacing['3']}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;

    .item-icon {
      color: ${({ theme }) => theme.colors.primary};
    }

    .item-label {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  &:active {
    background: ${({ theme }) => theme.colors.primary}25;
    transform: scale(0.98);
  }
`;

const ItemIcon = styled.span.attrs({ className: 'item-icon' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ItemLabel = styled.span.attrs({ className: 'item-label' })`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.15s ease;
`;

const Divider = styled.li`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => `${theme.spacing['2']} 0`};
`;

const AppVersion = styled.div`
  padding: ${({ theme }) => `${theme.spacing['2']} ${theme.spacing['3']}`};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing['2']};
`;

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const AboutIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 7v4M8 5v.01" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="2" />
    <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.8 3.8l1.4 1.4M10.8 10.8l1.4 1.4M3.8 12.2l1.4-1.4M10.8 5.2l1.4-1.4" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M6 6a2 2 0 0 1 3.5 1.3c0 1.2-2 1.7-2 2.7M8 12v.01" />
  </svg>
);

const KeyboardIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="4" width="14" height="9" rx="1" />
    <path d="M4 7h1M7 7h2M11 7h1M4 10h8" />
  </svg>
);

const DocsIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 2h8l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
    <path d="M11 2v3h3M5 8h6M5 11h4" />
  </svg>
);

const UpdateIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2v5l3 2M8 14a6 6 0 1 1 0-12" />
    <path d="M12 2v3h3" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isOpen,
  onClose,
  onAbout,
  onSettings,
  onHelp,
  onKeyboardShortcuts,
  onDocumentation,
  onCheckUpdates,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = React.useState(false);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (target.closest('[aria-label="Toggle menu"]')) {
          return;
        }
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  };

  const handleItemClick = (callback?: () => void) => {
    callback?.();
    handleClose();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <NavWrapper ref={navRef} $isOpen={isOpen} $isClosing={isClosing}>
      <MenuList>
        <MenuItem onClick={() => handleItemClick(onAbout)} role="menuitem">
          <ItemIcon><AboutIcon /></ItemIcon>
          <ItemLabel>About MolecuLab</ItemLabel>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => handleItemClick(onSettings)} role="menuitem">
          <ItemIcon><SettingsIcon /></ItemIcon>
          <ItemLabel>Settings</ItemLabel>
        </MenuItem>

        <MenuItem onClick={() => handleItemClick(onKeyboardShortcuts)} role="menuitem">
          <ItemIcon><KeyboardIcon /></ItemIcon>
          <ItemLabel>Keyboard Shortcuts</ItemLabel>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => handleItemClick(onHelp)} role="menuitem">
          <ItemIcon><HelpIcon /></ItemIcon>
          <ItemLabel>Help</ItemLabel>
        </MenuItem>

        <MenuItem onClick={() => handleItemClick(onDocumentation)} role="menuitem">
          <ItemIcon><DocsIcon /></ItemIcon>
          <ItemLabel>Documentation</ItemLabel>
        </MenuItem>

        <MenuItem onClick={() => handleItemClick(onCheckUpdates)} role="menuitem">
          <ItemIcon><UpdateIcon /></ItemIcon>
          <ItemLabel>Check for Updates</ItemLabel>
        </MenuItem>
      </MenuList>

      <AppVersion>MolecuLab v1.0.0</AppVersion>
    </NavWrapper>
  );
};

export default HeaderNav;

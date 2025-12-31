/**
 * ============================================================================
 * Sidebar Component
 * Collapsible sidebar for tools, elements, and molecular data
 * ============================================================================
 */
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Tooltip } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export interface SidebarProps {
  sections: SidebarSection[];
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  position?: 'left' | 'right';
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface WrapperProps {
  $isCollapsed: boolean;
  $position: 'left' | 'right';
}

const SidebarWrapper = styled.aside<WrapperProps>`
  display: flex;
  flex-direction: ${({ $position }) => ($position === 'left' ? 'row' : 'row-reverse')};
  height: 100%;
  background: ${({ theme }) => theme.glass.dark};
  border-${({ $position }) => ($position === 'left' ? 'right' : 'left')}: 1px solid ${({ theme }) => theme.colors.border};
  transition: width ${({ theme }) => theme.transitions.normal};
  width: ${({ $isCollapsed }) => ($isCollapsed ? '56px' : '280px')};
  overflow: hidden;
`;

const IconStrip = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 56px;
  padding: ${({ theme }) => theme.spacing['2']} 0;
  background: ${({ theme }) => theme.glass.subtle};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

interface NavButtonProps {
  $isActive: boolean;
}

const NavButton = styled.button<NavButtonProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: ${({ theme }) => theme.spacing['1']} 0;
  padding: 0;
  background: ${({ $isActive, theme }) =>
    $isActive ? `${theme.colors.primary}20` : 'transparent'};
  border: 1px solid ${({ $isActive, theme }) =>
    $isActive ? `${theme.colors.primary}60` : 'transparent'};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.textMuted};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary}40;
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -1px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: ${theme.colors.primary};
      border-radius: 0 2px 2px 0;
      box-shadow: 0 0 8px ${theme.colors.primary};
    }
  `}

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ContentPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideIn} 0.2s ease-out;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const SectionContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing['3']};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-top: auto;
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
    width: 18px;
    height: 18px;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════

const ChevronLeft = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 4L6 9l5 5" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 4l5 5-5 5" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  isCollapsed = false,
  onCollapsedChange,
  activeSection,
  onSectionChange,
  position = 'left',
}) => {
  const [internalActive, setInternalActive] = useState(sections[0]?.id || '');

  const currentActive = activeSection ?? internalActive;
  const activeContent = sections.find((s) => s.id === currentActive);

  const handleSectionClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    } else {
      setInternalActive(sectionId);
    }

    // Expand if collapsed
    if (isCollapsed && onCollapsedChange) {
      onCollapsedChange(false);
    }
  };

  const handleCollapse = () => {
    onCollapsedChange?.(!isCollapsed);
  };

  return (
    <SidebarWrapper $isCollapsed={isCollapsed} $position={position}>
      <IconStrip>
        {sections.map((section) => (
          <Tooltip
            key={section.id}
            content={section.title}
            placement={position === 'left' ? 'right' : 'left'}
          >
            <NavButton
              $isActive={currentActive === section.id}
              onClick={() => handleSectionClick(section.id)}
              aria-label={section.title}
            >
              {section.icon}
            </NavButton>
          </Tooltip>
        ))}

        <CollapseButton onClick={handleCollapse} aria-label="Toggle sidebar">
          {isCollapsed ? (
            position === 'left' ? (
              <ChevronRight />
            ) : (
              <ChevronLeft />
            )
          ) : position === 'left' ? (
            <ChevronLeft />
          ) : (
            <ChevronRight />
          )}
        </CollapseButton>
      </IconStrip>

      {!isCollapsed && activeContent && (
        <ContentPanel>
          <SectionHeader>
            <SectionTitle>{activeContent.title}</SectionTitle>
          </SectionHeader>
          <SectionContent>{activeContent.content}</SectionContent>
        </ContentPanel>
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;

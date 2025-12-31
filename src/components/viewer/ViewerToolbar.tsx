/**
 * ============================================================================
 * ✒ Metadata
 *    - Title: ViewerToolbar Component (MolecuLab Edition - v1.0)
 *    - File Name: ViewerToolbar.tsx
 *    - Relative Path: src/components/viewer/ViewerToolbar.tsx
 *    - Artifact Type: component
 *    - Version: 1.0.0
 *    - Date: 2025-12-30
 *    - Update: Monday, December 30, 2025
 *    - Author: Dennis 'dnoice' Smaltz
 *    - A.I. Acknowledgement: Anthropic - Claude Opus 4.5
 *    - Signature:  ︻デ═—··· 🎯 | Aim Twice, Shoot Once!
 *
 * ✒ Description:
 *    Horizontal toolbar for the molecular viewer with File, Edit, View,
 *    and Tools action buttons. Positioned at the top of the viewer area.
 *
 * ✒ Key Features:
 *    - Grouped action buttons (File, Edit, View, Tools)
 *    - Icon buttons with tooltips
 *    - Glassmorphism styling
 *    - Responsive layout with separators
 *    - Keyboard shortcut support ready
 * ============================================================================
 */
import React from 'react';
import styled from 'styled-components';
import { Tooltip } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  hotkey?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ViewerToolbarProps {
  moleculeName?: string;
  isModified?: boolean;
  onNewMolecule?: () => void;
  onOpenFile?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  onDelete?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onFullscreen?: () => void;
  onMeasure?: () => void;
  onSearch?: () => void;
  onCalculator?: () => void;
  onPeriodicTable?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const ToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  padding: ${({ theme }) => `${theme.spacing['2']} ${theme.spacing['3']}`};
  background: ${({ theme }) => theme.glass.dark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  backdrop-filter: blur(12px);
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 ${({ theme }) => theme.spacing['1']};
`;

interface ToolButtonProps {
  $disabled?: boolean;
}

const ToolButton = styled.button<ToolButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.textMuted : theme.colors.textSecondary};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  transition: all 0.15s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    ${({ $disabled, theme }) =>
      !$disabled &&
      `
      background: ${theme.colors.primary}15;
      border-color: ${theme.colors.primary}30;
      color: ${theme.colors.primary};
    `}
  }

  &:active:not(:disabled) {
    ${({ $disabled, theme }) =>
      !$disabled &&
      `
      background: ${theme.colors.primary}25;
      transform: scale(0.95);
    `}
  }
`;

const GroupLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-right: ${({ theme }) => theme.spacing['1']};
`;

const Spacer = styled.div`
  flex: 1;
`;

interface MoleculeNameProps {
  $isModified?: boolean;
}

const MoleculeName = styled.div<MoleculeNameProps>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.spacing['1']} ${theme.spacing['3']}`};
  background: ${({ theme }) => theme.glass.subtle};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};

  ${({ $isModified, theme }) =>
    $isModified &&
    `
    &::after {
      content: ' •';
      color: ${theme.colors.warning};
    }
  `}
`;

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const NewIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 2h7l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
    <path d="M11 2v4h4M9 8v6M6 11h6" />
  </svg>
);

const OpenIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 5v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9L7.5 4.5A1 1 0 0 0 6.8 4H3a1 1 0 0 0-1 1z" />
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 16H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6l4 4v9a1 1 0 0 1-1 1z" />
    <path d="M11 2v4h4M6 11h6M6 14h4" />
  </svg>
);

const ExportIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 2v9M6 5l3-3 3 3M3 11v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4" />
  </svg>
);

const UndoIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 7h7a4 4 0 1 1 0 8H9M4 7l3-3M4 7l3 3" />
  </svg>
);

const RedoIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 7H7a4 4 0 1 0 0 8h2M14 7l-3-3M14 7l-3 3" />
  </svg>
);

const SelectAllIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="12" height="12" rx="1" />
    <path d="M6 9l2 2 4-4" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 5h12M7 5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M13 5v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5" />
  </svg>
);

const ZoomInIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="5" />
    <path d="M12 12l4 4M8 6v4M6 8h4" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="5" />
    <path d="M12 12l4 4M6 8h4" />
  </svg>
);

const ResetViewIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 9a7 7 0 1 1 2 5M2 14V9h5" />
  </svg>
);

const FullscreenIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 6V3h3M12 3h3v3M15 12v3h-3M6 15H3v-3" />
  </svg>
);

const MeasureIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 16l14-14M7 2v5M2 7h5M11 16v-5M16 11h-5" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="5" />
    <path d="M12 12l4 4" />
  </svg>
);

const CalculatorIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="2" width="12" height="14" rx="1" />
    <path d="M5 5h8M5 9h2M8 9h2M11 9h2M5 12h2M8 12h2M11 12h2" />
  </svg>
);

const PeriodicIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="4" height="4" rx="0.5" />
    <rect x="7" y="2" width="4" height="4" rx="0.5" />
    <rect x="12" y="2" width="4" height="4" rx="0.5" />
    <rect x="2" y="7" width="4" height="4" rx="0.5" />
    <rect x="7" y="7" width="4" height="4" rx="0.5" />
    <rect x="2" y="12" width="4" height="4" rx="0.5" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ViewerToolbar: React.FC<ViewerToolbarProps> = ({
  moleculeName,
  isModified = false,
  onNewMolecule,
  onOpenFile,
  onSave,
  onExport,
  onUndo,
  onRedo,
  onSelectAll,
  onDelete,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFullscreen,
  onMeasure,
  onSearch,
  onCalculator,
  onPeriodicTable,
  canUndo = true,
  canRedo = true,
  hasSelection = false,
}) => {
  return (
    <ToolbarWrapper>
      {/* File Group */}
      <ButtonGroup>
        <GroupLabel>File</GroupLabel>
        <Tooltip content="New Molecule (Ctrl+N)" placement="bottom">
          <ToolButton onClick={onNewMolecule} aria-label="New Molecule">
            <NewIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Open File (Ctrl+O)" placement="bottom">
          <ToolButton onClick={onOpenFile} aria-label="Open File">
            <OpenIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Save (Ctrl+S)" placement="bottom">
          <ToolButton onClick={onSave} aria-label="Save">
            <SaveIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Export (Ctrl+E)" placement="bottom">
          <ToolButton onClick={onExport} aria-label="Export">
            <ExportIcon />
          </ToolButton>
        </Tooltip>
      </ButtonGroup>

      <Separator />

      {/* Edit Group */}
      <ButtonGroup>
        <GroupLabel>Edit</GroupLabel>
        <Tooltip content="Undo (Ctrl+Z)" placement="bottom">
          <ToolButton onClick={onUndo} $disabled={!canUndo} aria-label="Undo">
            <UndoIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Redo (Ctrl+Y)" placement="bottom">
          <ToolButton onClick={onRedo} $disabled={!canRedo} aria-label="Redo">
            <RedoIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Select All (Ctrl+A)" placement="bottom">
          <ToolButton onClick={onSelectAll} aria-label="Select All">
            <SelectAllIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Delete (Del)" placement="bottom">
          <ToolButton onClick={onDelete} $disabled={!hasSelection} aria-label="Delete">
            <DeleteIcon />
          </ToolButton>
        </Tooltip>
      </ButtonGroup>

      <Separator />

      {/* View Group */}
      <ButtonGroup>
        <GroupLabel>View</GroupLabel>
        <Tooltip content="Zoom In (+)" placement="bottom">
          <ToolButton onClick={onZoomIn} aria-label="Zoom In">
            <ZoomInIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Zoom Out (-)" placement="bottom">
          <ToolButton onClick={onZoomOut} aria-label="Zoom Out">
            <ZoomOutIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Reset View (R)" placement="bottom">
          <ToolButton onClick={onResetView} aria-label="Reset View">
            <ResetViewIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Fullscreen (F11)" placement="bottom">
          <ToolButton onClick={onFullscreen} aria-label="Fullscreen">
            <FullscreenIcon />
          </ToolButton>
        </Tooltip>
      </ButtonGroup>

      <Separator />

      {/* Tools Group */}
      <ButtonGroup>
        <GroupLabel>Tools</GroupLabel>
        <Tooltip content="Measure (M)" placement="bottom">
          <ToolButton onClick={onMeasure} aria-label="Measure">
            <MeasureIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="PubChem Search (Ctrl+F)" placement="bottom">
          <ToolButton onClick={onSearch} aria-label="PubChem Search">
            <SearchIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Mol. Calculator" placement="bottom">
          <ToolButton onClick={onCalculator} aria-label="Molecular Calculator">
            <CalculatorIcon />
          </ToolButton>
        </Tooltip>
        <Tooltip content="Periodic Table (P)" placement="bottom">
          <ToolButton onClick={onPeriodicTable} aria-label="Periodic Table">
            <PeriodicIcon />
          </ToolButton>
        </Tooltip>
      </ButtonGroup>

      {/* Spacer and Molecule Name */}
      {moleculeName && (
        <>
          <Spacer />
          <MoleculeName $isModified={isModified}>{moleculeName}</MoleculeName>
        </>
      )}
    </ToolbarWrapper>
  );
};

export default ViewerToolbar;

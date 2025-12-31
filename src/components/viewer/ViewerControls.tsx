/**
 * ============================================================================
 * ViewerControls Component
 * Controls for manipulating the 3D molecular viewer
 * ============================================================================
 */
import React from 'react';
import styled from 'styled-components';
import { GlassPanel, IconButton, Toggle, Tooltip } from '../common';
import type { RenderMode } from './MolecularViewer';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ViewerControlsProps {
  renderMode: RenderMode;
  onRenderModeChange: (mode: RenderMode) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  showBonds: boolean;
  onShowBondsChange: (show: boolean) => void;
  autoRotate: boolean;
  onAutoRotateChange: (rotate: boolean) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const ControlsWrapper = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['3']};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const GroupLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing['1']} 0;
`;

const ToggleLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface RenderModeButtonProps {
  $isActive: boolean;
}

const RenderModeButton = styled.button<RenderModeButtonProps>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing['2']};
  background: ${({ $isActive, theme }) =>
    $isActive ? `${theme.colors.primary}20` : 'transparent'};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.textMuted};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
    border-color: ${({ theme }) => theme.colors.primary}80;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing['1']} 0;
`;

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════

const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="7" cy="7" r="5" />
    <path d="M11 11l3 3M7 5v4M5 7h4" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="7" cy="7" r="5" />
    <path d="M11 11l3 3M5 7h4" />
  </svg>
);

const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 8a6 6 0 1 1 1.5 4M2 12V8h4" />
  </svg>
);

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 5V2h3M11 2h3v3M14 11v3h-3M5 14H2v-3" />
  </svg>
);

const ExitFullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 2v3H2M14 5h-3V2M11 14v-3h3M2 11h3v3" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const RENDER_MODES: { value: RenderMode; label: string }[] = [
  { value: 'ball-stick', label: 'Ball & Stick' },
  { value: 'space-fill', label: 'Space Fill' },
  { value: 'wireframe', label: 'Wireframe' },
  { value: 'stick', label: 'Stick' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  renderMode,
  onRenderModeChange,
  showLabels,
  onShowLabelsChange,
  showBonds,
  onShowBondsChange,
  autoRotate,
  onAutoRotateChange,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  onFullscreen,
  isFullscreen = false,
  className,
}) => {
  return (
    <ControlsWrapper className={className} variant="dark">
      <ControlGroup>
        <GroupLabel>View</GroupLabel>
        <ButtonRow>
          <Tooltip content="Zoom In">
            <IconButton
              icon={<ZoomInIcon />}
              aria-label="Zoom in"
              onClick={onZoomIn}
              size="sm"
            />
          </Tooltip>
          <Tooltip content="Zoom Out">
            <IconButton
              icon={<ZoomOutIcon />}
              aria-label="Zoom out"
              onClick={onZoomOut}
              size="sm"
            />
          </Tooltip>
          <Tooltip content="Reset Camera">
            <IconButton
              icon={<ResetIcon />}
              aria-label="Reset camera"
              onClick={onResetCamera}
              size="sm"
            />
          </Tooltip>
          {onFullscreen && (
            <Tooltip content={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              <IconButton
                icon={isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                onClick={onFullscreen}
                size="sm"
              />
            </Tooltip>
          )}
        </ButtonRow>
      </ControlGroup>

      <Divider />

      <ControlGroup>
        <GroupLabel>Render Mode</GroupLabel>
        <ButtonRow style={{ flexWrap: 'wrap' }}>
          {RENDER_MODES.map((mode) => (
            <RenderModeButton
              key={mode.value}
              $isActive={renderMode === mode.value}
              onClick={() => onRenderModeChange(mode.value)}
            >
              {mode.label}
            </RenderModeButton>
          ))}
        </ButtonRow>
      </ControlGroup>

      <Divider />

      <ControlGroup>
        <GroupLabel>Display Options</GroupLabel>
        <ToggleRow>
          <ToggleLabel>Show Labels</ToggleLabel>
          <Toggle
            checked={showLabels}
            onChange={(e) => onShowLabelsChange(e.target.checked)}
            size="sm"
          />
        </ToggleRow>
        <ToggleRow>
          <ToggleLabel>Show Bonds</ToggleLabel>
          <Toggle
            checked={showBonds}
            onChange={(e) => onShowBondsChange(e.target.checked)}
            size="sm"
          />
        </ToggleRow>
        <ToggleRow>
          <ToggleLabel>Auto Rotate</ToggleLabel>
          <Toggle
            checked={autoRotate}
            onChange={(e) => onAutoRotateChange(e.target.checked)}
            size="sm"
          />
        </ToggleRow>
      </ControlGroup>
    </ControlsWrapper>
  );
};

export default ViewerControls;

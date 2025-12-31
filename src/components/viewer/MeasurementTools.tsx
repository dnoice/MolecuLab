/**
 * ============================================================================
 * MeasurementTools Component
 * Tools for measuring distances, angles, and dihedral angles in molecules
 * ============================================================================
 */
import React from 'react';
import styled from 'styled-components';
import { GlassPanel, Button, Tooltip } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type MeasurementType = 'distance' | 'angle' | 'dihedral';

export interface Measurement {
  id: string;
  type: MeasurementType;
  atoms: string[];
  value: number;
  unit: string;
  label?: string;
}

export interface MeasurementToolsProps {
  measurements: Measurement[];
  activeTool?: MeasurementType | null;
  onToolChange: (tool: MeasurementType | null) => void;
  onMeasurementDelete: (id: string) => void;
  onMeasurementsClear: () => void;
  onMeasurementLabelChange?: (id: string, label: string) => void;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const ToolsWrapper = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['3']};
`;

const ToolsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ToolButtonsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['2']};
`;

interface ToolButtonProps {
  $isActive: boolean;
}

const ToolButton = styled.button<ToolButtonProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  padding: ${({ theme }) => theme.spacing['3']};
  background: ${({ $isActive, theme }) =>
    $isActive ? `${theme.colors.primary}20` : 'transparent'};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $isActive, theme }) =>
    $isActive &&
    `
    box-shadow: 0 0 12px ${theme.colors.primary}40;
  `}

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
    border-color: ${({ theme }) => theme.colors.primary}80;
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.textMuted};
  }

  span {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const MeasurementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

interface MeasurementItemProps {
  $type: MeasurementType;
}

const measurementColors: Record<MeasurementType, string> = {
  distance: '#00f5ff',
  angle: '#ff00ff',
  dihedral: '#ffd700',
};

const MeasurementItem = styled.div<MeasurementItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  padding: ${({ theme }) => theme.spacing['2']};
  background: ${({ theme }) => theme.glass.subtle};
  border: 1px solid ${({ $type }) => `${measurementColors[$type]}40`};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $type }) => `${measurementColors[$type]}10`};
    border-color: ${({ $type }) => measurementColors[$type]};
  }
`;

const MeasurementIcon = styled.div<MeasurementItemProps>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $type }) => measurementColors[$type]};
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MeasurementInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MeasurementValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MeasurementAtoms = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  opacity: 0;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${MeasurementItem}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4']};
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════

const DistanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="4" cy="12" r="2" />
    <circle cx="20" cy="12" r="2" />
    <path d="M6 12h12" strokeDasharray="3 2" />
  </svg>
);

const AngleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 20h16M4 20l8-16M4 20l12-8" />
    <path d="M7 17a5 5 0 0 1 4-3" />
  </svg>
);

const DihedralIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 8l8 4 8-4M4 16l8 4 8-4M12 4v16" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3l8 8M11 3l-8 8" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const MeasurementTools: React.FC<MeasurementToolsProps> = ({
  measurements,
  activeTool,
  onToolChange,
  onMeasurementDelete,
  onMeasurementsClear,
  className,
}) => {
  const handleToolClick = (tool: MeasurementType) => {
    onToolChange(activeTool === tool ? null : tool);
  };

  const formatValue = (measurement: Measurement) => {
    const precision = measurement.type === 'distance' ? 2 : 1;
    return `${measurement.value.toFixed(precision)} ${measurement.unit}`;
  };

  const getIcon = (type: MeasurementType) => {
    switch (type) {
      case 'distance':
        return <DistanceIcon />;
      case 'angle':
        return <AngleIcon />;
      case 'dihedral':
        return <DihedralIcon />;
    }
  };

  return (
    <ToolsWrapper className={className} variant="dark">
      <ToolsHeader>
        <Title>Measurements</Title>
      </ToolsHeader>

      <ToolButtonsRow>
        <Tooltip content="Measure distance between two atoms">
          <ToolButton
            $isActive={activeTool === 'distance'}
            onClick={() => handleToolClick('distance')}
          >
            <DistanceIcon />
            <span>Distance</span>
          </ToolButton>
        </Tooltip>

        <Tooltip content="Measure angle between three atoms">
          <ToolButton
            $isActive={activeTool === 'angle'}
            onClick={() => handleToolClick('angle')}
          >
            <AngleIcon />
            <span>Angle</span>
          </ToolButton>
        </Tooltip>

        <Tooltip content="Measure dihedral angle between four atoms">
          <ToolButton
            $isActive={activeTool === 'dihedral'}
            onClick={() => handleToolClick('dihedral')}
          >
            <DihedralIcon />
            <span>Dihedral</span>
          </ToolButton>
        </Tooltip>
      </ToolButtonsRow>

      {measurements.length > 0 ? (
        <>
          <MeasurementsList>
            {measurements.map((m) => (
              <MeasurementItem key={m.id} $type={m.type}>
                <MeasurementIcon $type={m.type}>{getIcon(m.type)}</MeasurementIcon>
                <MeasurementInfo>
                  <MeasurementValue>{formatValue(m)}</MeasurementValue>
                  <MeasurementAtoms>{m.atoms.join(' → ')}</MeasurementAtoms>
                </MeasurementInfo>
                <DeleteButton
                  onClick={() => onMeasurementDelete(m.id)}
                  aria-label="Delete measurement"
                >
                  <CloseIcon />
                </DeleteButton>
              </MeasurementItem>
            ))}
          </MeasurementsList>

          <FooterActions>
            <Button variant="ghost" size="sm" onClick={onMeasurementsClear}>
              Clear All
            </Button>
          </FooterActions>
        </>
      ) : (
        <EmptyState>
          Select a tool and click atoms to measure
        </EmptyState>
      )}
    </ToolsWrapper>
  );
};

export default MeasurementTools;

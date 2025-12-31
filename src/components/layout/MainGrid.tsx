/**
 * ============================================================================
 * MainGrid Component
 * Primary layout grid for the application with resizable panels
 * ============================================================================
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface MainGridProps {
  leftPanel?: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
  leftWidth?: number;
  rightWidth?: number;
  bottomHeight?: number;
  onLeftWidthChange?: (width: number) => void;
  onRightWidthChange?: (width: number) => void;
  onBottomHeightChange?: (height: number) => void;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  minRightWidth?: number;
  maxRightWidth?: number;
  minBottomHeight?: number;
  maxBottomHeight?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const TopRow = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

interface PanelProps {
  $width?: number;
  $height?: number;
}

const LeftPanelWrapper = styled.div<PanelProps>`
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  overflow: hidden;
`;

const CenterPanelWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const RightPanelWrapper = styled.div<PanelProps>`
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  overflow: hidden;
`;

const BottomPanelWrapper = styled.div<PanelProps>`
  height: ${({ $height }) => $height}px;
  flex-shrink: 0;
  overflow: hidden;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface ResizerProps {
  $orientation: 'vertical' | 'horizontal';
  $isResizing: boolean;
}

const Resizer = styled.div<ResizerProps>`
  position: relative;
  flex-shrink: 0;
  background: transparent;
  cursor: ${({ $orientation }) =>
    $orientation === 'vertical' ? 'col-resize' : 'row-resize'};

  ${({ $orientation }) =>
    $orientation === 'vertical'
      ? `
    width: 6px;
    margin: 0 -3px;
    z-index: 10;
  `
      : `
    height: 6px;
    margin: -3px 0;
    z-index: 10;
  `}

  &::before {
    content: '';
    position: absolute;
    ${({ $orientation }) =>
      $orientation === 'vertical'
        ? `
      left: 50%;
      top: 0;
      bottom: 0;
      width: 1px;
      transform: translateX(-50%);
    `
        : `
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      transform: translateY(-50%);
    `}
    background: ${({ theme }) => theme.colors.border};
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  &:hover::before,
  ${({ $isResizing }) => $isResizing && '&::before,'} {
    ${({ $orientation, theme }) =>
      $orientation === 'vertical'
        ? `
      width: 3px;
      background: ${theme.colors.primary};
      box-shadow: 0 0 8px ${theme.colors.primary}80;
    `
        : `
      height: 3px;
      background: ${theme.colors.primary};
      box-shadow: 0 0 8px ${theme.colors.primary}80;
    `}
  }

  &::after {
    content: '';
    position: absolute;
    ${({ $orientation }) =>
      $orientation === 'vertical'
        ? `
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 4px;
      height: 24px;
    `
        : `
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 4px;
    `}
    background: ${({ theme }) => theme.colors.textMuted}40;
    border-radius: 2px;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }

  &:hover::after {
    opacity: 1;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const MainGrid: React.FC<MainGridProps> = ({
  leftPanel,
  centerPanel,
  rightPanel,
  bottomPanel,
  leftWidth: controlledLeftWidth,
  rightWidth: controlledRightWidth,
  bottomHeight: controlledBottomHeight,
  onLeftWidthChange,
  onRightWidthChange,
  onBottomHeightChange,
  minLeftWidth = 200,
  maxLeftWidth = 400,
  minRightWidth = 200,
  maxRightWidth = 400,
  minBottomHeight = 100,
  maxBottomHeight = 400,
}) => {
  const [leftWidth, setLeftWidth] = useState(controlledLeftWidth ?? 280);
  const [rightWidth, setRightWidth] = useState(controlledRightWidth ?? 280);
  const [bottomHeight, setBottomHeight] = useState(controlledBottomHeight ?? 200);
  const [resizing, setResizing] = useState<'left' | 'right' | 'bottom' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentLeftWidth = controlledLeftWidth ?? leftWidth;
  const currentRightWidth = controlledRightWidth ?? rightWidth;
  const currentBottomHeight = controlledBottomHeight ?? bottomHeight;

  const handleMouseDown = useCallback((resizer: 'left' | 'right' | 'bottom') => {
    setResizing(resizer);
  }, []);

  const handleMouseUp = useCallback(() => {
    setResizing(null);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      if (resizing === 'left') {
        const newWidth = Math.min(
          maxLeftWidth,
          Math.max(minLeftWidth, e.clientX - rect.left)
        );
        if (onLeftWidthChange) {
          onLeftWidthChange(newWidth);
        } else {
          setLeftWidth(newWidth);
        }
      } else if (resizing === 'right') {
        const newWidth = Math.min(
          maxRightWidth,
          Math.max(minRightWidth, rect.right - e.clientX)
        );
        if (onRightWidthChange) {
          onRightWidthChange(newWidth);
        } else {
          setRightWidth(newWidth);
        }
      } else if (resizing === 'bottom') {
        const newHeight = Math.min(
          maxBottomHeight,
          Math.max(minBottomHeight, rect.bottom - e.clientY)
        );
        if (onBottomHeightChange) {
          onBottomHeightChange(newHeight);
        } else {
          setBottomHeight(newHeight);
        }
      }
    },
    [
      resizing,
      minLeftWidth,
      maxLeftWidth,
      minRightWidth,
      maxRightWidth,
      minBottomHeight,
      maxBottomHeight,
      onLeftWidthChange,
      onRightWidthChange,
      onBottomHeightChange,
    ]
  );

  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor =
        resizing === 'bottom' ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizing, handleMouseMove, handleMouseUp]);

  return (
    <GridWrapper ref={containerRef}>
      <TopRow>
        {leftPanel && (
          <>
            <LeftPanelWrapper $width={currentLeftWidth}>
              {leftPanel}
            </LeftPanelWrapper>
            <Resizer
              $orientation="vertical"
              $isResizing={resizing === 'left'}
              onMouseDown={() => handleMouseDown('left')}
            />
          </>
        )}

        <CenterPanelWrapper>{centerPanel}</CenterPanelWrapper>

        {rightPanel && (
          <>
            <Resizer
              $orientation="vertical"
              $isResizing={resizing === 'right'}
              onMouseDown={() => handleMouseDown('right')}
            />
            <RightPanelWrapper $width={currentRightWidth}>
              {rightPanel}
            </RightPanelWrapper>
          </>
        )}
      </TopRow>

      {bottomPanel && (
        <>
          <Resizer
            $orientation="horizontal"
            $isResizing={resizing === 'bottom'}
            onMouseDown={() => handleMouseDown('bottom')}
          />
          <BottomPanelWrapper $height={currentBottomHeight}>
            {bottomPanel}
          </BottomPanelWrapper>
        </>
      )}
    </GridWrapper>
  );
};

export default MainGrid;

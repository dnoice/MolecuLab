/**
 * ============================================================================
 * MolecularViewer Component
 * 3D molecular visualization with Three.js integration
 * ============================================================================
 */
import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Atom {
  id: string;
  element: string;
  position: { x: number; y: number; z: number };
  color?: string;
  radius?: number;
}

export interface Bond {
  id: string;
  atom1Id: string;
  atom2Id: string;
  order: 1 | 2 | 3;
}

export interface Molecule {
  id: string;
  name: string;
  atoms: Atom[];
  bonds: Bond[];
}

export type RenderMode = 'ball-stick' | 'space-fill' | 'wireframe' | 'stick';

export interface MolecularViewerProps {
  molecule?: Molecule;
  renderMode?: RenderMode;
  showLabels?: boolean;
  showBonds?: boolean;
  backgroundColor?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  onAtomClick?: (atom: Atom) => void;
  onAtomHover?: (atom: Atom | null) => void;
  onZoomChange?: (zoom: number) => void;
  className?: string;
}

export interface MolecularViewerRef {
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  toggleAutoRotate: () => void;
  exportImage: (format: 'png' | 'svg') => void;
  focusAtom: (atomId: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const ViewerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgDeep};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      ${({ theme }) => theme.colors.primary}08 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
`;

const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${({ theme }) => theme.colors.primary}40,
    transparent
  );
  animation: ${scanline} 4s linear infinite;
  opacity: 0.5;
`;

const CornerBracket = styled.div<{ $position: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: ${({ theme }) => theme.colors.primary}60;
  border-style: solid;
  border-width: 0;

  ${({ $position }) => {
    switch ($position) {
      case 'tl':
        return `
          top: 8px;
          left: 8px;
          border-top-width: 2px;
          border-left-width: 2px;
        `;
      case 'tr':
        return `
          top: 8px;
          right: 8px;
          border-top-width: 2px;
          border-right-width: 2px;
        `;
      case 'bl':
        return `
          bottom: 8px;
          left: 8px;
          border-bottom-width: 2px;
          border-left-width: 2px;
        `;
      case 'br':
        return `
          bottom: 8px;
          right: 8px;
          border-bottom-width: 2px;
          border-right-width: 2px;
        `;
    }
  }}
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${({ theme }) => theme.colors.primary}08 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.colors.primary}08 1px, transparent 1px);
  background-size: 40px 40px;
  animation: ${glowPulse} 3s ease-in-out infinite;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgDeep}ee;
  z-index: 10;
`;

const LoadingText = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-top: ${({ theme }) => theme.spacing['4']};
`;

const EmptyState = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['4']};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.5;
  }
`;

const EmptyText = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  max-width: 240px;
`;

const HoveredAtomLabel = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  transform: translate(-50%, -100%) translateY(-12px);
  padding: ${({ theme }) => `${theme.spacing['1']} ${theme.spacing['2']}`};
  background: ${({ theme }) => theme.glass.dark};
  border: 1px solid ${({ theme }) => theme.colors.primary}60;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  pointer-events: none;
  z-index: 20;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${({ theme }) => theme.colors.primary}60;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const MolecularViewer = forwardRef<MolecularViewerRef, MolecularViewerProps>(
  (
    {
      molecule,
      renderMode = 'ball-stick',
      showLabels = false,
      showBonds = true,
      backgroundColor,
      autoRotate = false,
      // rotationSpeed - reserved for Three.js integration
      onAtomClick,
      onAtomHover,
      onZoomChange,
      className,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading] = useState(false);
    const [hoveredAtom, setHoveredAtom] = useState<{ atom: Atom; x: number; y: number } | null>(null);
    const [zoom, setZoom] = useState(100);
    const [, setIsAutoRotating] = useState(autoRotate);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        setZoom(100);
        onZoomChange?.(100);
        // Reset rotation would be done with Three.js
      },
      zoomIn: () => {
        const newZoom = Math.min(400, zoom + 25);
        setZoom(newZoom);
        onZoomChange?.(newZoom);
      },
      zoomOut: () => {
        const newZoom = Math.max(25, zoom - 25);
        setZoom(newZoom);
        onZoomChange?.(newZoom);
      },
      toggleAutoRotate: () => {
        setIsAutoRotating((prev) => !prev);
      },
      exportImage: (format: 'png' | 'svg') => {
        // Export logic would be implemented with Three.js
        console.log(`Exporting as ${format}`);
      },
      focusAtom: (atomId: string) => {
        const atom = molecule?.atoms.find((a) => a.id === atomId);
        if (atom) {
          // Focus camera on atom with Three.js
          console.log(`Focusing on atom ${atomId}`);
        }
      },
    }));

    // Canvas 2D rendering (placeholder for Three.js)
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !molecule) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Clear canvas
      ctx.fillStyle = backgroundColor || '#0a0a0f';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Simple 2D projection of atoms (placeholder)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const scale = (zoom / 100) * 30;

      // Draw bonds
      if (showBonds) {
        molecule.bonds.forEach((bond) => {
          const atom1 = molecule.atoms.find((a) => a.id === bond.atom1Id);
          const atom2 = molecule.atoms.find((a) => a.id === bond.atom2Id);
          if (!atom1 || !atom2) return;

          const x1 = centerX + atom1.position.x * scale;
          const y1 = centerY + atom1.position.y * scale;
          const x2 = centerX + atom2.position.x * scale;
          const y2 = centerY + atom2.position.y * scale;

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = bond.order * 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
      }

      // Draw atoms
      molecule.atoms.forEach((atom) => {
        const x = centerX + atom.position.x * scale;
        const y = centerY + atom.position.y * scale;
        const radius = (atom.radius || 1) * scale * 0.3;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, atom.color || '#00f5ff');
        gradient.addColorStop(0.5, `${atom.color || '#00f5ff'}80`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Atom sphere
        ctx.fillStyle = atom.color || '#00f5ff';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        if (showLabels) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(atom.element, x, y + radius + 12);
        }
      });
    }, [molecule, zoom, showLabels, showBonds, backgroundColor, renderMode]);

    // Handle mouse move for hover detection
    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!molecule || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const scale = (zoom / 100) * 30;

        // Find hovered atom
        let foundAtom: Atom | null = null;
        for (const atom of molecule.atoms) {
          const ax = centerX + atom.position.x * scale;
          const ay = centerY + atom.position.y * scale;
          const radius = (atom.radius || 1) * scale * 0.3;
          const distance = Math.sqrt((x - ax) ** 2 + (y - ay) ** 2);
          if (distance <= radius * 1.5) {
            foundAtom = atom;
            break;
          }
        }

        if (foundAtom) {
          const ax = centerX + foundAtom.position.x * scale;
          const ay = centerY + foundAtom.position.y * scale;
          setHoveredAtom({ atom: foundAtom, x: ax, y: ay });
          onAtomHover?.(foundAtom);
        } else {
          setHoveredAtom(null);
          onAtomHover?.(null);
        }
      },
      [molecule, zoom, onAtomHover]
    );

    // Handle click
    const handleClick = useCallback(() => {
      if (hoveredAtom) {
        onAtomClick?.(hoveredAtom.atom);
      }
    }, [hoveredAtom, onAtomClick]);

    const isEmpty = !molecule || molecule.atoms.length === 0;

    return (
      <ViewerWrapper className={className}>
        <GridOverlay />
        <Canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        />
        <Overlay>
          <Scanline />
          <CornerBracket $position="tl" />
          <CornerBracket $position="tr" />
          <CornerBracket $position="bl" />
          <CornerBracket $position="br" />
        </Overlay>

        {isLoading && (
          <LoadingOverlay>
            <LoadingText>Rendering Molecule...</LoadingText>
          </LoadingOverlay>
        )}

        {isEmpty && !isLoading && (
          <EmptyState>
            <EmptyIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <circle cx="4" cy="8" r="2" />
                <circle cx="20" cy="8" r="2" />
                <circle cx="12" cy="20" r="2" />
                <path d="M9 10l-3-1M15 10l3-1M12 15v3" />
              </svg>
            </EmptyIcon>
            <EmptyText>
              No molecule loaded. Search for a compound or import a file to get started.
            </EmptyText>
          </EmptyState>
        )}

        {hoveredAtom && (
          <HoveredAtomLabel $x={hoveredAtom.x} $y={hoveredAtom.y}>
            {hoveredAtom.atom.element} ({hoveredAtom.atom.id})
          </HoveredAtomLabel>
        )}
      </ViewerWrapper>
    );
  }
);

MolecularViewer.displayName = 'MolecularViewer';

export default MolecularViewer;

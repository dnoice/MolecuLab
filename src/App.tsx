/**
 * ============================================================================
 * MolecuLab - Root Application Component
 * Quantum Molecular Design Studio
 * ============================================================================
 */
import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Header, Footer, Sidebar, type SidebarSection } from './components/layout';
import {
  MolecularViewer,
  ViewerControls,
  MoleculeSelector,
  type MolecularViewerRef,
  type RenderMode,
  type Molecule,
  type Element,
} from './components/viewer';

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════════════════════

const SAMPLE_ELEMENTS: Element[] = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, atomicMass: 1.008, category: 'nonmetal', color: '#ffffff' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, atomicMass: 12.011, category: 'nonmetal', color: '#00ffcc' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, atomicMass: 14.007, category: 'nonmetal', color: '#3366ff' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, atomicMass: 15.999, category: 'nonmetal', color: '#ff3366' },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, atomicMass: 18.998, category: 'halogen', color: '#90e050' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, atomicMass: 22.990, category: 'alkali-metal', color: '#ff8800' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, atomicMass: 24.305, category: 'alkaline-earth', color: '#ffd700' },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, atomicMass: 30.974, category: 'nonmetal', color: '#ff8800' },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, atomicMass: 32.065, category: 'nonmetal', color: '#ffd700' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, atomicMass: 35.453, category: 'halogen', color: '#1ff01f' },
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, atomicMass: 39.098, category: 'alkali-metal', color: '#ff8800' },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, atomicMass: 40.078, category: 'alkaline-earth', color: '#ffd700' },
  { symbol: 'Fe', name: 'Iron', atomicNumber: 26, atomicMass: 55.845, category: 'transition-metal', color: '#3366ff' },
  { symbol: 'Cu', name: 'Copper', atomicNumber: 29, atomicMass: 63.546, category: 'transition-metal', color: '#ff8800' },
  { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, atomicMass: 65.38, category: 'transition-metal', color: '#9933ff' },
  { symbol: 'Br', name: 'Bromine', atomicNumber: 35, atomicMass: 79.904, category: 'halogen', color: '#a62929' },
  { symbol: 'I', name: 'Iodine', atomicNumber: 53, atomicMass: 126.90, category: 'halogen', color: '#940094' },
];

// Sample water molecule
const SAMPLE_MOLECULE: Molecule = {
  id: 'h2o',
  name: 'Water (H₂O)',
  atoms: [
    { id: 'O1', element: 'O', position: { x: 0, y: 0, z: 0 }, color: '#ff3366', radius: 1.52 },
    { id: 'H1', element: 'H', position: { x: -1.5, y: 1, z: 0 }, color: '#ffffff', radius: 1.2 },
    { id: 'H2', element: 'H', position: { x: 1.5, y: 1, z: 0 }, color: '#ffffff', radius: 1.2 },
  ],
  bonds: [
    { id: 'b1', atom1Id: 'O1', atom2Id: 'H1', order: 1 },
    { id: 'b2', atom1Id: 'O1', atom2Id: 'H2', order: 1 },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR ICONS
// ═══════════════════════════════════════════════════════════════════════════

const ElementsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="6" height="6" rx="1" />
    <rect x="12" y="2" width="6" height="6" rx="1" />
    <rect x="2" y="12" width="6" height="6" rx="1" />
    <rect x="12" y="12" width="6" height="6" rx="1" />
  </svg>
);

const ControlsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="10" cy="10" r="7" />
    <path d="M10 6v4l2.5 2.5" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="10" cy="10" r="7" />
    <path d="M10 9v4M10 7v.01" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const gridScroll = keyframes`
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgDeep};
  color: ${({ theme }) => theme.colors.textPrimary};
  position: relative;
  overflow: hidden;
`;

const BackgroundEffects = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 80%, rgba(0, 245, 255, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(255, 0, 255, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 60%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: ${gridScroll} 20s linear infinite;
  }
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  z-index: 1;
  overflow: hidden;
`;

const ViewerArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing['4']};
  gap: ${({ theme }) => theme.spacing['4']};
  overflow: hidden;
`;

const ViewerWrapper = styled.div`
  flex: 1;
  min-height: 0;
`;

const MoleculeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => theme.spacing['3']};
  background: ${({ theme }) => theme.glass.dark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const MoleculeLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const App: React.FC = () => {
  const viewerRef = useRef<MolecularViewerRef>(null);

  // Viewer state
  const [renderMode, setRenderMode] = useState<RenderMode>('ball-stick');
  const [showLabels, setShowLabels] = useState(false);
  const [showBonds, setShowBonds] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('elements');

  // Element selection
  const [selectedElement, setSelectedElement] = useState<Element | undefined>();

  // Current molecule
  const [molecule] = useState<Molecule>(SAMPLE_MOLECULE);

  // Sidebar sections
  const sidebarSections: SidebarSection[] = [
    {
      id: 'elements',
      title: 'Elements',
      icon: <ElementsIcon />,
      content: (
        <MoleculeSelector
          elements={SAMPLE_ELEMENTS}
          selectedElement={selectedElement}
          onElementSelect={setSelectedElement}
        />
      ),
    },
    {
      id: 'controls',
      title: 'View Controls',
      icon: <ControlsIcon />,
      content: (
        <ViewerControls
          renderMode={renderMode}
          onRenderModeChange={setRenderMode}
          showLabels={showLabels}
          onShowLabelsChange={setShowLabels}
          showBonds={showBonds}
          onShowBondsChange={setShowBonds}
          autoRotate={autoRotate}
          onAutoRotateChange={setAutoRotate}
          onZoomIn={() => viewerRef.current?.zoomIn()}
          onZoomOut={() => viewerRef.current?.zoomOut()}
          onResetCamera={() => viewerRef.current?.resetCamera()}
        />
      ),
    },
    {
      id: 'info',
      title: 'Molecule Info',
      icon: <InfoIcon />,
      content: (
        <div style={{ padding: '12px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontSize: '12px' }}>
          <p><strong>Name:</strong> {molecule.name}</p>
          <p><strong>Atoms:</strong> {molecule.atoms.length}</p>
          <p><strong>Bonds:</strong> {molecule.bonds.length}</p>
          <p><strong>Formula:</strong> H₂O</p>
          <p><strong>Molecular Weight:</strong> 18.015 g/mol</p>
        </div>
      ),
    },
  ];

  return (
    <AppContainer>
      <BackgroundEffects />

      <Header
        moleculeName={molecule.name}
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <MainLayout>
        <Sidebar
          sections={sidebarSections}
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <ViewerArea>
          <ViewerWrapper>
            <MolecularViewer
              ref={viewerRef}
              molecule={molecule}
              renderMode={renderMode}
              showLabels={showLabels}
              showBonds={showBonds}
              autoRotate={autoRotate}
              onZoomChange={setZoomLevel}
            />
          </ViewerWrapper>

          <MoleculeInfo>
            <MoleculeLabel>
              <strong>Molecule:</strong> {molecule.name}
            </MoleculeLabel>
            <MoleculeLabel>
              <strong>Atoms:</strong> {molecule.atoms.length}
            </MoleculeLabel>
            <MoleculeLabel>
              <strong>Bonds:</strong> {molecule.bonds.length}
            </MoleculeLabel>
            {selectedElement && (
              <MoleculeLabel>
                <strong>Selected:</strong> {selectedElement.name} ({selectedElement.symbol})
              </MoleculeLabel>
            )}
          </MoleculeInfo>
        </ViewerArea>
      </MainLayout>

      <Footer
        atomCount={molecule.atoms.length}
        bondCount={molecule.bonds.length}
        zoomLevel={zoomLevel}
        renderMode={renderMode === 'ball-stick' ? 'Ball & Stick' : renderMode}
        onZoomChange={setZoomLevel}
      />
    </AppContainer>
  );
};

export default App;

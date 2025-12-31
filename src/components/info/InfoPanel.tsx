/**
 * ============================================================================
 * InfoPanel Component
 * Display comprehensive molecule information and properties
 * ============================================================================
 */
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { GlassPanel } from '../common';
import type { Molecule } from '../viewer';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface InfoPanelProps {
  molecule?: Molecule;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const PanelWrapper = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => theme.spacing['4']};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const Title = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.1em;

  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 14px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
    margin-right: ${({ theme }) => theme.spacing['2']};
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing['3']};
`;

const PropertyCard = styled.div`
  padding: ${({ theme }) => theme.spacing['3']};
  background: ${({ theme }) => theme.glass.subtle};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const PropertyLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing['1']};
`;

const PropertyValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const PropertyUnit = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  margin-left: ${({ theme }) => theme.spacing['1']};
`;

const MoleculeNameDisplay = styled.div`
  padding: ${({ theme }) => theme.spacing['3']};
  background: ${({ theme }) => theme.glass.subtle};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const MoleculeName = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  word-break: break-word;
`;

const Formula = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing['2']};

  sub {
    font-size: 0.7em;
  }
`;

const ElementsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['1']};
`;

interface ElementBadgeProps {
  $color: string;
}

const ElementBadge = styled.span<ElementBadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  padding: ${({ theme }) => `${theme.spacing['1']} ${theme.spacing['2']}`};
  background: ${({ $color }) => `${$color}20`};
  border: 1px solid ${({ $color }) => `${$color}60`};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $color }) => $color};
`;

const ElementCount = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['8']};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyText = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0;
`;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const ELEMENT_COLORS: Record<string, string> = {
  H: '#ffffff',
  C: '#00ffcc',
  N: '#3366ff',
  O: '#ff3366',
  S: '#ffd700',
  P: '#ff8800',
  F: '#90e050',
  Cl: '#1ff01f',
  Br: '#a62929',
  I: '#940094',
};

const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  S: 32.065,
  P: 30.974,
  F: 18.998,
  Cl: 35.453,
  Br: 79.904,
  I: 126.90,
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function formatFormula(elementCounts: Record<string, number>): React.ReactNode {
  // Standard order: C, H, then alphabetical
  const order = ['C', 'H'];
  const rest = Object.keys(elementCounts)
    .filter((e) => !order.includes(e))
    .sort();

  return [...order, ...rest]
    .filter((e) => elementCounts[e])
    .map((element) => {
      const count = elementCounts[element];
      return (
        <React.Fragment key={element}>
          {element}
          {count > 1 && <sub>{count}</sub>}
        </React.Fragment>
      );
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const InfoPanel: React.FC<InfoPanelProps> = ({ molecule, className }) => {
  const stats = useMemo(() => {
    if (!molecule) return null;

    // Count elements
    const elementCounts: Record<string, number> = {};
    for (const atom of molecule.atoms) {
      elementCounts[atom.element] = (elementCounts[atom.element] || 0) + 1;
    }

    // Calculate molecular weight
    let molecularWeight = 0;
    for (const [element, count] of Object.entries(elementCounts)) {
      molecularWeight += (ATOMIC_MASSES[element] || 0) * count;
    }

    // Count bond types
    const singleBonds = molecule.bonds.filter((b) => b.order === 1).length;
    const doubleBonds = molecule.bonds.filter((b) => b.order === 2).length;
    const tripleBonds = molecule.bonds.filter((b) => b.order === 3).length;

    return {
      elementCounts,
      molecularWeight,
      uniqueElements: Object.keys(elementCounts).length,
      singleBonds,
      doubleBonds,
      tripleBonds,
    };
  }, [molecule]);

  if (!molecule) {
    return (
      <PanelWrapper className={className} variant="dark">
        <Header>
          <Title>Molecule Info</Title>
        </Header>
        <EmptyState>
          <EmptyText>No molecule loaded</EmptyText>
        </EmptyState>
      </PanelWrapper>
    );
  }

  return (
    <PanelWrapper className={className} variant="dark">
      <Header>
        <Title>Molecule Info</Title>
      </Header>

      <MoleculeNameDisplay>
        <MoleculeName>{molecule.name}</MoleculeName>
        {stats && (
          <Formula>{formatFormula(stats.elementCounts)}</Formula>
        )}
      </MoleculeNameDisplay>

      <Section>
        <SectionTitle>Properties</SectionTitle>
        <PropertyGrid>
          <PropertyCard>
            <PropertyLabel>Atoms</PropertyLabel>
            <PropertyValue>{molecule.atoms.length}</PropertyValue>
          </PropertyCard>
          <PropertyCard>
            <PropertyLabel>Bonds</PropertyLabel>
            <PropertyValue>{molecule.bonds.length}</PropertyValue>
          </PropertyCard>
          <PropertyCard>
            <PropertyLabel>Elements</PropertyLabel>
            <PropertyValue>{stats?.uniqueElements || 0}</PropertyValue>
          </PropertyCard>
          <PropertyCard>
            <PropertyLabel>Mol. Weight</PropertyLabel>
            <PropertyValue>
              {stats?.molecularWeight.toFixed(2)}
              <PropertyUnit>g/mol</PropertyUnit>
            </PropertyValue>
          </PropertyCard>
        </PropertyGrid>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Composition</SectionTitle>
        <ElementsGrid>
          {stats &&
            Object.entries(stats.elementCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([element, count]) => (
                <ElementBadge
                  key={element}
                  $color={ELEMENT_COLORS[element] || '#888888'}
                >
                  {element}
                  <ElementCount>×{count}</ElementCount>
                </ElementBadge>
              ))}
        </ElementsGrid>
      </Section>

      {stats && (stats.doubleBonds > 0 || stats.tripleBonds > 0) && (
        <>
          <Divider />
          <Section>
            <SectionTitle>Bond Types</SectionTitle>
            <ElementsGrid>
              {stats.singleBonds > 0 && (
                <ElementBadge $color="#00f5ff">
                  Single <ElementCount>×{stats.singleBonds}</ElementCount>
                </ElementBadge>
              )}
              {stats.doubleBonds > 0 && (
                <ElementBadge $color="#ff00ff">
                  Double <ElementCount>×{stats.doubleBonds}</ElementCount>
                </ElementBadge>
              )}
              {stats.tripleBonds > 0 && (
                <ElementBadge $color="#ffd700">
                  Triple <ElementCount>×{stats.tripleBonds}</ElementCount>
                </ElementBadge>
              )}
            </ElementsGrid>
          </Section>
        </>
      )}
    </PanelWrapper>
  );
};

export default InfoPanel;

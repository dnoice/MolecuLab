/**
 * ============================================================================
 * CompoundCard Component
 * Display card for PubChem compound search results
 * ============================================================================
 */
import React from 'react';
import styled from 'styled-components';
import { GlassCard, Button, Loader } from '../common';
import type { PubChemCompound } from './usePubChem';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CompoundCardProps {
  compound: PubChemCompound;
  onSelect: (cid: number) => void;
  isLoading?: boolean;
  isSelected?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const CardWrapper = styled(GlassCard)<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing['3']};
  cursor: pointer;

  ${({ $isSelected, theme }) =>
    $isSelected &&
    `
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 12px ${theme.colors.primary}40;
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const CidBadge = styled.span`
  padding: ${({ theme }) => `${theme.spacing['0.5']} ${theme.spacing['2']}`};
  background: ${({ theme }) => theme.colors.primary}20;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const CompoundName = styled.h4`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
  flex: 1;

  /* Limit to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PropertiesRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['4']};
  margin-bottom: ${({ theme }) => theme.spacing['3']};
`;

const Property = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PropertyLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PropertyValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Formula = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.secondary};

  sub {
    font-size: 0.7em;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function formatFormula(formula: string): React.ReactNode {
  // Convert numbers to subscripts
  return formula.split(/(\d+)/).map((part, i) => {
    if (/^\d+$/.test(part)) {
      return <sub key={i}>{part}</sub>;
    }
    return part;
  });
}

function formatMass(mass: number): string {
  return `${mass.toFixed(2)} g/mol`;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const CompoundCard: React.FC<CompoundCardProps> = ({
  compound,
  onSelect,
  isLoading = false,
  isSelected = false,
  className,
}) => {
  const handleClick = () => {
    if (!isLoading) {
      onSelect(compound.cid);
    }
  };

  return (
    <CardWrapper
      $isSelected={isSelected}
      onClick={handleClick}
      className={className}
      interactive
    >
      <CardHeader>
        <CompoundName>{compound.iupacName || compound.name}</CompoundName>
        <CidBadge>CID {compound.cid}</CidBadge>
      </CardHeader>

      <PropertiesRow>
        <Property>
          <PropertyLabel>Formula</PropertyLabel>
          <Formula>{formatFormula(compound.molecularFormula)}</Formula>
        </Property>
        <Property>
          <PropertyLabel>Mass</PropertyLabel>
          <PropertyValue>{formatMass(compound.molecularWeight)}</PropertyValue>
        </Property>
      </PropertiesRow>

      <Actions>
        {isLoading ? (
          <Loader variant="dots" size="sm" />
        ) : (
          <Button variant="primary" size="sm" onClick={handleClick}>
            Load Molecule
          </Button>
        )}
      </Actions>
    </CardWrapper>
  );
};

export default CompoundCard;

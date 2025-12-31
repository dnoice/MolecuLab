/**
 * ============================================================================
 * MoleculeSelector Component
 * Element palette and molecule building tools
 * ============================================================================
 */
import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { GlassPanel, SearchInput, Tooltip } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  category: ElementCategory;
  color: string;
}

export type ElementCategory =
  | 'nonmetal'
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'metalloid'
  | 'halogen'
  | 'transition-metal'
  | 'post-transition'
  | 'lanthanide'
  | 'actinide';

export interface MoleculeSelectorProps {
  title?: string;
  elements: Element[];
  selectedElement?: Element;
  onElementSelect: (element: Element) => void;
  recentElements?: Element[];
  favorites?: Element[];
  onAddFavorite?: (element: Element) => void;
  onRemoveFavorite?: (element: Element) => void;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 rgba(0, 245, 255, 0); }
  50% { box-shadow: 0 0 12px rgba(0, 245, 255, 0.4); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const SelectorWrapper = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => theme.spacing['4']};
  max-height: 100%;
  overflow: hidden;
`;

const MainTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: ${({ theme }) => theme.spacing['3']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchWrapper = styled.div`
  flex-shrink: 0;
  width: 100%;

  /* Override SearchInput styles to fit container */
  > div {
    width: 100% !important;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme }) => theme.colors.border},
    transparent
  );
`;

// Category chips styling
const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['2']};
`;

interface CategoryChipProps {
  $color: string;
  $isActive: boolean;
}

const CategoryChip = styled.button<CategoryChipProps>`
  padding: ${({ theme }) => `${theme.spacing['1']} ${theme.spacing['3']}`};
  background: ${({ $isActive, $color }) => ($isActive ? `${$color}20` : 'rgba(255, 255, 255, 0.03)')};
  border: 1px solid ${({ $isActive, $color, theme }) =>
    $isActive ? $color : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  color: ${({ $isActive, $color, theme }) =>
    $isActive ? $color : theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: capitalize;
  white-space: nowrap;

  &:hover {
    background: ${({ $color }) => `${$color}15`};
    border-color: ${({ $color }) => `${$color}80`};
    color: ${({ $color }) => $color};
  }

  &:active {
    transform: scale(0.97);
  }
`;

// Elements grid styling
const ElementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing['2']};
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing['1']};

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;

    &:hover {
      background: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

interface ElementTileProps {
  $color: string;
  $isSelected: boolean;
}

const ElementTile = styled.button<ElementTileProps>`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: ${({ theme }) => theme.spacing['1']};
  background: ${({ $color }) => `${$color}10`};
  border: 1px solid ${({ $color, $isSelected }) => ($isSelected ? $color : `${$color}30`)};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $isSelected, $color }) =>
    $isSelected &&
    `
    background: ${$color}25;
    box-shadow: 0 0 12px ${$color}40, inset 0 0 8px ${$color}20;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}

  &:hover {
    background: ${({ $color }) => `${$color}20`};
    border-color: ${({ $color }) => `${$color}80`};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const ElementNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1;
`;

const ElementSymbol = styled.span<{ $color: string }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $color }) => $color};
  line-height: 1;
`;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_COLORS: Record<ElementCategory, string> = {
  nonmetal: '#00f5ff',
  'noble-gas': '#ff00ff',
  'alkali-metal': '#ff8800',
  'alkaline-earth': '#ffd700',
  metalloid: '#00ff88',
  halogen: '#ff3366',
  'transition-metal': '#3366ff',
  'post-transition': '#9933ff',
  lanthanide: '#ff6600',
  actinide: '#cc0066',
};

const CATEGORY_LABELS: Record<ElementCategory, string> = {
  nonmetal: 'Nonmetal',
  'noble-gas': 'Noble Gas',
  'alkali-metal': 'Alkali',
  'alkaline-earth': 'Alkaline',
  metalloid: 'Metalloid',
  halogen: 'Halogen',
  'transition-metal': 'Transition',
  'post-transition': 'Post-Trans',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  title = 'Elements',
  elements,
  selectedElement,
  onElementSelect,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(elements.map((el) => el.category));
    return Array.from(cats);
  }, [elements]);

  // Filter elements
  const filteredElements = useMemo(() => {
    return elements.filter((el) => {
      const matchesSearch =
        !searchQuery ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || el.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [elements, searchQuery, selectedCategory]);

  const handleElementClick = (element: Element) => {
    onElementSelect(element);
  };

  return (
    <SelectorWrapper className={className} variant="dark">
      {title && <MainTitle>{title}</MainTitle>}

      <SearchWrapper>
        <SearchInput
          placeholder="Search elements..."
          value={searchQuery}
          onChange={setSearchQuery}
          fullWidth
        />
      </SearchWrapper>

      <Divider />

      <Section>
        <SectionTitle>Categories</SectionTitle>
        <CategoryFilter>
          <CategoryChip
            $color="#00f5ff"
            $isActive={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </CategoryChip>
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              $color={CATEGORY_COLORS[cat]}
              $isActive={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {CATEGORY_LABELS[cat] || cat.replace('-', ' ')}
            </CategoryChip>
          ))}
        </CategoryFilter>
      </Section>

      <Divider />

      <Section style={{ flex: 1, overflow: 'hidden' }}>
        <SectionTitle>
          Elements ({filteredElements.length})
        </SectionTitle>
        <ElementsGrid>
          {filteredElements.map((element) => (
            <Tooltip
              key={element.symbol}
              content={`${element.name} (${element.atomicMass.toFixed(2)})`}
              placement="top"
            >
              <ElementTile
                $color={element.color}
                $isSelected={selectedElement?.symbol === element.symbol}
                onClick={() => handleElementClick(element)}
              >
                <ElementNumber>{element.atomicNumber}</ElementNumber>
                <ElementSymbol $color={element.color}>{element.symbol}</ElementSymbol>
              </ElementTile>
            </Tooltip>
          ))}
        </ElementsGrid>
      </Section>
    </SelectorWrapper>
  );
};

export default MoleculeSelector;

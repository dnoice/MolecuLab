/**
 * ============================================================================
 * MoleculeSelector Component
 * Element palette and molecule building tools
 * ============================================================================
 */
import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { GlassPanel, SearchInput, Chip, Tooltip } from '../common';

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
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['3']};
  max-height: 100%;
  overflow: hidden;
`;

const SearchWrapper = styled.div`
  flex-shrink: 0;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const ElementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: ${({ theme }) => theme.spacing['1']};
  flex: 1;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing['1']};

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
  background: ${({ $color }) => `${$color}15`};
  border: 1px solid ${({ $color, $isSelected }) => ($isSelected ? $color : `${$color}40`)};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $isSelected, $color }) =>
    $isSelected &&
    `
    background: ${$color}30;
    box-shadow: 0 0 12px ${$color}60;
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}

  &:hover {
    background: ${({ $color }) => `${$color}25`};
    border-color: ${({ $color }) => $color};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ElementSymbol = styled.span<{ $color: string }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $color }) => $color};
  line-height: 1;
`;

const ElementNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1;
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['1']};
`;

interface CategoryChipProps {
  $color: string;
  $isActive: boolean;
}

const CategoryChip = styled.button<CategoryChipProps>`
  padding: ${({ theme }) => `${theme.spacing['0.5']} ${theme.spacing['2']}`};
  background: ${({ $isActive, $color }) => ($isActive ? `${$color}20` : 'transparent')};
  border: 1px solid ${({ $isActive, $color, theme }) =>
    $isActive ? $color : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $isActive, $color, theme }) =>
    $isActive ? $color : theme.colors.textMuted};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-transform: capitalize;

  &:hover {
    background: ${({ $color }) => `${$color}15`};
    border-color: ${({ $color }) => $color};
    color: ${({ $color }) => $color};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
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

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const MoleculeSelector: React.FC<MoleculeSelectorProps> = ({
  elements,
  selectedElement,
  onElementSelect,
  recentElements = [],
  favorites = [],
  onAddFavorite,
  onRemoveFavorite,
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

  const isFavorite = (element: Element) =>
    favorites.some((f) => f.symbol === element.symbol);

  const handleElementClick = (element: Element) => {
    onElementSelect(element);
  };

  const handleFavoriteToggle = (element: Element, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(element)) {
      onRemoveFavorite?.(element);
    } else {
      onAddFavorite?.(element);
    }
  };

  return (
    <SelectorWrapper className={className} variant="dark">
      <SearchWrapper>
        <SearchInput
          placeholder="Search elements..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </SearchWrapper>

      {recentElements.length > 0 && (
        <Section>
          <SectionTitle>Recent</SectionTitle>
          <ChipsRow>
            {recentElements.slice(0, 6).map((el) => (
              <Chip
                key={el.symbol}
                variant="element"
                onClick={() => handleElementClick(el)}
                selected={selectedElement?.symbol === el.symbol}
              >
                {el.symbol}
              </Chip>
            ))}
          </ChipsRow>
        </Section>
      )}

      {favorites.length > 0 && (
        <Section>
          <SectionTitle>Favorites</SectionTitle>
          <ChipsRow>
            {favorites.map((el) => (
              <Chip
                key={el.symbol}
                variant="element"
                onClick={() => handleElementClick(el)}
                selected={selectedElement?.symbol === el.symbol}
                removable
                onRemove={() => onRemoveFavorite?.(el)}
              >
                {el.symbol}
              </Chip>
            ))}
          </ChipsRow>
        </Section>
      )}

      <Divider />

      <Section>
        <SectionTitle>Categories</SectionTitle>
        <CategoryFilter>
          <CategoryChip
            $color="#ffffff"
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
              {cat.replace('-', ' ')}
            </CategoryChip>
          ))}
        </CategoryFilter>
      </Section>

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
                onDoubleClick={(e) => handleFavoriteToggle(element, e)}
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

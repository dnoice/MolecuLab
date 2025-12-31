/**
 * ============================================================================
 * SearchPanel Component
 * Complete PubChem search panel with input and results
 * ============================================================================
 */
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { GlassPanel, SearchInput, Loader } from '../common';
import { CompoundCard } from './CompoundCard';
import { usePubChem } from './usePubChem';
import type { Molecule } from '../viewer';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SearchPanelProps {
  onMoleculeSelect: (molecule: Molecule) => void;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const PanelWrapper = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing['3']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing['3']};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};

  &::before {
    content: '';
    width: 3px;
    height: 14px;
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 2px;
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.secondary};
  }
`;

const ResultsArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing['3']};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['8']};
  gap: ${({ theme }) => theme.spacing['3']};
`;

const LoadingText = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['8']};
  gap: ${({ theme }) => theme.spacing['3']};
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.secondary}15;
  border: 1px dashed ${({ theme }) => theme.colors.secondary}40;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.secondary};

  svg {
    width: 32px;
    height: 32px;
    opacity: 0.6;
  }
`;

const EmptyTitle = styled.h4`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyText = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 220px;
`;

const ErrorState = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
  border-radius: ${({ theme }) => theme.radius.md};
  text-align: center;
`;

const ErrorText = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`;

const ResultsCount = styled.div`
  padding: ${({ theme }) => theme.spacing['2']} 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const SearchIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="14" cy="14" r="8" />
    <path d="M20 20l6 6" />
    <circle cx="14" cy="14" r="3" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const SearchPanel: React.FC<SearchPanelProps> = ({
  onMoleculeSelect,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [loadingCid, setLoadingCid] = useState<number | null>(null);
  const {
    searchCompounds,
    fetchMolecule,
    results,
    isSearching,
    error,
  } = usePubChem();

  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value);
      if (value.trim().length >= 2) {
        await searchCompounds(value);
      }
    },
    [searchCompounds]
  );

  const handleSubmit = useCallback(
    async (value: string) => {
      if (value.trim()) {
        await searchCompounds(value);
      }
    },
    [searchCompounds]
  );

  const handleCompoundSelect = useCallback(
    async (cid: number) => {
      setLoadingCid(cid);
      const molecule = await fetchMolecule(cid);
      setLoadingCid(null);

      if (molecule) {
        onMoleculeSelect(molecule);
      }
    },
    [fetchMolecule, onMoleculeSelect]
  );

  const hasSearched = query.trim().length >= 2;

  return (
    <PanelWrapper className={className} variant="dark">
      <Header>
        <Title>PubChem Search</Title>
        <SearchInput
          value={query}
          onChange={handleSearch}
          onSubmit={handleSubmit}
          placeholder="Search compounds..."
          loading={isSearching}
        />
      </Header>

      <ResultsArea>
        {isSearching && (
          <LoadingState>
            <Loader variant="orbital" size="lg" />
            <LoadingText>Searching PubChem...</LoadingText>
          </LoadingState>
        )}

        {!isSearching && error && (
          <ErrorState>
            <ErrorText>{error}</ErrorText>
          </ErrorState>
        )}

        {!isSearching && !error && results.length > 0 && (
          <>
            <ResultsCount>{results.length} compounds found</ResultsCount>
            <ResultsList>
              {results.map((compound) => (
                <CompoundCard
                  key={compound.cid}
                  compound={compound}
                  onSelect={handleCompoundSelect}
                  isLoading={loadingCid === compound.cid}
                  isSelected={loadingCid === compound.cid}
                />
              ))}
            </ResultsList>
          </>
        )}

        {!isSearching && !error && results.length === 0 && hasSearched && (
          <EmptyState>
            <EmptyIcon>
              <SearchIcon />
            </EmptyIcon>
            <EmptyTitle>No Results</EmptyTitle>
            <EmptyText>
              No compounds found for "{query}". Try a different search term.
            </EmptyText>
          </EmptyState>
        )}

        {!isSearching && !error && !hasSearched && (
          <EmptyState>
            <EmptyIcon>
              <SearchIcon />
            </EmptyIcon>
            <EmptyTitle>Search PubChem</EmptyTitle>
            <EmptyText>
              Search for molecules by name, formula, or CAS number from the PubChem database.
            </EmptyText>
          </EmptyState>
        )}
      </ResultsArea>
    </PanelWrapper>
  );
};

export default SearchPanel;

/**
 * ============================================================================
 * FileImporter Component
 * Complete file import panel with dropzone, parsing, and preview
 * ============================================================================
 */
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { GlassPanel, Button, Loader } from '../common';
import { FileDropzone } from './FileDropzone';
import { parseFile, type ParseResult, type FileFormat } from './parsers';
import type { Molecule } from '../viewer';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface FileImporterProps {
  onImport: (molecule: Molecule) => void;
  onCancel?: () => void;
  className?: string;
}

interface ImportState {
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: ParseResult;
  fileName?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const ImporterWrapper = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => theme.spacing['4']};
  max-width: 500px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.error}20;
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['6']};
`;

const LoadingText = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PreviewCard = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.glass.subtle};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  margin-bottom: ${({ theme }) => theme.spacing['3']};
`;

const FormatBadge = styled.span<{ $format: FileFormat }>`
  padding: ${({ theme }) => `${theme.spacing['0.5']} ${theme.spacing['2']}`};
  background: ${({ $format, theme }) => {
    switch ($format) {
      case 'mol':
        return theme.colors.primary;
      case 'pdb':
        return theme.colors.secondary;
      case 'xyz':
        return theme.colors.success;
      case 'sdf':
        return theme.colors.warning;
      default:
        return theme.colors.textMuted;
    }
  }}20;
  border: 1px solid ${({ $format, theme }) => {
    switch ($format) {
      case 'mol':
        return theme.colors.primary;
      case 'pdb':
        return theme.colors.secondary;
      case 'xyz':
        return theme.colors.success;
      case 'sdf':
        return theme.colors.warning;
      default:
        return theme.colors.textMuted;
    }
  }}60;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $format, theme }) => {
    switch ($format) {
      case 'mol':
        return theme.colors.primary;
      case 'pdb':
        return theme.colors.secondary;
      case 'xyz':
        return theme.colors.success;
      case 'sdf':
        return theme.colors.warning;
      default:
        return theme.colors.textMuted;
    }
  }};
  text-transform: uppercase;
`;

const FileName = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PreviewStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing['3']};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
`;

const MoleculeName = styled.div`
  margin-top: ${({ theme }) => theme.spacing['3']};
  padding-top: ${({ theme }) => theme.spacing['3']};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ErrorState = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
  border-radius: ${({ theme }) => theme.radius.md};
  text-align: center;
`;

const ErrorTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const ErrorMessage = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['2']};
  justify-content: flex-end;
`;

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const CloseIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const FileImporter: React.FC<FileImporterProps> = ({
  onImport,
  onCancel,
  className,
}) => {
  const [state, setState] = useState<ImportState>({ status: 'idle' });

  const handleFileSelect = useCallback(async (file: File) => {
    setState({ status: 'loading', fileName: file.name });

    try {
      const content = await file.text();
      const result = parseFile(content, file.name);

      setState({
        status: result.success ? 'success' : 'error',
        result,
        fileName: file.name,
      });
    } catch {
      setState({
        status: 'error',
        result: { success: false, error: 'Failed to read file', format: 'unknown' },
        fileName: file.name,
      });
    }
  }, []);

  const handleImport = useCallback(() => {
    if (state.result?.success && state.result.molecule) {
      onImport(state.result.molecule);
      setState({ status: 'idle' });
    }
  }, [state.result, onImport]);

  const handleReset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  const handleClose = useCallback(() => {
    setState({ status: 'idle' });
    onCancel?.();
  }, [onCancel]);

  return (
    <ImporterWrapper className={className} variant="dark">
      <Header>
        <Title>Import Molecule</Title>
        {onCancel && (
          <CloseButton onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </CloseButton>
        )}
      </Header>

      {state.status === 'idle' && (
        <FileDropzone onFileSelect={handleFileSelect} />
      )}

      {state.status === 'loading' && (
        <LoadingState>
          <Loader variant="orbital" size="lg" />
          <LoadingText>Parsing {state.fileName}...</LoadingText>
        </LoadingState>
      )}

      {state.status === 'success' && state.result?.molecule && (
        <>
          <PreviewCard>
            <PreviewHeader>
              <FormatBadge $format={state.result.format}>
                {state.result.format}
              </FormatBadge>
              <FileName>{state.fileName}</FileName>
            </PreviewHeader>

            <PreviewStats>
              <StatItem>
                <StatValue>{state.result.molecule.atoms.length}</StatValue>
                <StatLabel>Atoms</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{state.result.molecule.bonds.length}</StatValue>
                <StatLabel>Bonds</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>
                  {new Set(state.result.molecule.atoms.map((a) => a.element)).size}
                </StatValue>
                <StatLabel>Elements</StatLabel>
              </StatItem>
            </PreviewStats>

            <MoleculeName>
              <strong>Name:</strong> {state.result.molecule.name}
            </MoleculeName>
          </PreviewCard>

          <Actions>
            <Button variant="ghost" onClick={handleReset}>
              Choose Different File
            </Button>
            <Button variant="primary" onClick={handleImport}>
              Import Molecule
            </Button>
          </Actions>
        </>
      )}

      {state.status === 'error' && (
        <>
          <ErrorState>
            <ErrorTitle>Failed to Parse File</ErrorTitle>
            <ErrorMessage>{state.result?.error || 'Unknown error'}</ErrorMessage>
          </ErrorState>

          <Actions>
            <Button variant="ghost" onClick={handleReset}>
              Try Another File
            </Button>
          </Actions>
        </>
      )}
    </ImporterWrapper>
  );
};

export default FileImporter;

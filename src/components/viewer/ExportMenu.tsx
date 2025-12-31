/**
 * ============================================================================
 * ExportMenu Component
 * Export molecule visualizations in various formats
 * ============================================================================
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { GlassPanel, Button, Select, Toggle, Input } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ImageFormat = 'png' | 'svg' | 'jpg' | 'webp';
export type DataFormat = 'mol' | 'pdb' | 'xyz' | 'json';
export type Resolution = '1x' | '2x' | '4x';

export interface ExportOptions {
  imageFormat: ImageFormat;
  dataFormat: DataFormat;
  resolution: Resolution;
  transparentBackground: boolean;
  includeLabels: boolean;
  fileName: string;
}

export interface ExportMenuProps {
  onExportImage: (options: ExportOptions) => void;
  onExportData: (options: ExportOptions) => void;
  moleculeName?: string;
  isExporting?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const MenuWrapper = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => theme.spacing['4']};
  min-width: 280px;
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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
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

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
`;

const OptionLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing['2']} 0;
`;

const ToggleLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const PreviewBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['1']};
  padding: ${({ theme }) => `${theme.spacing['1']} ${theme.spacing['2']}`};
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary};
`;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const IMAGE_FORMATS: { value: ImageFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'svg', label: 'SVG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'webp', label: 'WebP' },
];

const DATA_FORMATS: { value: DataFormat; label: string }[] = [
  { value: 'mol', label: 'MOL' },
  { value: 'pdb', label: 'PDB' },
  { value: 'xyz', label: 'XYZ' },
  { value: 'json', label: 'JSON' },
];

const RESOLUTIONS: { value: Resolution; label: string }[] = [
  { value: '1x', label: '1x (Standard)' },
  { value: '2x', label: '2x (High DPI)' },
  { value: '4x', label: '4x (Print)' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ExportMenu: React.FC<ExportMenuProps> = ({
  onExportImage,
  onExportData,
  moleculeName = 'molecule',
  isExporting = false,
  className,
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    imageFormat: 'png',
    dataFormat: 'mol',
    resolution: '2x',
    transparentBackground: false,
    includeLabels: true,
    fileName: moleculeName,
  });

  const updateOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const getEstimatedSize = () => {
    const baseSize = options.resolution === '1x' ? 200 : options.resolution === '2x' ? 800 : 3200;
    const formatMultiplier = options.imageFormat === 'svg' ? 0.1 : options.imageFormat === 'webp' ? 0.6 : 1;
    return Math.round(baseSize * formatMultiplier);
  };

  return (
    <MenuWrapper className={className} variant="dark">
      <Title>Export</Title>

      <Section>
        <SectionTitle>File Name</SectionTitle>
        <Input
          value={options.fileName}
          onChange={(e) => updateOption('fileName', e.target.value)}
          placeholder="Enter file name..."
        />
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Image Export</SectionTitle>
        <OptionsGrid>
          <OptionGroup>
            <OptionLabel>Format</OptionLabel>
            <Select
              value={options.imageFormat}
              onChange={(value) => updateOption('imageFormat', value as ImageFormat)}
              options={IMAGE_FORMATS}
            />
          </OptionGroup>
          <OptionGroup>
            <OptionLabel>Resolution</OptionLabel>
            <Select
              value={options.resolution}
              onChange={(value) => updateOption('resolution', value as Resolution)}
              options={RESOLUTIONS}
            />
          </OptionGroup>
        </OptionsGrid>

        <ToggleRow>
          <ToggleLabel>Transparent Background</ToggleLabel>
          <Toggle
            checked={options.transparentBackground}
            onChange={(e) => updateOption('transparentBackground', e.target.checked)}
            size="sm"
            disabled={options.imageFormat === 'jpg'}
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>Include Labels</ToggleLabel>
          <Toggle
            checked={options.includeLabels}
            onChange={(e) => updateOption('includeLabels', e.target.checked)}
            size="sm"
          />
        </ToggleRow>

        <PreviewBadge>
          Estimated size: ~{getEstimatedSize()} KB
        </PreviewBadge>

        <Button
          variant="primary"
          onClick={() => onExportImage(options)}
          loading={isExporting}
          fullWidth
        >
          Export Image
        </Button>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Data Export</SectionTitle>
        <OptionGroup>
          <OptionLabel>Format</OptionLabel>
          <Select
            value={options.dataFormat}
            onChange={(value) => updateOption('dataFormat', value as DataFormat)}
            options={DATA_FORMATS}
          />
        </OptionGroup>

        <Button
          variant="secondary"
          onClick={() => onExportData(options)}
          loading={isExporting}
          fullWidth
        >
          Export Data
        </Button>
      </Section>
    </MenuWrapper>
  );
};

export default ExportMenu;

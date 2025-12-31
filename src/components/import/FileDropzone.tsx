/**
 * ============================================================================
 * FileDropzone Component
 * Drag-and-drop zone for molecular file uploads
 * ============================================================================
 */
import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string[];
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0, 245, 255, 0.2); }
  50% { box-shadow: 0 0 40px rgba(0, 245, 255, 0.4); }
`;

const scanLine = keyframes`
  0% { top: 0; opacity: 1; }
  50% { opacity: 0.5; }
  100% { top: 100%; opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface DropzoneWrapperProps {
  $isDragging: boolean;
  $disabled: boolean;
}

const DropzoneWrapper = styled.div<DropzoneWrapperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing['6']};
  background: ${({ theme }) => theme.glass.dark};
  border: 2px dashed ${({ $isDragging, theme }) =>
    $isDragging ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  ${({ $isDragging, theme }) =>
    $isDragging &&
    `
    background: ${theme.colors.primary}10;
    animation: ${pulseGlow} 1.5s ease-in-out infinite;
  `}

  &:hover {
    border-color: ${({ $disabled, theme }) =>
      $disabled ? theme.colors.border : theme.colors.primary};
    background: ${({ $disabled, theme }) =>
      $disabled ? theme.glass.dark : `${theme.colors.primary}05`};
  }
`;

const ScanLineEffect = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme }) => theme.colors.primary},
    transparent
  );
  pointer-events: none;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  animation: ${scanLine} 2s linear infinite;
`;

const IconWrapper = styled.div<{ $isDragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.primary};
  animation: ${({ $isDragging }) => ($isDragging ? float : 'none')} 1s ease-in-out infinite;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing['2']};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing['3']};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

const FormatBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['2']};
`;

const FormatBadge = styled.span`
  padding: ${({ theme }) => `${theme.spacing['1']} ${theme.spacing['2']}`};
  background: ${({ theme }) => theme.colors.secondary}15;
  border: 1px solid ${({ theme }) => theme.colors.secondary}40;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
`;

const HiddenInput = styled.input`
  display: none;
`;

const BrowseButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => `${theme.spacing['2']} ${theme.spacing['4']}`};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.primary}40;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const UploadIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 20V8M16 8l-5 5M16 8l5 5" />
    <path d="M8 24h16" />
    <rect x="4" y="4" width="24" height="24" rx="4" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_FORMATS = ['.mol', '.pdb', '.xyz', '.sdf'];
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  acceptedFormats = DEFAULT_FORMATS,
  maxSize = DEFAULT_MAX_SIZE,
  disabled = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFormats.includes(ext)) {
      console.warn(`Invalid file format: ${ext}`);
      return false;
    }
    if (file.size > maxSize) {
      console.warn(`File too large: ${file.size} bytes`);
      return false;
    }
    return true;
  }, [acceptedFormats, maxSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
  }, [disabled, validateFile, onFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
    // Reset input
    if (inputRef.current) inputRef.current.value = '';
  }, [validateFile, onFileSelect]);

  const handleBrowseClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const formatMaxSize = () => {
    if (maxSize >= 1024 * 1024) return `${Math.round(maxSize / (1024 * 1024))}MB`;
    if (maxSize >= 1024) return `${Math.round(maxSize / 1024)}KB`;
    return `${maxSize}B`;
  };

  return (
    <DropzoneWrapper
      $isDragging={isDragging}
      $disabled={disabled}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
      className={className}
    >
      <ScanLineEffect $active={isDragging} />

      <IconWrapper $isDragging={isDragging}>
        <UploadIcon />
      </IconWrapper>

      <Title>{isDragging ? 'Drop file here' : 'Import Molecule'}</Title>

      <Description>
        Drag and drop a molecular file or click to browse.
        <br />
        Max size: {formatMaxSize()}
      </Description>

      <FormatBadges>
        {acceptedFormats.map((format) => (
          <FormatBadge key={format}>{format.replace('.', '')}</FormatBadge>
        ))}
      </FormatBadges>

      <BrowseButton type="button" onClick={(e) => e.stopPropagation()}>
        Browse Files
      </BrowseButton>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleInputChange}
      />
    </DropzoneWrapper>
  );
};

export default FileDropzone;

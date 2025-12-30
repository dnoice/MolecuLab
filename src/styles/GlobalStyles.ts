/**
 * ============================================================================
 * MolecuLab Global Styles
 * CSS Reset + Base Styles + Font Imports
 * ============================================================================
 */
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Font imports */
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

  /* CSS Reset */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.bgDeep};
    color: ${({ theme }) => theme.colors.textPrimary};
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.5;
  }

  #root {
    min-height: 100vh;
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.neonCyan};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.neonMagenta};
      text-shadow: ${({ theme }) => theme.glows.cyan};
    }
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
  }

  /* Inputs */
  input,
  textarea,
  select {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 12px 16px;
    outline: none;
    transition: ${({ theme }) => theme.transitions.normal};

    &:focus {
      border-color: ${({ theme }) => theme.colors.neonCyan};
      box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 245, 255, 0.3);
    border-radius: 4px;
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: rgba(0, 245, 255, 0.5);
    }
  }

  /* Selection */
  ::selection {
    background: rgba(0, 245, 255, 0.3);
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  /* Canvas (Three.js) */
  canvas {
    display: block;
    outline: none;
  }

  /* Code blocks */
  code,
  pre {
    font-family: ${({ theme }) => theme.fonts.mono};
  }

  /* Utilities */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Prevent text selection on UI elements */
  .no-select {
    user-select: none;
    -webkit-user-select: none;
  }
`;

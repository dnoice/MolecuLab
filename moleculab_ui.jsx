/*
 * ============================================================================
 * ✒ Metadata
 *     - Title: MolecuLab Interface (Pylette Edition - v1.0)
 *     - File Name: moleculab_ui.jsx
 *     - Relative Path: ui/moleculab_ui.jsx
 *     - Artifact Type: script
 *     - Version: 1.0.0
 *     - Date: 2025-12-29
 *     - Update: Monday, December 29, 2025
 *     - Author: Dennis 'dnoice' Smaltz
 *     - A.I. Acknowledgement: Anthropic - Claude Opus 4.5
 *     - Signature: ︻デ═─── ✦ ✦ ✦ | Aim Twice, Shoot Once!
 * 
 * ✒ Description:
 *     Stunning cyberpunk-inspired interface for MolecuLab molecular design
 *     platform. Features 3D molecular visualization, real-time quantum data
 *     display, substrate nesting visualization, and chemical search.
 * 
 * ✒ Key Features:
 *     - Feature 1: Three.js 3D molecular rendering with orbital visualization
 *     - Feature 2: Glassmorphism UI panels with neon accents
 *     - Feature 3: Animated particle background for depth
 *     - Feature 4: Interactive substrate nesting canvas
 *     - Feature 5: Real-time chemical term highlighting
 *     - Feature 6: Smooth animations and micro-interactions
 *     - Feature 7: Responsive cyberpunk/sci-fi aesthetic
 *     - Feature 8: Data-driven quantum property displays
 * ----------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA - Would come from Python backend API in production
// ═══════════════════════════════════════════════════════════════════════════════

const MOLECULES_DATA = {
  water: {
    id: "mol_water",
    name: "water",
    formula: "H₂O",
    smiles: "O",
    atoms: [
      { element: "O", position: [0, 0, 0.12], color: "#ff3366", radius: 0.66 },
      { element: "H", position: [0, 0.76, -0.47], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [0, -0.76, -0.47], color: "#ffffff", radius: 0.31 }
    ],
    bonds: [[0, 1], [0, 2]],
    functionalGroups: ["hydroxyl"],
    quantum: {
      energy: -2070.4,
      homo: -12.6,
      lumo: 4.2,
      bandGap: 16.8,
      dipole: 1.85
    }
  },
  benzene: {
    id: "mol_benzene",
    name: "benzene",
    formula: "C₆H₆",
    smiles: "c1ccccc1",
    atoms: [
      { element: "C", position: [1.4, 0, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [0.7, 1.21, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [-0.7, 1.21, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [-1.4, 0, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [-0.7, -1.21, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [0.7, -1.21, 0], color: "#00ffcc", radius: 0.77 },
      { element: "H", position: [2.5, 0, 0], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [1.25, 2.16, 0], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [-1.25, 2.16, 0], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [-2.5, 0, 0], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [-1.25, -2.16, 0], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [1.25, -2.16, 0], color: "#ffffff", radius: 0.31 }
    ],
    bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]],
    functionalGroups: ["aromatic"],
    quantum: {
      energy: -6014.2,
      homo: -9.2,
      lumo: 1.3,
      bandGap: 10.5,
      dipole: 0.0
    }
  },
  ethanol: {
    id: "mol_ethanol",
    name: "ethanol",
    formula: "C₂H₆O",
    smiles: "CCO",
    atoms: [
      { element: "C", position: [-1.2, 0, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [0.3, 0, 0], color: "#00ffcc", radius: 0.77 },
      { element: "O", position: [0.9, 1.2, 0], color: "#ff3366", radius: 0.66 },
      { element: "H", position: [-1.6, 1.0, 0], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [-1.6, -0.5, 0.9], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [-1.6, -0.5, -0.9], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [0.7, -0.5, 0.9], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [0.7, -0.5, -0.9], color: "#ffffff", radius: 0.31 },
      { element: "H", position: [1.8, 1.2, 0], color: "#ffffff", radius: 0.31 }
    ],
    bonds: [[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8]],
    functionalGroups: ["hydroxyl", "alkyl"],
    quantum: {
      energy: -4209.8,
      homo: -10.9,
      lumo: 3.8,
      bandGap: 14.7,
      dipole: 1.69
    }
  },
  caffeine: {
    id: "mol_caffeine",
    name: "caffeine",
    formula: "C₈H₁₀N₄O₂",
    smiles: "Cn1cnc2c1c(=O)n(C)c(=O)n2C",
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#00ffcc", radius: 0.77 },
      { element: "N", position: [1.3, 0, 0], color: "#3366ff", radius: 0.71 },
      { element: "C", position: [2.0, 1.2, 0], color: "#00ffcc", radius: 0.77 },
      { element: "N", position: [1.3, 2.4, 0], color: "#3366ff", radius: 0.71 },
      { element: "C", position: [0, 2.4, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [-0.7, 1.2, 0], color: "#00ffcc", radius: 0.77 },
      { element: "O", position: [-0.7, 3.5, 0], color: "#ff3366", radius: 0.66 },
      { element: "N", position: [-2.1, 1.2, 0], color: "#3366ff", radius: 0.71 },
      { element: "C", position: [-2.8, 2.4, 0], color: "#00ffcc", radius: 0.77 },
      { element: "O", position: [-2.8, 0, 0], color: "#ff3366", radius: 0.66 },
      { element: "N", position: [-2.1, 3.6, 0], color: "#3366ff", radius: 0.71 },
      { element: "C", position: [-2.8, 4.8, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [3.5, 1.2, 0], color: "#00ffcc", radius: 0.77 },
      { element: "C", position: [2.0, 3.7, 0], color: "#00ffcc", radius: 0.77 }
    ],
    bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[4,6],[5,7],[7,8],[7,9],[8,10],[10,4],[10,11],[2,12],[3,13]],
    functionalGroups: ["amine", "carbonyl", "aromatic"],
    quantum: {
      energy: -16892.3,
      homo: -8.4,
      lumo: -0.2,
      bandGap: 8.2,
      dipole: 3.64
    }
  }
};

const NESTING_DATA = {
  substrate: { width: 40, height: 40 },
  placements: [
    { id: 1, molecule: "benzene", x: 5, y: 5, radius: 3.2, rotation: 0 },
    { id: 2, molecule: "benzene", x: 14, y: 5, radius: 3.2, rotation: 45 },
    { id: 3, molecule: "benzene", x: 23, y: 5, radius: 3.2, rotation: 90 },
    { id: 4, molecule: "benzene", x: 32, y: 5, radius: 3.2, rotation: 15 },
    { id: 5, molecule: "water", x: 8, y: 14, radius: 1.8, rotation: 0 },
    { id: 6, molecule: "water", x: 14, y: 14, radius: 1.8, rotation: 30 },
    { id: 7, molecule: "water", x: 20, y: 14, radius: 1.8, rotation: 60 },
    { id: 8, molecule: "water", x: 26, y: 14, radius: 1.8, rotation: 90 },
    { id: 9, molecule: "water", x: 32, y: 14, radius: 1.8, rotation: 120 },
    { id: 10, molecule: "ethanol", x: 6, y: 23, radius: 2.5, rotation: 0 },
    { id: 11, molecule: "ethanol", x: 16, y: 23, radius: 2.5, rotation: 45 },
    { id: 12, molecule: "ethanol", x: 26, y: 23, radius: 2.5, rotation: 90 },
    { id: 13, molecule: "caffeine", x: 10, y: 33, radius: 4.0, rotation: 0 },
    { id: 14, molecule: "caffeine", x: 28, y: 33, radius: 4.0, rotation: 180 },
    { id: 15, molecule: "water", x: 36, y: 23, radius: 1.8, rotation: 0 },
    { id: 16, molecule: "water", x: 5, y: 33, radius: 1.8, rotation: 45 },
    { id: 17, molecule: "water", x: 35, y: 33, radius: 1.8, rotation: 90 },
  ],
  utilization: 0.72,
  numPlaced: 17,
  numTotal: 17
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES - Cyberpunk/Sci-Fi Laboratory Aesthetic
// ═══════════════════════════════════════════════════════════════════════════════

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
  
  :root {
    --bg-deep: #0a0a0f;
    --bg-dark: #12121a;
    --bg-card: rgba(20, 20, 35, 0.7);
    --bg-glass: rgba(30, 30, 50, 0.4);
    
    --neon-cyan: #00f5ff;
    --neon-magenta: #ff00ff;
    --neon-gold: #ffd700;
    --neon-green: #00ff88;
    --neon-red: #ff3366;
    --neon-blue: #3366ff;
    
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --text-muted: rgba(255, 255, 255, 0.4);
    
    --glow-cyan: 0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3);
    --glow-magenta: 0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3);
    --glow-gold: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3);
    
    --border-glow: 1px solid rgba(0, 245, 255, 0.3);
    --radius-lg: 20px;
    --radius-md: 12px;
    --radius-sm: 8px;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg-deep);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  /* Animated Background */
  .bg-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    background: 
      radial-gradient(ellipse at 20% 80%, rgba(0, 245, 255, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(255, 0, 255, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 60%);
  }
  
  .bg-grid {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    background-image: 
      linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridScroll 20s linear infinite;
  }
  
  @keyframes gridScroll {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  /* Glass Panel Effect */
  .glass-panel {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: var(--border-glow);
    border-radius: var(--radius-lg);
    box-shadow: 
      inset 0 1px 1px rgba(255, 255, 255, 0.1),
      0 10px 40px rgba(0, 0, 0, 0.4);
  }
  
  /* App Container */
  .app-container {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    padding: 24px;
  }
  
  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding: 20px 32px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .logo-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta));
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    box-shadow: var(--glow-cyan);
    animation: logoPulse 3s ease-in-out infinite;
  }
  
  @keyframes logoPulse {
    0%, 100% { box-shadow: var(--glow-cyan); }
    50% { box-shadow: var(--glow-magenta); }
  }
  
  .logo-text {
    font-family: 'Orbitron', monospace;
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 4px;
  }
  
  .logo-subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 4px;
  }
  
  /* Navigation Tabs */
  .nav-tabs {
    display: flex;
    gap: 8px;
  }
  
  .nav-tab {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    padding: 12px 24px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .nav-tab:hover {
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
    background: rgba(0, 245, 255, 0.05);
  }
  
  .nav-tab.active {
    background: linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(255, 0, 255, 0.1));
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
    box-shadow: var(--glow-cyan);
  }
  
  /* Main Grid Layout */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    grid-template-rows: auto auto;
    gap: 24px;
    max-width: 1800px;
    margin: 0 auto;
  }
  
  /* 3D Viewer Panel */
  .viewer-panel {
    grid-row: span 2;
    min-height: 600px;
    padding: 0;
    overflow: hidden;
    position: relative;
  }
  
  .viewer-canvas {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-lg);
  }
  
  .viewer-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border-radius: var(--radius-md);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .viewer-btn {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .viewer-btn:hover {
    border-color: var(--neon-cyan);
    background: rgba(0, 245, 255, 0.1);
    color: var(--neon-cyan);
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.3);
  }
  
  .viewer-btn.active {
    background: var(--neon-cyan);
    color: var(--bg-deep);
    border-color: var(--neon-cyan);
  }
  
  /* Molecule Selector */
  .molecule-selector {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
  }
  
  .mol-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .mol-chip:hover {
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
  }
  
  .mol-chip.active {
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta));
    border-color: transparent;
    color: var(--bg-deep);
    font-weight: 500;
  }
  
  /* Info Panel */
  .info-panel {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .panel-title {
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    color: var(--neon-cyan);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .panel-title::before {
    content: '';
    width: 4px;
    height: 16px;
    background: var(--neon-cyan);
    border-radius: 2px;
    box-shadow: var(--glow-cyan);
  }
  
  /* Molecule Header */
  .mol-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .mol-formula-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(255, 0, 255, 0.1));
    border: 1px solid var(--neon-cyan);
    border-radius: var(--radius-md);
    color: var(--neon-cyan);
    text-shadow: var(--glow-cyan);
  }
  
  .mol-name {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 600;
    text-transform: capitalize;
    margin-bottom: 4px;
  }
  
  .mol-smiles {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--text-muted);
    background: rgba(0, 0, 0, 0.3);
    padding: 4px 10px;
    border-radius: 4px;
    display: inline-block;
  }
  
  /* Quantum Data Grid */
  .quantum-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .quantum-card {
    padding: 16px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: var(--radius-sm);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }
  
  .quantum-card:hover {
    border-color: rgba(0, 245, 255, 0.3);
    background: rgba(0, 245, 255, 0.05);
  }
  
  .quantum-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }
  
  .quantum-value {
    font-family: 'Orbitron', monospace;
    font-size: 20px;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .quantum-unit {
    font-size: 12px;
    color: var(--text-muted);
    margin-left: 4px;
  }
  
  .quantum-value.positive { color: var(--neon-green); }
  .quantum-value.negative { color: var(--neon-red); }
  .quantum-value.neutral { color: var(--neon-gold); }
  
  /* Functional Groups */
  .groups-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .group-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 6px 12px;
    background: rgba(255, 0, 255, 0.1);
    border: 1px solid rgba(255, 0, 255, 0.3);
    border-radius: 20px;
    color: var(--neon-magenta);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  /* Nesting Panel */
  .nesting-panel {
    padding: 24px;
  }
  
  .nesting-canvas-container {
    position: relative;
    background: rgba(0, 0, 0, 0.4);
    border-radius: var(--radius-md);
    padding: 20px;
    margin-top: 16px;
  }
  
  .nesting-canvas {
    width: 100%;
    aspect-ratio: 1;
    border: 2px solid rgba(0, 245, 255, 0.2);
    border-radius: var(--radius-sm);
    position: relative;
    overflow: hidden;
    background: 
      linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
    background-size: 10% 10%;
  }
  
  .nesting-molecule {
    position: absolute;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--bg-deep);
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    animation: moleculeFadeIn 0.5s ease forwards;
    opacity: 0;
  }
  
  @keyframes moleculeFadeIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .nesting-molecule:hover {
    transform: scale(1.15);
    z-index: 10;
    box-shadow: 0 0 20px currentColor;
  }
  
  .nesting-molecule.benzene { background: var(--neon-cyan); }
  .nesting-molecule.water { background: var(--neon-magenta); }
  .nesting-molecule.ethanol { background: var(--neon-gold); }
  .nesting-molecule.caffeine { background: var(--neon-green); }
  
  /* Nesting Stats */
  .nesting-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: var(--radius-sm);
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    font-family: 'Orbitron', monospace;
    font-size: 24px;
    font-weight: 700;
    color: var(--neon-cyan);
  }
  
  .stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
  }
  
  /* Search Panel */
  .search-panel {
    padding: 24px;
  }
  
  .search-input-wrapper {
    position: relative;
    margin-top: 12px;
  }
  
  .search-input {
    width: 100%;
    padding: 16px 20px;
    padding-left: 50px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
  }
  
  .search-input::placeholder {
    color: var(--text-muted);
  }
  
  .search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 18px;
  }
  
  /* Search Results */
  .search-results {
    margin-top: 16px;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .result-category {
    margin-bottom: 12px;
  }
  
  .category-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .category-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .result-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 4px;
    animation: tagPop 0.3s ease forwards;
  }
  
  @keyframes tagPop {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .result-tag.element {
    background: rgba(0, 245, 255, 0.15);
    border: 1px solid rgba(0, 245, 255, 0.3);
    color: var(--neon-cyan);
  }
  
  .result-tag.group {
    background: rgba(255, 0, 255, 0.15);
    border: 1px solid rgba(255, 0, 255, 0.3);
    color: var(--neon-magenta);
  }
  
  .result-tag.compound {
    background: rgba(255, 215, 0, 0.15);
    border: 1px solid rgba(255, 215, 0, 0.3);
    color: var(--neon-gold);
  }
  
  .result-tag.property {
    background: rgba(0, 255, 136, 0.15);
    border: 1px solid rgba(0, 255, 136, 0.3);
    color: var(--neon-green);
  }
  
  /* Footer */
  .footer {
    margin-top: 40px;
    padding: 20px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .footer-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--text-muted);
    letter-spacing: 2px;
  }
  
  .footer-signature {
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    margin-top: 8px;
    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta), var(--neon-gold));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 245, 255, 0.3);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 245, 255, 0.5);
  }
  
  /* Responsive */
  @media (max-width: 1200px) {
    .main-grid {
      grid-template-columns: 1fr;
    }
    
    .viewer-panel {
      grid-row: span 1;
      min-height: 500px;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// THREE.JS MOLECULAR VIEWER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const MolecularViewer = ({ molecule, showOrbitals }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const moleculeGroupRef = useRef(null);
  const frameRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0f, 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00f5ff, 1, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 0.8, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xffd700, 0.5, 50);
    pointLight3.position.set(0, 10, -10);
    scene.add(pointLight3);
    
    // Add subtle fog
    scene.fog = new THREE.Fog(0x0a0a0f, 15, 30);
    
    // Create molecule group
    const moleculeGroup = new THREE.Group();
    scene.add(moleculeGroup);
    moleculeGroupRef.current = moleculeGroup;
    
    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      moleculeGroup.rotation.y += deltaX * 0.01;
      moleculeGroup.rotation.x += deltaY * 0.01;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseUp = () => { isDragging = false; };
    
    const onWheel = (e) => {
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(5, Math.min(25, camera.position.z));
    };
    
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);
    
    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Gentle auto-rotation when not dragging
      if (!isDragging) {
        moleculeGroup.rotation.y += 0.003;
      }
      
      renderer.render(scene, camera);
    };
    animate();
    
    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  // Update molecule when it changes
  useEffect(() => {
    if (!moleculeGroupRef.current || !molecule) return;
    
    const group = moleculeGroupRef.current;
    
    // Clear existing
    while (group.children.length > 0) {
      const child = group.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      group.remove(child);
    }
    
    // Add atoms
    molecule.atoms.forEach((atom, index) => {
      const geometry = new THREE.SphereGeometry(atom.radius * 0.6, 32, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(atom.color),
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        emissive: new THREE.Color(atom.color),
        emissiveIntensity: 0.2
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...atom.position);
      group.add(mesh);
      
      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(atom.radius * 0.8, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(atom.color),
        transparent: true,
        opacity: 0.15
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.set(...atom.position);
      group.add(glowMesh);
    });
    
    // Add bonds
    molecule.bonds.forEach(([i, j]) => {
      const atom1 = molecule.atoms[i];
      const atom2 = molecule.atoms[j];
      
      if (!atom1 || !atom2) return;
      
      const start = new THREE.Vector3(...atom1.position);
      const end = new THREE.Vector3(...atom2.position);
      const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      
      const geometry = new THREE.CylinderGeometry(0.08, 0.08, length, 8);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x888888,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0x222222,
        emissiveIntensity: 0.3
      });
      
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.copy(mid);
      cylinder.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
      );
      group.add(cylinder);
    });
    
    // Add orbital visualization if enabled
    if (showOrbitals) {
      // Electron density cloud (simplified representation)
      const points = [];
      const colors = [];
      const color = new THREE.Color();
      
      for (let i = 0; i < 2000; i++) {
        // Generate points around atoms
        const atomIdx = Math.floor(Math.random() * molecule.atoms.length);
        const atom = molecule.atoms[atomIdx];
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 0.5 + Math.random() * 2;
        
        const x = atom.position[0] + r * Math.sin(phi) * Math.cos(theta);
        const y = atom.position[1] + r * Math.sin(phi) * Math.sin(theta);
        const z = atom.position[2] + r * Math.cos(phi);
        
        points.push(x, y, z);
        
        // Color based on distance (orbital density)
        const density = Math.exp(-r * 0.8);
        color.setHSL(0.5 + density * 0.3, 1, 0.5 + density * 0.3);
        colors.push(color.r, color.g, color.b);
      }
      
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      group.add(particles);
    }
    
  }, [molecule, showOrbitals]);
  
  return <div ref={containerRef} className="viewer-canvas" />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// NESTING VISUALIZATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const NestingVisualization = ({ data }) => {
  const { substrate, placements, utilization, numPlaced, numTotal } = data;
  
  return (
    <div className="nesting-canvas-container">
      <div className="nesting-canvas">
        {placements.map((p, index) => {
          const left = (p.x / substrate.width) * 100;
          const top = (p.y / substrate.height) * 100;
          const size = (p.radius / substrate.width) * 200;
          
          return (
            <div
              key={p.id}
              className={`nesting-molecule ${p.molecule}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}%`,
                height: `${size}%`,
                transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                animationDelay: `${index * 0.05}s`
              }}
              title={`${p.molecule} (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`}
            >
              {p.molecule[0].toUpperCase()}
            </div>
          );
        })}
      </div>
      
      <div className="nesting-stats">
        <div className="stat-item">
          <div className="stat-value">{numPlaced}</div>
          <div className="stat-label">Placed</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{(utilization * 100).toFixed(0)}%</div>
          <div className="stat-label">Utilization</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{substrate.width}×{substrate.height}</div>
          <div className="stat-label">Substrate (nm)</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHEMICAL SEARCH COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ChemicalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  
  // FlashText-style keyword matching (simulated frontend)
  const keywords = {
    elements: ['hydrogen', 'carbon', 'nitrogen', 'oxygen', 'sulfur', 'phosphorus', 'H', 'C', 'N', 'O', 'S', 'P'],
    groups: ['hydroxyl', 'carbonyl', 'carboxyl', 'amine', 'aromatic', 'ether', 'ester', 'alkene'],
    compounds: ['water', 'methane', 'ethanol', 'benzene', 'caffeine', 'glucose', 'ammonia'],
    properties: ['polar', 'nonpolar', 'hydrophobic', 'hydrophilic', 'aromatic', 'stable']
  };
  
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    
    const queryLower = query.toLowerCase();
    const found = {
      elements: [],
      groups: [],
      compounds: [],
      properties: []
    };
    
    Object.entries(keywords).forEach(([category, terms]) => {
      terms.forEach(term => {
        if (queryLower.includes(term.toLowerCase())) {
          found[category].push(term);
        }
      });
    });
    
    const totalFound = Object.values(found).flat().length;
    if (totalFound > 0) {
      setResults(found);
    } else {
      setResults(null);
    }
  }, [query]);
  
  return (
    <div className="search-panel glass-panel">
      <div className="panel-title">Chemical Search</div>
      
      <div className="search-input-wrapper">
        <span className="search-icon">🔬</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search elements, groups, compounds..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      {results && (
        <div className="search-results">
          {results.elements.length > 0 && (
            <div className="result-category">
              <div className="category-title">Elements</div>
              <div className="result-tags">
                {results.elements.map((el, i) => (
                  <span key={i} className="result-tag element">{el}</span>
                ))}
              </div>
            </div>
          )}
          
          {results.groups.length > 0 && (
            <div className="result-category">
              <div className="category-title">Functional Groups</div>
              <div className="result-tags">
                {results.groups.map((g, i) => (
                  <span key={i} className="result-tag group">{g}</span>
                ))}
              </div>
            </div>
          )}
          
          {results.compounds.length > 0 && (
            <div className="result-category">
              <div className="category-title">Compounds</div>
              <div className="result-tags">
                {results.compounds.map((c, i) => (
                  <span key={i} className="result-tag compound">{c}</span>
                ))}
              </div>
            </div>
          )}
          
          {results.properties.length > 0 && (
            <div className="result-category">
              <div className="category-title">Properties</div>
              <div className="result-tags">
                {results.properties.map((p, i) => (
                  <span key={i} className="result-tag property">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {!results && query && (
        <div style={{ 
          marginTop: '16px', 
          color: 'var(--text-muted)', 
          fontSize: '13px',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          No chemical terms found. Try: "hydroxyl", "benzene", "polar"
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MolecuLabApp() {
  const [selectedMolecule, setSelectedMolecule] = useState('benzene');
  const [activeTab, setActiveTab] = useState('viewer');
  const [showOrbitals, setShowOrbitals] = useState(false);
  
  const molecule = MOLECULES_DATA[selectedMolecule];
  
  return (
    <>
      <style>{styles}</style>
      
      <div className="bg-particles" />
      <div className="bg-grid" />
      
      <div className="app-container">
        {/* Header */}
        <header className="header glass-panel">
          <div className="logo">
            <div className="logo-icon">⚛️</div>
            <div>
              <div className="logo-text">MOLECULAB</div>
              <div className="logo-subtitle">Quantum Molecular Design Studio</div>
            </div>
          </div>
          
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'viewer' ? 'active' : ''}`}
              onClick={() => setActiveTab('viewer')}
            >
              3D Viewer
            </button>
            <button 
              className={`nav-tab ${activeTab === 'nesting' ? 'active' : ''}`}
              onClick={() => setActiveTab('nesting')}
            >
              Substrate
            </button>
            <button 
              className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Search
            </button>
          </nav>
        </header>
        
        {/* Main Content */}
        <main className="main-grid">
          {/* 3D Viewer */}
          <div className="viewer-panel glass-panel">
            {/* Molecule selector chips */}
            <div className="molecule-selector">
              {Object.keys(MOLECULES_DATA).map(name => (
                <button
                  key={name}
                  className={`mol-chip ${selectedMolecule === name ? 'active' : ''}`}
                  onClick={() => setSelectedMolecule(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            
            {/* Three.js canvas */}
            <MolecularViewer molecule={molecule} showOrbitals={showOrbitals} />
            
            {/* Viewer controls */}
            <div className="viewer-controls">
              <button 
                className={`viewer-btn ${showOrbitals ? 'active' : ''}`}
                onClick={() => setShowOrbitals(!showOrbitals)}
                title="Toggle Orbitals"
              >
                ☁️
              </button>
              <button className="viewer-btn" title="Reset View">↺</button>
              <button className="viewer-btn" title="Screenshot">📷</button>
              <button className="viewer-btn" title="Fullscreen">⛶</button>
            </div>
          </div>
          
          {/* Info Panel */}
          <div className="info-panel glass-panel">
            <div className="panel-title">Molecule Data</div>
            
            <div className="mol-header">
              <div className="mol-formula-badge">{molecule.formula}</div>
              <div>
                <div className="mol-name">{molecule.name}</div>
                <div className="mol-smiles">SMILES: {molecule.smiles}</div>
              </div>
            </div>
            
            <div>
              <div className="panel-title">Quantum Properties</div>
              <div className="quantum-grid">
                <div className="quantum-card">
                  <div className="quantum-label">Total Energy</div>
                  <div className="quantum-value negative">
                    {molecule.quantum.energy.toFixed(1)}
                    <span className="quantum-unit">eV</span>
                  </div>
                </div>
                <div className="quantum-card">
                  <div className="quantum-label">HOMO-LUMO Gap</div>
                  <div className="quantum-value neutral">
                    {molecule.quantum.bandGap.toFixed(1)}
                    <span className="quantum-unit">eV</span>
                  </div>
                </div>
                <div className="quantum-card">
                  <div className="quantum-label">HOMO</div>
                  <div className="quantum-value negative">
                    {molecule.quantum.homo.toFixed(1)}
                    <span className="quantum-unit">eV</span>
                  </div>
                </div>
                <div className="quantum-card">
                  <div className="quantum-label">LUMO</div>
                  <div className="quantum-value positive">
                    {molecule.quantum.lumo > 0 ? '+' : ''}{molecule.quantum.lumo.toFixed(1)}
                    <span className="quantum-unit">eV</span>
                  </div>
                </div>
                <div className="quantum-card" style={{ gridColumn: 'span 2' }}>
                  <div className="quantum-label">Dipole Moment</div>
                  <div className="quantum-value">
                    {molecule.quantum.dipole.toFixed(2)}
                    <span className="quantum-unit">Debye</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="panel-title">Functional Groups</div>
              <div className="groups-list">
                {molecule.functionalGroups.map((group, i) => (
                  <span key={i} className="group-tag">{group}</span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Conditional Panel Based on Tab */}
          {activeTab === 'nesting' && (
            <div className="nesting-panel glass-panel" style={{ gridColumn: '1 / -1' }}>
              <div className="panel-title">Substrate Nesting Optimization</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
                PyNest2D optimization for molecular array fabrication. Drag to reposition.
              </p>
              <NestingVisualization data={NESTING_DATA} />
            </div>
          )}
          
          {activeTab === 'search' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <ChemicalSearch />
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="footer">
          <div className="footer-text">
            MOLECULAB • PYNEST2D • FLASHTEXT • PYVOLUME • PSI4
          </div>
          <div className="footer-signature">
            ︻デ═─── ✦ ✦ ✦ | Aim Twice, Shoot Once!
          </div>
        </footer>
      </div>
    </>
  );
}
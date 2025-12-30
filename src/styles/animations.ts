/**
 * ============================================================================
 * MolecuLab Animations
 * Keyframe animations and animation utilities
 * ============================================================================
 */
import { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// KEYFRAME ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/** Fade in from transparent */
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/** Fade out to transparent */
export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

/** Scale up from small */
export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

/** Scale down and fade out */
export const scaleOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

/** Slide in from bottom */
export const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/** Slide in from top */
export const slideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/** Slide in from left */
export const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

/** Slide in from right */
export const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

/** Pulse glow effect for neon elements */
export const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 245, 255, 0.7), 0 0 60px rgba(0, 245, 255, 0.4);
  }
`;

/** Pulse between cyan and magenta */
export const pulseNeon = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3);
  }
`;

/** Continuous rotation */
export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/** Gentle floating motion */
export const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

/** Shake/error animation */
export const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
`;

/** Bounce effect */
export const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

/** Grid scroll animation for background */
export const gridScroll = keyframes`
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
`;

/** Skeleton loading shimmer */
export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/** Molecule pop-in animation */
export const moleculeFadeIn = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

/** Tag pop animation */
export const tagPop = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION UTILITIES (CSS snippets)
// ═══════════════════════════════════════════════════════════════════════════

/** Apply fade in animation */
export const animateFadeIn = css`
  animation: ${fadeIn} 0.3s ease forwards;
`;

/** Apply scale in animation */
export const animateScaleIn = css`
  animation: ${scaleIn} 0.2s ease forwards;
`;

/** Apply slide up animation */
export const animateSlideUp = css`
  animation: ${slideInUp} 0.3s ease forwards;
`;

/** Apply pulse glow animation */
export const animatePulseGlow = css`
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

/** Apply spin animation */
export const animateSpin = css`
  animation: ${spin} 1s linear infinite;
`;

/** Apply skeleton shimmer */
export const animateShimmer = css`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

/** Respect reduced motion preference */
export const respectMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
  }
`;

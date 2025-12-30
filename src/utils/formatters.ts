/**
 * ============================================================================
 * MolecuLab Formatter Utilities
 * Functions for formatting and displaying data
 * ============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// NUMBER FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format a number with specified decimal places
 */
export function formatNumber(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number with units
 */
export function formatWithUnit(
  value: number,
  unit: string,
  decimals: number = 2
): string {
  return `${formatNumber(value, decimals)} ${unit}`;
}

/**
 * Format energy value (eV)
 */
export function formatEnergy(value: number): string {
  return formatWithUnit(value, 'eV', 2);
}

/**
 * Format distance value (Angstroms)
 */
export function formatDistance(value: number): string {
  return formatWithUnit(value, 'Å', 3);
}

/**
 * Format angle value (degrees)
 */
export function formatAngle(value: number): string {
  return formatWithUnit(value, '°', 1);
}

/**
 * Format molecular weight
 */
export function formatMolecularWeight(value: number): string {
  return formatWithUnit(value, 'g/mol', 3);
}

/**
 * Format dipole moment
 */
export function formatDipole(value: number): string {
  return formatWithUnit(value, 'D', 2);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${formatNumber(value * 100, decimals)}%`;
}

/**
 * Format scientific notation
 */
export function formatScientific(
  value: number,
  significantDigits: number = 3
): string {
  return value.toExponential(significantDigits - 1);
}

/**
 * Format large numbers with SI suffixes
 */
export function formatSI(value: number, decimals: number = 1): string {
  const suffixes = ['', 'k', 'M', 'G', 'T', 'P'];
  let suffixIndex = 0;
  let scaledValue = value;

  while (Math.abs(scaledValue) >= 1000 && suffixIndex < suffixes.length - 1) {
    scaledValue /= 1000;
    suffixIndex++;
  }

  return `${formatNumber(scaledValue, decimals)}${suffixes[suffixIndex]}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE SIZE FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size, unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// TIME FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${formatNumber(ms / 1000, 1)}s`;
  if (ms < 3600000) return `${formatNumber(ms / 60000, 1)}m`;
  return `${formatNumber(ms / 3600000, 1)}h`;
}

/**
 * Format date in localized format
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

// ═══════════════════════════════════════════════════════════════════════════
// STRING FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Title case string
 */
export function titleCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Slugify a string for URLs
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ═══════════════════════════════════════════════════════════════════════════
// CHEMICAL FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format molecular formula with subscripts
 */
export function formatFormula(formula: string): string {
  // Already has subscripts
  if (/[₀-₉]/.test(formula)) return formula;

  // Convert numbers to subscripts
  return formula.replace(/(\d+)/g, (num) => {
    const subscripts = '₀₁₂₃₄₅₆₇₈₉';
    return num
      .split('')
      .map((d) => subscripts[parseInt(d)])
      .join('');
  });
}

/**
 * Format SMILES for display (truncate if long)
 */
export function formatSmiles(smiles: string, maxLength: number = 30): string {
  return truncate(smiles, maxLength);
}

/**
 * Format IUPAC name for display
 */
export function formatIupacName(name: string): string {
  return titleCase(name.replace(/-/g, ' - '));
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format coordinate tuple
 */
export function formatCoordinate(
  position: [number, number, number],
  decimals: number = 3
): string {
  return `(${formatNumber(position[0], decimals)}, ${formatNumber(position[1], decimals)}, ${formatNumber(position[2], decimals)})`;
}

/**
 * Format range display
 */
export function formatRange(
  min: number,
  max: number,
  unit?: string
): string {
  const formatted = `${formatNumber(min, 2)} - ${formatNumber(max, 2)}`;
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Pluralize a word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}

/**
 * Format atom count summary
 */
export function formatAtomCount(counts: Record<string, number>): string {
  return Object.entries(counts)
    .map(([element, count]) => `${element}: ${count}`)
    .join(', ');
}

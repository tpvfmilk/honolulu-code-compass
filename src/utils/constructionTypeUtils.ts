
/**
 * Utility functions to handle conversion between database construction type format (IA, IB)
 * and code format used for lookups (I-A, I-B)
 */

/**
 * Converts from database format (IA, IB) to code format (I-A, I-B) for lookup tables
 */
export const dbToCodeFormat = (dbFormat: string): string => {
  if (!dbFormat) return '';
  
  // Special case for Type IV variants
  if (dbFormat === 'IV') {
    return 'IV-A'; // Default to IV-A for lookup
  }
  
  // Match pattern like "IA", "IB", "IIA", etc.
  const match = dbFormat.match(/^(I{1,3}|IV|V)([AB])$/);
  if (match) {
    const [_, romanNumeral, subtype] = match;
    return `${romanNumeral}-${subtype}`;
  }
  
  return dbFormat; // Return as-is if format doesn't match expected pattern
};

/**
 * Converts from code format (I-A, I-B) to database format (IA, IB)
 */
export const codeToDbFormat = (codeFormat: string): string => {
  if (!codeFormat) return '';
  
  // Replace hyphen with nothing
  return codeFormat.replace('-', '');
};

/**
 * Gets a display name for UI rendering
 */
export const getDisplayName = (format: string): string => {
  if (!format) return '';
  
  const codeFormat = format.includes('-') ? format : dbToCodeFormat(format);
  
  // Handle special naming cases
  if (codeFormat.startsWith('IV-')) {
    if (codeFormat === 'IV-HT') {
      return 'Type IV - Heavy Timber';
    }
  }
  
  return `Type ${codeFormat}`;
};


/**
 * Format a string from snake_case or kebab-case to Title Case
 * @param value The string to format
 * @param defaultValue Optional default value if the input is empty
 * @returns Formatted string in Title Case
 */
export const formatTitleCase = (value?: string, defaultValue: string = "Not Specified"): string => {
  if (!value) return defaultValue;
  
  return value.split(/[_\-\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format a number as a string with comma separators
 * @param value The number to format or a string that can be parsed as a number
 * @param defaultValue Optional default value if the input is invalid
 * @returns Formatted string with comma separators
 */
export const formatNumber = (value?: number | string, defaultValue: string = "0"): string => {
  if (value === undefined || value === null) return defaultValue;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return defaultValue;
  
  return num.toLocaleString();
};

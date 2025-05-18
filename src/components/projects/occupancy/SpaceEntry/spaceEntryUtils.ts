
import { Space } from '../types/occupancyTypes';
import { SpaceTypeInfo } from '@/services/dataService';

// Format area with commas
export const formatArea = (area: string): string => {
  const numericValue = area.replace(/[^\d]/g, '');
  if (!numericValue) return '';
  return parseInt(numericValue).toLocaleString();
};

// Get occupant load factor for a space type
export const getFactorForType = (type: string, spaceTypes: SpaceTypeInfo[]): number => {
  const spaceType = spaceTypes.find(st => st.code === type);
  return spaceType ? spaceType.occupant_load_factor : 100;
};

// Check for unusually high or low factors
export const checkDensityWarning = (type: string, spaceTypes: SpaceTypeInfo[]) => {
  const factor = getFactorForType(type, spaceTypes);
  if (factor < 15) return { warning: true, message: 'High density space' };
  if (factor > 300) return { warning: true, message: 'Very low density' };
  return { warning: false };
};

// Calculate occupant load using Math.floor instead of Math.ceil
export const calculateOccupantLoad = (area: string, factor: number): number => {
  const numArea = parseFloat(area) || 0;
  return Math.floor(numArea / factor);
};


import { Space, spaceTypesByOccupancy } from '../types';

// Calculate total area for spaces
export const calculateTotalArea = (spaces: Space[]): number => {
  return spaces.reduce((sum, space) => {
    const area = parseFloat(space.area) || 0;
    return sum + area;
  }, 0);
};

// Format area with commas
export const formatArea = (area: string): string => {
  const numericValue = area.replace(/[^\d]/g, '');
  if (!numericValue) return '';
  return parseInt(numericValue).toLocaleString();
};

// Get space types based on occupancy
export const getSpaceTypes = (primaryOccupancy: string) => {
  const baseOccupancy = primaryOccupancy?.split('-')[0] || 'B';
  return spaceTypesByOccupancy[baseOccupancy] || 
         spaceTypesByOccupancy[Object.keys(spaceTypesByOccupancy)[0]];
};

// Get occupant load factor for a space type
export const getFactorForType = (spaceType: string, primaryOccupancy: string): number => {
  const spaceTypes = getSpaceTypes(primaryOccupancy);
  const type = spaceTypes.find(st => st.value === spaceType);
  return type ? type.factor : 100;
};

// Calculate occupant load for a space
export const calculateSpaceOccupantLoad = (space: Space, primaryOccupancy: string): number => {
  if (!space.type || !space.area) return 0;
  const area = parseFloat(space.area) || 0;
  const factor = getFactorForType(space.type, primaryOccupancy);
  return Math.ceil(area / factor);
};

// Check for unusually high or low factors
export const checkDensityWarning = (spaceType: string, primaryOccupancy: string) => {
  const factor = getFactorForType(spaceType, primaryOccupancy);
  if (factor < 15) return { warning: true, message: 'High density space' };
  if (factor > 300) return { warning: true, message: 'Very low density' };
  return { warning: false };
};

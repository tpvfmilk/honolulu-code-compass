
import type { Space } from '../types/occupancyDefinitions';
import { SpaceWithLoad } from '../types/occupancyTypes';

// Calculate occupant loads for all spaces
export const calculateOccupantLoad = (spaces: Space[], primaryOccupancy: string): {
  total: number;
  bySpace: SpaceWithLoad[];
  worstCase: number;
  hasHighDensity: boolean;
} => {
  let totalLoad = 0;
  let worstCaseLoad = 0;
  let hasHighDensitySpace = false;
  
  const spaceDetails = spaces.map(space => {
    // Get the space type info from the occupancy group database
    // Note: In the actual implementation, we'd fetch this from the database
    const factor = typeof space.loadFactor === 'number' 
      ? space.loadFactor 
      : parseInt(String(space.loadFactor)) || 100; // Default to 100 if not specified
    
    const area = parseFloat(space.area) || 0;
    
    // Use Math.floor to round down to the lowest whole number
    const spaceLoad = Math.floor(area / factor);
    
    totalLoad += spaceLoad;
    worstCaseLoad = Math.max(worstCaseLoad, spaceLoad);
    
    // Check for high density (factor < 15)
    const isHighDensity = factor < 15;
    if (isHighDensity) hasHighDensitySpace = true;
    
    return {
      ...space,
      loadFactor: factor,
      occupantLoad: spaceLoad,
      calculation: `${area} sf ÷ ${factor} = ${spaceLoad} people`,
      highDensity: isHighDensity,
      type: space.type || space.spaceType // Ensure type is always populated
    };
  });
  
  return {
    total: totalLoad,
    bySpace: spaceDetails,
    worstCase: worstCaseLoad,
    hasHighDensity: hasHighDensitySpace
  };
};

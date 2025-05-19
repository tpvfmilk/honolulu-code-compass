
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
  
  console.log("Calculating occupant load with spaces:", spaces);
  
  const spaceDetails = spaces.map(space => {
    // Get the load factor from the space object if available
    // This should be the primary source of the load factor
    const factor = typeof space.loadFactor === 'number' 
      ? space.loadFactor 
      : parseInt(String(space.loadFactor)) || 100; // Default to 100 if not specified
    
    const area = parseFloat(space.area) || 0;
    
    // Use Math.ceil to round up to the next whole number as per IBC
    const spaceLoad = Math.ceil(area / factor);
    
    totalLoad += spaceLoad;
    worstCaseLoad = Math.max(worstCaseLoad, spaceLoad);
    
    // Check for high density (factor < 15)
    const isHighDensity = factor < 15;
    if (isHighDensity) hasHighDensitySpace = true;
    
    console.log(`Space ${space.name} (type: ${space.type}, spaceType: ${space.spaceType}): ${area} sf ÷ ${factor} = ${spaceLoad} people`);
    
    return {
      ...space,
      loadFactor: factor,
      occupantLoad: spaceLoad,
      calculation: `${area} sf ÷ ${factor} = ${spaceLoad} people`,
      highDensity: isHighDensity,
      type: space.type || "", // Ensure type is always populated with the code
      spaceType: space.spaceType || "", // Keep the space type name
      occupancyType: space.occupancyType || primaryOccupancy // Use occupancyType for display only
    };
  });
  
  return {
    total: totalLoad,
    bySpace: spaceDetails,
    worstCase: worstCaseLoad,
    hasHighDensity: hasHighDensitySpace
  };
};

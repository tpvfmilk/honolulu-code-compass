
import type { Space } from '../types/occupancyDefinitions';
import { spaceTypesByOccupancy } from '../types/occupancyDefinitions';
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
    // Find space type info
    const occupancyKey = Object.keys(spaceTypesByOccupancy).find(key => 
      key === primaryOccupancy || key.startsWith(primaryOccupancy)
    ) || 'B';
    
    const spaceTypeInfo = spaceTypesByOccupancy[occupancyKey]?.find(
      st => st.value === space.type
    ) || { factor: 100, label: 'Unknown' };
    
    const factor = spaceTypeInfo.factor;
    const area = parseFloat(space.area) || 0;
    const spaceLoad = Math.ceil(area / factor);
    
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
      highDensity: isHighDensity
    };
  });
  
  return {
    total: totalLoad,
    bySpace: spaceDetails,
    worstCase: worstCaseLoad,
    hasHighDensity: hasHighDensitySpace
  };
};

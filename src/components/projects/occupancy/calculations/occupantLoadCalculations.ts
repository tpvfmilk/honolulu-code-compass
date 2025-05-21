
import type { Space } from '../types/occupancyDefinitions';
import { SpaceWithLoad } from '../types/occupancyTypes';
import { fetchAllSpaceTypes } from '@/services/dataService';

// Calculate occupant loads for all spaces
export const calculateOccupantLoad = async (spaces: Space[], primaryOccupancy: string): Promise<{
  total: number;
  bySpace: SpaceWithLoad[];
  worstCase: number;
  hasHighDensity: boolean;
}> => {
  let totalLoad = 0;
  let worstCaseLoad = 0;
  let hasHighDensitySpace = false;
  
  console.log("Calculating occupant load with spaces:", spaces);
  
  // Get the latest space types from database for accurate load factors
  let spaceTypesFromDb;
  try {
    spaceTypesFromDb = await fetchAllSpaceTypes();
    console.log("Fetched space types for calculations:", spaceTypesFromDb);
  } catch (error) {
    console.error("Error fetching space types for calculations:", error);
    spaceTypesFromDb = [];
  }
  
  const spaceDetails = spaces.map(space => {
    // First try to get load factor from database by space type code
    let factor;
    if (space.type && spaceTypesFromDb && spaceTypesFromDb.length > 0) {
      const spaceType = spaceTypesFromDb.find(t => t.code === space.type);
      if (spaceType) {
        console.log(`Found space type in DB for ${space.name}: ${spaceType.name} with factor ${spaceType.occupant_load_factor}`);
        factor = spaceType.occupant_load_factor;
      }
    }
    
    // If not found in DB, use the stored loadFactor in the space object
    if (!factor && space.loadFactor) {
      factor = typeof space.loadFactor === 'number' 
        ? space.loadFactor 
        : parseInt(String(space.loadFactor));
    }
    
    // Default fallback
    if (!factor) factor = 100;
    
    console.log(`Using load factor for ${space.name}: ${factor}`);
    
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

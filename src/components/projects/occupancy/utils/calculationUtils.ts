
import { Space, TravelDistances } from '../types/occupancyDefinitions';
import { SpaceWithLoad } from '../types/occupancyTypes';
import { OccupancyCalculationResults, TravelLimits } from '../types/calculationTypes';
import {
  calculateExitRequirements,
  validateTravelDistances,
  calculateCorridorRequirements,
  calculateAccessibilityRequirements,
  calculateOverallCompliance
} from '../calculations';
import { calculateOccupantLoad } from '../calculations/occupantLoadCalculations';

/**
 * Main calculation function for occupancy results
 */
export const calculateOccupancyResults = async (
  spaces: Space[],
  travelDistances: TravelDistances,
  numberOfEmployees: string,
  isPublicAccommodation: boolean,
  elevatorProvided: boolean,
  totalParkingSpaces: string,
  primaryOccupancy: string,
  isSprinklered: boolean,
  stories: string,
  totalBuildingArea: string
): Promise<OccupancyCalculationResults> => {
  // Calculate occupant loads - now properly awaiting the result
  const occupantLoad = await calculateOccupantLoad(spaces, primaryOccupancy);
  
  // Calculate exit requirements
  const exitRequirements = calculateExitRequirements(occupantLoad.total);
  
  // Validate travel distances
  const travelDistanceCompliance = validateTravelDistances(
    travelDistances,
    primaryOccupancy,
    isSprinklered
  );
  
  // Calculate corridor requirements
  const corridorRequirements = calculateCorridorRequirements(
    occupantLoad.total,
    primaryOccupancy
  );
  
  // Calculate accessibility requirements
  const accessibilityRequirements = calculateAccessibilityRequirements(
    numberOfEmployees,
    isPublicAccommodation,
    elevatorProvided,
    stories,
    totalBuildingArea,
    totalParkingSpaces
  );
  
  // Calculate overall compliance
  const overallCompliance = calculateOverallCompliance(
    travelDistanceCompliance,
    occupantLoad,
    exitRequirements,
    { ...accessibilityRequirements, elevatorProvided }
  );
  
  return {
    occupantLoad,
    exitRequirements,
    travelDistanceCompliance,
    corridorRequirements,
    accessibilityRequirements,
    overallCompliance
  };
};

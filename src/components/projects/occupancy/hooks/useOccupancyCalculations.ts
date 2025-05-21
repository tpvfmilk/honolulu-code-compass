
import { useState, useEffect } from 'react';
import { FormData } from '../../types';
import { OccupancyCalculationResults, SpaceWithLoad, ComplianceIssue, TravelLimits } from '../types/calculationTypes';
import { 
  calculateExitRequirements,
  validateTravelDistances,
  calculateCorridorRequirements,
  calculateAccessibilityRequirements,
  calculateOverallCompliance
} from '../calculations';
import { calculateOccupantLoad } from '../calculations/occupantLoadCalculations';
import { OccupancyCalculationsProps } from '../types/occupancyCalculationProps';

// Re-export types from the types file
export type { TravelDistances } from '../types/occupancyDefinitions';
export type { SpaceWithLoad, ComplianceIssue, TravelLimits };

export const useOccupancyCalculations = (props: FormData | OccupancyCalculationsProps) => {
  const [calculations, setCalculations] = useState<OccupancyCalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Check if we're using FormData or OccupancyCalculationsProps
    const occupancyDetails = 'occupancyDetails' in props ? props.occupancyDetails : null;
    if (!occupancyDetails) return;
    
    setIsCalculating(true);
    
    // Get primary occupancy group (e.g., 'B' from 'B')
    const occupancyGroup = 'occupancyGroup' in props ? props.occupancyGroup : "";
    const primaryOccupancy = String(occupancyGroup).split('-')[0] || 'B';
    const isSprinklered = 'sprinklerSystem' in props ? props.sprinklerSystem : false;
    const stories = 'stories' in props ? props.stories : '1';
    const totalBuildingArea = 'totalBuildingArea' in props ? props.totalBuildingArea : '0';
    
    // Calculate with slight delay to show loading state
    const timer = setTimeout(async () => {
      try {
        // Calculate occupant loads
        const occupantLoad = await calculateOccupantLoad(
          occupancyDetails.spaces,
          primaryOccupancy
        );
        
        // Calculate exit requirements
        const exitRequirements = calculateExitRequirements(occupantLoad.total);
        
        // Validate travel distances
        const travelDistanceCompliance = validateTravelDistances(
          occupancyDetails.travelDistances,
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
          occupancyDetails.numberOfEmployees,
          occupancyDetails.isPublicAccommodation,
          occupancyDetails.elevatorProvided,
          stories,
          totalBuildingArea,
          occupancyDetails.totalParkingSpaces
        );
        
        // Calculate overall compliance
        const overallCompliance = calculateOverallCompliance(
          travelDistanceCompliance,
          occupantLoad,
          exitRequirements,
          { ...accessibilityRequirements, elevatorProvided: occupancyDetails.elevatorProvided }
        );
        
        const results: OccupancyCalculationResults = {
          occupantLoad,
          exitRequirements,
          travelDistanceCompliance,
          corridorRequirements,
          accessibilityRequirements,
          overallCompliance
        };
        
        setCalculations(results);
      } catch (error) {
        console.error("Error calculating occupancy results:", error);
      } finally {
        setIsCalculating(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [props]);
  
  return { calculations, isCalculating };
};

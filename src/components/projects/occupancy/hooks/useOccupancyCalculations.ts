
import { useState, useEffect } from 'react';
import { FormData } from '../../types';
import { OccupancyCalculationResults, SpaceWithLoad, ComplianceIssue, TravelLimits } from '../types/calculationTypes';
import { calculateOccupancyResults } from '../utils/calculationUtils';
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
    const primaryOccupancy = ('occupancyGroup' in props ? props.occupancyGroup : props.occupancyGroup)?.split('-')[0] || 'B';
    const isSprinklered = 'sprinklerSystem' in props ? props.sprinklerSystem : props.sprinklerSystem || false;
    const stories = 'stories' in props ? props.stories : props.stories || '1';
    const totalBuildingArea = 'totalBuildingArea' in props ? props.totalBuildingArea : props.totalBuildingArea || '0';
    
    // Calculate with slight delay to show loading state
    const timer = setTimeout(() => {
      const results = calculateOccupancyResults(
        occupancyDetails.spaces,
        occupancyDetails.travelDistances,
        occupancyDetails.numberOfEmployees,
        occupancyDetails.isPublicAccommodation,
        occupancyDetails.elevatorProvided,
        occupancyDetails.totalParkingSpaces,
        primaryOccupancy,
        isSprinklered,
        stories,
        totalBuildingArea
      );
      
      setCalculations(results);
      setIsCalculating(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [props]);
  
  return { calculations, isCalculating };
};

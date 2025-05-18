
import { useState, useEffect } from 'react';
import { FormData } from '../../types';
import { OccupancyCalculationResults, SpaceWithLoad, ComplianceIssue, TravelLimits } from '../types/calculationTypes';
import { calculateOccupancyResults } from '../utils/calculationUtils';

// Re-export types from the types file
export type { TravelDistances } from '../types/occupancyDefinitions';
export type { SpaceWithLoad, ComplianceIssue, TravelLimits };

export const useOccupancyCalculations = (formData: FormData) => {
  const [calculations, setCalculations] = useState<OccupancyCalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!formData.occupancyDetails) return;
    
    setIsCalculating(true);
    
    // Get primary occupancy group (e.g., 'B' from 'B')
    const primaryOccupancy = formData.occupancyGroup?.split('-')[0] || 'B';
    const isSprinklered = formData.sprinklerSystem || false;
    
    // Calculate with slight delay to show loading state
    const timer = setTimeout(() => {
      const results = calculateOccupancyResults(
        formData.occupancyDetails.spaces,
        formData.occupancyDetails.travelDistances,
        formData.occupancyDetails.numberOfEmployees,
        formData.occupancyDetails.isPublicAccommodation,
        formData.occupancyDetails.elevatorProvided,
        formData.occupancyDetails.totalParkingSpaces,
        primaryOccupancy,
        isSprinklered,
        formData.stories || '1',
        formData.totalBuildingArea || '0'
      );
      
      setCalculations(results);
      setIsCalculating(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [formData]);
  
  return { calculations, isCalculating };
};

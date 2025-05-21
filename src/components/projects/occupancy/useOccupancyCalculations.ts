
import { useState, useEffect } from 'react';
import { FormData } from '../types';
import { OccupancyCalculationResults } from './types/occupancyTypes';
import {
  calculateExitRequirements,
  validateTravelDistances,
  calculateCorridorRequirements,
  calculateAccessibilityRequirements,
  calculateOverallCompliance
} from './calculations';
import { calculateOccupantLoad } from './calculations/occupantLoadCalculations';

// Import Space from the new location
import type { Space, TravelDistances } from './types/occupancyDefinitions';

// Re-export the TravelDistances type to fix the import error
export type { TravelDistances };

// Re-export SpaceWithLoad interface
export interface SpaceWithLoad {
  id: string;
  name: string;
  type: string;
  area: string;
  floorLevel: string;
  notes?: string;
  loadFactor: number;
  occupantLoad: number;
  calculation: string;
  highDensity?: boolean;
  occupancyType?: string; // Added this property to match the usage
}

// Re-export TravelLimits interface
export interface TravelLimits {
  maxTravel: number;
  commonPath: number;
  deadEnd: number;
}

// Re-export ComplianceIssue interface
export interface ComplianceIssue {
  type: 'warning' | 'violation';
  message: string;
  code?: string;
}

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
    const timer = setTimeout(async () => {
      try {
        const results = await calculateOccupancyResults(
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
      } catch (error) {
        console.error("Error calculating occupancy results:", error);
      } finally {
        setIsCalculating(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [formData]);
  
  return { calculations, isCalculating };
};

// Main calculation function - now properly async
const calculateOccupancyResults = async (
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

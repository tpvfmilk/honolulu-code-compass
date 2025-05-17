
import { useState, useEffect } from 'react';
import { FormData, Space } from '../types';
import { OccupancyCalculationResults, TravelDistances } from './types/occupancyTypes';
import {
  calculateOccupantLoad,
  calculateExitRequirements,
  validateTravelDistances,
  calculateCorridorRequirements,
  calculateAccessibilityRequirements,
  calculateOverallCompliance
} from './calculations';

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

// Main calculation function
const calculateOccupancyResults = (
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
): OccupancyCalculationResults => {
  // Calculate occupant loads
  const occupantLoad = calculateOccupantLoad(spaces, primaryOccupancy);
  
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

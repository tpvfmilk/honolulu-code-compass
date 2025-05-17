import { useState, useEffect } from 'react';
import { FormData, Space, travelDistanceLimits } from '../types';

export interface SpaceWithLoad extends Space {
  loadFactor: number;
  occupantLoad: number;
  calculation: string;
  highDensity?: boolean;
}

export interface TravelDistances {
  maxExitAccess: string;
  commonPath: string;
  deadEnd: string;
  roomTravel?: string;
}

export interface TravelLimits {
  maxTravel: number;
  commonPath: number;
  deadEnd: number;
}

export interface ComplianceIssue {
  type: 'warning' | 'violation';
  message: string;
  code?: string;
}

export interface OccupancyCalculationResults {
  occupantLoad: {
    total: number;
    bySpace: SpaceWithLoad[];
    worstCase: number;
    hasHighDensity: boolean;
  };
  exitRequirements: {
    requiredExits: number;
    doorWidth: number;
    stairWidth: number;
    capacityPerExit: number;
    suggestedConfig: string;
  };
  travelDistanceCompliance: {
    maxTravelCompliant: boolean;
    commonPathCompliant: boolean;
    deadEndCompliant: boolean;
    allowableLimits: TravelLimits;
    violations: string[];
  };
  corridorRequirements: {
    minWidth: number;
    fireRating: number;
    reasoning: string;
  };
  accessibilityRequirements: {
    elevatorRequired: boolean;
    accessibleParking: number;
    vanAccessible: number;
    rationale: string[];
  };
  overallCompliance: {
    percentage: number;
    issues: ComplianceIssue[];
    status: 'compliant' | 'warning' | 'violation';
  };
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

// Calculate occupant loads for all spaces
const calculateOccupantLoad = (spaces: Space[], primaryOccupancy: string): {
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

// Calculate exit requirements
const calculateExitRequirements = (occupantLoad: number) => {
  // Number of exits (IBC Table 1006.2.1)
  let requiredExits = 1;
  if (occupantLoad > 49) requiredExits = 2;
  if (occupantLoad > 500) requiredExits = 3;
  if (occupantLoad > 1000) requiredExits = 4;
  
  // Exit width requirements (inches)
  const doorWidth = Math.ceil(occupantLoad * 0.2);
  const stairWidth = Math.ceil(occupantLoad * 0.3);
  
  // Individual exit capacity
  const capacityPerExit = Math.ceil(occupantLoad / requiredExits);
  
  // Suggest door configurations
  let suggestedConfig = '';
  if (requiredExits === 1) {
    const minDoorWidth = Math.max(32, doorWidth);
    suggestedConfig = `One ${minDoorWidth}" door`;
  } else if (requiredExits === 2) {
    const eachDoorWidth = Math.max(32, Math.ceil(doorWidth / 2));
    suggestedConfig = `Two ${eachDoorWidth}" doors`;
  } else {
    const eachDoorWidth = Math.max(32, Math.ceil(doorWidth / requiredExits));
    suggestedConfig = `${requiredExits} ${eachDoorWidth}" doors`;
  }
  
  return {
    requiredExits,
    doorWidth,
    stairWidth,
    capacityPerExit,
    suggestedConfig
  };
};

// Validate travel distances
const validateTravelDistances = (
  travelDistances: TravelDistances,
  primaryOccupancy: string,
  isSprinklered: boolean
) => {
  // Get base limits from reference data
  const baseOccupancy = primaryOccupancy.charAt(0); // Just the letter part (e.g., 'B' from 'B')
  const baseLimits = travelDistanceLimits[baseOccupancy] || travelDistanceLimits['B'];
  
  // Apply sprinkler increase
  const limits = { ...baseLimits };
  if (isSprinklered) {
    limits.maxTravel = Math.round(limits.maxTravel * 1.25);
    limits.commonPath = Math.round(limits.commonPath * 1.5);
    // Dead end corridors usually don't get increases
  }
  
  // Parse distance values
  const maxTravel = parseFloat(travelDistances.maxExitAccess) || 0;
  const commonPath = parseFloat(travelDistances.commonPath) || 0;
  const deadEnd = parseFloat(travelDistances.deadEnd) || 0;
  
  // Check compliance
  const maxTravelCompliant = maxTravel <= limits.maxTravel;
  const commonPathCompliant = commonPath <= limits.commonPath;
  const deadEndCompliant = deadEnd <= limits.deadEnd;
  
  // Generate violation messages
  const violations: string[] = [];
  if (!maxTravelCompliant) {
    violations.push(`Exit access travel distance exceeds maximum by ${maxTravel - limits.maxTravel} ft`);
  }
  if (!commonPathCompliant) {
    violations.push(`Common path of travel exceeds maximum by ${commonPath - limits.commonPath} ft`);
  }
  if (!deadEndCompliant) {
    violations.push(`Dead end corridor exceeds maximum by ${deadEnd - limits.deadEnd} ft`);
  }
  
  return {
    maxTravelCompliant,
    commonPathCompliant,
    deadEndCompliant,
    allowableLimits: limits,
    violations
  };
};

// Calculate corridor requirements
const calculateCorridorRequirements = (occupantLoad: number, primaryOccupancy: string) => {
  // Base corridor width by occupancy
  let baseWidth = 44; // inches (standard)
  let fireRating = 0;
  let reasoning = "Standard corridor requirements apply";
  
  // Institutional and high-occupancy assembly get wider corridors
  if (primaryOccupancy.startsWith('I')) {
    baseWidth = 96; // 8 feet for institutional
    reasoning = "Institutional occupancies require 8' minimum corridor width";
    fireRating = 1;
  } else if (primaryOccupancy.startsWith('A') && occupantLoad > 300) {
    baseWidth = 72; // 6 feet for high-occupancy assembly
    reasoning = "Assembly occupancies with >300 occupant load require wider corridors";
    fireRating = 1;
  }
  
  // Increase width for large occupant loads
  const loadBasedWidth = occupantLoad * 0.2;
  const minWidth = Math.max(baseWidth, loadBasedWidth);
  
  return {
    minWidth: Math.ceil(minWidth),
    fireRating,
    reasoning
  };
};

// Calculate accessibility requirements
const calculateAccessibilityRequirements = (
  numberOfEmployees: string,
  isPublicAccommodation: boolean,
  elevatorProvided: boolean,
  stories: string,
  totalArea: string,
  totalParkingSpaces: string
) => {
  const employees = parseInt(numberOfEmployees) || 0;
  const multiStory = parseInt(stories) > 1;
  const buildingArea = parseFloat(totalArea) || 0;
  const parking = parseInt(totalParkingSpaces) || 0;
  
  // Determine if elevator is required
  const elevatorRequired = multiStory && (
    isPublicAccommodation || // Public buildings typically need elevators
    buildingArea > 3000 || // Larger buildings need elevators
    employees > 30 // Large employee count might trigger elevator requirements
  );
  
  // Calculate accessible parking
  const accessibleParking = Math.max(1, Math.ceil(parking * 0.02)); // Minimum 2%
  const vanAccessible = Math.ceil(accessibleParking / 6); // 1 van space per 6 accessible
  
  // Generate rationale
  const rationale: string[] = [];
  if (elevatorRequired) {
    if (isPublicAccommodation) {
      rationale.push("Public accommodation in multi-story building requires elevator");
    }
    if (buildingArea > 3000) {
      rationale.push(`Building area (${buildingArea} sf) exceeds 3,000 sf threshold for elevator exemption`);
    }
    if (employees > 30) {
      rationale.push(`Employee count (${employees}) may trigger elevator requirement`);
    }
  }
  
  return {
    elevatorRequired,
    accessibleParking,
    vanAccessible,
    rationale
  };
};

// Calculate overall compliance and generate issues
const calculateOverallCompliance = (
  travelCompliance: { violations: string[] },
  occupantLoad: { total: number, hasHighDensity: boolean },
  exitRequirements: { requiredExits: number },
  accessibilityRequirements: { elevatorRequired: boolean, elevatorProvided?: boolean }
) => {
  const issues: ComplianceIssue[] = [];
  
  // Add travel distance violations
  travelCompliance.violations.forEach(violation => {
    issues.push({ type: 'violation', message: violation, code: 'IBC 1017.1' });
  });
  
  // Check density concerns
  if (occupantLoad.hasHighDensity) {
    issues.push({ 
      type: 'warning',
      message: 'High occupant density detected - verify space planning',
      code: 'IBC 1004'
    });
  }
  
  // Check exit requirements
  if (exitRequirements.requiredExits > 1 && occupantLoad.total > 100) {
    issues.push({
      type: 'warning',
      message: 'Multiple exits required for this occupant load - verify direct access to exits',
      code: 'IBC 1006.2.1'
    });
  }
  
  // Check elevator compliance
  if (accessibilityRequirements.elevatorRequired && !accessibilityRequirements.elevatorProvided) {
    issues.push({
      type: 'violation',
      message: 'Elevator required but not provided',
      code: 'IBC Chapter 11'
    });
  }
  
  // Calculate compliance percentage
  const violationsCount = issues.filter(issue => issue.type === 'violation').length;
  const warningsCount = issues.filter(issue => issue.type === 'warning').length;
  
  // Determine overall status
  let status: 'compliant' | 'warning' | 'violation' = 'compliant';
  if (violationsCount > 0) {
    status = 'violation';
  } else if (warningsCount > 0) {
    status = 'warning';
  }
  
  // Simple percentage calculation (100% - 10% per violation - 5% per warning)
  const percentage = Math.max(0, 100 - (violationsCount * 10) - (warningsCount * 5));
  
  return {
    percentage,
    issues,
    status
  };
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

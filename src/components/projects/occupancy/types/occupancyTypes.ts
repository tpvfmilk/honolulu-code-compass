
import { Space, TravelDistances as FormTravelDistances } from '../../types';

// Re-export TravelDistances to fix the import error
export interface TravelDistances extends FormTravelDistances {}

export interface SpaceWithLoad extends Space {
  loadFactor: number;
  occupantLoad: number;
  calculation: string;
  highDensity?: boolean;
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

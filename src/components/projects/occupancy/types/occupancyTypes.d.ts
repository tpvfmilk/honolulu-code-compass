
import { Space, TravelDistances } from './occupancyDefinitions';

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
  occupancyType?: string;
}

// Occupancy details interface
export interface OccupancyDetails {
  spaces: Space[];
  travelDistances: TravelDistances;
  numberOfEmployees: string;
  isPublicAccommodation: boolean;
  elevatorProvided: boolean;
  totalParkingSpaces: string;
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
    exitWidth: number;
    stairwayWidth: number;
  };
  travelDistanceCompliance: {
    maxTravelDistance: {
      actual: number;
      limit: number;
      complies: boolean;
    };
    commonPath: {
      actual: number;
      limit: number;
      complies: boolean;
    };
    deadEnd: {
      actual: number;
      limit: number;
      complies: boolean;
    };
  };
  corridorRequirements: {
    requiredWidth: number;
    fireRating: number;
    separationRequired: boolean;
  };
  accessibilityRequirements: {
    adaptableFixtures: boolean;
    elevatorRequired: boolean;
    adaParking: {
      required: number;
      vanSpaces: number;
    };
  };
  overallCompliance: {
    issues: {
      type: 'warning' | 'violation';
      message: string;
      code?: string;
    }[];
    passedChecks: string[];
  };
}

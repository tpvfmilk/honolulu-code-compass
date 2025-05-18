
// Import from the new location
import type { Space, TravelDistances as FormTravelDistances } from './occupancyDefinitions';

// Re-export TravelDistances to fix the import error
export type { TravelDistances } from './occupancyDefinitions';
export type { ComplianceIssue, TravelLimits } from './calculationTypes';
export type { OccupancyCalculationResults } from './calculationTypes';

export interface SpaceWithLoad extends Space {
  loadFactor: number;
  occupantLoad: number;
  calculation: string;
  highDensity?: boolean;
  type: string; // Ensure type is required
}

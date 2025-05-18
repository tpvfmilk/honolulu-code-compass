
// Basic interfaces for occupancy calculations
export interface Space {
  id: string;
  name: string;
  spaceType: string;
  occupiedBy: string;
  area: string;
  floorLevel: string;
  notes?: string;
  loadFactor?: string | number; // Modified to accept both string and number to fix type compatibility
}

export interface TravelDistances {
  maxExitAccess: string;
  commonPath: string;
  deadEnd: string;
  roomTravel: string;
}

// For storing various types of occupancy requirements
export interface RequirementThreshold {
  threshold: number;
  requirement: string;
}

export interface OccupancyRequirements {
  exitCount: RequirementThreshold[];
  exitWidth: RequirementThreshold[];
  plumbingFixtures: RequirementThreshold[];
  exitSigns: RequirementThreshold[];
  accessiblePath: RequirementThreshold[];
  accessibleEntrance: RequirementThreshold[];
}

// Types for storing space type definitions from the database
export interface SpaceTypeDefinition {
  id: string;
  code: string;
  name: string;
  description?: string;
  occupant_load_factor: number;
  occupancy_group_id: string;
}

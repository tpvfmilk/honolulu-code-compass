
// Add this file to fix type issues with Space and SpaceWithLoad

export interface Space {
  id: string;
  name: string;
  type: string;
  area: string;
  floorLevel: string;
  notes: string;
  spaceType: string;
  occupiedBy: string;
}

export interface SpaceWithLoad extends Space {
  load: number;
  occupantLoad: number;
  type: string; // Ensure this is required, not optional
}

export type ComplianceIssue = {
  type: 'violation' | 'warning' | 'info';
  message: string;
  code: string;
};

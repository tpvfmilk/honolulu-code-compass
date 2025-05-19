
// Space interface
export interface Space {
  id: string;
  name: string;
  type: string;
  area: string;
  floorLevel: string;
  notes?: string;
  spaceType?: string;
  occupiedBy?: string;
  loadFactor?: string | number;
  occupancyType?: string;  // New field for Occupancy Group
}

// Travel distance values
export interface TravelDistances {
  maxExitAccess: string;
  commonPath: string;
  deadEnd: string;
  roomTravel: string;
}

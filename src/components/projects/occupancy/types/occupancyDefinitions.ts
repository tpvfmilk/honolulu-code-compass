// Common types for occupancy calculations and forms

// Space and occupancy-related interfaces
export interface Space {
  id: string;
  name: string;
  type: string;
  area: string;
  floorLevel: string;
  notes?: string;
  loadFactor?: string; // Added to store load factor from database
}

export interface TravelDistances {
  maxExitAccess: string;
  commonPath: string;
  deadEnd: string;
  roomTravel: string;
}

export interface OccupancyDetails {
  spaces: Space[];
  travelDistances: TravelDistances;
  numberOfEmployees: string;
  isPublicAccommodation: boolean;
  elevatorProvided: boolean;
  totalParkingSpaces: string;
}

// Space types by occupancy group
export const spaceTypesByOccupancy: Record<string, Array<{value: string, label: string, factor: number}>> = {
  'B': [
    { value: 'office', label: 'Office Space', factor: 150 },
    { value: 'conference', label: 'Conference Room', factor: 15 },
    { value: 'reception', label: 'Reception Area', factor: 30 },
    { value: 'break_room', label: 'Break Room', factor: 15 },
    { value: 'storage', label: 'Storage', factor: 300 },
    { value: 'mechanical', label: 'Mechanical Room', factor: 300 },
    { value: 'electrical', label: 'Electrical Room', factor: 300 },
    { value: 'corridor', label: 'Corridor', factor: 100 },
    { value: 'restroom', label: 'Restroom', factor: 300 }
  ],
  'A-2': [
    { value: 'dining', label: 'Dining Area', factor: 15 },
    { value: 'kitchen', label: 'Kitchen', factor: 200 },
    { value: 'bar_standing', label: 'Bar (Standing)', factor: 5 },
    { value: 'bar_seating', label: 'Bar (Seating)', factor: 12 }
  ],
  'A-3': [
    { value: 'assembly_unconcentrated', label: 'Assembly - Unconcentrated', factor: 15 },
    { value: 'assembly_concentrated', label: 'Assembly - Concentrated', factor: 7 },
    { value: 'assembly_standing', label: 'Assembly - Standing', factor: 5 },
    { value: 'lobby', label: 'Lobby', factor: 100 }
  ],
  'R-1': [
    { value: 'guest_room', label: 'Guest Room', factor: 200 },
    { value: 'lobby', label: 'Lobby', factor: 100 }
  ],
  'R-2': [
    { value: 'dwelling_unit', label: 'Dwelling Unit', factor: 200 },
    { value: 'common_area', label: 'Common Area', factor: 50 }
  ]
};

// Travel distance limits by occupancy type
export const travelDistanceLimits: Record<string, {maxTravel: number, commonPath: number, deadEnd: number}> = {
  'A': { maxTravel: 200, commonPath: 75, deadEnd: 20 },
  'B': { maxTravel: 200, commonPath: 100, deadEnd: 50 },
  'E': { maxTravel: 150, commonPath: 75, deadEnd: 20 },
  'I-2': { maxTravel: 150, commonPath: 30, deadEnd: 30 },
  'R': { maxTravel: 200, commonPath: 125, deadEnd: 50 }
};

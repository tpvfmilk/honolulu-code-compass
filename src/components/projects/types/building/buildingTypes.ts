
import { OccupancyGroup } from './buildingClassificationTypes';

export interface SecondaryOccupancy {
  group: OccupancyGroup | "";
  area: string;
  floorLevel: string;
}

// Fire Alarm System Types
export type FireAlarmType = "Manual" | "Automatic" | "Emergency Voice" | "";

// Fire Safety Data
export interface FireSafetyData {
  separationDistance: string;
  hasMixedOccupancy: boolean;
  occupancySeparationType: 'separated' | 'non-separated' | '';
  secondaryOccupancies: SecondaryOccupancy[];
  fireAlarmRequired: boolean;
  fireAlarmType: string;
  standpipeRequired: boolean;
  emergencyPower: boolean;
}

// Fire safety calculation reference data
export const ibcReferences = {
  exteriorWalls: "IBC Section 705",
  fireRatings: "IBC Table 705.8",
  openingProtectives: "IBC Table 716.1",
  occupancySeparation: "IBC Table 508.4",
  corridorRatings: "IBC Table 1020.1",
  incidentalUses: "IBC Table 509",
  shafts: "IBC Section 713",
  fireDampers: "IBC Section 717"
};

// Occupancy separation requirements reference data
export const occupancySeparationTable = {
  // Format: 'OccupancyA-to-OccupancyB': hours
  // For sprinklered buildings (most common)
  'A-1-to-A-2': 1, 'A-1-to-A-3': 1, 'A-1-to-A-4': 1, 'A-1-to-A-5': 1,
  'A-1-to-B': 1, 'A-1-to-E': 2, 'A-1-to-F-1': 2, 'A-1-to-F-2': 1,
  'A-1-to-H-1': 3, 'A-1-to-H-2': 3, 'A-1-to-H-3': 3, 'A-1-to-H-4': 2,
  'A-1-to-H-5': 2, 'A-1-to-I-1': 2, 'A-1-to-I-2': 2, 'A-1-to-I-3': 2,
  'A-1-to-I-4': 2, 'A-1-to-M': 1, 'A-1-to-R-1': 1, 'A-1-to-R-2': 1,
  'A-1-to-R-3': 1, 'A-1-to-R-4': 1, 'A-1-to-S-1': 1, 'A-1-to-S-2': 1,
  'A-1-to-U': 1,
  
  'B-to-B': 0, 'B-to-E': 1, 'B-to-F-1': 1, 'B-to-F-2': 1,
  'B-to-H-1': 3, 'B-to-H-2': 3, 'B-to-H-3': 2, 'B-to-H-4': 1,
  'B-to-H-5': 1, 'B-to-I-1': 1, 'B-to-I-2': 2, 'B-to-I-3': 1,
  'B-to-I-4': 1, 'B-to-M': 1, 'B-to-R-1': 1, 'B-to-R-2': 1,
  'B-to-R-3': 1, 'B-to-R-4': 1, 'B-to-S-1': 1, 'B-to-S-2': 0,
  'B-to-U': 0,

  'R-1-to-R-2': 0, 'R-1-to-R-3': 1, 'R-1-to-S-1': 1, 'R-1-to-S-2': 1,
  'R-1-to-U': 1, 'R-2-to-R-3': 1, 'R-2-to-S-1': 1, 'R-2-to-S-2': 1,
  'R-2-to-U': 1, 'R-3-to-S-1': 1, 'R-3-to-S-2': 1, 'R-3-to-U': 1
};

// Incidental use area ratings
export const incidentalUseTable = {
  'Furnace room where largest piece of equipment is over 400,000 Btu per hour input': 1,
  'Boiler room where largest piece of equipment is over 15 psi and 10 horsepower': 1,
  'Refrigerant machinery room': 1,
  'Parking garage (separation from other occupancies)': 1,
  'Hydrogen fuel gas rooms': 1,
  'Incinerator rooms': 2,
  'Paint shops not classified as Group H': 2,
  'Laboratory suites (sprinklered)': 1,
  'Laundry rooms over 100 square feet': 1,
  'Storage rooms over 100 square feet': 1,
  'Waste and linen collection rooms over 100 square feet': 1,
  'Electrical installations and transformers': 2
};

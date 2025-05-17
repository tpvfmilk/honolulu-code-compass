
export type FormData = {
  name: string;
  tmk: string;
  address: string;
  district: string;
  lotArea: string;
  buildingType: string;
  stories: string;
  height: string;
  isCornerLot: boolean;
  isHistoric: boolean;
  isSMA: boolean;
  // New fields for expanded building classification
  constructionType: ConstructionType | "";
  occupancyGroup: OccupancyGroup | "";
  mixedOccupancyType: MixedOccupancyType;
  secondaryOccupancies: SecondaryOccupancy[];
  groundFloorArea: string;
  totalBuildingArea: string;
  sprinklerSystem: boolean;
  sprinklerType: SprinklerType;
  fireAlarm: boolean;
  standpipe: boolean;
  highRise: boolean;
  unlimitedArea: boolean;
  // Fire Safety Fields
  fireSafety: FireSafetyData;
  // Add occupancyDetails field
  occupancyDetails: OccupancyDetails;
};

// Import occupancy-related types
import { 
  Space, 
  TravelDistances, 
  OccupancyDetails,
  spaceTypesByOccupancy,
  travelDistanceLimits
} from './occupancy/types/occupancyDefinitions';

// Re-export for backward compatibility
export type { Space, TravelDistances, OccupancyDetails };
export { spaceTypesByOccupancy, travelDistanceLimits };

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

// Building classification types
export type ConstructionType = 
  | "I-A" | "I-B" 
  | "II-A" | "II-B" 
  | "III-A" | "III-B" 
  | "IV-A" | "IV-B" 
  | "V-A" | "V-B";

export type OccupancyGroup = 
  | "A-1" | "A-2" | "A-3" | "A-4" | "A-5" 
  | "B" 
  | "E" 
  | "F-1" | "F-2" 
  | "H-1" | "H-2" | "H-3" | "H-4" | "H-5" 
  | "I-1" | "I-2" | "I-3" | "I-4" 
  | "M" 
  | "R-1" | "R-2" | "R-3" | "R-4" 
  | "S-1" | "S-2" 
  | "U";

export type SprinklerType = "NFPA-13" | "NFPA-13R" | "NFPA-13D" | "";

export type MixedOccupancyType = "None" | "Separated" | "Non-separated";

export interface SecondaryOccupancy {
  group: OccupancyGroup | "";
  area: string;
  floorLevel: string;
}

export type ZoningCalculationsState = {
  setbacks: {
    front: number;
    side: number;
    rear: number;
    streetSide?: number;
  } | null;
  heightLimits: {
    maxHeight: number;
    maxStories: number;
  } | null;
  coverage: {
    maxCoveragePercent: number;
    maxCoverage: number;
    farBase: number;
    farConditional?: number;
    maxFloorArea: number;
    maxConditionalFloorArea?: number;
  } | null;
  dwellingUnits: {
    maxUnits: number;
    allowsOhana: boolean;
    allowsADU: boolean;
    requiredParking: {
      main: number;
      ohana: number;
      adu: number;
      total: number;
    };
  } | null;
};

export const initialFormData: FormData = {
  name: "",
  tmk: "",
  address: "",
  district: "",
  lotArea: "",
  buildingType: "",
  stories: "",
  height: "",
  isCornerLot: false,
  isHistoric: false,
  isSMA: false,
  // Initialize new fields
  constructionType: "",
  occupancyGroup: "",
  mixedOccupancyType: "None",
  secondaryOccupancies: [],
  groundFloorArea: "",
  totalBuildingArea: "",
  sprinklerSystem: false,
  sprinklerType: "",
  fireAlarm: false,
  standpipe: false,
  highRise: false,
  unlimitedArea: false,
  // Initialize Fire Safety Fields
  fireSafety: {
    separationDistance: "10",
    hasMixedOccupancy: false,
    occupancySeparationType: '',
    secondaryOccupancies: [],
    fireAlarmRequired: false,
    fireAlarmType: "",
    standpipeRequired: false,
    emergencyPower: false
  },
  // Initialize occupancyDetails
  occupancyDetails: {
    spaces: [],
    travelDistances: {
      maxExitAccess: "",
      commonPath: "",
      deadEnd: "",
      roomTravel: ""
    },
    numberOfEmployees: "",
    isPublicAccommodation: false,
    elevatorProvided: false,
    totalParkingSpaces: ""
  }
};

// Zoning district data
export const zoningDistricts = [
  { value: "R-3.5", label: "R-3.5 Residential (3,500 sf minimum)", group: "Residential Districts" },
  { value: "R-5", label: "R-5 Residential (5,000 sf minimum)", group: "Residential Districts" },
  { value: "R-7.5", label: "R-7.5 Residential (7,500 sf minimum)", group: "Residential Districts" },
  { value: "R-10", label: "R-10 Residential (10,000 sf minimum)", group: "Residential Districts" },
  { value: "R-20", label: "R-20 Residential (20,000 sf minimum)", group: "Residential Districts" },
  { value: "A-1", label: "A-1 Apartment (Low Density)", group: "Apartment Districts" },
  { value: "A-2", label: "A-2 Apartment (Medium Density)", group: "Apartment Districts" },
  { value: "A-3", label: "A-3 Apartment (High Density)", group: "Apartment Districts" },
  { value: "B-1", label: "B-1 Neighborhood Business", group: "Business Districts" },
  { value: "B-2", label: "B-2 Community Business", group: "Business Districts" },
  { value: "B-3", label: "B-3 Central Business", group: "Business Districts" },
  { value: "BMX-1", label: "BMX-1 Business Mixed Use (Community)", group: "Business Districts" },
  { value: "BMX-2", label: "BMX-2 Business Mixed Use (Central)", group: "Business Districts" },
  { value: "BMX-3", label: "BMX-3 Business Mixed Use (Downtown)", group: "Business Districts" },
];

// Building types from current implementation
export const buildingTypes = [
  "Single-Family Dwelling",
  "Two-Family Dwelling",
  "Multi-Family Dwelling",
  "Commercial",
  "Mixed-Use",
  "Industrial",
  "Accessory Dwelling Unit (ADU)",
  "Other",
];

// Construction type data
export const constructionTypes = [
  { 
    group: "Type I - Fire Resistive", 
    options: [
      { value: "I-A", label: "Type I-A (Highest Fire Resistance)" },
      { value: "I-B", label: "Type I-B" }
    ]
  },
  { 
    group: "Type II - Non-Combustible", 
    options: [
      { value: "II-A", label: "Type II-A" },
      { value: "II-B", label: "Type II-B" }
    ]
  },
  { 
    group: "Type III - Limited Combustible", 
    options: [
      { value: "III-A", label: "Type III-A" },
      { value: "III-B", label: "Type III-B" }
    ]
  },
  { 
    group: "Type IV - Heavy Timber", 
    options: [
      { value: "IV-A", label: "Type IV-A" },
      { value: "IV-B", label: "Type IV-B" }
    ]
  },
  { 
    group: "Type V - Combustible", 
    options: [
      { value: "V-A", label: "Type V-A (Protected Wood Frame)" },
      { value: "V-B", label: "Type V-B (Wood Frame, Most Common)" }
    ]
  }
];

// Occupancy group data
export const occupancyGroups = [
  { 
    group: "Assembly", 
    options: [
      { value: "A-1", label: "A-1 - Assembly (Theater, Concert)" },
      { value: "A-2", label: "A-2 - Assembly (Food/Drink)" },
      { value: "A-3", label: "A-3 - Assembly (Worship, Recreation)" },
      { value: "A-4", label: "A-4 - Assembly (Indoor Sports)" },
      { value: "A-5", label: "A-5 - Assembly (Outdoor)" }
    ]
  },
  { 
    group: "Business", 
    options: [
      { value: "B", label: "B - Business" }
    ]
  },
  { 
    group: "Educational", 
    options: [
      { value: "E", label: "E - Educational" }
    ]
  },
  { 
    group: "Factory", 
    options: [
      { value: "F-1", label: "F-1 - Factory (Moderate Hazard)" },
      { value: "F-2", label: "F-2 - Factory (Low Hazard)" }
    ]
  },
  { 
    group: "Institutional", 
    options: [
      { value: "I-1", label: "I-1 - Institutional (Assisted Living)" },
      { value: "I-2", label: "I-2 - Institutional (Medical)" },
      { value: "I-3", label: "I-3 - Institutional (Detention)" },
      { value: "I-4", label: "I-4 - Institutional (Day Care)" }
    ]
  },
  { 
    group: "Mercantile", 
    options: [
      { value: "M", label: "M - Mercantile" }
    ]
  },
  { 
    group: "Residential", 
    options: [
      { value: "R-1", label: "R-1 - Residential (Hotels)" },
      { value: "R-2", label: "R-2 - Residential (Apartments)" },
      { value: "R-3", label: "R-3 - Residential (Single Family)" },
      { value: "R-4", label: "R-4 - Residential (Care Facilities)" }
    ]
  },
  { 
    group: "Storage", 
    options: [
      { value: "S-1", label: "S-1 - Storage (Moderate Hazard)" },
      { value: "S-2", label: "S-2 - Storage (Low Hazard)" }
    ]
  },
  { 
    group: "Utility", 
    options: [
      { value: "U", label: "U - Utility" }
    ]
  }
];

export type WizardStep = {
  id: string;
  label: string;
};

export const wizardSteps: WizardStep[] = [
  { id: "project", label: "Project Info" },
  { id: "zoning", label: "Zoning Info" },
  { id: "building", label: "Building Classification" },
  { id: "fire", label: "Fire Safety" },
  { id: "occupancy", label: "Occupancy Details" },
  { id: "review", label: "Review" },
];

// Fire Alarm System Types
export type FireAlarmType = "Manual" | "Automatic" | "Emergency Voice" | "";

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

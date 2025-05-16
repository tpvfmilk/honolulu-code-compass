
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
};

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
  unlimitedArea: false
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

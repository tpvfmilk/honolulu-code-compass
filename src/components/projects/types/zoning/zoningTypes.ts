
// Zoning district type
export type ZoningDistrict = {
  value: string;
  label: string;
  group: string;
};

// Zoning calculation types
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

// Zoning district data
export const zoningDistricts: ZoningDistrict[] = [
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

// Building types
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


// Construction type data
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


import { HeightAreaLimitRecord, FireRatingRecord, LoadFactorRecord, ZoningDistrict } from "./types";

// Sample height area data
export const MOCK_HEIGHT_AREA_DATA: HeightAreaLimitRecord[] = [
  {
    id: "1",
    constructionType: "V-B",
    occupancyGroup: "A-1",
    maxHeight: 40,
    maxStories: 1,
    maxAreaPerFloor: 11500,
    sprinklerHeightBonus: 20,
    sprinklerStoryBonus: 1,
    sprinklerAreaMultiplier: 2.0,
    ibcTableReference: "Table 504.3",
    notes: "Assembly fixed seating"
  },
  {
    id: "2",
    constructionType: "V-B",
    occupancyGroup: "B",
    maxHeight: 40,
    maxStories: 2,
    maxAreaPerFloor: 19000,
    sprinklerHeightBonus: 20,
    sprinklerStoryBonus: 1,
    sprinklerAreaMultiplier: 2.0,
    ibcTableReference: "Table 504.3",
    notes: "Business occupancy"
  },
  {
    id: "3",
    constructionType: "III-B",
    occupancyGroup: "R-2",
    maxHeight: 55,
    maxStories: 3,
    maxAreaPerFloor: 16000,
    sprinklerHeightBonus: 20,
    sprinklerStoryBonus: 1,
    sprinklerAreaMultiplier: 3.0,
    ibcTableReference: "Table 504.4",
    notes: "Multi-family residential"
  },
];

// Sample fire rating data
export const MOCK_FIRE_RATING_DATA: FireRatingRecord[] = [
  {
    id: "1",
    constructionType: "I-A",
    structuralFrame: 3,
    bearingWallsExterior: 3,
    bearingWallsInterior: 3,
    nonbearingPartitions: 0,
    floorConstruction: 2,
    roofConstruction: 1.5,
    ibcTableReference: "Table 601",
  },
  {
    id: "2",
    constructionType: "II-B",
    structuralFrame: 0,
    bearingWallsExterior: 0,
    bearingWallsInterior: 0,
    nonbearingPartitions: 0,
    floorConstruction: 0,
    roofConstruction: 0,
    ibcTableReference: "Table 601",
  },
];

// Sample load factor data
export const MOCK_LOAD_FACTOR_DATA: LoadFactorRecord[] = [
  {
    id: "1",
    occupancyGroup: "A-1",
    spaceType: "Fixed seating",
    loadFactor: 0,
    description: "Number of fixed seats",
    ibcTableReference: "Table 1004.5",
  },
  {
    id: "2",
    occupancyGroup: "B",
    spaceType: "Office space",
    loadFactor: 150,
    description: "Sq ft per occupant",
    ibcTableReference: "Table 1004.5",
  },
];

export const MOCK_ZONING_DISTRICTS: ZoningDistrict[] = [
  {
    id: "1",
    code: "R-3.5",
    name: "Residential",
    maxHeight: 25,
    maxStories: 2,
    setbacks: { front: 10, side: 5, rear: 5 }
  },
  {
    id: "2",
    code: "R-5",
    name: "Residential",
    maxHeight: 25,
    maxStories: 2,
    setbacks: { front: 10, side: 5, rear: 5 }
  },
  {
    id: "3",
    code: "R-7.5",
    name: "Residential",
    maxHeight: 25,
    maxStories: 2,
    setbacks: { front: 10, side: 5, rear: 5 }
  },
  {
    id: "4",
    code: "R-10",
    name: "Residential",
    maxHeight: 25,
    maxStories: 2,
    setbacks: { front: 10, side: 5, rear: 10 }
  },
  {
    id: "5",
    code: "AMX-2",
    name: "Apartment Mixed Use",
    maxHeight: 60,
    maxStories: 4,
    setbacks: { front: 10, side: 10, rear: 10 }
  },
];

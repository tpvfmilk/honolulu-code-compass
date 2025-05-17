
import { HeightAreaLimitRecord, FireRatingRecord, LoadFactorRecord } from "./types";

// Mock data for Height & Area Limits
export const mockHeightAreaData: HeightAreaLimitRecord[] = [
  {
    id: "1",
    constructionType: "V-B",
    occupancyGroup: "A-1",
    maxHeight: 40,
    maxStories: 1,
    maxAreaPerFloor: 11500,
    sprinkleredHeight: 60,
    sprinkleredStories: 2,
    sprinkleredArea: 34500,
    sprinklersAllowed: true,
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
    sprinkleredHeight: 60,
    sprinkleredStories: 3,
    sprinkleredArea: 57000,
    sprinklersAllowed: true,
    ibcTableReference: "Table 504.3",
    notes: "Business occupancy"
  },
  {
    id: "3",
    constructionType: "III-B",
    occupancyGroup: "M",
    maxHeight: 55,
    maxStories: 2,
    maxAreaPerFloor: 21500,
    sprinkleredHeight: 75,
    sprinkleredStories: 3,
    sprinkleredArea: 64500,
    sprinklersAllowed: true,
    ibcTableReference: "Table 504.3",
    notes: "Mercantile"
  },
  {
    id: "4",
    constructionType: "II-A",
    occupancyGroup: "R-2",
    maxHeight: 65,
    maxStories: 4,
    maxAreaPerFloor: 24000,
    sprinkleredHeight: 85,
    sprinkleredStories: 5,
    sprinkleredArea: 72000,
    sprinklersAllowed: true,
    ibcTableReference: "Table 504.3",
    notes: "Residential apartments"
  },
  {
    id: "5",
    constructionType: "I-A",
    occupancyGroup: "S-1",
    maxHeight: 85,
    maxStories: 5,
    maxAreaPerFloor: 48000,
    sprinkleredHeight: 105,
    sprinkleredStories: 6,
    sprinkleredArea: 144000,
    sprinklersAllowed: true,
    ibcTableReference: "Table 504.3",
    notes: "Storage moderate hazard"
  }
];

// Mock data for Fire Ratings
export const mockFireRatingsData: FireRatingRecord[] = [
  {
    id: "1",
    constructionType: "I-A",
    structuralFrame: 3,
    bearingWallsExterior: 3,
    bearingWallsInterior: 3,
    nonbearingPartitions: 0,
    floorConstruction: 2,
    roofConstruction: 1.5,
    ibcTableReference: "Table 601"
  },
  {
    id: "2",
    constructionType: "I-B",
    structuralFrame: 2,
    bearingWallsExterior: 2,
    bearingWallsInterior: 2,
    nonbearingPartitions: 0,
    floorConstruction: 2,
    roofConstruction: 1,
    ibcTableReference: "Table 601"
  },
  {
    id: "3",
    constructionType: "II-A",
    structuralFrame: 1,
    bearingWallsExterior: 1,
    bearingWallsInterior: 1,
    nonbearingPartitions: 0,
    floorConstruction: 1,
    roofConstruction: 1,
    ibcTableReference: "Table 601"
  },
  {
    id: "4",
    constructionType: "II-B",
    structuralFrame: 0,
    bearingWallsExterior: 0,
    bearingWallsInterior: 0,
    nonbearingPartitions: 0,
    floorConstruction: 0,
    roofConstruction: 0,
    ibcTableReference: "Table 601"
  },
  {
    id: "5",
    constructionType: "III-A",
    structuralFrame: 1,
    bearingWallsExterior: 2,
    bearingWallsInterior: 1,
    nonbearingPartitions: 0,
    floorConstruction: 1,
    roofConstruction: 1,
    ibcTableReference: "Table 601"
  }
];

// Mock data for Load Factors
export const mockLoadFactorsData: LoadFactorRecord[] = [
  {
    id: "1",
    occupancyGroup: "A-1",
    spaceType: "Fixed seating areas",
    loadFactor: 0,
    description: "Use actual number of fixed seats",
    ibcTableReference: "Table 1004.5"
  },
  {
    id: "2",
    occupancyGroup: "A-2",
    spaceType: "Concentrated, without fixed seating",
    loadFactor: 7,
    description: "Standing space, dining areas",
    ibcTableReference: "Table 1004.5"
  },
  {
    id: "3",
    occupancyGroup: "B",
    spaceType: "Office areas",
    loadFactor: 150,
    description: "Business areas",
    ibcTableReference: "Table 1004.5"
  },
  {
    id: "4",
    occupancyGroup: "E",
    spaceType: "Educational classroom area",
    loadFactor: 20,
    description: "Classroom areas",
    ibcTableReference: "Table 1004.5"
  },
  {
    id: "5",
    occupancyGroup: "I-2",
    spaceType: "Inpatient treatment areas",
    loadFactor: 240,
    description: "Hospital patient rooms",
    ibcTableReference: "Table 1004.5"
  }
];


// Common types for admin tables

export interface ZoningDistrict {
  id: string;
  code: string;
  name: string;
  description: string | null;
  min_lot_area: number;
  max_building_height: number;
  max_stories: number | null;
  front_setback: number;
  side_setback: number;
  rear_setback: number;
  max_lot_coverage: number;
  max_far: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface HeightAreaLimitRecord {
  id: string;
  constructionType: string;
  occupancyGroup: string;
  maxHeight: number;
  maxStories: number;
  maxAreaPerFloor: number;
  sprinklerHeightBonus: number;
  sprinklerStoryBonus: number;
  sprinklerAreaMultiplier: number;
  ibcTableReference: string;
  notes: string;
}

export interface FireRatingRecord {
  id: string;
  constructionType: string;
  structuralFrame: number;
  bearingWallsExterior: number;
  bearingWallsInterior: number;
  nonbearingPartitions: number;
  floorConstruction: number;
  roofConstruction: number;
  ibcTableReference: string;
}

export interface LoadFactorRecord {
  id: string;
  occupancyGroup: string;
  spaceType: string;
  loadFactor: number;
  description: string;
  ibcTableReference: string;
}

export interface TravelDistanceRecord {
  id: string;
  occupancyGroup: string;
  sprinklered: boolean;
  maxTravelDistance: number;
  maxCommonPath: number;
  maxDeadEnd: number;
}

export interface OccupancySeparationRecord {
  id: string;
  fromOccupancy: string;
  toOccupancy: string;
  ratingHours: number;
}

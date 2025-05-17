
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

// Database specific types for queries
export interface ConstructionTypeData {
  id: string;
  code: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OccupancyGroupData {
  id: string;
  code: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HeightAreaLimitData {
  id: string;
  construction_type_id: string;
  occupancy_group_id: string;
  max_height_ft: number;
  max_stories: number;
  base_allowable_area: number;
  sprinkler_increase_allowed: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface TravelDistanceData {
  id: string;
  occupancy_group_id: string;
  sprinklered: boolean;
  max_travel_distance_ft: number;
  max_common_path_ft: number;
  max_dead_end_ft: number;
  created_at?: string;
  updated_at?: string;
}

export interface SeparationData {
  id: string;
  from_occupancy_id: string;
  to_occupancy_id: string;
  required_rating_hours: number;
  created_at?: string;
  updated_at?: string;
}

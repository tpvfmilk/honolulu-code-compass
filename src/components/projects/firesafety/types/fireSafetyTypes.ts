
import { OccupancyGroup } from "../../types/building/buildingClassificationTypes";
import { FormData } from "../../types/projectTypes";

export interface FireSafetyData {
  separationDistance: string;
  hasMixedOccupancy: boolean;
  occupancySeparationType: string;
  secondaryOccupancies: any[];
  fireAlarmRequired: boolean;
  fireAlarmType: string;
  standpipeRequired: boolean;
  emergencyPower: boolean;
}

export interface FireSafetyCalculationsProps {
  occupancyGroup: OccupancyGroup | "";
  occupancyGroupId?: string;
  constructionType?: string;
  constructionTypeId?: string;
  zoningDistrict?: string;
  zoningDistrictId?: string;
  sprinklerSystem: boolean;
  highRise?: boolean;
  stories: string;
  fireSafety?: FireSafetyData;
  [key: string]: any; // Allow other properties for compatibility
}

export interface FireSafetyCalculations {
  exteriorWallRating: {
    rating: number;
    reference: string;
    openings?: number;
    openingProtection?: string;
    notes?: string;
  };
  occupancySeparations: {
    separations: Array<{
      from: string;
      to: string;
      rating: number;
    }>;
    required: boolean;
    reference: string;
  };
  corridorRating: {
    rating: number;
    sprinkleredExempt: boolean;
  };
  shaftRatings: {
    exitStairways: number;
    elevatorShafts: number;
    mechanicalShafts: number;
    otherShafts: number;
  };
  openingProtectives: {
    wallRatings: Array<{
      wallType: string;
      doorRating: string;
      windowRating: string;
      maxGlassArea: string;
      wallApplication: string;
    }>;
    requirements: Record<string, number>;
    reference: string;
  };
  fireDampers: {
    fireDamperLocations: string[];
    smokeDamperLocations: string[];
    exceptions: string[];
    reference: string;
  };
}

// Enhanced helper function to safely access property with better default handling
export function getProperty<K extends keyof FormData | keyof FireSafetyCalculationsProps>(
  obj: FormData | FireSafetyCalculationsProps | undefined | null,
  key: K
): any {
  // Early return for undefined/null with safe default
  if (!obj) return undefined;

  // Check for the existence of key in the object
  if (key in obj) {
    const value = obj[key as keyof typeof obj];
    
    // For 'fireSafety' key, provide a default empty object if undefined
    if (key === 'fireSafety' && value === undefined) {
      return {};
    }
    
    return value;
  }
  
  // Return appropriate defaults based on key type
  if (key === 'fireSafety') return {};
  if (key === 'sprinklerSystem') return false;
  if (key === 'highRise') return false;
  if (key === 'stories') return "1";
  if (key === 'occupancyGroup') return "";
  
  return undefined;
}


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

// Helper function to safely access property of either FormData or FireSafetyCalculationsProps
export function getProperty<K extends keyof FormData | keyof FireSafetyCalculationsProps>(
  obj: FormData | FireSafetyCalculationsProps,
  key: K
): any {
  // Early return for undefined/null
  if (!obj) return undefined;

  // Check for the existence of key in the object
  if (key in obj) {
    return obj[key as keyof typeof obj];
  }
  
  return undefined;
}

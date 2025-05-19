
import { useMemo } from "react";
import { FormData, occupancySeparationTable } from "../types";
import { OccupancyGroup } from "../types/building/buildingClassificationTypes";

interface FireSafetyCalculationsProps {
  occupancyGroup: OccupancyGroup | "";
  fireSafety: {
    separationDistance: string;
    hasMixedOccupancy: boolean;
    occupancySeparationType: string;
    secondaryOccupancies: any[];
    fireAlarmRequired: boolean;
    fireAlarmType: string;
    standpipeRequired: boolean;
    emergencyPower: boolean;
  };
  sprinklerSystem: boolean;
  stories: string;
  highRise?: boolean; // Added highRise as optional
}

// Type guard to check if input is FormData
function isFormData(input: FormData | FireSafetyCalculationsProps): input is FormData {
  return 'name' in input && 'tmk' in input;
}

export const useFireSafetyCalculations = (formData: FormData | FireSafetyCalculationsProps) => {
  // Calculate exterior wall ratings based on separation distance
  const exteriorWallRating = useMemo(() => {
    const separationDistance = parseFloat(
      isFormData(formData) 
        ? formData.fireSafety.separationDistance 
        : formData.fireSafety.separationDistance
    );
    
    if (isNaN(separationDistance)) {
      return {
        rating: 0,
        openings: 0,
        openingProtection: "N/A",
        reference: "IBC Table 705.8"
      };
    }
    
    if (separationDistance < 3) {
      return {
        rating: 3,
        openings: 0,
        openingProtection: "N/A - No openings permitted",
        reference: "IBC Table 705.8"
      };
    } else if (separationDistance < 5) {
      return {
        rating: 1,
        openings: 25,
        openingProtection: "Protected openings required",
        reference: "IBC Table 705.8"
      };
    } else if (separationDistance < 10) {
      return {
        rating: 1,
        openings: 50,
        openingProtection: "Protected openings required",
        reference: "IBC Table 705.8"
      };
    } else if (separationDistance < 15) {
      return {
        rating: 0,
        openings: 75,
        openingProtection: "Protected openings required",
        reference: "IBC Table 705.8"
      };
    } else {
      return {
        rating: 0,
        openings: 100,
        openingProtection: "No protection required",
        reference: "IBC Table 705.8"
      };
    }
  }, [isFormData(formData) ? formData.fireSafety.separationDistance : formData.fireSafety.separationDistance]);

  // Calculate occupancy separations
  const occupancySeparations = useMemo(() => {
    const results: { from: string; to: string; rating: number }[] = [];
    const primaryOccupancy = isFormData(formData) ? formData.occupancyGroup : formData.occupancyGroup;

    const hasMixedOccupancy = isFormData(formData) 
      ? formData.fireSafety.hasMixedOccupancy 
      : formData.fireSafety.hasMixedOccupancy;
    
    const occupancySeparationType = isFormData(formData) 
      ? formData.fireSafety.occupancySeparationType 
      : formData.fireSafety.occupancySeparationType;
    
    const secondaryOccupancies = isFormData(formData) 
      ? formData.fireSafety.secondaryOccupancies 
      : formData.fireSafety.secondaryOccupancies;

    if (hasMixedOccupancy && occupancySeparationType === 'separated' && primaryOccupancy) {
      // Get all secondary occupancies
      secondaryOccupancies.forEach(secondary => {
        if (!secondary.group) return;

        const key1 = `${primaryOccupancy}-to-${secondary.group}`;
        const key2 = `${secondary.group}-to-${primaryOccupancy}`;
        
        // Check both directions in the table
        let rating = occupancySeparationTable[key1] || occupancySeparationTable[key2] || 1;
        
        results.push({
          from: primaryOccupancy as string,
          to: secondary.group,
          rating
        });
      });
    }

    return results;
  }, [
    isFormData(formData) ? formData.occupancyGroup : formData.occupancyGroup, 
    isFormData(formData) ? formData.fireSafety.hasMixedOccupancy : formData.fireSafety.hasMixedOccupancy, 
    isFormData(formData) ? formData.fireSafety.occupancySeparationType : formData.fireSafety.occupancySeparationType, 
    isFormData(formData) ? formData.fireSafety.secondaryOccupancies : formData.fireSafety.secondaryOccupancies
  ]);

  // Calculate corridor rating
  const corridorRating = useMemo(() => {
    const occupancyGroupValue = isFormData(formData) ? formData.occupancyGroup : formData.occupancyGroup;
    const occupancy = String(occupancyGroupValue).split('-')[0]; // Get main group (A, B, etc.)
    const sprinklered = isFormData(formData) ? formData.sprinklerSystem : formData.sprinklerSystem;
    
    // Default corridor ratings based on IBC Table 1020.1
    switch (occupancy) {
      case 'A':
      case 'E':
        return { rating: 1, sprinkleredExempt: false };
      case 'B':
      case 'F':
      case 'M':
      case 'S':
      case 'U':
        return { rating: sprinklered ? 0 : 1, sprinkleredExempt: true };
      case 'H':
        return { rating: 1, sprinkleredExempt: false };
      case 'I':
        return { rating: sprinklered ? 0.5 : 1, sprinkleredExempt: false };
      case 'R':
        return { rating: sprinklered ? 0.5 : 1, sprinkleredExempt: false };
      default:
        return { rating: 1, sprinkleredExempt: false };
    }
  }, [
    isFormData(formData) ? formData.occupancyGroup : formData.occupancyGroup, 
    isFormData(formData) ? formData.sprinklerSystem : formData.sprinklerSystem
  ]);
  
  // Calculate shaft enclosure ratings
  const shaftRatings = useMemo(() => {
    const stories = parseInt(isFormData(formData) ? formData.stories : formData.stories) || 0;
    
    // Default shaft ratings based on IBC 713.4
    if (stories <= 3) {
      return {
        exitStairways: 1,
        elevatorShafts: 1,
        mechanicalShafts: 1,
        otherShafts: 1
      };
    } else {
      return {
        exitStairways: 2,
        elevatorShafts: 2,
        mechanicalShafts: 2,
        otherShafts: 2
      };
    }
  }, [isFormData(formData) ? formData.stories : formData.stories]);

  // Calculate opening protectives requirements
  const openingProtectives = useMemo(() => {
    return [
      {
        wallType: "1-hour fire barrier",
        doorRating: "3/4 hour (45 min)",
        windowRating: "3/4 hour (45 min)",
        maxGlassArea: "Limited by individual listing",
        wallApplication: "Corridors, occupancy separations"
      },
      {
        wallType: "2-hour fire barrier",
        doorRating: "1-1/2 hour (90 min)",
        windowRating: "1-1/2 hour (90 min)",
        maxGlassArea: "Limited by individual listing",
        wallApplication: "Exit enclosures, shafts, occupancy separations"
      },
      {
        wallType: "1-hour exterior wall",
        doorRating: "3/4 hour (45 min)",
        windowRating: "3/4 hour (45 min)",
        maxGlassArea: `${exteriorWallRating.openings}% of wall area`,
        wallApplication: "Exterior walls at 5'-15' separation distance"
      },
      {
        wallType: "2-hour exterior wall",
        doorRating: "1-1/2 hour (90 min)", 
        windowRating: "1-1/2 hour (90 min)",
        maxGlassArea: `${exteriorWallRating.openings}% of wall area`,
        wallApplication: "Exterior walls at 3'-5' separation distance"
      }
    ];
  }, [exteriorWallRating]);

  // Calculate fire/smoke damper requirements
  const fireDampers = useMemo(() => {
    const sprinklered = isFormData(formData) ? formData.sprinklerSystem : formData.sprinklerSystem;
    const highRise = isFormData(formData) ? formData.highRise : formData.highRise || false;
    
    return {
      fireDamperLocations: [
        "Ducts penetrating fire barriers",
        "Ducts penetrating fire partitions",
        "Ducts penetrating fire walls",
        "Ducts penetrating shaft enclosures"
      ],
      smokeDamperLocations: [
        "Ducts penetrating smoke barriers",
        "Ducts penetrating corridor walls required to be rated",
        ...(highRise ? ["At each floor in high-rise buildings"] : [])
      ],
      exceptions: [
        ...(sprinklered ? ["Smoke dampers not required in fully sprinklered buildings for some conditions"] : []),
        "Fire dampers not required where ducts are constructed of steel and penetration is protected"
      ],
      reference: "IBC Section 717"
    };
  }, [
    isFormData(formData) ? formData.sprinklerSystem : formData.sprinklerSystem, 
    isFormData(formData) ? formData.highRise : formData.highRise || false
  ]);

  return {
    exteriorWallRating,
    occupancySeparations,
    corridorRating,
    shaftRatings,
    openingProtectives,
    fireDampers
  };
};

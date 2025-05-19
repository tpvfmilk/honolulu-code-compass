
import { calculateExteriorWallRating } from "./exteriorWallCalculations";
import { FormData } from "../../types";
import { FireSafetyCalculationsProps } from "../types/fireSafetyTypes";
import { ibcReferences } from "../../types/building/buildingTypes";

export function calculateOpeningProtectives(formData: FormData | FireSafetyCalculationsProps) {
  const exteriorWallRating = calculateExteriorWallRating(formData);
  
  // Create the wall ratings details for display purposes
  const wallRatings = [
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
  
  // Create the requirements object for type compatibility
  const requirements: Record<string, number> = {
    "1-hour fire barrier": 45, // 45 min (3/4 hour)
    "2-hour fire barrier": 90, // 90 min (1-1/2 hour)
    "1-hour exterior wall": 45, // 45 min (3/4 hour)
    "2-hour exterior wall": 90, // 90 min (1-1/2 hour)
  };
  
  return {
    wallRatings, // Keep the detailed information for display
    requirements, // Add the requirements object for type compatibility
    reference: ibcReferences.openingProtectives
  };
}

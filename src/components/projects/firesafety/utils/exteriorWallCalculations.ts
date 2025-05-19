
import { FormData } from "../../types";
import { FireSafetyCalculationsProps, getProperty } from "../types/fireSafetyTypes";

export function calculateExteriorWallRating(formData: FormData | FireSafetyCalculationsProps | undefined | null) {
  // Handle undefined/null formData
  if (!formData) {
    return {
      rating: 0,
      openings: 100,
      openingProtection: "N/A - No data provided",
      reference: "IBC Table 705.8"
    };
  }
  
  const fireSafety = getProperty(formData, 'fireSafety') || {};
  // Safely get separation distance with fallback to "0"
  const separationDistance = parseFloat(fireSafety.separationDistance || "0");
  
  if (isNaN(separationDistance)) {
    return {
      rating: 0,
      openings: 0,
      openingProtection: "N/A - Invalid separation distance",
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
}

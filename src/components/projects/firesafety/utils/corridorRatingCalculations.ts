
import { FormData } from "../../types";
import { FireSafetyCalculationsProps, getProperty } from "../types/fireSafetyTypes";

export function calculateCorridorRating(formData: FormData | FireSafetyCalculationsProps | undefined | null) {
  // Return default values if formData is undefined
  if (!formData) {
    return { rating: 1, sprinkleredExempt: false };
  }
  
  const occupancyGroupValue = getProperty(formData, 'occupancyGroup') || "";
  const occupancy = String(occupancyGroupValue).split('-')[0] || "B"; // Get main group (A, B, etc.) with default
  const sprinklered = getProperty(formData, 'sprinklerSystem') || false;
  
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
}

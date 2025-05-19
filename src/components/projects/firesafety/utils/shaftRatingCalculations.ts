
import { FormData } from "../../types";
import { FireSafetyCalculationsProps, getProperty } from "../types/fireSafetyTypes";

export function calculateShaftRatings(formData: FormData | FireSafetyCalculationsProps) {
  const stories = parseInt(getProperty(formData, 'stories')) || 0;
  
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
}

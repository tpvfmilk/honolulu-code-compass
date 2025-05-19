
import { FormData, occupancySeparationTable } from "../../types";
import { FireSafetyCalculationsProps, getProperty } from "../types/fireSafetyTypes";
import { OccupancyGroup } from "../../types/building/buildingClassificationTypes";

export function calculateOccupancySeparations(formData: FormData | FireSafetyCalculationsProps) {
  const results: { from: string; to: string; rating: number }[] = [];
  
  const primaryOccupancy = getProperty(formData, 'occupancyGroup');
  const fireSafety = getProperty(formData, 'fireSafety');
  
  const hasMixedOccupancy = fireSafety.hasMixedOccupancy;
  const occupancySeparationType = fireSafety.occupancySeparationType;
  const secondaryOccupancies = fireSafety.secondaryOccupancies;

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
}

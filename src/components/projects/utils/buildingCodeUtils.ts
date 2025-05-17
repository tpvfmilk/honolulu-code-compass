
import { FormData, ConstructionType, OccupancyGroup } from "../types";
import { dbToCodeFormat } from "@/utils/constructionTypeUtils";

// Helper function to parse numeric values safely
const parseNumeric = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Base height limits by construction type and occupancy group (IBC Table 504.3)
const baseHeightLimits: Record<ConstructionType, Record<OccupancyGroup, number>> = {
  "I-A": { "A-1": 160, "A-2": 160, "A-3": 160, "A-4": 160, "A-5": 160, 
           "B": 160, "E": 160, "F-1": 160, "F-2": 160, 
           "H-1": 160, "H-2": 160, "H-3": 160, "H-4": 160, "H-5": 160,
           "I-1": 160, "I-2": 160, "I-3": 160, "I-4": 160, 
           "M": 160, 
           "R-1": 160, "R-2": 160, "R-3": 160, "R-4": 160,
           "S-1": 160, "S-2": 160, "U": 160 },
  "I-B": { "A-1": 65, "A-2": 65, "A-3": 65, "A-4": 65, "A-5": 65, 
           "B": 65, "E": 65, "F-1": 65, "F-2": 65, 
           "H-1": 65, "H-2": 65, "H-3": 65, "H-4": 65, "H-5": 65,
           "I-1": 65, "I-2": 65, "I-3": 65, "I-4": 65, 
           "M": 65, 
           "R-1": 65, "R-2": 65, "R-3": 65, "R-4": 65,
           "S-1": 65, "S-2": 65, "U": 65 },
  "II-A": { "A-1": 65, "A-2": 65, "A-3": 65, "A-4": 65, "A-5": 65, 
           "B": 65, "E": 65, "F-1": 65, "F-2": 65, 
           "H-1": 65, "H-2": 65, "H-3": 65, "H-4": 65, "H-5": 65,
           "I-1": 65, "I-2": 65, "I-3": 65, "I-4": 65, 
           "M": 65, 
           "R-1": 65, "R-2": 65, "R-3": 65, "R-4": 65,
           "S-1": 65, "S-2": 65, "U": 65 },
  "II-B": { "A-1": 55, "A-2": 55, "A-3": 55, "A-4": 55, "A-5": 55, 
           "B": 55, "E": 55, "F-1": 55, "F-2": 55, 
           "H-1": 55, "H-2": 55, "H-3": 55, "H-4": 55, "H-5": 55,
           "I-1": 55, "I-2": 55, "I-3": 55, "I-4": 55, 
           "M": 55, 
           "R-1": 55, "R-2": 55, "R-3": 55, "R-4": 55,
           "S-1": 55, "S-2": 55, "U": 55 },
  "III-A": { "A-1": 65, "A-2": 65, "A-3": 65, "A-4": 65, "A-5": 65, 
           "B": 65, "E": 65, "F-1": 65, "F-2": 65, 
           "H-1": 55, "H-2": 55, "H-3": 55, "H-4": 55, "H-5": 55,
           "I-1": 65, "I-2": 65, "I-3": 65, "I-4": 65, 
           "M": 65, 
           "R-1": 65, "R-2": 65, "R-3": 65, "R-4": 65,
           "S-1": 65, "S-2": 65, "U": 55 },
  "III-B": { "A-1": 55, "A-2": 55, "A-3": 55, "A-4": 55, "A-5": 55, 
           "B": 55, "E": 55, "F-1": 55, "F-2": 55, 
           "H-1": 55, "H-2": 55, "H-3": 55, "H-4": 55, "H-5": 55,
           "I-1": 55, "I-2": 55, "I-3": 55, "I-4": 55, 
           "M": 55, 
           "R-1": 55, "R-2": 55, "R-3": 55, "R-4": 55,
           "S-1": 55, "S-2": 55, "U": 55 },
  "IV-A": { "A-1": 65, "A-2": 65, "A-3": 65, "A-4": 65, "A-5": 65, 
           "B": 65, "E": 65, "F-1": 65, "F-2": 65, 
           "H-1": 65, "H-2": 65, "H-3": 65, "H-4": 65, "H-5": 65,
           "I-1": 65, "I-2": 65, "I-3": 65, "I-4": 65, 
           "M": 65, 
           "R-1": 65, "R-2": 65, "R-3": 65, "R-4": 65,
           "S-1": 65, "S-2": 65, "U": 65 },
  "IV-B": { "A-1": 55, "A-2": 55, "A-3": 55, "A-4": 55, "A-5": 55, 
           "B": 55, "E": 55, "F-1": 55, "F-2": 55, 
           "H-1": 55, "H-2": 55, "H-3": 55, "H-4": 55, "H-5": 55,
           "I-1": 55, "I-2": 55, "I-3": 55, "I-4": 55, 
           "M": 55, 
           "R-1": 55, "R-2": 55, "R-3": 55, "R-4": 55,
           "S-1": 55, "S-2": 55, "U": 55 },
  "V-A": { "A-1": 50, "A-2": 50, "A-3": 50, "A-4": 50, "A-5": 50, 
           "B": 50, "E": 50, "F-1": 50, "F-2": 50, 
           "H-1": 40, "H-2": 40, "H-3": 40, "H-4": 40, "H-5": 40,
           "I-1": 50, "I-2": 50, "I-3": 50, "I-4": 50, 
           "M": 50, 
           "R-1": 50, "R-2": 50, "R-3": 50, "R-4": 50,
           "S-1": 50, "S-2": 50, "U": 40 },
  "V-B": { "A-1": 40, "A-2": 40, "A-3": 40, "A-4": 40, "A-5": 40, 
           "B": 40, "E": 40, "F-1": 40, "F-2": 40, 
           "H-1": 40, "H-2": 40, "H-3": 40, "H-4": 40, "H-5": 40,
           "I-1": 40, "I-2": 40, "I-3": 40, "I-4": 40, 
           "M": 40, 
           "R-1": 40, "R-2": 40, "R-3": 40, "R-4": 40,
           "S-1": 40, "S-2": 40, "U": 40 }
};

// Base story limits by construction type and occupancy group (IBC Table 504.4)
const baseStoryLimits: Record<ConstructionType, Record<OccupancyGroup, number>> = {
  "I-A": { "A-1": 12, "A-2": 12, "A-3": 12, "A-4": 12, "A-5": 12, 
           "B": 12, "E": 12, "F-1": 12, "F-2": 12, 
           "H-1": 1, "H-2": 1, "H-3": 2, "H-4": 7, "H-5": 4,
           "I-1": 12, "I-2": 12, "I-3": 12, "I-4": 12, 
           "M": 12, 
           "R-1": 12, "R-2": 12, "R-3": 12, "R-4": 12,
           "S-1": 12, "S-2": 12, "U": 5 },
  "I-B": { "A-1": 5, "A-2": 5, "A-3": 5, "A-4": 5, "A-5": 5, 
           "B": 11, "E": 5, "F-1": 5, "F-2": 6, 
           "H-1": 1, "H-2": 1, "H-3": 2, "H-4": 5, "H-5": 3,
           "I-1": 4, "I-2": 4, "I-3": 4, "I-4": 5, 
           "M": 5, 
           "R-1": 11, "R-2": 11, "R-3": 11, "R-4": 11,
           "S-1": 4, "S-2": 5, "U": 4 },
  // Simplified examples for remaining types
  "II-A": { "A-1": 3, "A-2": 3, "A-3": 3, "A-4": 3, "A-5": 3, 
           "B": 5, "E": 3, "F-1": 3, "F-2": 4, 
           "H-1": 1, "H-2": 1, "H-3": 2, "H-4": 5, "H-5": 3,
           "I-1": 3, "I-2": 3, "I-3": 3, "I-4": 3, 
           "M": 4, 
           "R-1": 4, "R-2": 4, "R-3": 4, "R-4": 4,
           "S-1": 3, "S-2": 4, "U": 4 },
  "II-B": { "A-1": 2, "A-2": 2, "A-3": 2, "A-4": 2, "A-5": 2, 
           "B": 3, "E": 2, "F-1": 2, "F-2": 3, 
           "H-1": 1, "H-2": 1, "H-3": 1, "H-4": 2, "H-5": 1,
           "I-1": 2, "I-2": 1, "I-3": 1, "I-4": 2, 
           "M": 2, 
           "R-1": 4, "R-2": 4, "R-3": 4, "R-4": 4,
           "S-1": 2, "S-2": 3, "U": 2 },
  "III-A": { "A-1": 3, "A-2": 3, "A-3": 3, "A-4": 3, "A-5": 2, 
           "B": 5, "E": 3, "F-1": 3, "F-2": 4, 
           "H-1": 1, "H-2": 1, "H-3": 2, "H-4": 4, "H-5": 2,
           "I-1": 3, "I-2": 2, "I-3": 2, "I-4": 3, 
           "M": 4, 
           "R-1": 4, "R-2": 4, "R-3": 4, "R-4": 4,
           "S-1": 3, "S-2": 4, "U": 3 },
  "III-B": { "A-1": 2, "A-2": 2, "A-3": 2, "A-4": 2, "A-5": 2, 
           "B": 3, "E": 2, "F-1": 2, "F-2": 3, 
           "H-1": 1, "H-2": 1, "H-3": 1, "H-4": 2, "H-5": 1,
           "I-1": 2, "I-2": 1, "I-3": 1, "I-4": 2, 
           "M": 2, 
           "R-1": 4, "R-2": 4, "R-3": 4, "R-4": 4,
           "S-1": 2, "S-2": 3, "U": 2 },
  "IV-A": { "A-1": 3, "A-2": 3, "A-3": 3, "A-4": 3, "A-5": 2, 
           "B": 5, "E": 3, "F-1": 4, "F-2": 5, 
           "H-1": 1, "H-2": 1, "H-3": 3, "H-4": 5, "H-5": 2,
           "I-1": 3, "I-2": 2, "I-3": 2, "I-4": 3, 
           "M": 4, 
           "R-1": 4, "R-2": 4, "R-3": 4, "R-4": 4,
           "S-1": 4, "S-2": 5, "U": 4 },
  "IV-B": { "A-1": 2, "A-2": 2, "A-3": 2, "A-4": 2, "A-5": 2, 
           "B": 3, "E": 2, "F-1": 2, "F-2": 3, 
           "H-1": 1, "H-2": 1, "H-3": 2, "H-4": 2, "H-5": 1,
           "I-1": 2, "I-2": 1, "I-3": 1, "I-4": 2, 
           "M": 3, 
           "R-1": 3, "R-2": 3, "R-3": 3, "R-4": 3,
           "S-1": 2, "S-2": 3, "U": 2 },
  "V-A": { "A-1": 2, "A-2": 2, "A-3": 2, "A-4": 2, "A-5": 2, 
           "B": 3, "E": 1, "F-1": 2, "F-2": 3, 
           "H-1": 1, "H-2": 1, "H-3": 1, "H-4": 2, "H-5": 1,
           "I-1": 2, "I-2": 1, "I-3": 1, "I-4": 1, 
           "M": 1, 
           "R-1": 3, "R-2": 3, "R-3": 3, "R-4": 3,
           "S-1": 2, "S-2": 3, "U": 2 },
  "V-B": { "A-1": 1, "A-2": 1, "A-3": 1, "A-4": 1, "A-5": 1, 
           "B": 2, "E": 1, "F-1": 1, "F-2": 2, 
           "H-1": 1, "H-2": 1, "H-3": 1, "H-4": 1, "H-5": 1,
           "I-1": 1, "I-2": 1, "I-3": 1, "I-4": 1, 
           "M": 1, 
           "R-1": 2, "R-2": 2, "R-3": 3, "R-4": 2,
           "S-1": 1, "S-2": 2, "U": 1 }
};

// Base area limits by construction type and occupancy group (IBC Table 506.2)
const baseAreaLimits: Record<ConstructionType, Record<OccupancyGroup, number>> = {
  "I-A": { "A-1": 45000, "A-2": 45000, "A-3": 45000, "A-4": 45000, "A-5": 45000, 
           "B": 45000, "E": 45000, "F-1": 45000, "F-2": 45000, 
           "H-1": 21000, "H-2": 21000, "H-3": 21000, "H-4": 45000, "H-5": 45000,
           "I-1": 45000, "I-2": 45000, "I-3": 45000, "I-4": 45000, 
           "M": 45000, 
           "R-1": 45000, "R-2": 45000, "R-3": 45000, "R-4": 45000,
           "S-1": 45000, "S-2": 45000, "U": 45000 },
  // Simplified examples for remaining types
  "V-B": { "A-1": 6000, "A-2": 6000, "A-3": 6000, "A-4": 6000, "A-5": 6000, 
           "B": 9000, "E": 6000, "F-1": 6000, "F-2": 9000, 
           "H-1": 3000, "H-2": 3000, "H-3": 5000, "H-4": 9000, "H-5": 4500,
           "I-1": 6000, "I-2": 5000, "I-3": 5000, "I-4": 6000, 
           "M": 6000, 
           "R-1": 7000, "R-2": 7000, "R-3": 9000, "R-4": 7000,
           "S-1": 6000, "S-2": 9000, "U": 6000 },
  // Add all other construction types with realistic values
  "I-B": { "A-1": 30000, "A-2": 30000, "A-3": 30000, "A-4": 30000, "A-5": 30000, 
           "B": 37500, "E": 26500, "F-1": 18000, "F-2": 27000, 
           "H-1": 16500, "H-2": 16500, "H-3": 16500, "H-4": 30000, "H-5": 30000,
           "I-1": 16500, "I-2": 12000, "I-3": 12000, "I-4": 16500, 
           "M": 18000, 
           "R-1": 24000, "R-2": 24000, "R-3": 24000, "R-4": 24000,
           "S-1": 18000, "S-2": 26500, "U": 22500 },
  "II-A": { "A-1": 15000, "A-2": 15000, "A-3": 15000, "A-4": 15000, "A-5": 15000, 
           "B": 28500, "E": 14500, "F-1": 13500, "F-2": 18000, 
           "H-1": 11000, "H-2": 11000, "H-3": 11000, "H-4": 18000, "H-5": 18000,
           "I-1": 10500, "I-2": 9500, "I-3": 9500, "I-4": 10500, 
           "M": 12500, 
           "R-1": 16500, "R-2": 16500, "R-3": 16500, "R-4": 16500,
           "S-1": 13500, "S-2": 18000, "U": 14000 },
  "II-B": { "A-1": 9500, "A-2": 9500, "A-3": 9500, "A-4": 9500, "A-5": 9500, 
           "B": 19000, "E": 9500, "F-1": 8500, "F-2": 14000, 
           "H-1": 7000, "H-2": 7000, "H-3": 7000, "H-4": 10500, "H-5": 10500,
           "I-1": 7500, "I-2": 6000, "I-3": 6000, "I-4": 7500, 
           "M": 9500, 
           "R-1": 10500, "R-2": 10500, "R-3": 10500, "R-4": 10500,
           "S-1": 8500, "S-2": 13500, "U": 9000 },
  "III-A": { "A-1": 14000, "A-2": 14000, "A-3": 14000, "A-4": 14000, "A-5": 14000, 
           "B": 28500, "E": 14500, "F-1": 12000, "F-2": 18000, 
           "H-1": 9500, "H-2": 9500, "H-3": 9500, "H-4": 17000, "H-5": 17000,
           "I-1": 10500, "I-2": 9000, "I-3": 9000, "I-4": 10500, 
           "M": 13000, 
           "R-1": 12000, "R-2": 12000, "R-3": 12000, "R-4": 12000,
           "S-1": 11000, "S-2": 17000, "U": 14000 },
  "III-B": { "A-1": 9500, "A-2": 9500, "A-3": 9500, "A-4": 9500, "A-5": 9500, 
           "B": 19000, "E": 9500, "F-1": 8000, "F-2": 14000, 
           "H-1": 6500, "H-2": 6500, "H-3": 6500, "H-4": 10000, "H-5": 10000,
           "I-1": 7500, "I-2": 6000, "I-3": 6000, "I-4": 7500, 
           "M": 9000, 
           "R-1": 10500, "R-2": 10500, "R-3": 10500, "R-4": 10500,
           "S-1": 8000, "S-2": 13000, "U": 8500 },
  "IV-A": { "A-1": 18000, "A-2": 18000, "A-3": 18000, "A-4": 18000, "A-5": 18000, 
           "B": 36000, "E": 18000, "F-1": 15000, "F-2": 22500, 
           "H-1": 10500, "H-2": 10500, "H-3": 10500, "H-4": 18000, "H-5": 18000,
           "I-1": 13500, "I-2": 11500, "I-3": 11500, "I-4": 13500, 
           "M": 15000, 
           "R-1": 15000, "R-2": 15000, "R-3": 15000, "R-4": 15000,
           "S-1": 14000, "S-2": 21000, "U": 18000 },
  "IV-B": { "A-1": 10500, "A-2": 10500, "A-3": 10500, "A-4": 10500, "A-5": 10500, 
           "B": 19500, "E": 10500, "F-1": 9000, "F-2": 15000, 
           "H-1": 7500, "H-2": 7500, "H-3": 7500, "H-4": 10500, "H-5": 10500,
           "I-1": 7500, "I-2": 6000, "I-3": 6000, "I-4": 7500, 
           "M": 10000, 
           "R-1": 12000, "R-2": 12000, "R-3": 12000, "R-4": 12000,
           "S-1": 9000, "S-2": 15000, "U": 9000 },
  "V-A": { "A-1": 8500, "A-2": 8500, "A-3": 8500, "A-4": 8500, "A-5": 8500, 
           "B": 18000, "E": 8500, "F-1": 7500, "F-2": 11500, 
           "H-1": 5500, "H-2": 5500, "H-3": 5500, "H-4": 9000, "H-5": 9000,
           "I-1": 6000, "I-2": 5000, "I-3": 5000, "I-4": 6000, 
           "M": 8000, 
           "R-1": 10500, "R-2": 10500, "R-3": 10500, "R-4": 10500,
           "S-1": 7000, "S-2": 11000, "U": 7500 }
};

// Calculate allowable height based on construction type and occupancy
export function calculateAllowableHeight(formData: FormData): number {
  if (!formData.constructionType || !formData.occupancyGroup) {
    return 0;
  }
  
  try {
    // Convert database format to code format for lookup
    const constructionTypeFormatted = dbToCodeFormat(formData.constructionType);
    console.log('DB Construction Type:', formData.constructionType);
    console.log('Converted Construction Type:', constructionTypeFormatted);
    
    // Cast to proper types
    const constructionType = constructionTypeFormatted as ConstructionType;
    const occupancyGroup = formData.occupancyGroup as OccupancyGroup;
    
    if (!baseHeightLimits[constructionType]) {
      console.error('Construction type not found in height limits:', constructionType);
      return 0;
    }
    
    if (!baseHeightLimits[constructionType][occupancyGroup]) {
      console.error('Occupancy group not found for this construction type:', occupancyGroup);
      return 0;
    }
    
    let allowableHeight = baseHeightLimits[constructionType][occupancyGroup];
    
    // Apply sprinkler increase if applicable (IBC 504.2)
    if (formData.sprinklerSystem && formData.sprinklerType === "NFPA-13") {
      // For fully sprinklered buildings with NFPA 13 systems
      allowableHeight += 20; // 20 foot increase
    }
    
    return allowableHeight;
  } catch (error) {
    console.error("Error calculating allowable height:", error);
    return 0;
  }
}

// Calculate allowable stories based on construction type and occupancy
export function calculateAllowableStories(formData: FormData): number {
  if (!formData.constructionType || !formData.occupancyGroup) {
    return 0;
  }
  
  try {
    // Convert database format to code format for lookup
    const constructionTypeFormatted = dbToCodeFormat(formData.constructionType);
    
    // Cast to proper types
    const constructionType = constructionTypeFormatted as ConstructionType;
    const occupancyGroup = formData.occupancyGroup as OccupancyGroup;
    
    if (!baseStoryLimits[constructionType]) {
      console.error('Construction type not found in story limits:', constructionType);
      return 0;
    }
    
    if (!baseStoryLimits[constructionType][occupancyGroup]) {
      console.error('Occupancy group not found for this construction type:', occupancyGroup);
      return 0;
    }
    
    let allowableStories = baseStoryLimits[constructionType][occupancyGroup];
    
    // Apply sprinkler increase if applicable (IBC 504.2)
    if (formData.sprinklerSystem && formData.sprinklerType === "NFPA-13") {
      // For fully sprinklered buildings with NFPA 13 systems
      allowableStories += 1; // One story increase
    }
    
    return allowableStories;
  } catch (error) {
    console.error("Error calculating allowable stories:", error);
    return 0;
  }
}

// Calculate allowable area based on construction type and occupancy
export function calculateAllowableArea(formData: FormData): number {
  if (!formData.constructionType || !formData.occupancyGroup) {
    return 0;
  }
  
  try {
    // Convert database format to code format for lookup
    const constructionTypeFormatted = dbToCodeFormat(formData.constructionType);
    
    // Cast to proper types  
    const constructionType = constructionTypeFormatted as ConstructionType;
    const occupancyGroup = formData.occupancyGroup as OccupancyGroup;
    
    if (!baseAreaLimits[constructionType]) {
      console.error('Construction type not found in area limits:', constructionType);
      return 0;
    }
    
    if (!baseAreaLimits[constructionType][occupancyGroup]) {
      console.error('Occupancy group not found for this construction type:', occupancyGroup);
      return 0;
    }
    
    let baseArea = baseAreaLimits[constructionType][occupancyGroup];
    
    // Apply sprinkler increase if applicable (IBC 506.3)
    if (formData.sprinklerSystem && formData.sprinklerType === "NFPA-13") {
      // For fully sprinklered buildings with NFPA 13 systems
      baseArea *= 3; // 300% increase (3x) for sprinklered buildings
    }
    
    return baseArea;
  } catch (error) {
    console.error("Error calculating allowable area:", error);
    return 0;
  }
}

// Helper function to check if a value is within a warning threshold
export function isWithinWarningThreshold(actual: number, allowable: number): boolean {
  return actual > (allowable * 0.9) && actual <= allowable;
}

// Helper function to check all compliance
export function getBuildingCompliance(formData: FormData) {
  const actualHeight = parseNumeric(formData.height);
  const actualStories = parseNumeric(formData.stories);
  const actualArea = parseNumeric(formData.totalBuildingArea);
  
  const allowableHeight = calculateAllowableHeight(formData);
  const allowableStories = calculateAllowableStories(formData);
  const allowableArea = calculateAllowableArea(formData);
  
  return {
    height: {
      actual: actualHeight,
      allowable: allowableHeight,
      compliant: actualHeight <= allowableHeight,
      warning: isWithinWarningThreshold(actualHeight, allowableHeight)
    },
    stories: {
      actual: actualStories,
      allowable: allowableStories,
      compliant: actualStories <= allowableStories,
      warning: isWithinWarningThreshold(actualStories, allowableStories)
    },
    area: {
      actual: actualArea,
      allowable: allowableArea,
      compliant: actualArea <= allowableArea,
      warning: isWithinWarningThreshold(actualArea, allowableArea)
    }
  };
}

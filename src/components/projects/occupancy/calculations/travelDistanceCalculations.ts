
import { travelDistanceLimits } from '../../types';
import { TravelDistances, TravelLimits } from '../types/occupancyTypes';

// Validate travel distances
export const validateTravelDistances = (
  travelDistances: TravelDistances,
  primaryOccupancy: string,
  isSprinklered: boolean
) => {
  // Get base limits from reference data
  const baseOccupancy = primaryOccupancy.charAt(0); // Just the letter part (e.g., 'B' from 'B')
  const baseLimits = travelDistanceLimits[baseOccupancy] || travelDistanceLimits['B'];
  
  // Apply sprinkler increase
  const limits = { ...baseLimits };
  if (isSprinklered) {
    limits.maxTravel = Math.round(limits.maxTravel * 1.25);
    limits.commonPath = Math.round(limits.commonPath * 1.5);
    // Dead end corridors usually don't get increases
  }
  
  // Parse distance values
  const maxTravel = parseFloat(travelDistances.maxExitAccess) || 0;
  const commonPath = parseFloat(travelDistances.commonPath) || 0;
  const deadEnd = parseFloat(travelDistances.deadEnd) || 0;
  
  // Check compliance
  const maxTravelCompliant = maxTravel <= limits.maxTravel;
  const commonPathCompliant = commonPath <= limits.commonPath;
  const deadEndCompliant = deadEnd <= limits.deadEnd;
  
  // Generate violation messages
  const violations: string[] = [];
  if (!maxTravelCompliant) {
    violations.push(`Exit access travel distance exceeds maximum by ${maxTravel - limits.maxTravel} ft`);
  }
  if (!commonPathCompliant) {
    violations.push(`Common path of travel exceeds maximum by ${commonPath - limits.commonPath} ft`);
  }
  if (!deadEndCompliant) {
    violations.push(`Dead end corridor exceeds maximum by ${deadEnd - limits.deadEnd} ft`);
  }
  
  return {
    maxTravelCompliant,
    commonPathCompliant,
    deadEndCompliant,
    allowableLimits: limits as TravelLimits,
    violations
  };
};

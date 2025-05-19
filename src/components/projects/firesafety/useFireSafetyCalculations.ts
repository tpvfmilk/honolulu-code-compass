
import { useMemo } from "react";
import { FormData } from "../types";
import { FireSafetyCalculationsProps } from "./types/fireSafetyTypes";
import { calculateExteriorWallRating } from "./utils/exteriorWallCalculations";
import { calculateOccupancySeparations } from "./utils/occupancySeparationCalculations";
import { calculateCorridorRating } from "./utils/corridorRatingCalculations";
import { calculateShaftRatings } from "./utils/shaftRatingCalculations";
import { calculateOpeningProtectives } from "./utils/openingProtectivesCalculations";
import { calculateFireDampers } from "./utils/fireDamperCalculations";

export const useFireSafetyCalculations = (formData: FormData | FireSafetyCalculationsProps) => {
  // Calculate exterior wall ratings based on separation distance
  const exteriorWallRating = useMemo(() => {
    return calculateExteriorWallRating(formData);
  }, [formData]);

  // Calculate occupancy separations
  const occupancySeparations = useMemo(() => {
    return calculateOccupancySeparations(formData);
  }, [formData]);

  // Calculate corridor rating
  const corridorRating = useMemo(() => {
    return calculateCorridorRating(formData);
  }, [formData]);
  
  // Calculate shaft enclosure ratings
  const shaftRatings = useMemo(() => {
    return calculateShaftRatings(formData);
  }, [formData]);

  // Calculate opening protectives requirements
  const openingProtectives = useMemo(() => {
    return calculateOpeningProtectives(formData);
  }, [formData]);

  // Calculate fire/smoke damper requirements
  const fireDampers = useMemo(() => {
    return calculateFireDampers(formData);
  }, [formData]);

  return {
    exteriorWallRating,
    occupancySeparations,
    corridorRating,
    shaftRatings,
    openingProtectives,
    fireDampers
  };
};

// Re-export the types and helper functions for convenience
export * from "./types/fireSafetyTypes";

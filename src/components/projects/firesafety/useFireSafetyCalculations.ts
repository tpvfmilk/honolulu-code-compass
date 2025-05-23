
import { useMemo, useState, useEffect } from "react";
import { FormData } from "../types";
import { FireSafetyCalculationsProps } from "./types/fireSafetyTypes";
import { calculateExteriorWallRating } from "./utils/exteriorWallCalculations";
import { calculateOccupancySeparations } from "./utils/occupancySeparationCalculations";
import { calculateCorridorRating } from "./utils/corridorRatingCalculations";
import { calculateShaftRatings } from "./utils/shaftRatingCalculations";
import { calculateOpeningProtectives } from "./utils/openingProtectivesCalculations";
import { calculateFireDampers } from "./utils/fireDamperCalculations";

export const useFireSafetyCalculations = (formData: FormData | FireSafetyCalculationsProps | undefined | null) => {
  // Check if formData is valid before proceeding with calculations
  const isValidFormData = formData !== null && formData !== undefined;
  const [exteriorWallRating, setExteriorWallRating] = useState({
    rating: 0,
    openings: 100,
    openingProtection: "Loading...",
    reference: "Loading..."
  });
  
  const [openingProtectives, setOpeningProtectives] = useState({
    wallRatings: [],
    requirements: {},
    reference: "Loading..."
  });
  
  // Calculate exterior wall ratings based on separation distance
  useEffect(() => {
    const fetchExteriorWallRating = async () => {
      if (isValidFormData) {
        const result = await calculateExteriorWallRating(formData);
        setExteriorWallRating(result);
      }
    };
    
    fetchExteriorWallRating();
  }, [formData, isValidFormData]);

  // Calculate opening protectives requirements
  useEffect(() => {
    const fetchOpeningProtectives = async () => {
      if (isValidFormData) {
        const result = await calculateOpeningProtectives(formData);
        setOpeningProtectives(result);
      }
    };
    
    fetchOpeningProtectives();
  }, [formData, isValidFormData]);

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

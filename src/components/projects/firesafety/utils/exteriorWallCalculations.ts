
import { FormData } from "../../types";
import { FireSafetyCalculationsProps, getProperty } from "../types/fireSafetyTypes";
import { supabase } from "@/integrations/supabase/client";

interface ExteriorWallRequirement {
  rating_hours_without_sprinkler: number;
  rating_hours_with_sprinkler: number;
  max_opening_percent_without_sprinkler: number;
  max_opening_percent_with_sprinkler: number;
  notes: string | null;
  reference: string;
}

export async function fetchExteriorWallRequirements(
  separationDistance: number,
  constructionTypeId?: string,
  occupancyGroupId?: string,
  zoningDistrictId?: string
): Promise<ExteriorWallRequirement | null> {
  try {
    // Query with additional filters if provided
    let query = supabase
      .from('exterior_wall_requirements')
      .select('*')
      .lte('min_separation_ft', separationDistance)
      .gt('max_separation_ft', separationDistance);

    if (constructionTypeId) {
      query = query.or(`construction_type_id.eq.${constructionTypeId},construction_type_id.is.null`);
    }
    
    if (occupancyGroupId) {
      query = query.or(`occupancy_group_id.eq.${occupancyGroupId},occupancy_group_id.is.null`);
    }
    
    if (zoningDistrictId) {
      query = query.or(`zoning_district_id.eq.${zoningDistrictId},zoning_district_id.is.null`);
    }

    // Order by most specific match first (non-null values for type/group/zone)
    query = query.order('construction_type_id', { ascending: false, nullsLast: true })
                 .order('occupancy_group_id', { ascending: false, nullsLast: true })
                 .order('zoning_district_id', { ascending: false, nullsLast: true });

    const { data, error } = await query.limit(1);

    if (error) {
      console.error('Error fetching exterior wall requirements:', error);
      return null;
    }

    return data.length > 0 ? data[0] as ExteriorWallRequirement : null;
  } catch (error) {
    console.error('Error in fetchExteriorWallRequirements:', error);
    return null;
  }
}

export async function calculateExteriorWallRating(formData: FormData | FireSafetyCalculationsProps | undefined | null) {
  // Default fallback response
  const defaultRating = {
    rating: 0,
    openings: 100,
    openingProtection: "N/A - No data provided",
    reference: "IBC Table 705.8"
  };

  // Handle undefined/null formData
  if (!formData) {
    return defaultRating;
  }
  
  const fireSafety = getProperty(formData, 'fireSafety') || {};
  // Safely get separation distance with fallback to "0"
  const separationDistance = parseFloat(fireSafety.separationDistance || "0");
  const isSprinklered = formData.sprinklerSystem || false;
  
  if (isNaN(separationDistance)) {
    return {
      ...defaultRating,
      openingProtection: "N/A - Invalid separation distance"
    };
  }

  try {
    // Try to fetch from database first
    const requirement = await fetchExteriorWallRequirements(
      separationDistance,
      formData.constructionTypeId,
      formData.occupancyGroupId,
      formData.zoningDistrictId
    );

    if (requirement) {
      const rating = isSprinklered 
        ? requirement.rating_hours_with_sprinkler 
        : requirement.rating_hours_without_sprinkler;
      
      const openings = isSprinklered
        ? requirement.max_opening_percent_with_sprinkler
        : requirement.max_opening_percent_without_sprinkler;
      
      let openingProtection = "No protection required";
      
      if (openings === 0) {
        openingProtection = "N/A - No openings permitted";
      } else if (openings < 45) {
        openingProtection = "Protected openings required";
      }

      return {
        rating,
        openings,
        openingProtection,
        reference: requirement.reference,
        notes: requirement.notes || undefined
      };
    }
  } catch (error) {
    console.error("Error calculating exterior wall rating from database:", error);
    // Continue to fallback calculation below
  }
  
  // Fallback to hardcoded logic if database query fails
  console.warn("Using fallback calculation for exterior wall rating");
  
  if (separationDistance < 3) {
    return {
      rating: isSprinklered ? 1 : 3,
      openings: 0,
      openingProtection: "N/A - No openings permitted",
      reference: "IBC Table 705.8"
    };
  } else if (separationDistance < 5) {
    return {
      rating: isSprinklered ? 0 : 1,
      openings: 25,
      openingProtection: "Protected openings required",
      reference: "IBC Table 705.8"
    };
  } else if (separationDistance < 10) {
    return {
      rating: 0,
      openings: isSprinklered ? 75 : 50,
      openingProtection: isSprinklered ? "No protection required" : "Protected openings required",
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


import { useState } from "react";
import { ZoningCalculationsState } from "../types/zoning/zoningTypes";
import { ZoningDistrictData } from "@/services/dataService";

type UseZoningCalculationsProps = {
  zoningDistricts: ZoningDistrictData[];
};

export const useZoningCalculations = ({ zoningDistricts }: UseZoningCalculationsProps) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculations, setCalculations] = useState<ZoningCalculationsState>({
    setbacks: null,
    heightLimits: null,
    coverage: null,
    dwellingUnits: null,
  });

  // Get zoning district data based on selected district code
  const getZoningDistrictData = (districtCode: string) => {
    return zoningDistricts.find(d => d.code === districtCode);
  };

  const performZoningCalculations = (district: string, lotAreaStr: string, isCornerLot: boolean) => {
    if (!district || !lotAreaStr) return;
    
    setIsCalculating(true);
    
    // Get zoning district data from database
    const districtData = getZoningDistrictData(district);
    if (!districtData) {
      console.error("District data not found:", district);
      setIsCalculating(false);
      return;
    }
    
    // Convert lot area from string to number
    const lotArea = parseFloat(lotAreaStr.replace(/,/g, ''));
    
    // Use district data for calculations
    setTimeout(() => {
      // Calculate setbacks (common for all districts)
      const setbacks = {
        front: districtData.front_setback, 
        side: districtData.side_setback, 
        rear: districtData.rear_setback,
        streetSide: isCornerLot ? Math.round(districtData.side_setback * 1.5) : undefined 
      };

      // Calculate height limits (common for all districts)
      const heightLimits = { 
        maxHeight: districtData.max_building_height, 
        maxStories: districtData.max_stories || 2 // fallback if null
      };

      // Calculate maximum dwelling units based on min lot area
      const maxUnits = Math.floor(lotArea / districtData.min_lot_area);

      // Initialize coverage object with default calculations
      let coverage = { 
        maxCoveragePercent: districtData.max_lot_coverage * 100,
        maxCoverage: lotArea * districtData.max_lot_coverage,
        farBase: districtData.max_far || 0.7, // fallback if null
        maxFloorArea: lotArea * (districtData.max_far || 0.7),
        // Initialize the new properties
        specialRuleApplies: false,
        calculationMethod: "FAR" as const,
        specialRuleExplanation: "",
      };

      // Apply district-specific logic for coverage and floor area calculations
      if (district === "R-5") {
        // R-5 specific calculations - 3,000 sq ft per dwelling unit
        const unitBasedArea = maxUnits * 3000;
        
        // The maximum building area is the lesser of:
        // 1. 3,000 sq ft per dwelling unit
        // 2. 50% of lot area (standard lot coverage)
        const maxBuildingArea = Math.min(unitBasedArea, coverage.maxCoverage);
        
        coverage = {
          ...coverage,
          maxFloorArea: maxBuildingArea,
          // Add special rule flags and explanations
          specialRuleApplies: true,
          calculationMethod: "UnitBased",
          maxAreaByUnits: unitBasedArea,
          specialRuleExplanation: "In R-5 zoning, maximum building area is 3,000 sq ft per dwelling unit, limited by lot coverage."
        };
      } else if (district.startsWith("A-")) {
        // Apartment districts have different FAR values (usually higher)
        coverage.specialRuleApplies = true;
        coverage.calculationMethod = "FAR";
        coverage.specialRuleExplanation = "Apartment districts use higher FAR values for multi-family developments.";
      } else if (district.startsWith("B-") || district.startsWith("BMX-")) {
        // Business districts often have different rules
        coverage.specialRuleApplies = true;
        coverage.calculationMethod = "FAR";
        coverage.specialRuleExplanation = "Business districts typically allow higher density developments with increased FAR.";
      }

      // Calculate dwelling units and parking requirements
      const dwellingUnits = {
        maxUnits: maxUnits,
        allowsOhana: lotArea >= districtData.min_lot_area * 1.5, // Example rule
        allowsADU: lotArea >= 3500,
        requiredParking: {
          main: 2,
          ohana: lotArea >= districtData.min_lot_area * 1.5 ? 1 : 0,
          adu: lotArea >= 3500 ? 1 : 0,
          total: 2 + (lotArea >= districtData.min_lot_area * 1.5 ? 1 : 0) + (lotArea >= 3500 ? 1 : 0)
        }
      };
      
      // Set all calculations
      const calculationResults: ZoningCalculationsState = {
        setbacks,
        heightLimits,
        coverage,
        dwellingUnits
      };
      
      setCalculations(calculationResults);
      setIsCalculating(false);
    }, 500); // 500ms delay for animation
  };

  return {
    isCalculating,
    calculations,
    performZoningCalculations
  };
};


import { FormData } from "../types";
import { ZoningCalculationsState } from "../types/zoning/zoningTypes";
import { ZoningFormCard } from "./zoning/ZoningFormCard";
import { ZoningCalculationResults } from "./zoning/ZoningCalculationResults";

type ZoningInfoStepProps = {
  formData: FormData;
  calculations: ZoningCalculationsState;
  isCalculating: boolean;
  updateFormData: (key: keyof FormData, value: string | boolean | number) => void;
  zoningDistricts: Array<{ value: string; label: string; group: string }>;
};

export const ZoningInfoStep = ({ 
  formData, 
  calculations, 
  isCalculating, 
  updateFormData,
  zoningDistricts
}: ZoningInfoStepProps) => {
  // Calculate acres from square feet
  const lotAreaSqFt = parseFloat((formData.lotArea || "0").replace(/,/g, ''));
  const lotAreaAcres = (lotAreaSqFt / 43560).toFixed(2);
  
  // Parse numerical values for the building envelope calculations
  const actualHeight = formData.height ? parseFloat(formData.height) : undefined;
  const actualStories = formData.stories ? parseInt(formData.stories) : undefined;
  const actualBuildingArea = formData.totalBuildingArea 
    ? parseFloat(formData.totalBuildingArea.replace(/,/g, '')) 
    : undefined;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Column - Input Form (40%) */}
      <div className="w-full md:w-2/5">
        <ZoningFormCard
          formData={formData}
          updateFormData={updateFormData}
          zoningDistricts={zoningDistricts}
          lotAreaAcres={lotAreaAcres}
        />
      </div>
      
      {/* Right Column - Calculation Results (60%) */}
      <div className="w-full md:w-3/5">
        <ZoningCalculationResults
          formData={formData}
          calculations={calculations}
          isCalculating={isCalculating}
          actualHeight={actualHeight}
          actualStories={actualStories}
          actualBuildingArea={actualBuildingArea}
        />
      </div>
    </div>
  );
};

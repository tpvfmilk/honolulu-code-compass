
import React from "react";
import { ProjectInfoStep } from "./steps/ProjectInfoStep";
import { ZoningInfoStep } from "./steps/ZoningInfoStep";
import { BuildingClassificationStep } from "./steps/BuildingClassificationStep";
import { FireSafetyStep } from "./steps/FireSafetyStep";
import { OccupancyDetailsStep } from "./steps/OccupancyDetailsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { FormData } from "./types";
import { buildingTypes } from "./types/zoning/zoningTypes";

interface WizardStepContentProps {
  currentStep: number;
  formData: FormData;
  calculations: any;
  isCalculating: boolean;
  updateFormData: (key: keyof FormData, value: any) => void;
  zoningDistricts: any[];
}

export const WizardStepContent: React.FC<WizardStepContentProps> = ({
  currentStep,
  formData,
  calculations,
  isCalculating,
  updateFormData,
  zoningDistricts,
}) => {
  // Prevent default form submission that causes navigation to landing page
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission prevented in WizardStepContent");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} noValidate>
        {currentStep === 0 ? (
          <ProjectInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        ) : currentStep === 1 ? (
          <ZoningInfoStep 
            formData={formData}
            calculations={calculations}
            isCalculating={isCalculating}
            updateFormData={updateFormData}
            zoningDistricts={zoningDistricts}
          />
        ) : currentStep === 2 ? (
          <BuildingClassificationStep 
            formData={formData} 
            updateFormData={updateFormData}
            buildingTypes={buildingTypes}
          />
        ) : currentStep === 3 ? (
          <FireSafetyStep 
            formData={formData}
            updateFormData={updateFormData}
          />
        ) : currentStep === 4 ? (
          <OccupancyDetailsStep 
            formData={formData}
            updateFormData={updateFormData}
          />
        ) : currentStep === 5 ? (
          <ReviewStep formData={formData} />
        ) : (
          <div>Unknown step</div>
        )}
      </form>
    </div>
  );
};

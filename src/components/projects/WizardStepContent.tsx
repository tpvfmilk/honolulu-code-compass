
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
  switch (currentStep) {
    case 0:
      return (
        <ProjectInfoStep 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      );
    case 1:
      return (
        <ZoningInfoStep 
          formData={formData}
          calculations={calculations}
          isCalculating={isCalculating}
          updateFormData={updateFormData}
          zoningDistricts={zoningDistricts}
        />
      );
    case 2:
      return (
        <BuildingClassificationStep 
          formData={formData} 
          updateFormData={updateFormData}
          buildingTypes={buildingTypes}
        />
      );
    case 3:
      return (
        <FireSafetyStep 
          formData={formData}
          updateFormData={updateFormData}
        />
      );
    case 4:
      return (
        <OccupancyDetailsStep 
          formData={formData}
          updateFormData={updateFormData}
        />
      );
    case 5:
      return <ReviewStep formData={formData} />;
    default:
      return <div>Unknown step</div>;
  }
};

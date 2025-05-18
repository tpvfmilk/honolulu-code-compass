
import { useState } from "react";
import { FormData, initialFormData } from "../types/projectTypes";
import { useToast } from "@/components/ui/use-toast";

export const useProjectForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();

  // TMK validation function
  const validateTmkFormat = (tmk: string): boolean => {
    const tmkPattern = /^\d-\d-\d{3}:\d{3}$/;
    return tmkPattern.test(tmk);
  };

  const updateFormData = (key: keyof FormData, value: string | boolean | any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Update with zoning calculations trigger
  const updateFormDataWithCalculations = (
    key: keyof FormData,
    value: string | boolean | any,
    currentStep: number,
    performZoningCalculations: (district: string, lotArea: string, isCornerLot: boolean) => void
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Trigger calculations for zoning step
    if ((key === 'district' || key === 'lotArea' || key === 'isCornerLot') && currentStep === 1) {
      performZoningCalculations(
        key === 'district' ? value as string : formData.district, 
        key === 'lotArea' ? value as string : formData.lotArea,
        key === 'isCornerLot' ? value as boolean : formData.isCornerLot
      );
    }
  };

  return {
    formData,
    setFormData,
    updateFormData,
    updateFormDataWithCalculations,
    validateTmkFormat
  };
};

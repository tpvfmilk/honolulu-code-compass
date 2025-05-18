
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FormData, wizardSteps } from "./types/projectTypes";
import { fetchZoningDistricts, ZoningDistrictData } from "@/services/dataService";
import { adaptZoningDistrictsForSelector } from "@/adapters/dataAdapters";
import { useZoningCalculations } from "./hooks/useZoningCalculations";
import { useProjectForm } from "./hooks/useProjectForm";
import { useProjectPersistence } from "./hooks/useProjectPersistence";

export const useProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [zoningDistricts, setZoningDistricts] = useState<ZoningDistrictData[]>([]);
  const [adaptedZoningDistricts, setAdaptedZoningDistricts] = useState<{value: string; label: string; group: string}[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize our custom hooks
  const { isCalculating, calculations, performZoningCalculations } = useZoningCalculations({ zoningDistricts });
  const { formData, setFormData, updateFormData: baseUpdateFormData, validateTmkFormat } = useProjectForm();
  const { projectId, isSubmitting, saveDraft: baseSaveDraft, handleSubmit: baseHandleSubmit } = useProjectPersistence();

  // Create a wrapper for updateFormData that triggers zoning calculations
  const updateFormData = (key: keyof FormData, value: string | boolean | any) => {
    baseUpdateFormData(key, value);

    // Trigger calculations for zoning step
    if ((key === 'district' || key === 'lotArea' || key === 'isCornerLot') && currentStep === 1) {
      performZoningCalculations(
        key === 'district' ? value as string : formData.district, 
        key === 'lotArea' ? value as string : formData.lotArea,
        key === 'isCornerLot' ? value as boolean : formData.isCornerLot
      );
    }
  };

  // Fetch zoning districts from database
  useEffect(() => {
    const loadZoningDistricts = async () => {
      const districts = await fetchZoningDistricts();
      setZoningDistricts(districts);
      setAdaptedZoningDistricts(adaptZoningDistrictsForSelector(districts));
    };
    
    loadZoningDistricts();
  }, []);

  // Wrapper for saveDraft
  const saveDraft = () => {
    baseSaveDraft(formData, currentStep);
  };

  // Wrapper for handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    baseHandleSubmit(e, formData, currentStep);
  };

  const handleNext = () => {
    // For the Project Info step, validate TMK format before proceeding
    if (currentStep === 0) {
      if (!formData.name || !formData.tmk || !validateTmkFormat(formData.tmk)) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please ensure all required fields are filled correctly."
        });
        return;
      }
      
      // Save project draft when moving past first step
      saveDraft();
    }
    
    // For the Zoning Info step, validate district and lot area
    if (currentStep === 1 && (!formData.district || !formData.lotArea)) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a zoning district and enter lot area."
      });
      return;
    }
    
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Save form data for current step
      if (projectId) {
        saveDraft();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    saveDraft();
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    isCalculating,
    calculations,
    updateFormData,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleSaveDraft,
    validateTmkFormat,
    zoningDistricts: adaptedZoningDistricts,
    setFormData
  };
};

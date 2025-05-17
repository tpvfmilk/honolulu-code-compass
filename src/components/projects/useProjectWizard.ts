import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FormData, initialFormData, wizardSteps } from "./types";
import { ZoningCalculationsState } from "./zoning/types/zoningTypes";
import { 
  fetchZoningDistricts, 
  saveProject, 
  saveProjectData,
  ZoningDistrictData
} from "@/services/dataService";
import { adaptZoningDistrictsForSelector } from "@/adapters/dataAdapters";

export const useProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [zoningDistricts, setZoningDistricts] = useState<ZoningDistrictData[]>([]);
  const [adaptedZoningDistricts, setAdaptedZoningDistricts] = useState<{value: string; label: string; group: string}[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [calculations, setCalculations] = useState<ZoningCalculationsState>({
    setbacks: null,
    heightLimits: null,
    coverage: null,
    dwellingUnits: null,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch zoning districts from database
  useEffect(() => {
    const loadZoningDistricts = async () => {
      const districts = await fetchZoningDistricts();
      setZoningDistricts(districts);
      setAdaptedZoningDistricts(adaptZoningDistrictsForSelector(districts));
    };
    
    loadZoningDistricts();
  }, []);

  // TMK validation function
  const validateTmkFormat = (tmk: string): boolean => {
    const tmkPattern = /^\d-\d-\d{3}:\d{3}$/;
    return tmkPattern.test(tmk);
  };

  const updateFormData = (key: keyof FormData, value: string | boolean | any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Trigger calculations for zoning step
    if ((key === 'district' || key === 'lotArea' || key === 'isCornerLot') && currentStep === 1) {
      performZoningCalculations(key === 'district' ? value as string : formData.district, 
                             key === 'lotArea' ? value as string : formData.lotArea,
                             key === 'isCornerLot' ? value as boolean : formData.isCornerLot);
    }
  };

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
      const calculationResults: ZoningCalculationsState = {
        setbacks: { 
          front: districtData.front_setback, 
          side: districtData.side_setback, 
          rear: districtData.rear_setback,
          streetSide: isCornerLot ? Math.round(districtData.side_setback * 1.5) : undefined 
        },
        heightLimits: { 
          maxHeight: districtData.max_building_height, 
          maxStories: districtData.max_stories || 2 // fallback if null
        },
        coverage: { 
          maxCoveragePercent: districtData.max_lot_coverage * 100,
          maxCoverage: lotArea * districtData.max_lot_coverage,
          farBase: districtData.max_far || 0.7, // fallback if null
          maxFloorArea: lotArea * (districtData.max_far || 0.7)
        },
        dwellingUnits: {
          maxUnits: Math.floor(lotArea / districtData.min_lot_area),
          allowsOhana: lotArea >= districtData.min_lot_area * 1.5, // Example rule
          allowsADU: lotArea >= 3500,
          requiredParking: {
            main: 2,
            ohana: lotArea >= districtData.min_lot_area * 1.5 ? 1 : 0,
            adu: lotArea >= 3500 ? 1 : 0,
            total: 2 + (lotArea >= districtData.min_lot_area * 1.5 ? 1 : 0) + (lotArea >= 3500 ? 1 : 0)
          }
        }
      };
      
      setCalculations(calculationResults);
      setIsCalculating(false);
    }, 500); // 500ms delay for animation
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
        saveProjectData(projectId, currentStep, formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = async () => {
    try {
      const savedProjectId = await saveProject({
        id: projectId || undefined,
        name: formData.name,
        tmk: formData.tmk,
        address: formData.address || null,
        status: 'draft'
      });
      
      if (savedProjectId) {
        setProjectId(savedProjectId);
        
        // Save form data for current step
        await saveProjectData(savedProjectId, currentStep, formData);
        
        toast({
          title: "Draft Saved",
          description: "Your project draft has been saved successfully",
        });
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your draft"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const savedProjectId = await saveProject({
        id: projectId || undefined,
        name: formData.name,
        tmk: formData.tmk,
        address: formData.address || null,
        status: 'completed',
        is_complete: true
      });
      
      if (savedProjectId) {
        // Save final form data
        await saveProjectData(savedProjectId, currentStep, formData);
        
        toast({
          title: "Project Created",
          description: "Your project has been created successfully",
        });
        navigate("/");
      } else {
        throw new Error("Failed to save project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error creating your project"
      });
    } finally {
      setIsSubmitting(false);
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
    zoningDistricts: adaptedZoningDistricts // Return the adapted zoning districts
  };
};

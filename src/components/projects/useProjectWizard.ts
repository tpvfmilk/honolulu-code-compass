
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FormData, initialFormData, wizardSteps } from "./types/projectTypes";
import { ZoningCalculationsState } from "./types/zoning/zoningTypes";
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
        maxFloorArea: lotArea * (districtData.max_far || 0.7)
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
        // Note: This is a placeholder - actual values should come from the database
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
    zoningDistricts: adaptedZoningDistricts, // Return the adapted zoning districts
    setFormData // Export setFormData to allow setting the entire form data object
  };
};

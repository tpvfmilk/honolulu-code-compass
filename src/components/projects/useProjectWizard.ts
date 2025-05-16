
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FormData, initialFormData, ZoningCalculationsState, wizardSteps } from "./types";

export const useProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculations, setCalculations] = useState<ZoningCalculationsState>({
    setbacks: null,
    heightLimits: null,
    coverage: null,
    dwellingUnits: null,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateFormData = (key: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Trigger calculations for zoning step
    if ((key === 'district' || key === 'lotArea' || key === 'isCornerLot') && currentStep === 1) {
      performZoningCalculations(key === 'district' ? value as string : formData.district, 
                             key === 'lotArea' ? value as string : formData.lotArea,
                             key === 'isCornerLot' ? value as boolean : formData.isCornerLot);
    }
  };

  const performZoningCalculations = (district: string, lotAreaStr: string, isCornerLot: boolean) => {
    if (!district || !lotAreaStr) return;
    
    setIsCalculating(true);
    
    // Simulate API calculation delay
    setTimeout(() => {
      const lotArea = parseFloat(lotAreaStr.replace(/,/g, ''));
      
      // Example calculation logic based on zoning district
      let calculationResults: ZoningCalculationsState = {
        setbacks: null,
        heightLimits: null,
        coverage: null,
        dwellingUnits: null
      };
      
      // Apply calculations based on district
      switch(district) {
        case "R-5":
          calculationResults = {
            setbacks: { front: 25, side: 5, rear: 15, streetSide: isCornerLot ? 20 : undefined },
            heightLimits: { maxHeight: 30, maxStories: 2.5 },
            coverage: { 
              maxCoveragePercent: 50,
              maxCoverage: lotArea * 0.5,
              farBase: 0.7,
              farConditional: 0.8,
              maxFloorArea: lotArea * 0.7,
              maxConditionalFloorArea: lotArea * 0.8
            },
            dwellingUnits: {
              maxUnits: Math.floor(lotArea / 5000),
              allowsOhana: true,
              allowsADU: lotArea >= 3500,
              requiredParking: {
                main: 2,
                ohana: 1,
                adu: 1,
                total: 2 + (lotArea >= 3500 ? 2 : 0)
              }
            }
          };
          break;
          
        case "R-3.5":
          calculationResults = {
            setbacks: { front: 20, side: 5, rear: 10, streetSide: isCornerLot ? 15 : undefined },
            heightLimits: { maxHeight: 25, maxStories: 2 },
            coverage: { 
              maxCoveragePercent: 60,
              maxCoverage: lotArea * 0.6,
              farBase: 0.8,
              maxFloorArea: lotArea * 0.8
            },
            dwellingUnits: {
              maxUnits: Math.floor(lotArea / 3500),
              allowsOhana: true,
              allowsADU: lotArea >= 3500,
              requiredParking: {
                main: 2,
                ohana: 1,
                adu: 1,
                total: 2 + (lotArea >= 3500 ? 2 : 0)
              }
            }
          };
          break;
          
        default:
          // Default calculations for other zones
          calculationResults = {
            setbacks: { front: 20, side: 5, rear: 10 },
            heightLimits: { maxHeight: 30, maxStories: 2 },
            coverage: { 
              maxCoveragePercent: 40,
              maxCoverage: lotArea * 0.4,
              farBase: 0.6,
              maxFloorArea: lotArea * 0.6
            },
            dwellingUnits: {
              maxUnits: Math.floor(lotArea / 7500),
              allowsOhana: false,
              allowsADU: false,
              requiredParking: {
                main: 2,
                ohana: 0,
                adu: 0,
                total: 2
              }
            }
          };
      }
      
      setCalculations(calculationResults);
      setIsCalculating(false);
      
    }, 500); // 500ms delay for animation
  };

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Project Created",
        description: "Your project has been created successfully",
      });
      navigate("/");
    }, 1500);
  };
  
  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your project draft has been saved successfully",
    });
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
    handleSaveDraft
  };
};

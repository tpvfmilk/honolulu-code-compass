
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { wizardSteps } from "./types/projectTypes";

interface WizardFooterProps {
  currentStep: number;
  formData: any;
  isSubmitting: boolean;
  id?: string;
  handlePrevious: () => void;
  handleNext: () => void;
  handleSaveDraft: () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  validateTmkFormat: (tmk: string) => boolean;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  currentStep,
  formData,
  isSubmitting,
  id,
  handlePrevious,
  handleNext,
  handleSaveDraft,
  handleSubmit,
  validateTmkFormat,
}) => {
  // Handle submit with preventDefault
  const onSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="flex justify-between w-full">
      <div>
        <Button
          type="button" // Explicitly set button type
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
      </div>
      
      <div className="flex gap-3">
        <Button
          type="button" // Explicitly set button type
          variant="ghost"
          onClick={handleSaveDraft}
          className="text-muted-foreground"
        >
          <Save className="mr-2 h-4 w-4" /> Save Draft
        </Button>
        
        {currentStep < wizardSteps.length - 1 ? (
          <Button 
            type="button" // Explicitly set button type
            onClick={handleNext}
            disabled={
              (currentStep === 0 && (!formData.name || !formData.tmk || !validateTmkFormat(formData.tmk))) ||
              (currentStep === 1 && (!formData.district || !formData.lotArea))
            }
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="button" // Explicitly set button type
            onClick={onSubmitClick}
            disabled={isSubmitting}
            className="hawaii-gradient"
          >
            {isSubmitting ? "Saving..." : (id ? "Update Project" : "Create Project")}
          </Button>
        )}
      </div>
    </div>
  );
};

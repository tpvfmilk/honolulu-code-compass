
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { WizardProgress } from "./WizardProgress";
import { ProjectInfoStep } from "./steps/ProjectInfoStep";
import { ZoningInfoStep } from "./steps/ZoningInfoStep";
import { BuildingClassificationStep } from "./steps/BuildingClassificationStep";
import { FireSafetyStep } from "./steps/FireSafetyStep";
import { OccupancyDetailsStep } from "./steps/OccupancyDetailsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useProjectWizard } from "./useProjectWizard";
import { wizardSteps, zoningDistricts, buildingTypes } from "./types";

export const ProjectWizard = () => {
  const {
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
    validateTmkFormat
  } = useProjectWizard();

  return (
    <div className="max-w-6xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
          <CardDescription>
            Fill out the project information to generate a building code compliance sheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <WizardProgress steps={wizardSteps} currentStep={currentStep} />

          {/* Step Content */}
          <form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <ProjectInfoStep 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}

            {currentStep === 1 && (
              <ZoningInfoStep 
                formData={formData}
                calculations={calculations}
                isCalculating={isCalculating}
                updateFormData={updateFormData}
                zoningDistricts={zoningDistricts}
              />
            )}

            {currentStep === 2 && (
              <BuildingClassificationStep 
                formData={formData} 
                updateFormData={updateFormData}
                buildingTypes={buildingTypes}
              />
            )}

            {currentStep === 3 && (
              <FireSafetyStep 
                formData={formData}
                updateFormData={updateFormData}
              />
            )}

            {currentStep === 4 && <OccupancyDetailsStep 
              formData={formData}
              updateFormData={updateFormData}
            />}

            {currentStep === 5 && <ReviewStep formData={formData} />}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSaveDraft}
              className="text-muted-foreground"
            >
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            
            {currentStep < wizardSteps.length - 1 ? (
              <Button 
                type="button" 
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
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="hawaii-gradient"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

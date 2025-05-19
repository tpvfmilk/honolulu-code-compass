
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardProgress } from "./WizardProgress";
import { useProjectWizard } from "./useProjectWizard";
import { wizardSteps } from "./types/projectTypes";
import { WizardStepContent } from "./WizardStepContent";
import { WizardFooter } from "./WizardFooter";
import { useProjectLoader } from "./hooks/useProjectLoader";
import { ProjectLoadingState } from "./ProjectLoadingState";

export const ProjectWizard = () => {
  const { id } = useParams<{ id: string }>();

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
    validateTmkFormat,
    zoningDistricts,
    setFormData
  } = useProjectWizard();

  // Use our extracted project loader hook
  const { isLoadingProject } = useProjectLoader(id, formData, setFormData);

  // Prevent any form submission from navigating away
  const preventFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (isLoadingProject) {
    return <ProjectLoadingState />;
  }

  return (
    <div className="max-w-6xl mx-auto py-6" onSubmit={preventFormSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {id ? "Edit Project" : "Create New Project"}
          </CardTitle>
          <CardDescription>
            {id 
              ? "Edit your project information to update building code compliance"
              : "Fill out the project information to generate a building code compliance sheet"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <WizardProgress steps={wizardSteps} currentStep={currentStep} />

          {/* Step Content */}
          <WizardStepContent 
            currentStep={currentStep}
            formData={formData}
            calculations={calculations}
            isCalculating={isCalculating}
            updateFormData={updateFormData}
            zoningDistricts={zoningDistricts}
          />
        </CardContent>
        <CardFooter>
          <WizardFooter
            currentStep={currentStep}
            formData={formData}
            isSubmitting={isSubmitting}
            id={id}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handleSaveDraft={handleSaveDraft}
            handleSubmit={handleSubmit}
            validateTmkFormat={validateTmkFormat}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

import { useEffect, useState } from "react";
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
import { wizardSteps } from "./types/projectTypes";
import { buildingTypes } from "./types/zoning/zoningTypes";
import { useParams } from "react-router-dom";
import { getProjectById, getProjectData } from "../../services/dataService";
import { useToast } from "@/components/ui/use-toast";

export const ProjectWizard = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [projectLoaded, setProjectLoaded] = useState(false);

  // Make sure to destructure setFormData from useProjectWizard
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
    setFormData  // Ensure this is available from useProjectWizard
  } = useProjectWizard();

  // Load existing project data if in edit mode
  useEffect(() => {
    const loadProjectData = async () => {
      if (id && !projectLoaded) {
        setIsLoadingProject(true);
        try {
          // Fetch project basic info
          const projectDetails = await getProjectById(id);
          
          if (!projectDetails) {
            toast({
              title: "Error",
              description: "Project not found",
              variant: "destructive",
            });
            return;
          }

          // Initialize with basic project info
          let projectFormData = {
            ...formData,
            id: projectDetails.id,
            name: projectDetails.name,
            tmk: projectDetails.tmk || "",
            address: projectDetails.address || "",
            client_name: projectDetails.client_name || "",
            property_owner: projectDetails.property_owner || "",
          };

          // Fetch saved form data for each step
          const promises = [];
          for (let step = 0; step < wizardSteps.length; step++) {
            promises.push(getProjectData(id, step));
          }

          const stepResults = await Promise.all(promises);
          
          // Merge all step data into projectFormData
          stepResults.forEach((stepData, index) => {
            if (stepData) {
              projectFormData = { ...projectFormData, ...stepData };
            }
          });

          // Update form data with all loaded project data
          setFormData(projectFormData);
          setProjectLoaded(true);
          
          toast({
            title: "Project Loaded",
            description: "Project data has been loaded successfully",
          });
        } catch (error) {
          console.error("Error loading project data:", error);
          toast({
            title: "Error",
            description: "Failed to load project data",
            variant: "destructive",
          });
        } finally {
          setIsLoadingProject(false);
        }
      }
    };

    loadProjectData();
  }, [id, projectLoaded, formData, setFormData, toast]);

  if (isLoadingProject) {
    return (
      <div className="max-w-6xl mx-auto py-6">
        <Card>
          <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
            <div className="animate-pulse text-lg">Loading project data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
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
                {isSubmitting ? "Saving..." : (id ? "Update Project" : "Create Project")}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

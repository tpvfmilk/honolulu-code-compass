
import { useState, useEffect } from "react";
import { getProjectById, getProjectData } from "@/services/dataService";
import { useToast } from "@/components/ui/use-toast";
import { wizardSteps } from "../types/projectTypes";
import { FormData } from "../types";

export const useProjectLoader = (
  id: string | undefined, 
  formData: FormData, 
  setFormData: (data: FormData) => void
) => {
  const { toast } = useToast();
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [projectLoaded, setProjectLoaded] = useState(false);

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
          stepResults.forEach((stepData) => {
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

  return { isLoadingProject, projectLoaded };
};

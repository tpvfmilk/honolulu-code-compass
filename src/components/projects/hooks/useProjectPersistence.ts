
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FormData } from "../types/projectTypes";
import { saveProject, saveProjectData } from "@/services/dataService";

export const useProjectPersistence = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const saveDraft = async (formData: FormData, currentStep: number) => {
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

  const handleSubmit = async (e: React.FormEvent, formData: FormData, currentStep: number) => {
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

  return {
    projectId,
    setProjectId,
    isSubmitting,
    saveDraft,
    handleSubmit
  };
};

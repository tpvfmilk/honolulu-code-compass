
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchZoningDistricts, saveProject, saveProjectData } from "@/services/dataService";
import { useToast } from "@/components/ui/use-toast";

export function useProjectWizard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculations, setCalculations] = useState({});
  const [zoningDistricts, setZoningDistricts] = useState([]);
  
  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    // Project Info
    name: "",
    tmk: "",
    address: "",
    client_name: "",
    property_owner: "",
    
    // Zoning Info
    district: "",
    lotArea: "",
    buildingType: "",
    
    // Additional form fields
    // ... more fields would be here based on the application's requirements
  });
  
  // Fetch zoning districts on component mount
  useEffect(() => {
    const getZoningDistricts = async () => {
      try {
        const districts = await fetchZoningDistricts();
        setZoningDistricts(districts);
      } catch (error) {
        console.error("Error fetching zoning districts:", error);
      }
    };
    
    getZoningDistricts();
  }, []);
  
  // Function to update form data
  const updateFormData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);
  
  // Handle next step
  const handleNext = useCallback(() => {
    setCurrentStep(prev => prev + 1);
    
    // Save draft automatically when moving to next step if we have a project ID
    if (id) {
      handleSaveDraft(true);
    }
  }, [id]);
  
  // Handle previous step
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);
  
  // Handle save draft
  const handleSaveDraft = useCallback(async (silent = false) => {
    try {
      let projectId = id;
      
      // If we don't have a project ID yet or this is a new project, create one first
      if (!projectId) {
        const savedProjectId = await saveProject({
          name: formData.name || "Untitled Project",
          tmk: formData.tmk || null,
          address: formData.address || null,
          client_name: formData.client_name || null,
          property_owner: formData.property_owner || null,
          status: "draft"
        });
        
        if (!savedProjectId) {
          throw new Error("Failed to create project");
        }
        
        projectId = savedProjectId;
      } else {
        // Update existing project basic info
        await saveProject({
          id: projectId,
          name: formData.name,
          tmk: formData.tmk || null,
          address: formData.address || null,
          client_name: formData.client_name || null,
          property_owner: formData.property_owner || null,
          status: "draft",
          current_step: currentStep
        });
      }
      
      // Save current step data
      await saveProjectData(projectId, currentStep, formData);
      
      if (!silent) {
        toast({
          title: "Draft Saved",
          description: "Project draft has been saved successfully"
        });
      }
      
      // If this is a new project, redirect to the project edit page with the new ID
      if (!id) {
        navigate(`/project/edit/${projectId}`);
      }
      
      return projectId;
    } catch (error) {
      console.error("Error saving draft:", error);
      if (!silent) {
        toast({
          title: "Error",
          description: "Failed to save draft. Please try again.",
          variant: "destructive"
        });
      }
      return null;
    }
  }, [formData, id, navigate, toast, currentStep]);
  
  // Handle final submit
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    try {
      let projectId = id;
      
      // If no project ID, create one first
      if (!projectId) {
        projectId = await handleSaveDraft(true);
        if (!projectId) {
          throw new Error("Failed to create project");
        }
      }
      
      // Update the project status to completed and save
      await saveProject({
        id: projectId,
        status: "in-progress",
        is_complete: true
      });
      
      toast({
        title: "Success",
        description: id ? "Project updated successfully" : "Project created successfully"
      });
      
      // Navigate to the project view page
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [id, handleSaveDraft, navigate, toast]);
  
  // Validate TMK format
  const validateTmkFormat = (tmk) => {
    // Simple validation - can be enhanced based on specific TMK format requirements
    return tmk && tmk.length >= 5;
  };
  
  return {
    currentStep,
    formData,
    isSubmitting,
    isCalculating,
    calculations,
    zoningDistricts,
    updateFormData,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleSaveDraft,
    validateTmkFormat,
    setFormData // Export this to allow setting the entire form data object
  };
}


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProjectDetail } from "../components/projects/ProjectDetail";
import { ProjectHeader } from "../components/projects/ProjectHeader";
import { NotFound } from "./NotFound";
import { getProjectById } from "../services/dataService";
import { useToast } from "@/hooks/use-toast";

// Define an interface for the project data structure
export interface ProjectData {
  id: string;
  name: string;
  tmk: string;
  status: "draft" | "in-progress" | "completed" | "needs-revision";
  district: string;  // Changed from optional to required
  lastUpdated: Date;
  address?: string;
  client_name?: string;
  property_owner?: string;
  // Add new fields from our database
  project_type?: string;
  stories?: number;
  building_height?: number;
  total_building_area?: number;
  lot_area_sqft?: number;
  existing_use?: string;
  proposed_use?: string;
  construction_type?: string;
  is_fully_sprinklered?: boolean;
}

// Interface used by ProjectDetail component
export interface Project extends Omit<ProjectData, 'district'> {
  district: string; // Make it required here
}

const ProjectView = ({ onLogout }: { onLogout: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) {
        setError("No project ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const projectData = await getProjectById(id);
        
        if (!projectData) {
          setError("Project not found");
          setIsLoading(false);
          return;
        }

        // Convert the project data to match our ProjectData interface
        const formattedProject: ProjectData = {
          id: projectData.id || "",
          name: projectData.name || "",
          tmk: projectData.tmk || "",
          status: (projectData.status as "draft" | "in-progress" | "completed" | "needs-revision") || "draft",
          district: projectData.district || "Unknown", // Changed: now always set with fallback
          lastUpdated: new Date(projectData.updated_at || Date.now()),
          address: projectData.address || "",
          client_name: projectData.client_name || "",
          property_owner: projectData.property_owner || "",
          // Map new fields
          project_type: projectData.project_type,
          stories: projectData.stories,
          building_height: projectData.building_height,
          total_building_area: projectData.total_building_area,
          lot_area_sqft: projectData.lot_area_sqft,
          existing_use: projectData.existing_use,
          proposed_use: projectData.proposed_use,
          construction_type: projectData.construction_type,
          is_fully_sprinklered: projectData.is_fully_sprinklered
        };

        setProject(formattedProject);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data");
        toast({
          title: "Error",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id, toast]);

  const handleEditProject = () => {
    if (project) {
      navigate(`/project/edit/${project.id}`);
    }
  };

  if (isLoading) {
    return (
      <AppLayout onLogout={onLogout}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-lg">Loading project data...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !project) {
    return <NotFound />;
  }

  // Since district is now required in ProjectData, we don't need this conversion anymore
  return (
    <AppLayout onLogout={onLogout}>
      <ProjectHeader 
        project={project} 
        onEditProject={handleEditProject} 
      />
      <ProjectDetail project={project as Project} />
    </AppLayout>
  );
};

export default ProjectView;

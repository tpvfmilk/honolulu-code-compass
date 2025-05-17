
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProjectDetail } from "../components/projects/ProjectDetail";
import { NotFound } from "./NotFound";
import { getProjectById } from "../services/dataService";
import { useToast } from "@/components/ui/use-toast";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define an interface for the project data structure
export interface ProjectData {
  id: string;
  name: string;
  tmk: string;
  status: "draft" | "in-progress" | "completed" | "needs-revision";
  district: string;
  lastUpdated: Date;
  address?: string;
  client_name?: string;
  property_owner?: string;
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
          district: "Unknown", // This field might need to be fetched from project_data
          lastUpdated: new Date(projectData.updated_at || Date.now()),
          address: projectData.address || "",
          client_name: projectData.client_name || "",
          property_owner: projectData.property_owner || ""
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

  return (
    <AppLayout onLogout={onLogout}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">TMK: {project.tmk}</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleEditProject}
        >
          <Pencil className="h-4 w-4" />
          <span>Edit Project</span>
        </Button>
      </div>
      <ProjectDetail project={project} />
    </AppLayout>
  );
};

export default ProjectView;

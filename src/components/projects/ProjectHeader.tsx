
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectData } from "../../pages/ProjectView";
import { ProjectPdfPreview } from "./ProjectPdfPreview";

interface ProjectHeaderProps {
  project: ProjectData;
  onEditProject: () => void;
}

export const ProjectHeader = ({ project, onEditProject }: ProjectHeaderProps) => {
  // Format project type for display
  const formatProjectType = (type?: string): string => {
    if (!type) return "New Project";
    
    // Format from snake_case or kebab-case to Title Case
    return type.split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  const statusColors = {
    "draft": "bg-gray-200 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "completed": "bg-green-100 text-green-800",
    "needs-revision": "bg-amber-100 text-amber-800",
  };
  
  const statusText = {
    "draft": "Draft",
    "in-progress": "In Progress",
    "completed": "Completed",
    "needs-revision": "Needs Revision",
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <span className={`text-xs py-1 px-2 rounded-full ${statusColors[project.status]}`}>
              {statusText[project.status]}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-muted-foreground">
            <p>TMK: {project.tmk}</p>
            {project.project_type && (
              <>
                <div className="hidden sm:block">•</div>
                <p>{formatProjectType(project.project_type)}</p>
              </>
            )}
            {project.district && (
              <>
                <div className="hidden sm:block">•</div>
                <p>{project.district}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onEditProject}
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Project</span>
          </Button>
          <ProjectPdfPreview project={project} />
        </div>
      </div>
      
      {project.address && (
        <p className="text-sm text-muted-foreground">{project.address}</p>
      )}
    </div>
  );
};


import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectData } from "../../pages/ProjectView";
import { ProjectPdfPreview } from "./ProjectPdfPreview";

interface ProjectHeaderProps {
  project: ProjectData;
  onEditProject: () => void;
}

export const ProjectHeader = ({ project, onEditProject }: ProjectHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">TMK: {project.tmk}</p>
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
  );
};

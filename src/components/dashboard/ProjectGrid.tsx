
import { useState } from "react";
import { ProjectCard, Project } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

type ProjectGridProps = {
  projects: Project[];
};

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tmk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3"
          />
        </div>
        <Button
          onClick={() => navigate("/projects/new")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm
              ? "Try adjusting your search term"
              : "Create a new project to get started"}
          </p>
          {!searchTerm && (
            <Button 
              className="mt-4"
              onClick={() => navigate("/projects/new")}
            >
              Create your first project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

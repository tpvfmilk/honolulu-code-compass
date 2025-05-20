
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NavigateFunction } from "react-router-dom";
import { Copy, Eye, FileText, MoreVertical, Trash } from "lucide-react";
import { Project, getStatusBadgeColor } from "../types/projectListTypes";

interface ProjectsGridProps {
  projects: Project[];
  selectedProjects: string[];
  onSelectProject: (id: string) => void;
  onViewProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  navigate: NavigateFunction;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  selectedProjects,
  onSelectProject,
  onViewProject,
  onDeleteProject,
  navigate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
          onClick={() => onViewProject(project.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1 overflow-hidden">
                <CardTitle className="text-lg truncate" title={project.name}>
                  {project.name}
                </CardTitle>
              </div>
              <Checkbox
                checked={selectedProjects.includes(project.id)}
                onCheckedChange={() => onSelectProject(project.id)}
                className="mr-2 mt-1"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => navigate(`/project/${project.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/project/edit/${project.id}`)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-sm text-muted-foreground mb-2">
              TMK: {project.tmk}
            </div>
            <div className="text-sm text-muted-foreground mb-3 truncate" title={project.address}>
              {project.address}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={getStatusBadgeColor(project.status)}
                variant="secondary"
              >
                {project.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
              <Badge variant="outline">{project.project_type}</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-2 text-xs text-muted-foreground">
            Last updated: {new Date(project.updated_at).toLocaleDateString()}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

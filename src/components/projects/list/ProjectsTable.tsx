
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NavigateFunction } from "react-router-dom";
import { Copy, Eye, FileText, MoreVertical, Trash } from "lucide-react";
import { Project, getStatusBadgeColor } from "../types/projectListTypes";

interface ProjectsTableProps {
  projects: Project[];
  selectedProjects: string[];
  onSelectProject: (id: string) => void;
  onViewProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  navigate: NavigateFunction;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  selectedProjects,
  onSelectProject,
  onViewProject,
  onDeleteProject,
  navigate,
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]">
              <Checkbox
                checked={
                  selectedProjects.length === projects.length &&
                  projects.length > 0
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectProject(projects.map((p) => p.id).join(','));
                  } else {
                    onSelectProject('');
                  }
                }}
              />
            </TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>TMK</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={() => onSelectProject(project.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell
                className="font-medium"
                onClick={() => onViewProject(project.id)}
              >
                {project.name}
              </TableCell>
              <TableCell>{project.tmk}</TableCell>
              <TableCell>
                <Badge
                  className={getStatusBadgeColor(project.status)}
                  variant="secondary"
                >
                  {project.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </TableCell>
              <TableCell>{project.project_type}</TableCell>
              <TableCell>
                {new Date(project.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProject(project.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

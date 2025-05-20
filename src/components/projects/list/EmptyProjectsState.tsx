
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyProjectsStateProps {
  hasProjects: boolean;
  onCreateProject: () => void;
  onClearFilters: () => void;
}

export const EmptyProjectsState: React.FC<EmptyProjectsStateProps> = ({
  hasProjects,
  onCreateProject,
  onClearFilters,
}) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-gray-50">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium">No projects found</h3>
      <p className="text-muted-foreground mb-4">
        {!hasProjects
          ? "You haven't created any projects yet"
          : "No projects match your current filters"}
      </p>
      {!hasProjects ? (
        <Button onClick={onCreateProject}>Create Your First Project</Button>
      ) : (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
};

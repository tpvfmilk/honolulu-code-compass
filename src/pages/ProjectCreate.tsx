
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectWizard } from "@/components/projects/ProjectWizard";

interface ProjectCreateProps {
  onLogout: () => Promise<void>;
}

const ProjectCreate = ({ onLogout }: ProjectCreateProps) => {
  return (
    <AppLayout onLogout={async () => await onLogout()}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
        <ProjectWizard />
      </div>
    </AppLayout>
  );
};

export default ProjectCreate;


import { AppLayout } from "../components/layout/AppLayout";
import { ProjectWizard } from "../components/projects/ProjectWizard";

const ProjectCreate = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <AppLayout onLogout={onLogout}>
      <ProjectWizard />
    </AppLayout>
  );
};

export default ProjectCreate;

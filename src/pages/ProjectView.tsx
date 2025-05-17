
import { useParams } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProjectDetail } from "../components/projects/ProjectDetail";
import { Project } from "../components/dashboard/ProjectCard";
import { NotFound } from "./NotFound";

// Mock data - would come from an API in a real app
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Kailua Beach House",
    tmk: "(1) 4-2-002:001",
    status: "completed",
    district: "R-5 Residential",
    lastUpdated: new Date(2023, 4, 10),
  },
  {
    id: "2",
    name: "Manoa Valley ADU",
    tmk: "(1) 2-9-005:022",
    status: "in-progress",
    district: "R-7.5 Residential",
    lastUpdated: new Date(2023, 5, 2),
  },
  {
    id: "3",
    name: "Kakaako Office Building",
    tmk: "(1) 2-1-058:123",
    status: "draft",
    district: "BMX-3 Business Mixed Use",
    lastUpdated: new Date(2023, 5, 15),
  },
];

const ProjectView = ({ onLogout }: { onLogout: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const project = MOCK_PROJECTS.find((p) => p.id === id);

  if (!project) {
    return <NotFound />;
  }

  return (
    <AppLayout onLogout={onLogout}>
      <ProjectDetail project={project} />
    </AppLayout>
  );
};

export default ProjectView;

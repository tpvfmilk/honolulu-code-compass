
import { useState } from "react";
import { AuthForm } from "../components/auth/AuthForm";
import { AppLayout } from "../components/layout/AppLayout";
import { StatsCards } from "../components/dashboard/StatsCards";
import { ProjectGrid } from "../components/dashboard/ProjectGrid";
import { Project } from "../components/dashboard/ProjectCard";

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
  {
    id: "4",
    name: "Waikiki Condo Renovation",
    tmk: "(1) 2-6-012:037",
    status: "needs-revision",
    district: "A-2 Apartment",
    lastUpdated: new Date(2023, 4, 28),
  },
];

const Index = () => {
  // Always authenticated for now
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Still have the function but we won't use it to actually log out for now
    console.log("Logout functionality disabled");
    // Not setting isAuthenticated to false for now
  };

  // Login form is now bypassed
  return (
    <AppLayout onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John Architect</p>
        </div>

        <StatsCards 
          totalProjects={MOCK_PROJECTS.length} 
          completedProjects={MOCK_PROJECTS.filter(p => p.status === "completed").length}
          inProgressProjects={MOCK_PROJECTS.filter(p => p.status === "in-progress").length}
        />

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Your Projects</h2>
          <ProjectGrid projects={MOCK_PROJECTS} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;

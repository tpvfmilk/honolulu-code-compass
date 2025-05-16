
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b py-6 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-primary">Hawaii Building Code Compliance</h1>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col md:flex-row py-8">
          <div className="w-full md:w-1/2 px-6 py-8 flex items-center justify-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold mb-6">Simplify Code Compliance for Hawaii Building Projects</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Save time and reduce errors with our specialized platform for architects and engineers in Hawaii.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm mt-0.5">✓</div>
                  <div>
                    <p className="font-medium">Generate code sheets in minutes, not hours</p>
                    <p className="text-sm text-muted-foreground">Complete basic compliance sheets in 5-7 minutes</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm mt-0.5">✓</div>
                  <div>
                    <p className="font-medium">Real-time compliance checking</p>
                    <p className="text-sm text-muted-foreground">Instant visual feedback on zoning requirements</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm mt-0.5">✓</div>
                  <div>
                    <p className="font-medium">Professional PDF generation</p>
                    <p className="text-sm text-muted-foreground">Ready for permit submission with your firm's branding</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 bg-card p-6 flex items-center justify-center">
            <AuthForm onSuccess={handleLogin} />
          </div>
        </div>
        
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Hawaii Building Code Compliance Platform
        </footer>
      </div>
    );
  }

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

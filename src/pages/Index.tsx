
import { useState } from "react";
import { AuthForm } from "../components/auth/AuthForm";
import { AppLayout } from "../components/layout/AppLayout";
import { StatsCards } from "../components/dashboard/StatsCards";
import { ProjectGrid } from "../components/dashboard/ProjectGrid";
import { Project } from "../components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ShieldCheck, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const ACTIVITIES = [
  { id: 1, project: "Kailua Beach House", action: "Code sheet exported", time: "2 hours ago" },
  { id: 2, project: "Manoa Valley ADU", action: "Zoning updated to R-7.5", time: "Yesterday" },
  { id: 3, project: "Kakaako Office Building", action: "Project created", time: "3 days ago" },
];

const TESTIMONIALS = [
  {
    quote: "This platform saved me at least 3 hours per project on code compliance sheets.",
    author: "Sarah K., Principal Architect",
    firm: "Honolulu Design Partners"
  },
  {
    quote: "The real-time calculations helped us catch zoning issues before submission.",
    author: "David L., Project Manager",
    firm: "Pacific Architecture Group"
  }
];

const Index = () => {
  // Always authenticated for now
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Still have the function but we won't use it to actually log out for now
    console.log("Logout functionality disabled");
    // Not setting isAuthenticated to false for now
  };

  return (
    <AppLayout onLogout={handleLogout}>
      {isAuthenticated ? (
        // Authenticated Dashboard View
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, John Architect</p>
            </div>
            <Button 
              onClick={() => navigate('/projects/new')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              New Project
            </Button>
          </div>

          <StatsCards 
            totalProjects={MOCK_PROJECTS.length} 
            completedProjects={MOCK_PROJECTS.filter(p => p.status === "completed").length}
            inProgressProjects={MOCK_PROJECTS.filter(p => p.status === "in-progress").length}
          />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
              <ProjectGrid projects={MOCK_PROJECTS} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
              <div className="bg-card rounded-lg border p-4 space-y-3">
                {ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="mt-1 bg-muted rounded-full p-1">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.project}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Unauthenticated Landing Page View
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                    Hawaii Building Code Compliance Made Simple
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-[600px]">
                    Create accurate code compliance sheets in minutes, not hours. Built specifically for Hawaii architects.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button size="lg" onClick={handleLogin}>
                      Start Free Trial
                    </Button>
                    <Button size="lg" variant="outline">
                      View Demo
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="rounded-xl overflow-hidden shadow-xl">
                    <img 
                      src="/placeholder.svg" 
                      alt="Screenshot of code compliance platform" 
                      className="w-full aspect-video object-cover" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 bg-muted/50">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold">Designed for Hawaii Architects</h2>
                <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
                  Our platform automates the code compliance process with features built specifically for Hawaii's unique requirements.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">75% Time Savings</h3>
                  <p className="text-muted-foreground">Generate complete code sheets in under 15 minutes instead of hours of manual work.</p>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">100% Code Accuracy</h3>
                  <p className="text-muted-foreground">Our system is continuously updated with the latest Hawaii building codes and zoning regulations.</p>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Professional Output</h3>
                  <p className="text-muted-foreground">Branded, permit-ready PDF sheets with all the calculations and code references clearly documented.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-12">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold mb-12 text-center">Trusted by Hawaii's Top Architects</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {TESTIMONIALS.map((testimonial, i) => (
                  <div key={i} className="bg-muted/30 rounded-xl p-6 border">
                    <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.firm}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleLogin}
                >
                  Try It Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </AppLayout>
  );
};

export default Index;

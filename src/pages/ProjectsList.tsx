
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  address: string;
  client_name: string;
  property_owner: string;
  tmk: string;
  created_at: string;
  updated_at: string;
  current_step: number;
  status: string;
  is_complete: boolean;
  user_id: string;
  project_type: string;
  // Map these to the expected format for ProjectCard
  district?: string;
  lastUpdated?: string;
}

interface ProjectsListProps {
  onLogout: () => Promise<void>;
}

const ProjectsList = ({ onLogout }: ProjectsListProps) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }
        
        // Fetch projects for the authenticated user
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Process the data to match the Project interface
        const processedData: Project[] = data.map((project: any) => ({
          ...project,
          district: project.district || "N/A", // Provide default value for district
          lastUpdated: project.updated_at,     // Map updated_at to lastUpdated
          project_type: project.project_type || "Unknown" // Default project_type if missing
        }));
        
        setProjects(processedData);
        setFilteredProjects(processedData);
      } catch (error: any) {
        console.error("Error fetching projects:", error.message);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [navigate, toast]);
  
  useEffect(() => {
    // Filter projects based on selected filter
    if (filter === "all") {
      setFilteredProjects(projects);
    } else if (filter === "active") {
      setFilteredProjects(projects.filter(project => 
        project.status === "active" || project.status === "in-progress"
      ));
    } else if (filter === "completed") {
      setFilteredProjects(projects.filter(project => 
        project.status === "completed" || project.is_complete
      ));
    } else if (filter === "pending") {
      setFilteredProjects(projects.filter(project => 
        project.status === "pending" || (!project.is_complete && project.status !== "active")
      ));
    }
  }, [filter, projects]);
  
  // Calculate statistics for the cards
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active" || p.status === "in-progress").length,
    completed: projects.filter(p => p.status === "completed" || p.is_complete).length,
    pending: projects.filter(p => p.status === "pending" || (!p.is_complete && p.status !== "active")).length
  };
  
  return (
    <AppLayout onLogout={onLogout}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-gray-500 mt-1">Manage and view all your building projects</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate("/project/create")}>
              Create New Project
            </Button>
          </div>
        </div>
        
        <StatsCards stats={stats} />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              onClick={() => setFilter("all")}
            >
              All Projects
            </Button>
            <Button 
              variant={filter === "active" ? "default" : "outline"} 
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button 
              variant={filter === "completed" ? "default" : "outline"} 
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
            <Button 
              variant={filter === "pending" ? "default" : "outline"} 
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <ProjectGrid projects={filteredProjects} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter !== "all" 
                  ? `You don't have any ${filter} projects yet.` 
                  : "You haven't created any projects yet."}
              </p>
              {filter !== "all" ? (
                <Button 
                  variant="link" 
                  onClick={() => setFilter("all")}
                  className="mt-4"
                >
                  View all projects
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate("/project/create")}
                  className="mt-4"
                >
                  Create your first project
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectsList;

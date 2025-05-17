
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface ProjectsListProps {
  onLogout: () => Promise<void>;
}

// Extend Project type to ensure compatibility
interface Project {
  id: string;
  name: string;
  address: string;
  tmk: string;
  client_name: string;
  property_owner: string;
  status: "draft" | "in-progress" | "completed" | "needs-revision";  // Use literal types
  project_type: string;
  created_at: string;
  updated_at: string;
  current_step: number;
  is_complete: boolean;
  user_id?: string;
}

const ProjectsList = ({ onLogout }: ProjectsListProps) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Ensure proper status values
        const formattedProjects = data.map(project => ({
          ...project,
          status: validateStatus(project.status),
          project_type: project.project_type || "Unknown"
        })) as Project[];
        
        setProjects(formattedProjects);
      }
    } catch (error: any) {
      toast.error(`Error loading projects: ${error.message}`);
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to validate status values
  const validateStatus = (status: string): "draft" | "in-progress" | "completed" | "needs-revision" => {
    const validStatuses = ["draft", "in-progress", "completed", "needs-revision"];
    return validStatuses.includes(status) ? status as any : "draft";
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const filteredProjects = projects.filter(project => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return project.status === "in-progress";
    if (activeFilter === "completed") return project.status === "completed";
    if (activeFilter === "draft") return project.status === "draft";
    return true;
  });
  
  // Calculate statistics
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "in-progress").length,
    completed: projects.filter(p => p.status === "completed").length,
    pending: projects.filter(p => ["draft", "needs-revision"].includes(p.status)).length
  };
  
  return (
    <AppLayout onLogout={async () => await onLogout()}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">My Projects</h1>
          <Button 
            onClick={() => navigate('/project/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>
        
        <StatsCards 
          stats={{
            total: stats.total,
            active: stats.active,
            completed: stats.completed,
            pending: stats.pending
          }} 
        />
        
        <Tabs defaultValue="all" className="mt-8" onValueChange={setActiveFilter}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeFilter} className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProjects.length > 0 ? (
              <ProjectGrid projects={filteredProjects as any} />
            ) : (
              <div className="bg-muted/40 rounded-lg p-10 text-center">
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  {activeFilter === "all" 
                    ? "You don't have any projects yet. Create your first project to get started." 
                    : `You don't have any ${activeFilter} projects.`
                  }
                </p>
                <Button onClick={() => navigate('/project/create')}>
                  Create New Project
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectsList;

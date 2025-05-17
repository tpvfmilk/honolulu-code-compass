import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [searchTerm, setSearchTerm] = useState("");
  
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
        // Ensure proper status values and project_type
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
  
  // Filter projects based on active tab and search term
  const filteredProjects = projects.filter(project => {
    // Filter by tab
    if (activeFilter !== "all" && project.status !== activeFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !project.tmk.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-500 mt-1">Manage and track your building code compliance projects</p>
            </div>
            
            <Button 
              onClick={() => navigate('/project/create')}
              className="bg-ocean-600 hover:bg-ocean-700 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <StatsCards 
          totalProjects={stats.total}
          completedProjects={stats.completed}
          inProgressProjects={stats.active}
        />
        
        {/* Projects Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-50 border-gray-200"
                />
              </div>
              
              {/* Filter Tabs */}
              <Tabs defaultValue={activeFilter} onValueChange={setActiveFilter} className="w-full sm:w-auto">
                <TabsList className="bg-gray-100 p-1 h-auto">
                  <TabsTrigger value="all" className="text-xs px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-ocean-700 data-[state=active]:shadow-sm">
                    All Projects
                  </TabsTrigger>
                  <TabsTrigger value="in-progress" className="text-xs px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-ocean-700 data-[state=active]:shadow-sm">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="text-xs px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-ocean-700 data-[state=active]:shadow-sm">
                    Completed
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="text-xs px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-ocean-700 data-[state=active]:shadow-sm">
                    Drafts
                  </TabsTrigger>
                </TabsList>

                {/* This TabsContent must be within the Tabs component */}
                <TabsContent value={activeFilter} className="mt-0 p-6">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
                    </div>
                  ) : filteredProjects.length > 0 ? (
                    <ProjectGrid projects={filteredProjects as any} />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-10 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                      <p className="text-gray-500 mb-6">
                        {searchTerm 
                          ? "Try adjusting your search term or filter selection" 
                          : (activeFilter === "all" 
                            ? "You don't have any projects yet. Create your first project to get started." 
                            : `You don't have any ${activeFilter} projects.`
                          )
                        }
                      </p>
                      <Button 
                        onClick={() => navigate('/project/create')}
                        className="bg-ocean-600 hover:bg-ocean-700 text-white"
                      >
                        Create New Project
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectsList;

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { StatsCards } from '@/components/dashboard/StatsCards';

// Define the interface for data coming from the database
interface ProjectData {
  id: string;
  name: string;
  address: string;
  client_name: string;
  property_owner: string;
  tmk: string;
  status: string;
  is_complete: boolean;
  current_step: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Define the Project interface used by components
export interface Project {
  id: string;
  name: string;
  address: string;
  project_type: string;
  client_name: string;
  property_owner: string;
  tmk: string;
  status: string;
  is_complete: boolean;
  current_step: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectsListProps {
  onLogout: () => Promise<void>;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ onLogout }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Helper function to determine project type based on other properties
  const determineProjectType = (project: ProjectData): string => {
    // This is a placeholder logic - you would determine project type 
    // based on actual data indicators from your database
    if (project.name.toLowerCase().includes('residential')) {
      return 'Residential';
    } else if (project.name.toLowerCase().includes('commercial')) {
      return 'Commercial';
    } else if (project.name.toLowerCase().includes('industrial')) {
      return 'Industrial';
    } else {
      return 'Other';
    }
  };
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          toast({ 
            title: "Authentication error", 
            description: "You must be logged in to view projects", 
            variant: "destructive" 
          });
          return;
        }

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Transform the data to include project type
          const transformedProjects = data.map((project: ProjectData) => ({
            ...project,
            project_type: determineProjectType(project)
          }));

          setProjects(transformedProjects);
          setFilteredProjects(transformedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Failed to fetch projects",
          description: "There was an error loading your projects",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  useEffect(() => {
    // Filter projects based on search term and status
    let result = projects;
    
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(result);
  }, [searchTerm, statusFilter, projects]);

  // Calculate stats
  const completedProjects = projects.filter(p => p.is_complete).length;
  const inProgressProjects = projects.filter(p => !p.is_complete).length;
  const totalProjects = projects.length;

  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Projects</h1>
        </div>

        <StatsCards 
          totalProjects={totalProjects} 
          completedProjects={completedProjects} 
          inProgressProjects={inProgressProjects} 
        />

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-gray-500 mb-4">
                  {projects.length === 0 
                    ? "You haven't created any projects yet." 
                    : "No projects match your search criteria."}
                </p>
                {projects.length === 0 && (
                  <a 
                    href="/project/create" 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Create your first project
                  </a>
                )}
              </div>
            ) : (
              <ProjectGrid projects={filteredProjects} />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectsList;

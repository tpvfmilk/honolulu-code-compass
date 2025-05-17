
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  address: string;
  tmk: string;
  client_name: string;
  property_owner: string;
  status: string;
  project_type: string;
  created_at: string;
  updated_at: string;
  current_step: number;
  is_complete: boolean;
  user_id?: string;
}

interface ProjectViewProps {
  onLogout: () => Promise<void>;
}

const ProjectView = ({ onLogout }: ProjectViewProps) => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Ensure all required fields are present
        if (data) {
          const projectData: Project = {
            ...data,
            project_type: data.project_type || 'Unknown'
          };
          setProject(projectData);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProject();
    }
  }, [id]);
  
  return (
    <AppLayout onLogout={async () => await onLogout()}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back link */}
        <div className="flex items-center">
          <Link to="/projects" className="inline-flex items-center text-sm text-ocean-600 hover:text-ocean-800 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-red-700">
            <h2 className="text-xl font-medium mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : project ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-500 mt-1">TMK: {project.tmk}</p>
            </div>
            <div className="p-6">
              <ProjectDetail project={project as any} />
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-amber-700">
            <h2 className="text-xl font-medium mb-2">Project Not Found</h2>
            <p>The requested project could not be found.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectView;

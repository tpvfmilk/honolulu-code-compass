
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  name: string;
  address: string;
  tmk: string;
  client_name: string;
  property_owner: string;
  status: string;
  project_type: string; // Add missing property
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
            project_type: data.project_type || 'Unknown' // Add default value
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
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
            <h2 className="text-xl font-medium mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : project ? (
          <ProjectDetail project={project as any} />
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-yellow-700">
            <h2 className="text-xl font-medium mb-2">Project Not Found</h2>
            <p>The requested project could not be found.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectView;

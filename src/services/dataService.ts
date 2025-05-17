import { supabase } from "@/integrations/supabase/client";

// Types
export type ZoningDistrictData = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  min_lot_area: number;
  max_building_height: number;
  max_stories: number | null;
  front_setback: number;
  side_setback: number;
  rear_setback: number;
  max_lot_coverage: number;
  max_far: number | null;
};

export type ConstructionTypeData = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

export type OccupancyGroupData = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

// Project data type
export type ProjectData = {
  id?: string;
  name: string;
  tmk: string | null;
  address: string | null;
  client_name?: string | null;
  property_owner?: string | null;
  status?: string;
  current_step?: number;
  is_complete?: boolean;
  updated_at?: string;  // Make this field optional but available
};

// Fetch zoning districts
export const fetchZoningDistricts = async (): Promise<ZoningDistrictData[]> => {
  const { data, error } = await supabase
    .from('zoning_districts')
    .select('*')
    .order('code');

  if (error) {
    console.error('Error fetching zoning districts:', error);
    return [];
  }

  return data || [];
};

// Fetch construction types
export const fetchConstructionTypes = async (): Promise<ConstructionTypeData[]> => {
  const { data, error } = await supabase
    .from('construction_types')
    .select('*')
    .order('code');
    
  if (error) {
    console.error('Error fetching construction types:', error);
    return [];
  }
    
  return data || [];
};

// Fetch occupancy groups
export const fetchOccupancyGroups = async (): Promise<OccupancyGroupData[]> => {
  const { data, error } = await supabase
    .from('occupancy_groups')
    .select('*')
    .order('code');
    
  if (error) {
    console.error('Error fetching occupancy groups:', error);
    return [];
  }
    
  return data || [];
};

// Project operations

// Save project (creates new or updates existing)
export const saveProject = async (projectData: ProjectData): Promise<string | null> => {
  // If we have a user ID, associate the project with the user
  // Otherwise, this will rely on RLS to handle permissions
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  const projectWithUserId = {
    ...projectData,
    user_id: userId || null,
  };
  
  if (projectData.id) {
    // Update existing project
    const { error } = await supabase
      .from('projects')
      .update(projectWithUserId)
      .eq('id', projectData.id);
      
    if (error) {
      console.error('Error updating project:', error);
      return null;
    }
    
    return projectData.id;
  } else {
    // Create new project
    const { data, error } = await supabase
      .from('projects')
      .insert(projectWithUserId)
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating project:', error);
      return null;
    }
    
    return data?.id || null;
  }
};

// Save project data (for storing form state)
export const saveProjectData = async (projectId: string, stepNumber: number, formData: any): Promise<boolean> => {
  const { error } = await supabase
    .from('project_data')
    .upsert({
      project_id: projectId,
      step_number: stepNumber,
      data: formData
    }, {
      onConflict: 'project_id,step_number'
    });
    
  if (error) {
    console.error('Error saving project data:', error);
    return false;
  }
    
  return true;
};

// Get project by ID
export const getProjectById = async (id: string): Promise<ProjectData | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
    
  return data;
};

// Get project data (form state)
export const getProjectData = async (projectId: string, stepNumber: number): Promise<any | null> => {
  const { data, error } = await supabase
    .from('project_data')
    .select('data')
    .eq('project_id', projectId)
    .eq('step_number', stepNumber)
    .single();
    
  if (error) {
    console.error('Error fetching project data:', error);
    return null;
  }
    
  return data?.data || null;
};

// Get all projects for current user
export const getUserProjects = async (): Promise<ProjectData[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
    
  return data || [];
};

// Delete a project
export const deleteProject = async (id: string): Promise<boolean> => {
  // First delete associated project data
  const { error: dataError } = await supabase
    .from('project_data')
    .delete()
    .eq('project_id', id);
    
  if (dataError) {
    console.error('Error deleting project data:', dataError);
    return false;
  }
    
  // Then delete the project
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
    
  return true;
};

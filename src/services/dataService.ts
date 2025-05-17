
import { supabase } from "@/integrations/supabase/client";
import { 
  HeightAreaLimitRecord, 
  FireRatingRecord, 
  LoadFactorRecord, 
  ZoningDistrict 
} from "@/components/admin/types";

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

export type SpaceTypeData = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  occupancy_group_id: string;
  occupant_load_factor: number;
};

export type HeightAreaLimitData = {
  id: string;
  construction_type_id: string;
  occupancy_group_id: string;
  max_height_ft: number;
  max_stories: number;
  base_allowable_area: number;
  sprinkler_increase_allowed: boolean;
};

export type FireRatingData = {
  id: string;
  construction_type_id: string;
  structural_frame: number;
  bearing_walls_exterior: number;
  bearing_walls_interior: number;
  nonbearing_walls_exterior: number;
  nonbearing_walls_interior: number;
  floor_construction: number;
  roof_construction: number;
};

export type LoadFactorData = {
  id: string;
  occupancy_group_id: string;
  space_type: string;
  load_factor: number;
  description: string;
};

export type TravelDistanceData = {
  id: string;
  occupancy_group_id: string;
  sprinklered: boolean;
  max_travel_distance_ft: number;
  max_common_path_ft: number;
  max_dead_end_ft: number;
};

export type SeparationData = {
  id: string;
  from_occupancy_id: string;
  to_occupancy_id: string;
  required_rating_hours: number;
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

// Fetch height and area limits
export const fetchHeightAreaLimits = async (): Promise<HeightAreaLimitData[]> => {
  const { data, error } = await supabase
    .from('height_area_limits')
    .select(`
      id,
      construction_type_id,
      occupancy_group_id,
      max_height_ft,
      max_stories,
      base_allowable_area,
      sprinkler_increase_allowed
    `)
    .order('occupancy_group_id');

  if (error) {
    console.error('Error fetching height and area limits:', error);
    return [];
  }

  return data || [];
};

// Fetch fire ratings
export const fetchFireRatings = async (): Promise<FireRatingRecord[]> => {
  const { data, error } = await supabase
    .from('fire_separation_requirements')
    .select(`
      id,
      from_occupancy_id,
      to_occupancy_id,
      required_rating_hours
    `)
    .order('from_occupancy_id');

  if (error) {
    console.error('Error fetching fire ratings:', error);
    return [];
  }

  // This is a placeholder to convert from the database format to the expected format
  // In a real implementation, you'd create a proper mapping or update your component
  const convertedData: FireRatingRecord[] = data.map((item, index) => ({
    id: item.id,
    constructionType: `Type ${index + 1}`, // Placeholder - would need real mapping
    structuralFrame: item.required_rating_hours,
    bearingWallsExterior: item.required_rating_hours,
    bearingWallsInterior: item.required_rating_hours,
    nonbearingPartitions: 0,
    floorConstruction: item.required_rating_hours,
    roofConstruction: Math.max(0, item.required_rating_hours - 1),
    ibcTableReference: "Table 601"
  }));

  return convertedData;
};

// Fetch load factors
export const fetchLoadFactors = async (): Promise<LoadFactorRecord[]> => {
  const { data, error } = await supabase
    .from('space_types')
    .select(`
      id,
      code,
      name,
      description,
      occupancy_group_id,
      occupant_load_factor
    `)
    .order('occupancy_group_id');

  if (error) {
    console.error('Error fetching load factors:', error);
    return [];
  }

  // Convert from database format to component format
  const convertedData: LoadFactorRecord[] = data.map(item => {
    return {
      id: item.id,
      occupancyGroup: item.code.split('-')[0] || 'Unknown', // This is a guess at the format, adjust as needed
      spaceType: item.name,
      loadFactor: item.occupant_load_factor,
      description: item.description || '',
      ibcTableReference: "Table 1004.5"
    };
  });

  return convertedData;
};

// Fetch travel distances
export const fetchTravelDistances = async (): Promise<TravelDistanceData[]> => {
  const { data, error } = await supabase
    .from('travel_distance_limits')
    .select('*')
    .order('occupancy_group_id');

  if (error) {
    console.error('Error fetching travel distances:', error);
    return [];
  }

  return data || [];
};

// Fetch occupancy separations
export const fetchOccupancySeparations = async (): Promise<SeparationData[]> => {
  const { data, error } = await supabase
    .from('fire_separation_requirements')
    .select('*')
    .order('from_occupancy_id');

  if (error) {
    console.error('Error fetching occupancy separations:', error);
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

import { supabase } from "@/integrations/supabase/client";
import { 
  HeightAreaLimitRecord, 
  FireRatingRecord, 
  LoadFactorRecord, 
  ZoningDistrict,
  ConstructionTypeData,
  OccupancyGroupData,
  HeightAreaLimitData,
  TravelDistanceData,
  SeparationData
} from "@/components/admin/types";

// Types
export type ZoningDistrictData = ZoningDistrict;
export type { ConstructionTypeData, OccupancyGroupData, HeightAreaLimitData, TravelDistanceData, SeparationData };

// Project data type
export type ProjectData = {
  id?: string;
  name: string;
  tmk: string | null;
  address: string | null;
  district?: string;
  client_name?: string | null;
  property_owner?: string | null;
  status?: string;
  current_step?: number;
  is_complete?: boolean;
  updated_at?: string;  // Make this field optional but available
  // Building details
  project_type?: string;
  stories?: number;
  building_height?: number;
  total_building_area?: number;
  lot_area_sqft?: number;
  existing_use?: string;
  proposed_use?: string;
  construction_type?: string;
  is_fully_sprinklered?: boolean;
  // Environmental designations
  lava_zone?: string;
  seismic_zone?: string;
  flood_zone?: string;
  // County and historic information
  county?: "Honolulu" | "Hawaii" | "Maui" | "Kauai";
  historic_status?: boolean;
  historic_review_type?: string;
  // For renovation projects
  year_of_construction?: number;
  original_building_code?: string;
  alteration_level?: string;
  work_area_percentage?: number;
  compliance_method?: string;
  // Parking information
  standard_stalls_required?: number;
  standard_stalls_provided?: number;
  ada_stalls_required?: number;
  ada_stalls_provided?: number;
  loading_spaces_required?: number;
  loading_spaces_provided?: number;
};

// Space types with load factors
export interface SpaceTypeInfo {
  id: string;
  code: string;
  name: string;
  description?: string;
  occupancy_group_id: string;
  occupant_load_factor: number;
}

// Fetch space types by occupancy group
export const fetchSpaceTypesByOccupancy = async (occupancyGroupId: string): Promise<SpaceTypeInfo[]> => {
  if (!occupancyGroupId) {
    console.error('No occupancy group ID provided');
    return [];
  }

  const { data, error } = await supabase
    .from('space_types')
    .select('*')
    .eq('occupancy_group_id', occupancyGroupId);
    
  if (error) {
    console.error('Error fetching space types:', error);
    return [];
  }
    
  return data || [];
};

// Get occupancy group ID by code
export const getOccupancyGroupIdByCode = async (code: string): Promise<string | null> => {
  // Extract base occupancy code (e.g., 'B' from 'B-1')
  const baseCode = code.split('-')[0];
  
  const { data, error } = await supabase
    .from('occupancy_groups')
    .select('id')
    .eq('code', baseCode)
    .single();
    
  if (error) {
    console.error('Error fetching occupancy group ID:', error);
    return null;
  }
    
  return data?.id || null;
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

// Create zoning district
export const createZoningDistrict = async (district: Omit<ZoningDistrict, 'id' | 'created_at' | 'updated_at'>): Promise<ZoningDistrict | null> => {
  const { data, error } = await supabase
    .from('zoning_districts')
    .insert({
      code: district.code,
      name: district.name,
      description: district.description || null,
      min_lot_area: district.min_lot_area,
      max_building_height: district.max_building_height,
      max_stories: district.max_stories || null,
      front_setback: district.front_setback,
      side_setback: district.side_setback,
      rear_setback: district.rear_setback,
      max_lot_coverage: district.max_lot_coverage,
      max_far: district.max_far || null
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating zoning district:', error);
    return null;
  }
    
  return data;
};

// Update zoning district
export const updateZoningDistrict = async (district: ZoningDistrict): Promise<ZoningDistrict | null> => {
  const { data, error } = await supabase
    .from('zoning_districts')
    .update({
      code: district.code,
      name: district.name,
      description: district.description || null,
      min_lot_area: district.min_lot_area,
      max_building_height: district.max_building_height,
      max_stories: district.max_stories || null,
      front_setback: district.front_setback,
      side_setback: district.side_setback,
      rear_setback: district.rear_setback,
      max_lot_coverage: district.max_lot_coverage,
      max_far: district.max_far || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', district.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating zoning district:', error);
    return null;
  }
    
  return data;
};

// Delete zoning district
export const deleteZoningDistrict = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('zoning_districts')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting zoning district:', error);
    return false;
  }
    
  return true;
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
      base_height_ft,
      base_stories,
      base_allowable_area,
      sprinklered_height_ft,
      sprinklered_stories,
      sprinklered_area,
      sprinkler_increase_allowed
    `)
    .order('occupancy_group_id');

  if (error) {
    console.error('Error fetching height and area limits:', error);
    return [];
  }

  return data || [];
};

// Create a new height and area limit record
export const createHeightAreaLimit = async (record: Omit<HeightAreaLimitData, 'id' | 'created_at' | 'updated_at'>): Promise<HeightAreaLimitData | null> => {
  const { data, error } = await supabase
    .from('height_area_limits')
    .insert({
      construction_type_id: record.construction_type_id,
      occupancy_group_id: record.occupancy_group_id,
      base_height_ft: record.base_height_ft,
      base_stories: record.base_stories,
      base_allowable_area: record.base_allowable_area,
      sprinklered_height_ft: record.sprinklered_height_ft,
      sprinklered_stories: record.sprinklered_stories,
      sprinklered_area: record.sprinklered_area,
      sprinkler_increase_allowed: record.sprinkler_increase_allowed,
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating height and area limit record:', error);
    return null;
  }
    
  return data;
};

// Update an existing height and area limit record
export const updateHeightAreaLimit = async (record: HeightAreaLimitData): Promise<HeightAreaLimitData | null> => {
  const { data, error } = await supabase
    .from('height_area_limits')
    .update({
      construction_type_id: record.construction_type_id,
      occupancy_group_id: record.occupancy_group_id,
      base_height_ft: record.base_height_ft,
      base_stories: record.base_stories,
      base_allowable_area: record.base_allowable_area,
      sprinklered_height_ft: record.sprinklered_height_ft,
      sprinklered_stories: record.sprinklered_stories,
      sprinklered_area: record.sprinklered_area,
      sprinkler_increase_allowed: record.sprinkler_increase_allowed,
      updated_at: new Date().toISOString()
    })
    .eq('id', record.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating height and area limit record:', error);
    return null;
  }
    
  return data;
};

// Delete a height and area limit record
export const deleteHeightAreaLimit = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('height_area_limits')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting height and area limit record:', error);
    return false;
  }
    
  return true;
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

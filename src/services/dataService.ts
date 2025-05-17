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

// Code Section types
export type CodeSectionData = {
  id: string;
  code_type: string;
  jurisdiction: string;
  year: string;
  section_number: string;
  section_title: string;
  section_text: string;
  plain_language_explanation: string | null;
  parent_section_id: string | null;
  has_children: boolean;
  is_calculation_required: boolean;
  created_at?: string;
  updated_at?: string;
};

export type BookmarkedCodeData = {
  id: string;
  user_id: string;
  code_section_id: string;
  created_at?: string;
};

export type FrequentlyReferencedCodeData = {
  id: string;
  code_section_id: string;
  reference_count: number;
  updated_at?: string;
};

// Fetch code sections
export const fetchCodeSections = async (
  codeType?: string,
  jurisdiction?: string,
  year?: string
): Promise<CodeSectionData[]> => {
  let query = supabase.from('code_sections').select('*');
  
  if (codeType) {
    query = query.eq('code_type', codeType);
  }
  
  if (jurisdiction) {
    query = query.eq('jurisdiction', jurisdiction);
  }
  
  if (year) {
    query = query.eq('year', year);
  }
  
  const { data, error } = await query.order('section_number');
  
  if (error) {
    console.error('Error fetching code sections:', error);
    return [];
  }
  
  return data || [];
};

// Fetch a single code section by ID
export const getCodeSectionById = async (id: string): Promise<CodeSectionData | null> => {
  const { data, error } = await supabase
    .from('code_sections')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching code section:', error);
    return null;
  }
    
  return data;
};

// Search code sections
export const searchCodeSections = async (
  searchQuery: string,
  codeType?: string,
  jurisdiction?: string,
  year?: string
): Promise<CodeSectionData[]> => {
  let query = supabase
    .from('code_sections')
    .select('*')
    .or(`section_title.ilike.%${searchQuery}%,section_number.ilike.%${searchQuery}%,section_text.ilike.%${searchQuery}%`);
  
  if (codeType) {
    query = query.eq('code_type', codeType);
  }
  
  if (jurisdiction) {
    query = query.eq('jurisdiction', jurisdiction);
  }
  
  if (year) {
    query = query.eq('year', year);
  }
  
  const { data, error } = await query.order('section_number');
  
  if (error) {
    console.error('Error searching code sections:', error);
    return [];
  }
  
  return data || [];
};

// Get user bookmarked codes
export const getUserBookmarkedCodes = async (): Promise<CodeSectionData[]> => {
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('user_bookmarked_codes')
    .select('code_section_id')
    
  if (bookmarksError) {
    console.error('Error fetching user bookmarks:', bookmarksError);
    return [];
  }
  
  if (!bookmarks || bookmarks.length === 0) {
    return [];
  }
  
  const codeSectionIds = bookmarks.map(bookmark => bookmark.code_section_id);
  
  const { data, error } = await supabase
    .from('code_sections')
    .select('*')
    .in('id', codeSectionIds);
  
  if (error) {
    console.error('Error fetching bookmarked code sections:', error);
    return [];
  }
  
  return data || [];
};

// Toggle bookmark for a code section
export const toggleBookmark = async (codeSectionId: string): Promise<boolean> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    console.error('User not authenticated');
    return false;
  }
  
  // Check if bookmark exists
  const { data: existingBookmark, error: checkError } = await supabase
    .from('user_bookmarked_codes')
    .select('id')
    .eq('user_id', user.id)
    .eq('code_section_id', codeSectionId)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking bookmark:', checkError);
    return false;
  }
  
  if (existingBookmark) {
    // Remove bookmark
    const { error: deleteError } = await supabase
      .from('user_bookmarked_codes')
      .delete()
      .eq('id', existingBookmark.id);
      
    if (deleteError) {
      console.error('Error removing bookmark:', deleteError);
      return false;
    }
    
    return true;
  } else {
    // Add bookmark
    const { error: insertError } = await supabase
      .from('user_bookmarked_codes')
      .insert({
        user_id: user.id,
        code_section_id: codeSectionId
      });
      
    if (insertError) {
      console.error('Error adding bookmark:', insertError);
      return false;
    }
    
    return true;
  }
};

// Get frequently referenced codes
export const getFrequentlyReferencedCodes = async (): Promise<CodeSectionData[]> => {
  const { data: frequentRefs, error: freqError } = await supabase
    .from('frequently_referenced_codes')
    .select('code_section_id')
    .order('reference_count', { ascending: false })
    .limit(10);
    
  if (freqError) {
    console.error('Error fetching frequently referenced codes:', freqError);
    return [];
  }
  
  if (!frequentRefs || frequentRefs.length === 0) {
    return [];
  }
  
  const codeSectionIds = frequentRefs.map(ref => ref.code_section_id);
  
  const { data, error } = await supabase
    .from('code_sections')
    .select('*')
    .in('id', codeSectionIds);
  
  if (error) {
    console.error('Error fetching frequently referenced code sections:', error);
    return [];
  }
  
  return data || [];
};

// Record a reference to a code section (increment the reference count)
export const recordCodeReference = async (codeSectionId: string): Promise<boolean> => {
  // First check if the code section exists in the frequently referenced table
  const { data: existingRef, error: checkError } = await supabase
    .from('frequently_referenced_codes')
    .select('id, reference_count')
    .eq('code_section_id', codeSectionId)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking reference:', checkError);
    return false;
  }
  
  if (existingRef) {
    // Update reference count
    const { error: updateError } = await supabase
      .from('frequently_referenced_codes')
      .update({
        reference_count: (existingRef.reference_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingRef.id);
      
    if (updateError) {
      console.error('Error updating reference count:', updateError);
      return false;
    }
  } else {
    // Create new reference
    const { error: insertError } = await supabase
      .from('frequently_referenced_codes')
      .insert({
        code_section_id: codeSectionId,
        reference_count: 1
      });
      
    if (insertError) {
      console.error('Error creating reference:', insertError);
      return false;
    }
  }
  
  return true;
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

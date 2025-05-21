
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ComplianceAdminUser } from "@/components/compliance/types";

// Construction Types
export interface ConstructionTypeRow {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchConstructionTypes = async (): Promise<ConstructionTypeRow[]> => {
  try {
    const { data, error } = await supabase
      .from('construction_types')
      .select('*')
      .order('code');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'fetching construction types');
    return [];
  }
};

export const createConstructionType = async (type: Omit<ConstructionTypeRow, 'id' | 'created_at' | 'updated_at'>): Promise<ConstructionTypeRow | null> => {
  try {
    const { data, error } = await supabase
      .from('construction_types')
      .insert(type)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Construction type created successfully.",
    });
    
    return data;
  } catch (error) {
    handleSupabaseError(error, 'creating construction type');
    return null;
  }
};

export const updateConstructionType = async (type: ConstructionTypeRow): Promise<ConstructionTypeRow | null> => {
  try {
    const { data, error } = await supabase
      .from('construction_types')
      .update({
        code: type.code,
        name: type.name,
        description: type.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', type.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Construction type updated successfully.",
    });
    
    return data;
  } catch (error) {
    handleSupabaseError(error, 'updating construction type');
    return null;
  }
};

export const deleteConstructionType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('construction_types')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Construction type deleted successfully.",
    });
    
    return true;
  } catch (error) {
    handleSupabaseError(error, 'deleting construction type');
    return false;
  }
};

// Occupancy Groups
export interface OccupancyGroupRow {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchOccupancyGroups = async (): Promise<OccupancyGroupRow[]> => {
  try {
    const { data, error } = await supabase
      .from('occupancy_groups')
      .select('*')
      .order('code');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'fetching occupancy groups');
    return [];
  }
};

export const createOccupancyGroup = async (group: Omit<OccupancyGroupRow, 'id' | 'created_at' | 'updated_at'>): Promise<OccupancyGroupRow | null> => {
  try {
    const { data, error } = await supabase
      .from('occupancy_groups')
      .insert(group)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Occupancy group created successfully.",
    });
    
    return data;
  } catch (error) {
    handleSupabaseError(error, 'creating occupancy group');
    return null;
  }
};

export const updateOccupancyGroup = async (group: OccupancyGroupRow): Promise<OccupancyGroupRow | null> => {
  try {
    const { data, error } = await supabase
      .from('occupancy_groups')
      .update({
        code: group.code,
        name: group.name,
        description: group.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', group.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Occupancy group updated successfully.",
    });
    
    return data;
  } catch (error) {
    handleSupabaseError(error, 'updating occupancy group');
    return null;
  }
};

export const deleteOccupancyGroup = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('occupancy_groups')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Occupancy group deleted successfully.",
    });
    
    return true;
  } catch (error) {
    handleSupabaseError(error, 'deleting occupancy group');
    return false;
  }
};

// Space Types with Load Factors
export interface SpaceTypeRow {
  id: string;
  code: string;
  name: string;
  description?: string;
  occupancy_group_id: string;
  occupant_load_factor: number;
  created_at?: string;
  updated_at?: string;
}

export const fetchSpaceTypes = async (): Promise<SpaceTypeRow[]> => {
  try {
    const { data, error } = await supabase
      .from('space_types')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'fetching space types');
    return [];
  }
};

export const createSpaceType = async (spaceType: Omit<SpaceTypeRow, 'id' | 'created_at' | 'updated_at'>): Promise<SpaceTypeRow | null> => {
  try {
    const { data, error } = await supabase
      .from('space_types')
      .insert(spaceType)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Space type created successfully.",
    });
    
    return data;
  } catch (error) {
    handleSupabaseError(error, 'creating space type');
    return null;
  }
};

export const updateSpaceType = async (spaceType: SpaceTypeRow): Promise<SpaceTypeRow | null> => {
  try {
    const { data, error } = await supabase
      .from('space_types')
      .update({
        code: spaceType.code,
        name: spaceType.name,
        description: spaceType.description,
        occupancy_group_id: spaceType.occupancy_group_id,
        occupant_load_factor: spaceType.occupant_load_factor,
        updated_at: new Date().toISOString()
      })
      .eq('id', spaceType.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Space type updated successfully.",
    });
    
    return data;
  } catch (error) {
    handleSupabaseError(error, 'updating space type');
    return null;
  }
};

export const deleteSpaceType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('space_types')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Space type deleted successfully.",
    });
    
    return true;
  } catch (error) {
    handleSupabaseError(error, 'deleting space type');
    return false;
  }
};

// Get admin user from localStorage
export const getAdminUser = (): ComplianceAdminUser | null => {
  const adminData = localStorage.getItem('compliance_admin');
  if (!adminData) return null;
  
  try {
    return JSON.parse(adminData);
  } catch (err) {
    return null;
  }
};

// Get table statistics
export const fetchTableStatistics = async (): Promise<any[]> => {
  const tables = [
    'construction_types',
    'occupancy_groups',
    'height_area_limits',
    'fire_separation_requirements',
    'space_types',
    'zoning_districts',
    'parking_requirements',
  ];
  
  try {
    const statsPromises = tables.map(async (table) => {
      const { count, error } = await supabase
        .from(table as any)
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      return {
        table_name: table,
        count: count || 0
      };
    });
    
    return await Promise.all(statsPromises);
  } catch (error) {
    handleSupabaseError(error, 'fetching table statistics');
    return [];
  }
};

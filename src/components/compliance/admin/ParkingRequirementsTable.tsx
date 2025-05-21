
import { useState } from "react";
import { DataTable, Column, DataRow } from "@/components/compliance/admin/DataTable";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { fetchZoningDistricts, ZoningDistrictData } from "@/services/dataService"; 
import { supabase } from "@/integrations/supabase/client";

// Define type for parking requirement data
interface ParkingRequirementData {
  id: string;
  use_type: string;
  parking_ratio: string;
  loading_ratio: string | null;
  notes: string | null;
  code_reference: string | null;
  zoning_district_id: string | null;
  created_at?: string;
  updated_at?: string;
}

// Function to fetch parking requirements from Supabase
const fetchParkingRequirements = async (): Promise<ParkingRequirementData[]> => {
  const { data, error } = await supabase
    .from('parking_requirements')
    .select('*')
    .order('use_type');
    
  if (error) {
    console.error('Error fetching parking requirements:', error);
    return [];
  }
    
  return data || [];
};

export const ParkingRequirementsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch parking requirements data
  const { data: parkingRequirements = [], isLoading: isLoadingParking, error: parkingError, refetch } = useQuery({
    queryKey: ["parkingRequirements"],
    queryFn: fetchParkingRequirements
  });

  // Fetch zoning districts for dropdown options
  const { data: zoningDistricts = [], isLoading: isLoadingZoning } = useQuery({
    queryKey: ["zoningDistricts"],
    queryFn: fetchZoningDistricts
  });
  
  const isLoading = isLoadingParking || isLoadingZoning;
  
  if (parkingError) {
    console.error("Error fetching parking requirements:", parkingError);
  }

  // Create dropdown options for zoning districts
  const zoningDistrictOptions = zoningDistricts.map(district => ({
    label: `${district.code} - ${district.name}`,
    value: district.id
  }));
  
  // Add "All Districts" option
  zoningDistrictOptions.unshift({
    label: "All Districts",
    value: ""
  });

  // Define columns for the data table
  const columns: Column[] = [
    { 
      id: "use_type", 
      header: "Use Type", 
      accessorKey: "use_type", 
      editable: true
    },
    { 
      id: "zoning_district", 
      header: "Zoning District", 
      accessorKey: "zoning_district_id", 
      editable: true,
      type: "select",
      options: zoningDistrictOptions,
      cell: (row) => {
        if (!row.zoning_district_id) return <span>All Districts</span>;
        const district = zoningDistricts.find(d => d.id === row.zoning_district_id);
        return district ? <span>{district.code}</span> : null;
      }
    },
    { 
      id: "parking_ratio", 
      header: "Parking Ratio", 
      accessorKey: "parking_ratio", 
      editable: true
    },
    { 
      id: "loading_ratio", 
      header: "Loading Ratio", 
      accessorKey: "loading_ratio", 
      editable: true
    },
    { 
      id: "code_reference", 
      header: "Code Reference", 
      accessorKey: "code_reference", 
      editable: true
    },
    { 
      id: "notes", 
      header: "Notes", 
      accessorKey: "notes", 
      editable: true
    }
  ];

  // Handle creating a new parking requirement
  const handleCreate = async (newRequirement: DataRow) => {
    try {
      const { data, error } = await supabase
        .from('parking_requirements')
        .insert({
          use_type: newRequirement.use_type,
          zoning_district_id: newRequirement.zoning_district_id || null,
          parking_ratio: newRequirement.parking_ratio,
          loading_ratio: newRequirement.loading_ratio || null,
          code_reference: newRequirement.code_reference || null,
          notes: newRequirement.notes || null
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating parking requirement:", error);
        toast({
          title: "Error",
          description: "Failed to create parking requirement",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Parking requirement created successfully",
      });
      refetch();
      return true;
    } catch (error) {
      console.error("Error creating parking requirement:", error);
      toast({
        title: "Error",
        description: "Failed to create parking requirement",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle updating a parking requirement
  const handleUpdate = async (updatedRequirement: DataRow) => {
    try {
      const { data, error } = await supabase
        .from('parking_requirements')
        .update({
          use_type: updatedRequirement.use_type,
          zoning_district_id: updatedRequirement.zoning_district_id || null,
          parking_ratio: updatedRequirement.parking_ratio,
          loading_ratio: updatedRequirement.loading_ratio || null,
          code_reference: updatedRequirement.code_reference || null,
          notes: updatedRequirement.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedRequirement.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating parking requirement:", error);
        toast({
          title: "Error",
          description: "Failed to update parking requirement",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Parking requirement updated successfully",
      });
      refetch();
      return true;
    } catch (error) {
      console.error("Error updating parking requirement:", error);
      toast({
        title: "Error",
        description: "Failed to update parking requirement",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle deleting a parking requirement
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('parking_requirements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting parking requirement:", error);
        toast({
          title: "Error",
          description: "Failed to delete parking requirement",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Parking requirement deleted successfully",
      });
      refetch();
      return true;
    } catch (error) {
      console.error("Error deleting parking requirement:", error);
      toast({
        title: "Error",
        description: "Failed to delete parking requirement",
        variant: "destructive"
      });
      return false;
    }
  };

  // Default values for new row
  const defaultNewRow = {
    id: "new",
    use_type: "Commercial",
    zoning_district_id: "",
    parking_ratio: "1 per 500 sf",
    loading_ratio: "1 per 10,000 sf",
    code_reference: "",
    notes: ""
  };

  return (
    <DataTable
      data={parkingRequirements}
      columns={columns}
      onSave={handleUpdate}
      onDelete={handleDelete}
      onCreate={handleCreate}
      defaultNewRow={defaultNewRow}
      isLoading={isLoading}
      searchPlaceholder="Search parking requirements..."
    />
  );
};

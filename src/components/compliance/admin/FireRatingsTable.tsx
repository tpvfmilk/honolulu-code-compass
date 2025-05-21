
import { useState } from "react";
import { DataTable, Column, DataRow } from "@/components/compliance/admin/DataTable";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { 
  fetchOccupancyGroups,
  fetchOccupancySeparations,
  SeparationData
} from "@/services/dataService";
import { supabase } from "@/integrations/supabase/client";

export const FireRatingsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch fire separation requirements data
  const { data: fireSeparations = [], isLoading: isLoadingSeparations, error, refetch } = useQuery({
    queryKey: ["fireSeparations"],
    queryFn: fetchOccupancySeparations
  });

  // Fetch occupancy groups for dropdown options
  const { data: occupancyGroups = [], isLoading: isLoadingOccupancyGroups } = useQuery({
    queryKey: ["occupancyGroups"],
    queryFn: fetchOccupancyGroups
  });
  
  const isLoading = isLoadingSeparations || isLoadingOccupancyGroups;
  
  if (error) {
    console.error("Error fetching fire separation requirements:", error);
  }

  // Create dropdown options for occupancy groups
  const occupancyGroupOptions = occupancyGroups.map(group => ({
    label: `${group.code} - ${group.name}`,
    value: group.id
  }));

  // Define columns for the data table
  const columns: Column[] = [
    { 
      id: "from_occupancy", 
      header: "From Occupancy", 
      accessorKey: "from_occupancy_id", 
      editable: true,
      type: "select",
      options: occupancyGroupOptions,
      cell: (row) => {
        const group = occupancyGroups.find(g => g.id === row.from_occupancy_id);
        return group ? <span>{group.code}</span> : null;
      }
    },
    { 
      id: "to_occupancy", 
      header: "To Occupancy", 
      accessorKey: "to_occupancy_id", 
      editable: true,
      type: "select",
      options: occupancyGroupOptions,
      cell: (row) => {
        const group = occupancyGroups.find(g => g.id === row.to_occupancy_id);
        return group ? <span>{group.code}</span> : null;
      }
    },
    { 
      id: "required_rating_hours", 
      header: "Required Rating (hours)", 
      accessorKey: "required_rating_hours", 
      editable: true,
      type: "number"
    }
  ];

  // Handle creating a new fire separation requirement
  const handleCreate = async (newSeparation: DataRow) => {
    try {
      const { data, error } = await supabase
        .from('fire_separation_requirements')
        .insert({
          from_occupancy_id: newSeparation.from_occupancy_id,
          to_occupancy_id: newSeparation.to_occupancy_id,
          required_rating_hours: Number(newSeparation.required_rating_hours)
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating fire separation requirement:", error);
        toast({
          title: "Error",
          description: "Failed to create fire separation requirement",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Fire separation requirement created successfully",
      });
      refetch();
      return true;
    } catch (error) {
      console.error("Error creating fire separation requirement:", error);
      toast({
        title: "Error",
        description: "Failed to create fire separation requirement",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle updating a fire separation requirement
  const handleUpdate = async (updatedSeparation: DataRow) => {
    try {
      const { data, error } = await supabase
        .from('fire_separation_requirements')
        .update({
          from_occupancy_id: updatedSeparation.from_occupancy_id,
          to_occupancy_id: updatedSeparation.to_occupancy_id,
          required_rating_hours: Number(updatedSeparation.required_rating_hours),
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedSeparation.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating fire separation requirement:", error);
        toast({
          title: "Error",
          description: "Failed to update fire separation requirement",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Fire separation requirement updated successfully",
      });
      refetch();
      return true;
    } catch (error) {
      console.error("Error updating fire separation requirement:", error);
      toast({
        title: "Error",
        description: "Failed to update fire separation requirement",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle deleting a fire separation requirement
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fire_separation_requirements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting fire separation requirement:", error);
        toast({
          title: "Error",
          description: "Failed to delete fire separation requirement",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Fire separation requirement deleted successfully",
      });
      refetch();
      return true;
    } catch (error) {
      console.error("Error deleting fire separation requirement:", error);
      toast({
        title: "Error",
        description: "Failed to delete fire separation requirement",
        variant: "destructive"
      });
      return false;
    }
  };

  // Default values for new row
  const defaultNewRow = {
    id: "new",
    from_occupancy_id: occupancyGroups.length > 0 ? occupancyGroups[0].id : "",
    to_occupancy_id: occupancyGroups.length > 0 ? occupancyGroups[0].id : "",
    required_rating_hours: 1
  };

  return (
    <DataTable
      data={fireSeparations}
      columns={columns}
      onSave={handleUpdate}
      onDelete={handleDelete}
      onCreate={handleCreate}
      defaultNewRow={defaultNewRow}
      isLoading={isLoading}
      searchPlaceholder="Search fire separation requirements..."
    />
  );
};

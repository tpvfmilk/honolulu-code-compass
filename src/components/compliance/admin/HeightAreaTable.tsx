
import { useState } from "react";
import { DataTable, Column, DataRow } from "@/components/compliance/admin/DataTable";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { 
  fetchHeightAreaLimits, 
  fetchConstructionTypes,
  fetchOccupancyGroups,
  createHeightAreaLimit,
  updateHeightAreaLimit,
  deleteHeightAreaLimit,
  HeightAreaLimitData
} from "@/services/dataService";

export const HeightAreaTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch height and area limits data
  const { data: heightAreaLimits = [], isLoading: isLoadingLimits, error: limitsError, refetch } = useQuery({
    queryKey: ["heightAreaLimits"],
    queryFn: fetchHeightAreaLimits
  });

  // Fetch construction types for dropdown options
  const { data: constructionTypes = [], isLoading: isLoadingConstructionTypes } = useQuery({
    queryKey: ["constructionTypes"],
    queryFn: fetchConstructionTypes
  });

  // Fetch occupancy groups for dropdown options
  const { data: occupancyGroups = [], isLoading: isLoadingOccupancyGroups } = useQuery({
    queryKey: ["occupancyGroups"],
    queryFn: fetchOccupancyGroups
  });
  
  const isLoading = isLoadingLimits || isLoadingConstructionTypes || isLoadingOccupancyGroups;
  
  if (limitsError) {
    console.error("Error fetching height and area limits:", limitsError);
  }

  // Create dropdown options for construction types
  const constructionTypeOptions = constructionTypes.map(type => ({
    label: `${type.code} - ${type.name}`,
    value: type.id
  }));

  // Create dropdown options for occupancy groups
  const occupancyGroupOptions = occupancyGroups.map(group => ({
    label: `${group.code} - ${group.name}`,
    value: group.id
  }));

  // Define columns for the data table
  const columns: Column[] = [
    { 
      id: "construction_type", 
      header: "Construction Type", 
      accessorKey: "construction_type_id", 
      editable: true,
      type: "select",
      options: constructionTypeOptions,
      cell: (row) => {
        const type = constructionTypes.find(t => t.id === row.construction_type_id);
        return type ? `${type.code} - ${type.name}` : row.construction_type_id;
      }
    },
    { 
      id: "occupancy_group", 
      header: "Occupancy Group", 
      accessorKey: "occupancy_group_id", 
      editable: true,
      type: "select",
      options: occupancyGroupOptions,
      cell: (row) => {
        const group = occupancyGroups.find(g => g.id === row.occupancy_group_id);
        return group ? `${group.code} - ${group.name}` : row.occupancy_group_id;
      }
    },
    { 
      id: "base_height_ft", 
      header: "Base Height (ft)", 
      accessorKey: "base_height_ft", 
      editable: true,
      type: "number"
    },
    { 
      id: "base_stories", 
      header: "Base Stories", 
      accessorKey: "base_stories", 
      editable: true,
      type: "number"
    },
    { 
      id: "base_allowable_area", 
      header: "Base Area (sq ft)", 
      accessorKey: "base_allowable_area", 
      editable: true,
      type: "number",
      cell: (row) => row.base_allowable_area ? row.base_allowable_area.toLocaleString() : "N/A"
    },
    { 
      id: "sprinkler_increase_allowed", 
      header: "Sprinkler Increase", 
      accessorKey: "sprinkler_increase_allowed", 
      editable: true,
      type: "boolean",
      cell: (row) => row.sprinkler_increase_allowed ? "Yes" : "No"
    },
    { 
      id: "sprinklered_height_ft", 
      header: "With Sprinklers Height (ft)", 
      accessorKey: "sprinklered_height_ft", 
      editable: true,
      type: "number"
    },
    { 
      id: "sprinklered_stories", 
      header: "With Sprinklers Stories", 
      accessorKey: "sprinklered_stories", 
      editable: true,
      type: "number"
    },
    { 
      id: "sprinklered_area", 
      header: "With Sprinklers Area (sq ft)", 
      accessorKey: "sprinklered_area", 
      editable: true,
      type: "number",
      cell: (row) => row.sprinklered_area ? row.sprinklered_area.toLocaleString() : "N/A"
    }
  ];

  // Handle creating a new height and area limit record
  const handleCreate = async (newLimit: DataRow) => {
    try {
      const created = await createHeightAreaLimit({
        construction_type_id: newLimit.construction_type_id,
        occupancy_group_id: newLimit.occupancy_group_id,
        base_height_ft: Number(newLimit.base_height_ft),
        base_stories: Number(newLimit.base_stories),
        base_allowable_area: Number(newLimit.base_allowable_area),
        sprinkler_increase_allowed: Boolean(newLimit.sprinkler_increase_allowed),
        sprinklered_height_ft: newLimit.sprinklered_height_ft ? Number(newLimit.sprinklered_height_ft) : null,
        sprinklered_stories: newLimit.sprinklered_stories ? Number(newLimit.sprinklered_stories) : null,
        sprinklered_area: newLimit.sprinklered_area ? Number(newLimit.sprinklered_area) : null
      });

      if (created) {
        toast({
          title: "Success",
          description: "Height and area limit created successfully",
        });
        refetch();
        return true;
      }
      
      toast({
        title: "Error",
        description: "Failed to create height and area limit",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Error creating height and area limit:", error);
      toast({
        title: "Error",
        description: "Failed to create height and area limit",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle updating a height and area limit record
  const handleUpdate = async (updatedLimit: DataRow) => {
    try {
      const updated = await updateHeightAreaLimit(updatedLimit as HeightAreaLimitData);
      
      if (updated) {
        toast({
          title: "Success",
          description: "Height and area limit updated successfully",
        });
        refetch();
        return true;
      }
      
      toast({
        title: "Error",
        description: "Failed to update height and area limit",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Error updating height and area limit:", error);
      toast({
        title: "Error",
        description: "Failed to update height and area limit",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle deleting a height and area limit record
  const handleDelete = async (id: string) => {
    try {
      const success = await deleteHeightAreaLimit(id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Height and area limit deleted successfully",
        });
        refetch();
        return true;
      }
      
      toast({
        title: "Error",
        description: "Failed to delete height and area limit",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Error deleting height and area limit:", error);
      toast({
        title: "Error",
        description: "Failed to delete height and area limit",
        variant: "destructive"
      });
      return false;
    }
  };

  // Default values for new row
  const defaultNewRow = {
    id: "new",
    construction_type_id: constructionTypes.length > 0 ? constructionTypes[0].id : "",
    occupancy_group_id: occupancyGroups.length > 0 ? occupancyGroups[0].id : "",
    base_height_ft: 60,
    base_stories: 5,
    base_allowable_area: 12000,
    sprinkler_increase_allowed: true,
    sprinklered_height_ft: 85,
    sprinklered_stories: 6,
    sprinklered_area: 36000
  };

  return (
    <DataTable
      data={heightAreaLimits}
      columns={columns}
      onSave={handleUpdate}
      onDelete={handleDelete}
      onCreate={handleCreate}
      defaultNewRow={defaultNewRow}
      isLoading={isLoading}
      searchPlaceholder="Search height and area limits..."
    />
  );
};

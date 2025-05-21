
import { useState } from "react";
import { DataTable, Column, DataRow } from "@/components/compliance/admin/DataTable";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { 
  fetchZoningDistricts, 
  createZoningDistrict, 
  updateZoningDistrict, 
  deleteZoningDistrict,
  ZoningDistrictData
} from "@/services/dataService";

export const ZoningDistrictsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch zoning districts data
  const { data: zoningDistricts = [], isLoading, error, refetch } = useQuery({
    queryKey: ["zoningDistricts"],
    queryFn: fetchZoningDistricts
  });
  
  if (error) {
    console.error("Error fetching zoning districts:", error);
  }

  // Define columns for the data table
  const columns: Column[] = [
    { 
      id: "code", 
      header: "Code", 
      accessorKey: "code", 
      editable: true
    },
    { 
      id: "name", 
      header: "Name", 
      accessorKey: "name", 
      editable: true
    },
    { 
      id: "min_lot_area", 
      header: "Min Lot Area", 
      accessorKey: "min_lot_area", 
      editable: true,
      type: "number",
      cell: (row) => <span>{row.min_lot_area.toLocaleString()} sf</span>
    },
    { 
      id: "max_building_height", 
      header: "Max Height", 
      accessorKey: "max_building_height",
      editable: true,
      type: "number",
      cell: (row) => <span>{row.max_building_height}′</span>
    },
    { 
      id: "max_stories", 
      header: "Max Stories", 
      accessorKey: "max_stories",
      editable: true,
      type: "number"
    },
    { 
      id: "front_setback", 
      header: "Front Setback", 
      accessorKey: "front_setback",
      editable: true,
      type: "number",
      cell: (row) => <span>{row.front_setback}′</span>
    },
    { 
      id: "side_setback", 
      header: "Side Setback", 
      accessorKey: "side_setback",
      editable: true,
      type: "number",
      cell: (row) => <span>{row.side_setback}′</span>
    },
    { 
      id: "rear_setback", 
      header: "Rear Setback", 
      accessorKey: "rear_setback",
      editable: true,
      type: "number",
      cell: (row) => <span>{row.rear_setback}′</span>
    },
    { 
      id: "max_lot_coverage", 
      header: "Max Coverage", 
      accessorKey: "max_lot_coverage",
      editable: true,
      type: "number",
      cell: (row) => <span>{row.max_lot_coverage}%</span>
    },
    { 
      id: "max_far", 
      header: "Max FAR", 
      accessorKey: "max_far",
      editable: true,
      type: "number"
    }
  ];

  // Handle creating a new zoning district
  const handleCreate = async (newDistrict: DataRow) => {
    try {
      const created = await createZoningDistrict({
        code: newDistrict.code,
        name: newDistrict.name,
        description: newDistrict.description || null,
        min_lot_area: Number(newDistrict.min_lot_area),
        max_building_height: Number(newDistrict.max_building_height),
        max_stories: newDistrict.max_stories ? Number(newDistrict.max_stories) : null,
        front_setback: Number(newDistrict.front_setback),
        side_setback: Number(newDistrict.side_setback),
        rear_setback: Number(newDistrict.rear_setback),
        max_lot_coverage: Number(newDistrict.max_lot_coverage),
        max_far: newDistrict.max_far ? Number(newDistrict.max_far) : null
      });

      if (created) {
        toast({
          title: "Success",
          description: "Zoning district created successfully",
        });
        refetch();
        return true;
      }
      
      toast({
        title: "Error",
        description: "Failed to create zoning district",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Error creating zoning district:", error);
      toast({
        title: "Error",
        description: "Failed to create zoning district",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle updating a zoning district
  const handleUpdate = async (updatedDistrict: DataRow) => {
    try {
      const updated = await updateZoningDistrict(updatedDistrict as ZoningDistrictData);
      
      if (updated) {
        toast({
          title: "Success",
          description: "Zoning district updated successfully",
        });
        refetch();
        return true;
      }
      
      toast({
        title: "Error",
        description: "Failed to update zoning district",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Error updating zoning district:", error);
      toast({
        title: "Error",
        description: "Failed to update zoning district",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle deleting a zoning district
  const handleDelete = async (id: string) => {
    try {
      const success = await deleteZoningDistrict(id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Zoning district deleted successfully",
        });
        refetch();
        return true;
      }
      
      toast({
        title: "Error",
        description: "Failed to delete zoning district",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Error deleting zoning district:", error);
      toast({
        title: "Error",
        description: "Failed to delete zoning district",
        variant: "destructive"
      });
      return false;
    }
  };

  const defaultNewRow = {
    id: "new",
    code: "",
    name: "",
    description: "",
    min_lot_area: 5000,
    max_building_height: 35,
    max_stories: 2,
    front_setback: 15,
    side_setback: 5,
    rear_setback: 10,
    max_lot_coverage: 50,
    max_far: 0.5
  };

  return (
    <DataTable
      data={zoningDistricts}
      columns={columns}
      onSave={handleUpdate}
      onDelete={handleDelete}
      onCreate={handleCreate}
      defaultNewRow={defaultNewRow}
      isLoading={isLoading}
      searchPlaceholder="Search zoning districts..."
    />
  );
};

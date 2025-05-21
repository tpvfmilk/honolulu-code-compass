
import { useEffect, useState } from "react";
import { DataTable, Column, DataRow } from "./DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table as TableIcon } from "lucide-react";
import { 
  SpaceTypeRow, 
  OccupancyGroupRow,
  fetchSpaceTypes, 
  createSpaceType, 
  updateSpaceType, 
  deleteSpaceType,
  fetchOccupancyGroups 
} from "@/services/complianceService";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export const SpaceTypes = () => {
  const [spaceTypes, setSpaceTypes] = useState<SpaceTypeRow[]>([]);
  const [occupancyGroups, setOccupancyGroups] = useState<OccupancyGroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  useEffect(() => {
    Promise.all([
      loadSpaceTypes(),
      loadOccupancyGroups()
    ]).finally(() => setLoading(false));
  }, []);
  
  const loadSpaceTypes = async () => {
    const data = await fetchSpaceTypes();
    setSpaceTypes(data);
  };
  
  const loadOccupancyGroups = async () => {
    const data = await fetchOccupancyGroups();
    setOccupancyGroups(data);
  };
  
  const handleSave = async (row: DataRow) => {
    try {
      const updated = await updateSpaceType(row as SpaceTypeRow);
      if (updated) {
        setSpaceTypes(prev => 
          prev.map(item => item.id === updated.id ? updated : item)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update space type.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreate = async (row: DataRow) => {
    try {
      const { id, created_at, updated_at, ...newRow } = row as SpaceTypeRow;
      const created = await createSpaceType(newRow);
      if (created) {
        setSpaceTypes(prev => [...prev, created]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create space type.",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };
  
  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      const success = await deleteSpaceType(deleteId);
      if (success) {
        setSpaceTypes(prev => 
          prev.filter(item => item.id !== deleteId)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete space type.",
        variant: "destructive"
      });
    } finally {
      setDeleteId(null);
    }
  };

  // Get occupancy group display name
  const getOccupancyGroupName = (id: string) => {
    const group = occupancyGroups.find(g => g.id === id);
    return group ? `${group.code} - ${group.name}` : id;
  };
  
  // Prepare occupancy group options for select
  const occupancyOptions = occupancyGroups.map(group => ({
    label: `${group.code} - ${group.name}`,
    value: group.id
  }));
  
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
      id: "occupancy_group_id",
      header: "Occupancy Group",
      accessorKey: "occupancy_group_id",
      editable: true,
      type: 'select',
      options: occupancyOptions,
      cell: (row) => {
        const groupName = getOccupancyGroupName(row.occupancy_group_id);
        const group = occupancyGroups.find(g => g.id === row.occupancy_group_id);
        return (
          <Badge variant="outline" className={`font-normal ${group ? 'bg-green-50 text-green-800' : ''}`}>
            {groupName}
          </Badge>
        );
      }
    },
    {
      id: "occupant_load_factor",
      header: "Load Factor (SF/person)",
      accessorKey: "occupant_load_factor",
      editable: true,
      type: 'number'
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      editable: true
    }
  ];
  
  const defaultNewRow = {
    id: "new",
    code: "",
    name: "",
    occupancy_group_id: "",
    occupant_load_factor: 100,
    description: ""
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <TableIcon className="mr-2 h-6 w-6 text-indigo-600" />
          Space Types
        </h1>
        <p className="text-muted-foreground">
          Manage space types and their associated occupant load factors
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Space Types Table</CardTitle>
          <CardDescription>
            Edit space types used for occupant load calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={spaceTypes}
            columns={columns}
            onSave={handleSave}
            onDelete={handleDelete}
            onCreate={handleCreate}
            defaultNewRow={defaultNewRow}
            isLoading={loading}
            searchPlaceholder="Search space types..."
          />
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the space type
              and may break references in other parts of the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

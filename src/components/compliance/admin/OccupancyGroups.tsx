
import { useEffect, useState } from "react";
import { DataTable, Column, DataRow } from "./DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { OccupancyGroupRow, fetchOccupancyGroups, createOccupancyGroup, updateOccupancyGroup, deleteOccupancyGroup } from "@/services/complianceService";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const OccupancyGroups = () => {
  const [occupancyGroups, setOccupancyGroups] = useState<OccupancyGroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  useEffect(() => {
    loadOccupancyGroups();
  }, []);
  
  const loadOccupancyGroups = async () => {
    setLoading(true);
    const data = await fetchOccupancyGroups();
    setOccupancyGroups(data);
    setLoading(false);
  };
  
  const handleSave = async (row: DataRow) => {
    try {
      const updated = await updateOccupancyGroup(row as OccupancyGroupRow);
      if (updated) {
        setOccupancyGroups(prev => 
          prev.map(item => item.id === updated.id ? updated : item)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update occupancy group.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreate = async (row: DataRow) => {
    try {
      const { id, created_at, updated_at, ...newRow } = row as OccupancyGroupRow;
      const created = await createOccupancyGroup(newRow);
      if (created) {
        setOccupancyGroups(prev => [...prev, created]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create occupancy group.",
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
      const success = await deleteOccupancyGroup(deleteId);
      if (success) {
        setOccupancyGroups(prev => 
          prev.filter(item => item.id !== deleteId)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete occupancy group.",
        variant: "destructive"
      });
    } finally {
      setDeleteId(null);
    }
  };
  
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
    description: ""
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Users className="mr-2 h-6 w-6 text-green-600" />
          Occupancy Groups
        </h1>
        <p className="text-muted-foreground">
          Manage occupancy groups (A-1, B, R-2, etc.) and their descriptions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Occupancy Groups Table</CardTitle>
          <CardDescription>
            Edit occupancy groups used throughout the compliance engine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={occupancyGroups}
            columns={columns}
            onSave={handleSave}
            onDelete={handleDelete}
            onCreate={handleCreate}
            defaultNewRow={defaultNewRow}
            isLoading={loading}
            searchPlaceholder="Search occupancy groups..."
          />
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the occupancy group
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


import { useEffect, useState } from "react";
import { DataTable, Column, DataRow } from "./DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { ConstructionTypeRow, fetchConstructionTypes, createConstructionType, updateConstructionType, deleteConstructionType } from "@/services/complianceService";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const ConstructionTypes = () => {
  const [constructionTypes, setConstructionTypes] = useState<ConstructionTypeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  useEffect(() => {
    loadConstructionTypes();
  }, []);
  
  const loadConstructionTypes = async () => {
    setLoading(true);
    const data = await fetchConstructionTypes();
    setConstructionTypes(data);
    setLoading(false);
  };
  
  const handleSave = async (row: DataRow) => {
    try {
      const updated = await updateConstructionType(row as ConstructionTypeRow);
      if (updated) {
        setConstructionTypes(prev => 
          prev.map(item => item.id === updated.id ? updated : item)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update construction type.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreate = async (row: DataRow) => {
    try {
      const { id, created_at, updated_at, ...newRow } = row as ConstructionTypeRow;
      const created = await createConstructionType(newRow);
      if (created) {
        setConstructionTypes(prev => [...prev, created]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create construction type.",
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
      const success = await deleteConstructionType(deleteId);
      if (success) {
        setConstructionTypes(prev => 
          prev.filter(item => item.id !== deleteId)
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete construction type.",
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
          <Building className="mr-2 h-6 w-6 text-blue-600" />
          Construction Types
        </h1>
        <p className="text-muted-foreground">
          Manage construction types (I-A through V-B) and their descriptions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Construction Types Table</CardTitle>
          <CardDescription>
            Edit construction types used throughout the compliance engine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={constructionTypes}
            columns={columns}
            onSave={handleSave}
            onDelete={handleDelete}
            onCreate={handleCreate}
            defaultNewRow={defaultNewRow}
            isLoading={loading}
            searchPlaceholder="Search construction types..."
          />
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the construction type
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


import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableTable } from "@/components/admin/SearchableTable";
import { HeightAreaLimitRecord } from "@/components/admin/types";
import { toast } from "sonner";
import { fetchConstructionTypes, fetchHeightAreaLimits, fetchOccupancyGroups, deleteHeightAreaLimit } from "@/services/dataService";
import { HeightAreaTableActions } from "./components/HeightAreaTableActions";
import { HeightAreaTableContent } from "./components/HeightAreaTableContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HeightAreaForm } from "../forms/HeightAreaForm";

interface HeightAreaTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HeightAreaTable = ({ searchQuery, setSearchQuery }: HeightAreaTableProps) => {
  const [data, setData] = useState<HeightAreaLimitRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [constructionTypes, setConstructionTypes] = useState<Record<string, string>>({});
  const [occupancyGroups, setOccupancyGroups] = useState<Record<string, string>>({});
  const [editingRecord, setEditingRecord] = useState<HeightAreaLimitRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load construction types and occupancy groups for mapping
      const types = await fetchConstructionTypes();
      const groups = await fetchOccupancyGroups();
      const typeMap: Record<string, string> = {};
      const groupMap: Record<string, string> = {};
      
      types.forEach(type => {
        typeMap[type.id] = type.code;
      });
      
      groups.forEach(group => {
        groupMap[group.id] = group.code;
      });
      
      setConstructionTypes(typeMap);
      setOccupancyGroups(groupMap);
      
      // Load height and area limits
      const heightAreaData = await fetchHeightAreaLimits();
      
      // Map data to the format expected by the component
      const formattedData: HeightAreaLimitRecord[] = heightAreaData.map(item => ({
        id: item.id,
        constructionType: typeMap[item.construction_type_id] || 'Unknown',
        occupancyGroup: groupMap[item.occupancy_group_id] || 'Unknown',
        maxHeight: item.base_height_ft,
        maxStories: item.base_stories,
        maxAreaPerFloor: item.base_allowable_area,
        sprinkleredHeight: item.sprinklered_height_ft,
        sprinkleredStories: item.sprinklered_stories,
        sprinkleredArea: item.sprinklered_area,
        sprinklersAllowed: item.sprinkler_increase_allowed === true,
        ibcTableReference: "Tables 504.3, 504.4, 506.2",
        notes: ""
      }));
      
      setData(formattedData);
    } catch (error) {
      console.error("Error loading height and area data:", error);
      toast.error("Failed to load height and area limitations data");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleEdit = (id: string) => {
    const recordToEdit = data.find(item => item.id === id);
    if (recordToEdit) {
      setEditingRecord(recordToEdit);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const success = await deleteHeightAreaLimit(id);
      if (success) {
        toast.success("Record deleted successfully");
        setData(data.filter(item => item.id !== id));
      } else {
        toast.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };
  
  const handleAddRecord = (newRecord: HeightAreaLimitRecord) => {
    setData(prevData => [newRecord, ...prevData]);
  };

  const handleEditSave = (updatedRecord: HeightAreaLimitRecord) => {
    setData(prevData => prevData.map(item => item.id === updatedRecord.id ? updatedRecord : item));
    setIsEditDialogOpen(false);
    setEditingRecord(null);
  };
  
  const handleDownloadTemplate = () => {
    toast.info("Template download functionality will be implemented soon.");
  };
  
  const handleUpload = () => {
    toast.info("Upload functionality will be implemented soon.");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Height & Area Limitations</CardTitle>
            <CardDescription>Maximum building heights, stories, and areas by construction type and occupancy (IBC Tables 504.3, 504.4, 506.2)</CardDescription>
          </div>
          <HeightAreaTableActions 
            onAddRecord={handleAddRecord} 
            onDownloadTemplate={handleDownloadTemplate}
            onUpload={handleUpload}
          />
        </div>
      </CardHeader>
      <CardContent>
        <SearchableTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <HeightAreaTableContent 
          data={data}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            {editingRecord && (
              <HeightAreaForm
                initialData={editingRecord}
                onClose={() => {
                  setIsEditDialogOpen(false);
                  setEditingRecord(null);
                }}
                onSave={handleEditSave}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchableTable } from "@/components/admin/SearchableTable";
import { TablePagination } from "@/components/admin/TablePagination";
import { Download, Upload, Plus, ArrowUp, ArrowDown, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { CsvUploader } from "@/components/admin/CsvUploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchOccupancyGroups, fetchOccupancySeparations } from "@/services/dataService";
import { OccupancySeparationsForm } from "../forms/OccupancySeparationsForm";

interface OccupancySeparation {
  id: string;
  fromOccupancy: string;
  toOccupancy: string;
  ratingHours: number;
}

interface OccupancySeparationsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const OccupancySeparationsTable = ({ searchQuery, setSearchQuery }: OccupancySeparationsTableProps) => {
  const [data, setData] = useState<OccupancySeparation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof OccupancySeparation>("fromOccupancy");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OccupancySeparation | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load occupancy groups for mapping
        const groups = await fetchOccupancyGroups();
        const groupMap: Record<string, string> = {};
        
        groups.forEach(group => {
          groupMap[group.id] = group.code;
        });
        
        // Load separation data
        const separationData = await fetchOccupancySeparations();
        
        // Map data to our desired format
        const formattedData: OccupancySeparation[] = separationData.map(item => ({
          id: item.id,
          fromOccupancy: groupMap[item.from_occupancy_id] || 'Unknown',
          toOccupancy: groupMap[item.to_occupancy_id] || 'Unknown',
          ratingHours: item.required_rating_hours
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Error loading occupancy separation data:", error);
        toast.error("Failed to load occupancy separation data");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const rowsPerPage = 10;
  
  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.fromOccupancy.toLowerCase().includes(lowerCaseQuery) ||
        item.toOccupancy.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        const aString = String(aValue || "").toLowerCase();
        const bString = String(bValue || "").toLowerCase();
        return sortDirection === "asc" 
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      }
    });
  }, [data, searchQuery, sortField, sortDirection]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  const handleSort = (field: keyof OccupancySeparation) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getSortIcon = (field: keyof OccupancySeparation) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="inline h-3 w-3 ml-1" /> : 
      <ArrowDown className="inline h-3 w-3 ml-1" />;
  };
  
  const handleEdit = (id: string) => {
    const recordToEdit = data.find(item => item.id === id);
    if (recordToEdit) {
      setEditingRecord(recordToEdit);
      setIsEditDialogOpen(true);
    } else {
      toast.info(`Editing record ID: ${id}`);
    }
  };
  
  const handleDelete = (id: string) => {
    toast.success(`Record ID: ${id} deleted`);
    setData(data.filter(item => item.id !== id));
  };
  
  const handleCsvUpload = async (csvData: any[]) => {
    try {
      console.log("CSV data to process:", csvData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Successfully processed ${csvData.length} records`);
      setIsUploadOpen(false);
      return true;
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("Failed to process CSV data");
      return false;
    }
  };
  
  // Format hours for display
  const formatHours = (hours: number) => {
    if (hours === 0) return "No separation";
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };
  
  const handleAddRecord = (newRecord: OccupancySeparation) => {
    setData(prevData => [...prevData, newRecord]);
    setIsAddDialogOpen(false);
  };
  
  const handleEditSave = (updatedRecord: OccupancySeparation) => {
    setData(prevData => 
      prevData.map(item => item.id === updatedRecord.id ? updatedRecord : item)
    );
    setIsEditDialogOpen(false);
    setEditingRecord(null);
  };
  
  const handleDownloadTemplate = () => {
    toast.info("Template download functionality will be implemented soon.");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Required Separation of Occupancies</CardTitle>
            <CardDescription>Fire-resistance rating required between different occupancy groups (IBC Table 508.4)</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleDownloadTemplate}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Template</span>
            </Button>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Occupancy Separation Data</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with occupancy separation requirements data. Download the template for the correct format.
                  </DialogDescription>
                </DialogHeader>
                <CsvUploader 
                  onUpload={handleCsvUpload} 
                  templateName="occupancy_separations" 
                />
              </DialogContent>
            </Dialog>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Record</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <OccupancySeparationsForm
                  onClose={() => setIsAddDialogOpen(false)}
                  onSave={handleAddRecord}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchableTable 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          placeholder="Search by occupancy group..." 
        />
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[120px] cursor-pointer"
                  onClick={() => handleSort("fromOccupancy")}
                >
                  From Occupancy {getSortIcon("fromOccupancy")}
                </TableHead>
                <TableHead 
                  className="w-[120px] cursor-pointer"
                  onClick={() => handleSort("toOccupancy")}
                >
                  To Occupancy {getSortIcon("toOccupancy")}
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("ratingHours")}
                >
                  Required Rating {getSortIcon("ratingHours")}
                </TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={`cell-${i}-${j}`} className="py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.fromOccupancy}</TableCell>
                    <TableCell>{row.toOccupancy}</TableCell>
                    <TableCell className="text-center">{formatHours(row.ratingHours)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(row.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {searchQuery ? "No matching records found." : "No records found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        
        {/* Dialog for editing records */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            {editingRecord && (
              <OccupancySeparationsForm
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

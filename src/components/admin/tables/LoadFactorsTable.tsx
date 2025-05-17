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
import { LoadFactorRecord } from "@/components/admin/types";
import { TablePagination } from "@/components/admin/TablePagination";
import { Download, Upload, Plus, ArrowUp, ArrowDown, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { CsvUploader } from "@/components/admin/CsvUploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchLoadFactors, fetchOccupancyGroups } from "@/services/dataService";
import { LoadFactorsForm } from "../forms/LoadFactorsForm";

interface LoadFactorsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const LoadFactorsTable = ({ searchQuery, setSearchQuery }: LoadFactorsTableProps) => {
  const [data, setData] = useState<LoadFactorRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof LoadFactorRecord>("occupancyGroup");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LoadFactorRecord | null>(null);
  
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
        
        // Load load factors data
        const loadFactorData = await fetchLoadFactors();
        
        setData(loadFactorData);
      } catch (error) {
        console.error("Error loading load factor data:", error);
        toast.error("Failed to load occupant load factors data");
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
        item.occupancyGroup.toLowerCase().includes(lowerCaseQuery) ||
        item.spaceType.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery)
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
  
  const handleSort = (field: keyof LoadFactorRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getSortIcon = (field: keyof LoadFactorRecord) => {
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
      // In a real implementation, this would validate and process the data
      console.log("CSV data to process:", csvData);
      
      // Simulate processing delay
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
  
  // Format the load factor value
  const formatLoadFactor = (value: number) => {
    if (value === 0) return "N/A";
    return `${value} sq ft per person`;
  };
  
  const handleAddRecord = (newRecord: LoadFactorRecord) => {
    setData(prevData => [...prevData, newRecord]);
    setIsAddDialogOpen(false);
  };
  
  const handleEditSave = (updatedRecord: LoadFactorRecord) => {
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
            <CardTitle>Occupant Load Factors</CardTitle>
            <CardDescription>Maximum occupant loads by occupancy classification and function (IBC Table 1004.5)</CardDescription>
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
                  <DialogTitle>Upload Load Factors Data</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with occupant load factors data. Download the template for the correct format.
                  </DialogDescription>
                </DialogHeader>
                <CsvUploader 
                  onUpload={handleCsvUpload} 
                  templateName="load_factors" 
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
                <LoadFactorsForm
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
          placeholder="Search by occupancy, space type, or description..." 
        />
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[100px] cursor-pointer"
                  onClick={() => handleSort("occupancyGroup")}
                >
                  Group {getSortIcon("occupancyGroup")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("spaceType")}
                >
                  Space Type {getSortIcon("spaceType")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("loadFactor")}
                >
                  Load Factor {getSortIcon("loadFactor")}
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={`cell-${i}-${j}`} className="py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.occupancyGroup}</TableCell>
                    <TableCell>{row.spaceType}</TableCell>
                    <TableCell>{formatLoadFactor(row.loadFactor)}</TableCell>
                    <TableCell className="max-w-xs truncate">{row.description}</TableCell>
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
                  <TableCell colSpan={5} className="h-24 text-center">
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
      </CardContent>
    </Card>
  );
};


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
import { FireRatingRecord } from "@/components/admin/types";
import { TablePagination } from "@/components/admin/TablePagination";
import { Download, Upload, Plus, ArrowUp, ArrowDown, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { CsvUploader } from "@/components/admin/CsvUploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchFireRatings, fetchConstructionTypes } from "@/services/dataService";

interface FireRatingsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FireRatingsTable = ({ searchQuery, setSearchQuery }: FireRatingsTableProps) => {
  const [data, setData] = useState<FireRatingRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof FireRatingRecord>("constructionType");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load construction types for displaying proper names
        const types = await fetchConstructionTypes();
        const typeMap: Record<string, string> = {};
        
        types.forEach(type => {
          typeMap[type.id] = type.code;
        });
        
        const fireRatingData = await fetchFireRatings();
        
        // For this example, we'll use the data as is
        // In a real implementation, you'd map the data properly
        setData(fireRatingData);
        
      } catch (error) {
        console.error("Error loading fire rating data:", error);
        toast.error("Failed to load fire rating data");
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
        item.constructionType.toLowerCase().includes(lowerCaseQuery)
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
  
  const handleSort = (field: keyof FireRatingRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getSortIcon = (field: keyof FireRatingRecord) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="inline h-3 w-3 ml-1" /> : 
      <ArrowDown className="inline h-3 w-3 ml-1" />;
  };
  
  const handleEdit = (id: string) => {
    toast.info(`Editing record ID: ${id}`);
  };
  
  const handleDelete = (id: string) => {
    toast.success(`Record ID: ${id} deleted`);
    setData(data.filter(item => item.id !== id));
  };
  
  const handleCsvUpload = async (csvData: any[]) => {
    try {
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

  // Helper to format fire rating hours
  const formatHours = (hours: number) => {
    if (hours === 0) return "-";
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };
  
  const handleAddRecord = () => {
    toast.info("Add new record functionality will be implemented soon.");
  };
  
  const handleDownloadTemplate = () => {
    toast.info("Template download functionality will be implemented soon.");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Fire-Resistance Rating Requirements</CardTitle>
            <CardDescription>Building element fire-resistance rating requirements by construction type (IBC Table 601)</CardDescription>
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
                  <DialogTitle>Upload Fire Rating Data</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with fire-resistance rating data. Download the template for the correct format.
                  </DialogDescription>
                </DialogHeader>
                <CsvUploader 
                  onUpload={handleCsvUpload} 
                  templateName="fire_ratings" 
                />
              </DialogContent>
            </Dialog>
            <Button 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleAddRecord}
            >
              <Plus className="h-4 w-4" />
              <span>Add Record</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchableTable 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          placeholder="Search by construction type..." 
        />
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[120px] cursor-pointer"
                  onClick={() => handleSort("constructionType")}
                >
                  Type {getSortIcon("constructionType")}
                </TableHead>
                <TableHead className="text-center">
                  Structural<br/>Frame
                </TableHead>
                <TableHead className="text-center">
                  Bearing Walls<br/>Exterior
                </TableHead>
                <TableHead className="text-center">
                  Bearing Walls<br/>Interior
                </TableHead>
                <TableHead className="text-center">
                  Nonbearing<br/>Partitions
                </TableHead>
                <TableHead className="text-center">
                  Floor<br/>Construction
                </TableHead>
                <TableHead className="text-center">
                  Roof<br/>Construction
                </TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={`cell-${i}-${j}`} className="py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.constructionType}</TableCell>
                    <TableCell className="text-center">{formatHours(row.structuralFrame)}</TableCell>
                    <TableCell className="text-center">{formatHours(row.bearingWallsExterior)}</TableCell>
                    <TableCell className="text-center">{formatHours(row.bearingWallsInterior)}</TableCell>
                    <TableCell className="text-center">{formatHours(row.nonbearingPartitions)}</TableCell>
                    <TableCell className="text-center">{formatHours(row.floorConstruction)}</TableCell>
                    <TableCell className="text-center">{formatHours(row.roofConstruction)}</TableCell>
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
                  <TableCell colSpan={8} className="h-24 text-center">
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

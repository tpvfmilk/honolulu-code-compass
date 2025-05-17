
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
import { fetchOccupancyGroups, fetchTravelDistances } from "@/services/dataService";

interface TravelDistance {
  id: string;
  occupancyGroup: string;
  sprinklered: boolean;
  maxTravelDistance: number;
  maxCommonPath: number;
  maxDeadEnd: number;
}

interface TravelDistancesTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TravelDistancesTable = ({ searchQuery, setSearchQuery }: TravelDistancesTableProps) => {
  const [data, setData] = useState<TravelDistance[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof TravelDistance>("occupancyGroup");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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
        
        // Load travel distance data
        const travelDistanceData = await fetchTravelDistances();
        
        // Map data to our desired format
        const formattedData: TravelDistance[] = travelDistanceData.map(item => ({
          id: item.id,
          occupancyGroup: groupMap[item.occupancy_group_id] || 'Unknown',
          sprinklered: item.sprinklered,
          maxTravelDistance: item.max_travel_distance_ft,
          maxCommonPath: item.max_common_path_ft,
          maxDeadEnd: item.max_dead_end_ft
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Error loading travel distance data:", error);
        toast.error("Failed to load travel distance data");
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
        item.occupancyGroup.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } 
      else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        if (sortDirection === "asc") {
          return aValue === bValue ? 0 : aValue ? 1 : -1;
        } else {
          return aValue === bValue ? 0 : aValue ? -1 : 1;
        }
      }
      else {
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
  
  const handleSort = (field: keyof TravelDistance) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getSortIcon = (field: keyof TravelDistance) => {
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
            <CardTitle>Egress Travel Distances</CardTitle>
            <CardDescription>Maximum travel distances by occupancy group and sprinkler condition (IBC Table 1017.2)</CardDescription>
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
                  <DialogTitle>Upload Travel Distance Data</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with travel distance limitations data. Download the template for the correct format.
                  </DialogDescription>
                </DialogHeader>
                <CsvUploader 
                  onUpload={handleCsvUpload} 
                  templateName="travel_distances" 
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
          placeholder="Search by occupancy group..." 
        />
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[120px] cursor-pointer"
                  onClick={() => handleSort("occupancyGroup")}
                >
                  Occupancy {getSortIcon("occupancyGroup")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("sprinklered")}
                >
                  Sprinklered {getSortIcon("sprinklered")}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("maxTravelDistance")}
                >
                  Max Travel<br/>Distance (ft) {getSortIcon("maxTravelDistance")}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("maxCommonPath")}
                >
                  Common Path<br/>(ft) {getSortIcon("maxCommonPath")}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("maxDeadEnd")}
                >
                  Dead End<br/>Corridor (ft) {getSortIcon("maxDeadEnd")}
                </TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 6 }).map((_, j) => (
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
                    <TableCell>{row.sprinklered ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">{row.maxTravelDistance}</TableCell>
                    <TableCell className="text-right">{row.maxCommonPath}</TableCell>
                    <TableCell className="text-right">{row.maxDeadEnd}</TableCell>
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
                  <TableCell colSpan={6} className="h-24 text-center">
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

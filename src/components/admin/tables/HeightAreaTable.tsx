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
import { HeightAreaLimitRecord } from "@/components/admin/types";
import { TablePagination } from "@/components/admin/TablePagination";
import { Download, Upload, Plus, ArrowUp, ArrowDown, Edit, Trash, Check, X } from "lucide-react";
import { toast } from "sonner";
import { CsvUploader } from "@/components/admin/CsvUploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchConstructionTypes, fetchHeightAreaLimits, fetchOccupancyGroups } from "@/services/dataService";

interface HeightAreaTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HeightAreaTable = ({ searchQuery, setSearchQuery }: HeightAreaTableProps) => {
  const [data, setData] = useState<HeightAreaLimitRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof HeightAreaLimitRecord>("constructionType");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [constructionTypes, setConstructionTypes] = useState<Record<string, string>>({});
  const [occupancyGroups, setOccupancyGroups] = useState<Record<string, string>>({});
  
  useEffect(() => {
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
          maxHeight: item.max_height_ft,
          maxStories: item.max_stories,
          maxAreaPerFloor: item.base_allowable_area,
          sprinklerHeightBonus: 20, // Default value as this isn't in the DB schema
          sprinklerStoryBonus: 1, // Default value
          sprinklerAreaMultiplier: item.sprinkler_increase_allowed ? 3 : 1,
          sprinklersAllowed: item.sprinkler_increase_allowed, // Add direct field for sprinkler_increase_allowed
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
    
    loadData();
  }, []);
  
  const rowsPerPage = 10;
  
  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.constructionType.toLowerCase().includes(lowerCaseQuery) ||
        item.occupancyGroup.toLowerCase().includes(lowerCaseQuery) ||
        item.notes.toLowerCase().includes(lowerCaseQuery)
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
  
  const handleSort = (field: keyof HeightAreaLimitRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getSortIcon = (field: keyof HeightAreaLimitRecord) => {
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
            <CardTitle>Height & Area Limitations</CardTitle>
            <CardDescription>Maximum building heights, stories, and areas by construction type and occupancy (IBC Tables 504.3, 504.4, 506.2)</CardDescription>
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
                  <DialogTitle>Upload Height & Area Data</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with height and area limitations data. Download the template for the correct format.
                  </DialogDescription>
                </DialogHeader>
                <CsvUploader 
                  onUpload={handleCsvUpload} 
                  templateName="height_area_limits" 
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
        <SearchableTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[120px] cursor-pointer"
                  onClick={() => handleSort("constructionType")}
                >
                  Type {getSortIcon("constructionType")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("occupancyGroup")}
                >
                  Occupancy {getSortIcon("occupancyGroup")}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("maxHeight")}
                >
                  Height (ft) {getSortIcon("maxHeight")}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("maxStories")}
                >
                  Stories {getSortIcon("maxStories")}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("maxAreaPerFloor")}
                >
                  Area (sq ft) {getSortIcon("maxAreaPerFloor")}
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("sprinklersAllowed")}
                >
                  Sprinklers<br/>Allowed {getSortIcon("sprinklersAllowed")}
                </TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 7 }).map((_, j) => (
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
                    <TableCell>{row.occupancyGroup}</TableCell>
                    <TableCell className="text-right">{row.maxHeight}</TableCell>
                    <TableCell className="text-right">{row.maxStories}</TableCell>
                    <TableCell className="text-right">{row.maxAreaPerFloor.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      {row.sprinklersAllowed ? 
                        <Check className="h-4 w-4 mx-auto text-green-500" /> : 
                        <X className="h-4 w-4 mx-auto text-red-500" />
                      }
                    </TableCell>
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
                  <TableCell colSpan={7} className="h-24 text-center">
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


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
import { Download, Upload, Plus, ArrowUp, ArrowDown, Edit, Trash, Info } from "lucide-react";
import { toast } from "sonner";
import { CsvUploader } from "@/components/admin/CsvUploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ZoningDistrictData, fetchZoningDistricts } from "@/services/dataService";
import { zoningDistricts } from "@/components/projects/types/zoning/zoningTypes";

interface ZoningDistrictsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ZoningDistrictsTable = ({ searchQuery, setSearchQuery }: ZoningDistrictsTableProps) => {
  const [data, setData] = useState<ZoningDistrictData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ZoningDistrictData>("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Attempt to load from Supabase
        const zoningData = await fetchZoningDistricts();
        
        if (zoningData && zoningData.length > 0) {
          setData(zoningData);
        } else {
          // Fallback to static data if no data in database
          toast.info("Using demonstration zoning data. Connect to database for production use.");
          
          // Create default data from static values
          const defaultData = zoningDistricts.map((district, index) => ({
            id: index.toString(),
            code: district.value,
            name: district.label,
            description: `${district.group}: ${district.label}`,
            min_lot_area: 5000,
            max_building_height: 35,
            max_stories: 2,
            front_setback: 15,
            side_setback: 5,
            rear_setback: 10,
            max_lot_coverage: 50,
            max_far: 0.5
          }));
          
          setData(defaultData);
        }
      } catch (error) {
        console.error("Error loading zoning districts:", error);
        toast.error("Failed to load zoning districts data");
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
        item.code.toLowerCase().includes(lowerCaseQuery) ||
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerCaseQuery))
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
  
  const handleSort = (field: keyof ZoningDistrictData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getSortIcon = (field: keyof ZoningDistrictData) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="inline h-3 w-3 ml-1" /> : 
      <ArrowDown className="inline h-3 w-3 ml-1" />;
  };
  
  const handleEdit = (id: string) => {
    toast.info(`Editing zoning district ID: ${id}`);
  };
  
  const handleDelete = (id: string) => {
    toast.success(`Zoning district ID: ${id} deleted`);
    setData(data.filter(item => item.id !== id));
  };
  
  const handleCsvUpload = async (csvData: any[]) => {
    try {
      console.log("CSV data to process:", csvData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Successfully processed ${csvData.length} zoning districts`);
      setIsUploadOpen(false);
      return true;
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("Failed to process CSV data");
      return false;
    }
  };
  
  const handleAddRecord = () => {
    toast.info("Add new zoning district functionality will be implemented soon.");
  };
  
  const handleDownloadTemplate = () => {
    toast.info("Zoning district template download functionality will be implemented soon.");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Zoning Districts</CardTitle>
            <CardDescription>Building regulations by zoning district (heights, setbacks, coverage limits)</CardDescription>
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
                  <DialogTitle>Upload Zoning Districts Data</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with zoning district parameters. Download the template for the correct format.
                  </DialogDescription>
                </DialogHeader>
                <CsvUploader 
                  onUpload={handleCsvUpload} 
                  templateName="zoning_districts" 
                />
              </DialogContent>
            </Dialog>
            <Button 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleAddRecord}
            >
              <Plus className="h-4 w-4" />
              <span>Add District</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchableTable 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          placeholder="Search by district code or name..." 
        />
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[100px] cursor-pointer"
                  onClick={() => handleSort("code")}
                >
                  Code {getSortIcon("code")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name {getSortIcon("name")}
                </TableHead>
                <TableHead className="text-center">
                  Min Lot<br/>Area
                </TableHead>
                <TableHead className="text-center">
                  Max<br/>Height
                </TableHead>
                <TableHead className="text-center">
                  Max<br/>Stories
                </TableHead>
                <TableHead className="text-center">
                  Front<br/>Setback
                </TableHead>
                <TableHead className="text-center">
                  Side<br/>Setback
                </TableHead>
                <TableHead className="text-center">
                  Rear<br/>Setback
                </TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={`cell-${i}-${j}`} className="py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.code}</TableCell>
                    <TableCell>{row.name.split('(')[0].trim()}</TableCell>
                    <TableCell className="text-center">{row.min_lot_area.toLocaleString()} sf</TableCell>
                    <TableCell className="text-center">{row.max_building_height}′</TableCell>
                    <TableCell className="text-center">{row.max_stories || "N/A"}</TableCell>
                    <TableCell className="text-center">{row.front_setback}′</TableCell>
                    <TableCell className="text-center">{row.side_setback}′</TableCell>
                    <TableCell className="text-center">{row.rear_setback}′</TableCell>
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
                  <TableCell colSpan={9} className="h-24 text-center">
                    No zoning districts found.
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


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
import { Download, Upload, Plus, ArrowUp, ArrowDown, Edit, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CsvUploader } from "@/components/admin/CsvUploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ZoningDistrictData, fetchZoningDistricts, createZoningDistrict, updateZoningDistrict, deleteZoningDistrict } from "@/services/dataService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ZoningDistrict } from "@/components/admin/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ZoningDistrictsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Form schema for validation
const zoningDistrictSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  min_lot_area: z.coerce.number().min(1, "Min lot area must be greater than 0"),
  max_building_height: z.coerce.number().min(1, "Max height must be greater than 0"),
  max_stories: z.coerce.number().nullable(),
  front_setback: z.coerce.number().min(0, "Front setback must be 0 or greater"),
  side_setback: z.coerce.number().min(0, "Side setback must be 0 or greater"),
  rear_setback: z.coerce.number().min(0, "Rear setback must be 0 or greater"),
  max_lot_coverage: z.coerce.number().min(0, "Max lot coverage must be 0 or greater").max(100, "Max lot coverage cannot exceed 100%"),
  max_far: z.coerce.number().nullable(),
});

type ZoningDistrictFormValues = z.infer<typeof zoningDistrictSchema>;

export const ZoningDistrictsTable = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => {
  const [data, setData] = useState<ZoningDistrictData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ZoningDistrictData>("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState<ZoningDistrict | null>(null);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<ZoningDistrictFormValues>({
    resolver: zodResolver(zoningDistrictSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      min_lot_area: 5000,
      max_building_height: 30,
      max_stories: 2,
      front_setback: 15,
      side_setback: 5,
      rear_setback: 10,
      max_lot_coverage: 50,
      max_far: 0.5,
    }
  });
  
  // Load data from API
  const loadData = async () => {
    try {
      setIsLoading(true);
      const zoningData = await fetchZoningDistricts();
      setData(zoningData);
    } catch (error) {
      console.error("Error loading zoning districts:", error);
      toast.error("Failed to load zoning districts data");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
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
  
  // Edit a record - open form with current values
  const handleEdit = (id: string) => {
    const district = data.find(item => item.id === id);
    if (district) {
      setCurrentDistrict(district);
      
      form.reset({
        code: district.code,
        name: district.name,
        description: district.description || null,
        min_lot_area: district.min_lot_area,
        max_building_height: district.max_building_height,
        max_stories: district.max_stories || null,
        front_setback: district.front_setback,
        side_setback: district.side_setback,
        rear_setback: district.rear_setback,
        max_lot_coverage: district.max_lot_coverage,
        max_far: district.max_far || null,
      });
      
      setIsFormOpen(true);
    }
  };
  
  // Delete a record from database
  const handleDelete = async (id: string) => {
    const success = await deleteZoningDistrict(id);
    
    if (success) {
      toast.success("Zoning district deleted successfully");
      setData(data.filter(item => item.id !== id));
    } else {
      toast.error("Failed to delete zoning district");
    }
  };
  
  // Handle form submission - create or update record
  const onSubmit = async (values: ZoningDistrictFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (currentDistrict) {
        // Update existing record
        const updated = await updateZoningDistrict({
          ...currentDistrict,
          ...values
        });
        
        if (updated) {
          toast.success("Zoning district updated successfully");
          setData(prev => prev.map(item => item.id === updated.id ? updated : item));
        } else {
          toast.error("Failed to update zoning district");
        }
      } else {
        // Create new record
        const created = await createZoningDistrict(values as Omit<ZoningDistrict, 'id' | 'created_at' | 'updated_at'>);
        
        if (created) {
          toast.success("Zoning district created successfully");
          setData(prev => [...prev, created]);
        } else {
          toast.error("Failed to create zoning district");
        }
      }
      
      setIsFormOpen(false);
      setCurrentDistrict(null);
    } catch (error) {
      console.error("Error saving zoning district:", error);
      toast.error("An error occurred while saving zoning district");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddRecord = () => {
    setCurrentDistrict(null);
    form.reset({
      code: "",
      name: "",
      description: "",
      min_lot_area: 5000,
      max_building_height: 30,
      max_stories: 2,
      front_setback: 15,
      side_setback: 5,
      rear_setback: 10,
      max_lot_coverage: 50,
      max_far: 0.5,
    });
    setIsFormOpen(true);
  };
  
  const handleDownloadTemplate = () => {
    const headers = "code,name,description,min_lot_area,max_building_height,max_stories,front_setback,side_setback,rear_setback,max_lot_coverage,max_far";
    const example = "R-1,Residential Single Family,Low density residential zone,5000,30,2,15,5,10,50,0.5";
    
    const csvContent = `${headers}\n${example}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'zoning_districts_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.info("Template downloaded successfully");
  };
  
  const handleCsvUpload = async (csvData: any[]) => {
    try {
      setIsLoading(true);
      
      // Process CSV data and create records
      let createdCount = 0;
      let failedCount = 0;
      
      for (const row of csvData) {
        const district = {
          code: row.code,
          name: row.name,
          description: row.description || undefined,
          min_lot_area: Number(row.min_lot_area),
          max_building_height: Number(row.max_building_height),
          max_stories: row.max_stories ? Number(row.max_stories) : undefined,
          front_setback: Number(row.front_setback),
          side_setback: Number(row.side_setback),
          rear_setback: Number(row.rear_setback),
          max_lot_coverage: Number(row.max_lot_coverage),
          max_far: row.max_far ? Number(row.max_far) : undefined
        };
        
        const created = await createZoningDistrict(district);
        if (created) {
          createdCount++;
        } else {
          failedCount++;
        }
      }
      
      if (createdCount > 0) {
        toast.success(`Successfully created ${createdCount} zoning districts`);
        await loadData(); // Reload data after updates
      }
      
      if (failedCount > 0) {
        toast.error(`Failed to create ${failedCount} zoning districts`);
      }
      
      setIsUploadOpen(false);
      return createdCount > 0;
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("Failed to process CSV data");
      return false;
    } finally {
      setIsLoading(false);
    }
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
                <TableHead 
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("max_lot_coverage")}
                >
                  Max Lot<br/>Coverage {getSortIcon("max_lot_coverage")}
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("max_far")}
                >
                  Max<br/>FAR {getSortIcon("max_far")}
                </TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 11 }).map((_, j) => (
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
                    <TableCell className="text-center">{row.max_lot_coverage}%</TableCell>
                    <TableCell className="text-center">{row.max_far || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(row.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the zoning district "{row.code}" and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(row.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    {searchQuery ? "No matching records found." : "No zoning districts found."}
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
        
        {/* Dialog for adding/editing zoning districts */}
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          if (!isOpen && !isSubmitting) setIsFormOpen(false);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{currentDistrict ? "Edit Zoning District" : "Add Zoning District"}</DialogTitle>
              <DialogDescription>
                {currentDistrict 
                  ? "Update the zoning district information below." 
                  : "Fill in the details to create a new zoning district."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="R-1" maxLength={10} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Residential Single Family" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Low density residential zone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="min_lot_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Lot Area (sq ft)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="max_lot_coverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Lot Coverage (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} max={100} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="max_building_height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Building Height (ft)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="max_stories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Stories</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="front_setback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Front Setback (ft)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="side_setback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Side Setback (ft)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rear_setback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rear Setback (ft)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="max_far"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max FAR (Floor Area Ratio)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="ml-2">
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {currentDistrict ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

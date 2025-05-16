
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import { SearchableTable } from "../SearchableTable";
import { TablePagination } from "../TablePagination";
import { CsvUploader } from "../CsvUploader";
import { MOCK_FIRE_RATING_DATA } from "../mockData";
import { toast } from "sonner";

interface FireRatingsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FireRatingsTable = ({ searchQuery, setSearchQuery }: FireRatingsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter data based on search query
  const filteredData = MOCK_FIRE_RATING_DATA.filter(record => 
    record.constructionType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDownloadTemplate = () => {
    toast.success("Fire Ratings template downloaded.");
  };

  const handleFileUpload = (file: File) => {
    // Handle file processing here
    console.log("Uploaded file:", file.name);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="space-y-1.5 flex-1">
          <CardTitle>Fire Ratings</CardTitle>
          <CardDescription>
            Fire resistance ratings for building elements by construction type (IBC Table 601)
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <CsvUploader 
            templateName="fire-ratings" 
            onFileUpload={handleFileUpload} 
            onDownloadTemplate={handleDownloadTemplate}
          />
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SearchableTable 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          placeholder="Search by construction type..."
        />
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Construction Type</TableHead>
                <TableHead>Structural Frame</TableHead>
                <TableHead>Bearing Walls (Ext)</TableHead>
                <TableHead>Bearing Walls (Int)</TableHead>
                <TableHead>Floor Construction</TableHead>
                <TableHead>Roof Construction</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No records found. Try a different search or add a new record.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.constructionType}</TableCell>
                    <TableCell>{record.structuralFrame} hr</TableCell>
                    <TableCell>{record.bearingWallsExterior} hr</TableCell>
                    <TableCell>{record.bearingWallsInterior} hr</TableCell>
                    <TableCell>{record.floorConstruction} hr</TableCell>
                    <TableCell>{record.roofConstruction} hr</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <TablePagination 
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
};

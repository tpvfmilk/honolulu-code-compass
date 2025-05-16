
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import { SearchableTable } from "../SearchableTable";
import { TablePagination } from "../TablePagination";
import { MOCK_ZONING_DISTRICTS } from "../mockData";

interface ZoningDistrictsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ZoningDistrictsTable = ({ searchQuery, setSearchQuery }: ZoningDistrictsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter data based on search query
  const filteredData = MOCK_ZONING_DISTRICTS.filter(district => 
    district.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="space-y-1.5 flex-1">
          <CardTitle>Zoning Districts</CardTitle>
          <CardDescription>
            Manage all zoning districts and their requirements
          </CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add District
        </Button>
      </CardHeader>
      <CardContent>
        <SearchableTable 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          placeholder="Search districts..."
        />
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Max Height</TableHead>
                <TableHead>Max Stories</TableHead>
                <TableHead>Setbacks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No districts found. Try a different search or add a new district.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((district) => (
                  <TableRow key={district.id}>
                    <TableCell className="font-medium">{district.code}</TableCell>
                    <TableCell>{district.name}</TableCell>
                    <TableCell>{district.maxHeight}′</TableCell>
                    <TableCell>{district.maxStories}</TableCell>
                    <TableCell>
                      F: {district.setbacks.front}′, 
                      S: {district.setbacks.side}′, 
                      R: {district.setbacks.rear}′
                    </TableCell>
                    <TableCell className="text-right">
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


import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { HeightAreaLimitRecord } from "@/components/admin/types";
import { TablePagination } from "@/components/admin/TablePagination";
import { ArrowUp, ArrowDown, Edit, Trash, Check, X } from "lucide-react";

interface HeightAreaTableContentProps {
  data: HeightAreaLimitRecord[];
  isLoading: boolean;
  searchQuery: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HeightAreaTableContent = ({ 
  data,
  isLoading,
  searchQuery,
  onEdit,
  onDelete
}: HeightAreaTableContentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof HeightAreaLimitRecord>("constructionType");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const rowsPerPage = 10;
  
  // Filter and sort data
  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      item.constructionType.toLowerCase().includes(lowerCaseQuery) ||
      item.occupancyGroup.toLowerCase().includes(lowerCaseQuery) ||
      item.notes.toLowerCase().includes(lowerCaseQuery)
    );
  }).sort((a, b) => {
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
  
  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[100px] cursor-pointer"
                onClick={() => handleSort("constructionType")}
              >
                Type {getSortIcon("constructionType")}
              </TableHead>
              <TableHead 
                className="w-[100px] cursor-pointer"
                onClick={() => handleSort("occupancyGroup")}
              >
                Occupancy {getSortIcon("occupancyGroup")}
              </TableHead>
              <TableHead 
                colSpan={3}
                className="text-center border-b"
              >
                Base (No Sprinklers)
              </TableHead>
              <TableHead 
                colSpan={3}
                className="text-center border-b"
              >
                With Sprinklers
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer"
                onClick={() => handleSort("sprinklersAllowed")}
              >
                Sprinklers<br/>Allowed {getSortIcon("sprinklersAllowed")}
              </TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
              {/* Base (No Sprinklers) */}
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
              {/* With Sprinklers */}
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort("sprinkleredHeight")}
              >
                Height (ft) {getSortIcon("sprinkleredHeight")}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort("sprinkleredStories")}
              >
                Stories {getSortIcon("sprinkleredStories")}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort("sprinkleredArea")}
              >
                Area (sq ft) {getSortIcon("sprinkleredArea")}
              </TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: 10 }).map((_, j) => (
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
                  {/* Base values (no sprinklers) */}
                  <TableCell className="text-right">{row.maxHeight}</TableCell>
                  <TableCell className="text-right">{row.maxStories}</TableCell>
                  <TableCell className="text-right">{row.maxAreaPerFloor.toLocaleString()}</TableCell>
                  {/* With sprinklers */}
                  <TableCell className="text-right">
                    {row.sprinkleredHeight ? row.sprinkleredHeight.toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.sprinkleredStories ? row.sprinkleredStories.toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.sprinkleredArea ? row.sprinkleredArea.toLocaleString() : 'N/A'}
                  </TableCell>
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
                        onClick={() => onEdit(row.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(row.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
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
    </>
  );
};


import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Save, Trash, Edit, X, Check } from "lucide-react";
import { TablePagination } from "@/components/admin/TablePagination";
import { SearchableTable } from "@/components/admin/SearchableTable";

export interface Column {
  id: string;
  header: string;
  accessorKey: string;
  cell?: (props: any) => JSX.Element;
  editable?: boolean;
  type?: 'text' | 'number' | 'select' | 'boolean';
  options?: { label: string; value: string }[];
}

export interface DataRow {
  id: string;
  [key: string]: any;
}

interface DataTableProps {
  data: DataRow[];
  columns: Column[];
  onSave: (row: DataRow) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (row: DataRow) => Promise<void>;
  defaultNewRow?: DataRow;
  isLoading?: boolean;
  searchPlaceholder?: string;
}

export const DataTable = ({ 
  data, 
  columns, 
  onSave,
  onDelete,
  onCreate,
  defaultNewRow = { id: "new" }, // Provide a default id to fix the TypeScript error
  isLoading = false, 
  searchPlaceholder = "Search..." 
}: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<DataRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newRow, setNewRow] = useState<DataRow>(defaultNewRow);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Filter data based on search query
  const filteredData = data.filter((row) => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchLower);
    });
  });
  
  // Paginate data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleEdit = (row: DataRow) => {
    setEditingId(row.id);
    setEditingRow({ ...row });
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingRow(null);
  };
  
  const handleSave = async () => {
    if (editingRow) {
      await onSave(editingRow);
      setEditingId(null);
      setEditingRow(null);
    }
  };

  const handleCreate = async () => {
    await onCreate(newRow);
    setIsCreating(false);
    setNewRow(defaultNewRow);
  };
  
  const handleChange = (id: string, key: string, value: any) => {
    setEditingRow(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleNewRowChange = (key: string, value: any) => {
    setNewRow(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <SearchableTable
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={searchPlaceholder}
          />
        </div>
        <Button 
          className="ml-auto"
          onClick={() => setIsCreating(!isCreating)}
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isCreating && (
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.type === 'select' && column.options ? (
                      <select
                        className="w-full border rounded p-2"
                        value={newRow[column.accessorKey] || ''}
                        onChange={(e) => handleNewRowChange(column.accessorKey, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {column.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : column.type === 'boolean' ? (
                      <input
                        type="checkbox"
                        checked={!!newRow[column.accessorKey]}
                        onChange={(e) => handleNewRowChange(column.accessorKey, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    ) : (
                      <Input
                        type={column.type || 'text'}
                        value={newRow[column.accessorKey] || ''}
                        onChange={(e) => handleNewRowChange(column.accessorKey, e.target.value)}
                        placeholder={`Enter ${column.header.toLowerCase()}`}
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleCreate} variant="outline">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={() => setIsCreating(false)} variant="outline">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  {columns.map((column) => (
                    <TableCell key={`loading-${column.id}-${i}`}>
                      <div className="h-5 bg-muted/30 animate-pulse rounded"></div>
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      <div className="h-9 w-9 bg-muted/30 animate-pulse rounded"></div>
                      <div className="h-9 w-9 bg-muted/30 animate-pulse rounded"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.id}`}>
                      {editingId === row.id && column.editable !== false ? (
                        column.type === 'select' && column.options ? (
                          <select
                            className="w-full border rounded p-2"
                            value={editingRow?.[column.accessorKey] || ''}
                            onChange={(e) => handleChange(row.id, column.accessorKey, e.target.value)}
                          >
                            {column.options.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : column.type === 'boolean' ? (
                          <input
                            type="checkbox"
                            checked={!!editingRow?.[column.accessorKey]}
                            onChange={(e) => handleChange(row.id, column.accessorKey, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                        ) : (
                          <Input
                            type={column.type || 'text'}
                            value={editingRow?.[column.accessorKey] || ''}
                            onChange={(e) => handleChange(row.id, column.accessorKey, e.target.value)}
                          />
                        )
                      ) : column.cell ? (
                        column.cell(row)
                      ) : (
                        row[column.accessorKey]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingId === row.id ? (
                        <>
                          <Button size="sm" onClick={handleSave} variant="outline">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={handleCancelEdit} variant="outline">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => handleEdit(row)} variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(row.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredData.length > itemsPerPage && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

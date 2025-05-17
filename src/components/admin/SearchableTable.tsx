
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TableComponentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

type TableComponent = React.ComponentType<TableComponentProps>;

interface TableDefinition {
  name: string;
  component: TableComponent;
}

interface SearchableTableProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  placeholder?: string;
  tables?: TableDefinition[];
  defaultTableIndex?: number;
}

export const SearchableTable = ({ 
  searchQuery: externalSearchQuery, 
  setSearchQuery: externalSetSearchQuery,
  placeholder = "Search records...",
  tables = [],
  defaultTableIndex = 0
}: SearchableTableProps) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(defaultTableIndex);
  
  // Use external or internal state based on what's provided
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;

  // If no tables are provided, just show the search bar
  if (tables.length === 0) {
    return (
      <div className="flex items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Render with tabs when tables are provided
  const ActiveTableComponent = tables[activeTabIndex]?.component;

  return (
    <div>
      <Tabs 
        defaultValue={tables[defaultTableIndex]?.name} 
        className="w-full"
        onValueChange={(value) => {
          const newIndex = tables.findIndex(t => t.name === value);
          if (newIndex >= 0) {
            setActiveTabIndex(newIndex);
            setSearchQuery(""); // Clear search when changing tabs
          }
        }}
      >
        <TabsList className="w-full mb-6 overflow-x-auto flex flex-nowrap">
          {tables.map((table) => (
            <TabsTrigger 
              key={table.name} 
              value={table.name}
              className="flex-shrink-0"
            >
              {table.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tables.map((table, index) => {
          const TableComp = table.component;
          return (
            <TabsContent key={table.name} value={table.name} className="pt-2">
              {ActiveTableComponent && index === activeTabIndex && (
                <TableComp 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery}
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

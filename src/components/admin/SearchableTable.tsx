
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchableTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

export const SearchableTable = ({ searchQuery, setSearchQuery, placeholder = "Search records..." }: SearchableTableProps) => {
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
};

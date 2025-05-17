import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Import type from the new file
import type { ZoningDistrict } from "./types/zoningTypes";

type ZoningSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  zoningDistricts: ZoningDistrict[];
};

export const ZoningSelector = ({ value, onChange, zoningDistricts }: ZoningSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Group districts by category
  const groupedDistricts = zoningDistricts.reduce<Record<string, ZoningDistrict[]>>((groups, district) => {
    if (!groups[district.group]) {
      groups[district.group] = [];
    }
    groups[district.group].push(district);
    return groups;
  }, {});
  
  // Filter districts based on search term
  const filteredDistricts = searchTerm 
    ? zoningDistricts.filter(d => 
        d.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : zoningDistricts;

  return (
    <div className="relative">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select zoning district" />
        </SelectTrigger>
        <SelectContent>
          <div className="flex items-center border-b px-3 py-2">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              placeholder="Search districts..."
              className="border-0 focus-visible:ring-0 p-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {searchTerm ? (
            // Show filtered results when searching
            filteredDistricts.map((district) => (
              <SelectItem key={district.value} value={district.value}>
                {district.label}
              </SelectItem>
            ))
          ) : (
            // Show grouped results when not searching
            Object.entries(groupedDistricts).map(([group, districts]) => (
              <SelectGroup key={group}>
                <SelectLabel>{group}</SelectLabel>
                {districts.map((district) => (
                  <SelectItem key={district.value} value={district.value}>
                    {district.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          )}
        </SelectContent>
      </Select>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              type="button"
              className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={(e) => e.preventDefault()}
            >
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>Not sure? Enter your TMK and we'll help identify it</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};


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

// Import type from the new services folder
import type { ZoningDistrictData } from "@/services/dataService";

type ZoningSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  zoningDistricts: ZoningDistrictData[];
};

export const ZoningSelector = ({ value, onChange, zoningDistricts }: ZoningSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Group districts by code prefix (e.g., "R-", "A-", "B-")
  const groupedDistricts = zoningDistricts.reduce<Record<string, ZoningDistrictData[]>>((groups, district) => {
    // Extract the first letter or first two letters before the dash
    const prefix = district.code.split('-')[0];
    const groupName = getGroupName(prefix);
    
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(district);
    return groups;
  }, {});
  
  // Helper function to get readable group names
  function getGroupName(prefix: string): string {
    const groupMap: Record<string, string> = {
      'R': 'Residential Districts',
      'A': 'Apartment Districts',
      'B': 'Business Districts',
      'BMX': 'Business Mixed Use Districts',
      'I': 'Industrial Districts',
      'P': 'Preservation Districts',
      'AMX': 'Apartment Mixed Use Districts'
    };
    
    return groupMap[prefix] || 'Other Districts';
  }
  
  // Filter districts based on search term
  const filteredDistricts = searchTerm 
    ? zoningDistricts.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.code.toLowerCase().includes(searchTerm.toLowerCase())
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
              <SelectItem key={district.id} value={district.code}>
                {district.code} - {district.name}
              </SelectItem>
            ))
          ) : (
            // Show grouped results when not searching
            Object.entries(groupedDistricts).map(([group, districts]) => (
              <SelectGroup key={group}>
                <SelectLabel>{group}</SelectLabel>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.code}>
                    {district.code} - {district.name}
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

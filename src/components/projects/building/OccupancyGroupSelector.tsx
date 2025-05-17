import { useEffect, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchOccupancyGroups, OccupancyGroupData } from "@/services/dataService";

interface OccupancyGroupSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const OccupancyGroupSelector = ({ value, onChange }: OccupancyGroupSelectorProps) => {
  const [occupancyGroups, setOccupancyGroups] = useState<OccupancyGroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOccupancyGroups = async () => {
      setIsLoading(true);
      try {
        const groups = await fetchOccupancyGroups();
        setOccupancyGroups(groups);
      } catch (error) {
        console.error("Error loading occupancy groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOccupancyGroups();
  }, []);

  // Group occupancy groups by their first letter (A, B, E, etc.)
  const groupedOccupancyGroups = occupancyGroups.reduce<Record<string, OccupancyGroupData[]>>(
    (groups, occupancy) => {
      // Extract the group letter (A from A-1, B from B, etc.)
      const groupLetter = occupancy.code.split('-')[0];
      
      if (!groups[groupLetter]) {
        groups[groupLetter] = [];
      }
      
      groups[groupLetter].push(occupancy);
      return groups;
    },
    {}
  );

  // Get group name based on first letter
  const getGroupName = (letter: string) => {
    const groupNames: Record<string, string> = {
      'A': 'Assembly',
      'B': 'Business',
      'E': 'Educational',
      'F': 'Factory',
      'H': 'High Hazard',
      'I': 'Institutional',
      'M': 'Mercantile',
      'R': 'Residential',
      'S': 'Storage',
      'U': 'Utility'
    };
    
    return groupNames[letter] || letter;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="occupancyGroup">Primary Occupancy Group</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80">
              <p>Determines occupancy requirements and restrictions (IBC Chapter 3)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger id="occupancyGroup">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select occupancy group"} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedOccupancyGroups).map(([groupLetter, occupancies]) => (
            <SelectGroup key={groupLetter}>
              <SelectLabel>{getGroupName(groupLetter)}</SelectLabel>
              {occupancies.map((occupancy) => (
                <SelectItem key={occupancy.id} value={occupancy.code}>
                  {occupancy.code} - {occupancy.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

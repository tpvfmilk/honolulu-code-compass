
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
import { InfoCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { occupancyGroups, OccupancyGroup } from "../types";

interface OccupancyGroupSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const OccupancyGroupSelector = ({ value, onChange }: OccupancyGroupSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="occupancyGroup">Primary Occupancy Group</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80">
              <p>Determines occupancy requirements and restrictions (IBC Chapter 3)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="occupancyGroup">
          <SelectValue placeholder="Select occupancy group" />
        </SelectTrigger>
        <SelectContent>
          {occupancyGroups.map((group) => (
            <SelectGroup key={group.group}>
              <SelectLabel>{group.group}</SelectLabel>
              {group.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

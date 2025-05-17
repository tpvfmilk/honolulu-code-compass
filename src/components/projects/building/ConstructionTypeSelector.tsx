import { useState, useEffect } from "react";
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
import { fetchConstructionTypes, ConstructionTypeData } from "@/services/dataService";

interface ConstructionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ConstructionTypeSelector = ({ value, onChange }: ConstructionTypeSelectorProps) => {
  const [constructionTypes, setConstructionTypes] = useState<ConstructionTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConstructionTypes = async () => {
      setIsLoading(true);
      try {
        const types = await fetchConstructionTypes();
        setConstructionTypes(types);
      } catch (error) {
        console.error("Error loading construction types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConstructionTypes();
  }, []);

  // Group construction types by their type (I, II, III, etc.)
  const groupedConstructionTypes = constructionTypes.reduce<Record<string, ConstructionTypeData[]>>(
    (groups, type) => {
      // Extract the type (I, II, III, etc)
      const typePrefix = type.code.split('-')[0];
      const groupName = getConstructionTypeGroupName(typePrefix);
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      
      groups[groupName].push(type);
      return groups;
    },
    {}
  );

  function getConstructionTypeGroupName(prefix: string): string {
    const groupMap: Record<string, string> = {
      'I': 'Type I - Fire Resistive',
      'II': 'Type II - Non-Combustible',
      'III': 'Type III - Limited Combustible',
      'IV': 'Type IV - Heavy Timber',
      'V': 'Type V - Combustible'
    };
    
    return groupMap[prefix] || 'Other Types';
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="constructionType">Construction Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80">
              <p>Determines fire resistance and allowable heights/areas (IBC Chapter 6)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger id="constructionType">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select construction type"} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedConstructionTypes).map(([group, types]) => (
            <SelectGroup key={group}>
              <SelectLabel>{group}</SelectLabel>
              {types.map((type) => (
                <SelectItem key={type.id} value={type.code}>
                  {type.code} - {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

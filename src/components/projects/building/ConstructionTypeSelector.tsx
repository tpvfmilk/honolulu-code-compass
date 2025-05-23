
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
        console.log('Fetched construction types:', types);
        
        // Sort construction types by their roman numeral order (I, II, III, IV, V)
        const sortedTypes = [...types].sort((a, b) => {
          // Extract the roman numeral part (I, II, III, IV, V)
          // For database format (IA, IB) we just need to extract the roman numerals
          const getRomanNumeral = (code: string) => {
            // Match I, II, III, IV, or V regardless of what follows
            const match = code.match(/^(I{1,3}|IV|V)/);
            return match ? match[0] : '';
          };
          
          const romanOrder: Record<string, number> = { "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5 };
          
          const aRoman = getRomanNumeral(a.code);
          const bRoman = getRomanNumeral(b.code);
          
          const aOrder = romanOrder[aRoman] || 99;
          const bOrder = romanOrder[bRoman] || 99;
          
          // First sort by roman numeral
          if (aOrder !== bOrder) return aOrder - bOrder;
          
          // Then sort by the subtype (A, B)
          return a.code.localeCompare(b.code);
        });
        
        setConstructionTypes(sortedTypes);
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
      // Extract the type (I, II, III, etc) - for database format
      const typePrefix = type.code.match(/^(I{1,3}|IV|V)/)?.[0] || 'Other';
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
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

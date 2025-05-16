
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
import { Label } from "@/components/ui/label";
import { InfoCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { constructionTypes, ConstructionType } from "../types";

interface ConstructionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ConstructionTypeSelector = ({ value, onChange }: ConstructionTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="constructionType">Construction Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80">
              <p>Determines fire resistance and allowable heights/areas (IBC Chapter 6)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="constructionType">
          <SelectValue placeholder="Select construction type" />
        </SelectTrigger>
        <SelectContent>
          {constructionTypes.map((typeGroup) => (
            <SelectGroup key={typeGroup.group}>
              <SelectLabel>{typeGroup.group}</SelectLabel>
              {typeGroup.options.map((option) => (
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

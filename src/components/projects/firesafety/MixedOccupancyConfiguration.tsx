
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OccupancyGroupSelector } from "../building/OccupancyGroupSelector";
import { SecondaryOccupancy, OccupancyGroup } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface MixedOccupancyConfigurationProps {
  hasMixedOccupancy: boolean;
  occupancySeparationType: string;
  secondaryOccupancies: SecondaryOccupancy[];
  primaryOccupancy: string;
  onHasMixedOccupancyChange: (value: boolean) => void;
  onOccupancySeparationTypeChange: (value: 'separated' | 'non-separated') => void;
  onSecondaryOccupanciesChange: (value: SecondaryOccupancy[]) => void;
}

export const MixedOccupancyConfiguration = ({
  hasMixedOccupancy,
  occupancySeparationType,
  secondaryOccupancies,
  primaryOccupancy,
  onHasMixedOccupancyChange,
  onOccupancySeparationTypeChange,
  onSecondaryOccupanciesChange
}: MixedOccupancyConfigurationProps) => {
  
  const addSecondaryOccupancy = () => {
    const newSecondaryOccupancies = [
      ...secondaryOccupancies,
      { group: "", area: "", floorLevel: "1" }
    ];
    onSecondaryOccupanciesChange(newSecondaryOccupancies);
  };

  const updateSecondaryOccupancy = (index: number, key: keyof SecondaryOccupancy, value: string) => {
    const newSecondaryOccupancies = [...secondaryOccupancies];
    newSecondaryOccupancies[index] = {
      ...newSecondaryOccupancies[index],
      [key]: value
    };
    onSecondaryOccupanciesChange(newSecondaryOccupancies);
  };

  const removeSecondaryOccupancy = (index: number) => {
    const newSecondaryOccupancies = [...secondaryOccupancies];
    newSecondaryOccupancies.splice(index, 1);
    onSecondaryOccupanciesChange(newSecondaryOccupancies);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch 
          id="mixed-occupancy" 
          checked={hasMixedOccupancy}
          onCheckedChange={onHasMixedOccupancyChange}
        />
        <Label htmlFor="mixed-occupancy">Building has multiple occupancy types</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80">
              <p>Mixed occupancies may require fire barriers and additional means of egress (IBC 508)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {hasMixedOccupancy && (
        <div className="space-y-4 pl-6 border-l-2 border-blue-100">
          <div className="space-y-2">
            <Label>Occupancy Separation Method</Label>
            <RadioGroup 
              value={occupancySeparationType} 
              onValueChange={(value) => onOccupancySeparationTypeChange(value as 'separated' | 'non-separated')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="separated" id="separated" />
                <Label htmlFor="separated">Separated Occupancies (508.4)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Requires fire barriers between different occupancy types</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-separated" id="non-separated" />
                <Label htmlFor="non-separated">Non-separated Occupancies (508.3)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Entire building must comply with most restrictive requirements</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Secondary Occupancies</Label>
              <div className="text-sm text-muted-foreground">Primary: {primaryOccupancy}</div>
            </div>

            {secondaryOccupancies.map((occupancy, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end border p-3 rounded-md bg-slate-50">
                <div className="col-span-4">
                  <Label htmlFor={`occupancy-${index}`} className="text-xs mb-1 block">Occupancy Type</Label>
                  <OccupancyGroupSelector 
                    value={occupancy.group} 
                    onChange={(value) => updateSecondaryOccupancy(index, 'group', value)}
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`area-${index}`} className="text-xs mb-1 block">Area (sf)</Label>
                  <Input
                    id={`area-${index}`}
                    type="text"
                    value={occupancy.area}
                    onChange={(e) => updateSecondaryOccupancy(index, 'area', e.target.value)}
                    placeholder="Area"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`floorLevel-${index}`} className="text-xs mb-1 block">Floor Level</Label>
                  <Input
                    id={`floorLevel-${index}`}
                    type="text"
                    value={occupancy.floorLevel}
                    onChange={(e) => updateSecondaryOccupancy(index, 'floorLevel', e.target.value)}
                    placeholder="Floor Level"
                  />
                </div>
                <div className="col-span-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeSecondaryOccupancy(index)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button 
              variant="outline" 
              onClick={addSecondaryOccupancy}
              className="w-full"
            >
              + Add Secondary Occupancy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface FireSeparationDistanceInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const FireSeparationDistanceInput = ({ value, onChange }: FireSeparationDistanceInputProps) => {
  const presetDistances = ["0", "3", "5", "10", "15", "20"];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow positive numbers
    if (newValue === '' || (!isNaN(parseFloat(newValue)) && parseFloat(newValue) >= 0)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="separation-distance">Fire Separation Distance (ft)</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80">
              <p>Distance from exterior face of building to property line, centerline of street, or other reference point (IBC Section 202)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Input
        id="separation-distance"
        type="number"
        min="0"
        step="0.5"
        placeholder="Enter distance"
        value={value}
        onChange={handleInputChange}
      />
      
      {/* Visual distance indicator */}
      <div className="h-12 w-full bg-slate-50 relative rounded-md border overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-300" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-blue-100" />
        <div 
          className="absolute top-3 bottom-3 border-t-2 border-b-2 border-r-2 border-blue-400"
          style={{ 
            left: '2px', 
            width: `${Math.min(Math.max(parseFloat(value) * 5, 10), 85)}%` 
          }}
        />
        <div className="absolute left-3 top-1 text-xs">Property Line</div>
        <div className="absolute right-3 top-1 text-xs">Building</div>
        <div 
          className="absolute top-5 text-xs font-medium"
          style={{ 
            left: `${Math.min(Math.max(parseFloat(value) * 2.5, 10), 50)}%` 
          }}
        >
          {value}′
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        <div className="text-sm text-muted-foreground mr-2">Quick select:</div>
        {presetDistances.map((distance) => (
          <Button 
            key={distance}
            variant={value === distance ? "default" : "outline"}
            size="sm"
            type="button" 
            onClick={() => onChange(distance)}
          >
            {distance}′
          </Button>
        ))}
      </div>
    </div>
  );
};


import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AccessibilityInputsProps {
  numberOfEmployees: string;
  isPublicAccommodation: boolean;
  elevatorProvided: boolean;
  totalParkingSpaces: string;
  isMultiStory: boolean;
  onEmployeesChange: (value: string) => void;
  onPublicAccommodationChange: (value: boolean) => void;
  onElevatorProvidedChange: (value: boolean) => void;
  onTotalParkingSpacesChange: (value: string) => void;
}

export const AccessibilityInputs = ({
  numberOfEmployees,
  isPublicAccommodation,
  elevatorProvided,
  totalParkingSpaces,
  isMultiStory,
  onEmployeesChange,
  onPublicAccommodationChange,
  onElevatorProvidedChange,
  onTotalParkingSpacesChange
}: AccessibilityInputsProps) => {
  
  // Format numeric input
  const formatNumeric = (value: string) => {
    return value.replace(/[^\d]/g, '');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Accessibility Input</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="number-of-employees" className="flex items-center">
            Number of Employees
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total number of employees that will work in this building</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          
          <Input
            id="number-of-employees"
            value={numberOfEmployees}
            onChange={(e) => onEmployeesChange(formatNumeric(e.target.value))}
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="public-accommodation" className="cursor-pointer">Public Accommodation</Label>
            <Switch
              id="public-accommodation"
              checked={isPublicAccommodation}
              onCheckedChange={onPublicAccommodationChange}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Building is open to the general public
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Label className="mr-1">Multi-story Building</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Auto-detected from building classification step</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-sm font-medium">
              {isMultiStory ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="elevator-provided" className="cursor-pointer">Elevator Provided</Label>
            <Switch
              id="elevator-provided"
              checked={elevatorProvided}
              onCheckedChange={onElevatorProvidedChange}
            />
          </div>
          {isMultiStory && isPublicAccommodation && !elevatorProvided && (
            <p className="text-xs text-orange-600">
              Multi-story public buildings typically require elevators
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="total-parking-spaces" className="flex items-center">
            Total Parking Spaces
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total number of parking spaces provided for this building</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          
          <Input
            id="total-parking-spaces"
            value={totalParkingSpaces}
            onChange={(e) => onTotalParkingSpacesChange(formatNumeric(e.target.value))}
            placeholder="0"
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Accessibility requirements per IBC Chapter 11 and ICC A117.1</p>
        </div>
      </CardContent>
    </Card>
  );
};

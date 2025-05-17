
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
  onTotalParkingSpacesChange,
}: AccessibilityInputsProps) => {
  // Format numeric input
  const formatNumber = (value: string) => {
    return value.replace(/[^\d]/g, '');
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          Accessibility Requirements
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>IBC Chapter 11 and ADA requirements</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Information needed for accessibility compliance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="number-of-employees">Number of Employees</Label>
          <Input
            id="number-of-employees"
            value={numberOfEmployees}
            onChange={(e) => onEmployeesChange(formatNumber(e.target.value))}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            Used to determine accessibility requirements
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="public-accommodation" className="cursor-pointer">
              Public Accommodation Facility
              <p className="text-xs font-normal text-muted-foreground mt-1">
                Businesses that serve the public directly
              </p>
            </Label>
            <Switch
              id="public-accommodation"
              checked={isPublicAccommodation}
              onCheckedChange={onPublicAccommodationChange}
            />
          </div>
        </div>
        
        {isMultiStory && (
          <div className="space-y-1 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="elevator-provided" className="cursor-pointer">
                Elevator Provided
                <p className="text-xs font-normal text-muted-foreground mt-1">
                  Required for most multi-story public buildings
                </p>
              </Label>
              <Switch
                id="elevator-provided"
                checked={elevatorProvided}
                onCheckedChange={onElevatorProvidedChange}
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="total-parking">Total Parking Spaces</Label>
          <Input
            id="total-parking"
            value={totalParkingSpaces}
            onChange={(e) => onTotalParkingSpacesChange(formatNumber(e.target.value))}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            Used to calculate required accessible parking
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground pt-2">
          <p>IBC Chapter 11 and ADA Standards determine accessibility requirements based on building use and occupant data.</p>
        </div>
      </CardContent>
    </Card>
  );
};

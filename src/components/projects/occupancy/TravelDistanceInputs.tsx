
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Check, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TravelDistances } from './useOccupancyCalculations';
import { travelDistanceLimits } from '../types';

interface TravelDistanceInputsProps {
  travelDistances: TravelDistances;
  primaryOccupancy: string;
  isSprinklered: boolean;
  onTravelDistancesChange: (travelDistances: TravelDistances) => void;
}

export const TravelDistanceInputs = ({
  travelDistances,
  primaryOccupancy,
  isSprinklered,
  onTravelDistancesChange
}: TravelDistanceInputsProps) => {
  // Get base occupancy code letter (e.g., 'B' from 'B-1')
  const baseOccupancy = primaryOccupancy?.charAt(0) || 'B';
  
  // Get limits
  const baseLimits = travelDistanceLimits[baseOccupancy] || travelDistanceLimits['B'];
  const limits = {
    maxTravel: isSprinklered ? Math.round(baseLimits.maxTravel * 1.25) : baseLimits.maxTravel,
    commonPath: isSprinklered ? Math.round(baseLimits.commonPath * 1.5) : baseLimits.commonPath,
    deadEnd: baseLimits.deadEnd // Usually no increase for dead ends
  };
  
  // Update a travel distance value
  const updateDistance = (key: keyof TravelDistances, value: string) => {
    onTravelDistancesChange({
      ...travelDistances,
      [key]: value
    });
  };
  
  // Format numeric input and allow only numbers and decimal point
  const formatDistance = (value: string) => {
    return value.replace(/[^\d.]/g, '');
  };
  
  // Determine status for a distance value
  const getDistanceStatus = (value: string, limit: number) => {
    const distance = parseFloat(value);
    if (!distance) return { status: 'empty', icon: null, color: '' };
    
    if (distance > limit) {
      return { 
        status: 'violation', 
        icon: <AlertCircle className="h-4 w-4" />, 
        color: 'text-red-600'
      };
    }
    if (distance > limit * 0.9) {
      return { 
        status: 'warning', 
        icon: <AlertTriangle className="h-4 w-4" />, 
        color: 'text-orange-600'
      };
    }
    return { 
      status: 'compliant', 
      icon: <Check className="h-4 w-4" />, 
      color: 'text-green-600'
    };
  };

  // Get status for each distance
  const maxTravelStatus = getDistanceStatus(travelDistances.maxExitAccess, limits.maxTravel);
  const commonPathStatus = getDistanceStatus(travelDistances.commonPath, limits.commonPath);
  const deadEndStatus = getDistanceStatus(travelDistances.deadEnd, limits.deadEnd);
  const roomTravelStatus = { status: 'info', icon: null, color: '' }; // No specific limit

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          Travel Distances
        </CardTitle>
        <CardDescription className="flex items-center text-orange-600 font-medium">
          <AlertTriangle className="h-4 w-4 mr-1" /> 
          These distances must be measured from your floor plan drawings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="max-exit-access" className="flex items-center">
              Maximum Exit Access Travel Distance
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-80">
                    <p>Measure from the most remote point in the building to the nearest exit or exit access doorway</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className={`text-sm ${maxTravelStatus.color}`}>
              Limit: {limits.maxTravel} ft {maxTravelStatus.icon}
            </span>
          </div>
          
          <Input
            id="max-exit-access"
            value={travelDistances.maxExitAccess}
            onChange={(e) => updateDistance('maxExitAccess', formatDistance(e.target.value))}
            className={maxTravelStatus.status === 'violation' ? 'border-red-500' : ''}
            placeholder="0"
          />
          {maxTravelStatus.status === 'violation' && (
            <p className="text-xs text-red-600">
              Exceeds maximum by {parseFloat(travelDistances.maxExitAccess) - limits.maxTravel} ft
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="common-path" className="flex items-center">
              Common Path of Egress Travel
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-80">
                    <p>Distance a person must travel before two separate exit paths are available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className={`text-sm ${commonPathStatus.color}`}>
              Limit: {limits.commonPath} ft {commonPathStatus.icon}
            </span>
          </div>
          
          <Input
            id="common-path"
            value={travelDistances.commonPath}
            onChange={(e) => updateDistance('commonPath', formatDistance(e.target.value))}
            className={commonPathStatus.status === 'violation' ? 'border-red-500' : ''}
            placeholder="0"
          />
          {commonPathStatus.status === 'violation' && (
            <p className="text-xs text-red-600">
              Exceeds maximum by {parseFloat(travelDistances.commonPath) - limits.commonPath} ft
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="dead-end" className="flex items-center">
              Dead End Corridor Length
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-80">
                    <p>Length of corridor with no exit, ending at a dead end</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className={`text-sm ${deadEndStatus.color}`}>
              Limit: {limits.deadEnd} ft {deadEndStatus.icon}
            </span>
          </div>
          
          <Input
            id="dead-end"
            value={travelDistances.deadEnd}
            onChange={(e) => updateDistance('deadEnd', formatDistance(e.target.value))}
            className={deadEndStatus.status === 'violation' ? 'border-red-500' : ''}
            placeholder="0"
          />
          {deadEndStatus.status === 'violation' && (
            <p className="text-xs text-red-600">
              Exceeds maximum by {parseFloat(travelDistances.deadEnd) - limits.deadEnd} ft
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="room-travel" className="flex items-center">
            Maximum Room Travel Distance
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-80">
                  <p>For large rooms, measure from the most remote point to the room exit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          
          <Input
            id="room-travel"
            value={travelDistances.roomTravel}
            onChange={(e) => updateDistance('roomTravel', formatDistance(e.target.value))}
            placeholder="0"
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>IBC Table 1017.1 determines maximum allowable travel distances.</p>
          {isSprinklered && (
            <p className="mt-1">✓ Sprinklered building: increased distance allowances applied.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

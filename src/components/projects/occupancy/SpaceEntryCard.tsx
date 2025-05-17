
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash } from 'lucide-react';
import { Space, spaceTypesByOccupancy } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpaceEntryCardProps {
  space: Space;
  index: number;
  primaryOccupancy: string;
  onUpdate: (id: string, field: keyof Space, value: string) => void;
  onRemove: (id: string) => void;
}

export const SpaceEntryCard = ({ 
  space, 
  index, 
  primaryOccupancy, 
  onUpdate, 
  onRemove 
}: SpaceEntryCardProps) => {
  // Get space types based on occupancy
  const baseOccupancy = primaryOccupancy?.split('-')[0] || 'B';
  const spaceTypes = spaceTypesByOccupancy[baseOccupancy] || 
                  spaceTypesByOccupancy[Object.keys(spaceTypesByOccupancy)[0]];
  
  // Format area with commas
  const formatArea = (area: string) => {
    const numericValue = area.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue).toLocaleString();
  };
  
  // Get occupant load factor for a space type
  const getFactorForType = (type: string) => {
    const spaceType = spaceTypes.find(st => st.value === type);
    return spaceType ? spaceType.factor : 100;
  };
  
  // Check for unusually high or low factors
  const checkDensityWarning = (type: string) => {
    const factor = getFactorForType(type);
    if (factor < 15) return { warning: true, message: 'High density space' };
    if (factor > 300) return { warning: true, message: 'Very low density' };
    return { warning: false };
  };

  const densityCheck = space.type ? checkDensityWarning(space.type) : { warning: false };

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{`Space ${index + 1}`}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onRemove(space.id)}
            aria-label="Remove space"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`space-name-${space.id}`}>Space Name</Label>
            <Input
              id={`space-name-${space.id}`}
              value={space.name}
              onChange={(e) => onUpdate(space.id, 'name', e.target.value)}
              placeholder="e.g. Main Office"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`space-type-${space.id}`}>Space Type</Label>
            <div className="flex items-center gap-2">
              <select
                id={`space-type-${space.id}`}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={space.type}
                onChange={(e) => onUpdate(space.id, 'type', e.target.value)}
              >
                <option value="">Select type...</option>
                {spaceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} ({type.factor} sf/person)
                  </option>
                ))}
              </select>
              
              {densityCheck.warning && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{densityCheck.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`space-area-${space.id}`}>Area (sf)</Label>
            <Input
              id={`space-area-${space.id}`}
              value={space.area}
              onChange={(e) => onUpdate(space.id, 'area', formatArea(e.target.value))}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`space-floor-${space.id}`}>Floor Level</Label>
            <select
              id={`space-floor-${space.id}`}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={space.floorLevel}
              onChange={(e) => onUpdate(space.id, 'floorLevel', e.target.value)}
            >
              <option value="1">Ground Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
              <option value="4">4th Floor</option>
              <option value="5">5th Floor</option>
              <option value="B">Basement</option>
            </select>
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor={`space-notes-${space.id}`}>Notes (Optional)</Label>
            <Textarea
              id={`space-notes-${space.id}`}
              value={space.notes || ''}
              onChange={(e) => onUpdate(space.id, 'notes', e.target.value)}
              placeholder="Additional details about this space..."
              rows={2}
            />
          </div>
          
          {space.type && space.area && (
            <div className="col-span-2 text-sm text-muted-foreground">
              <span className="font-medium">Estimated Occupant Load: </span>
              {Math.ceil(parseFloat(space.area) / getFactorForType(space.type))} people
              <span className="ml-2 text-xs">
                ({space.area} sf ÷ {getFactorForType(space.type)} sf/person)
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

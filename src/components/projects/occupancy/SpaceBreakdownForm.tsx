
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Space, spaceTypesByOccupancy } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpaceBreakdownFormProps {
  spaces: Space[];
  primaryOccupancy: string;
  onSpacesChange: (spaces: Space[]) => void;
}

export const SpaceBreakdownForm = ({ spaces, primaryOccupancy, onSpacesChange }: SpaceBreakdownFormProps) => {
  // Get space types based on occupancy
  const baseOccupancy = primaryOccupancy?.split('-')[0] || 'B';
  const spaceTypes = spaceTypesByOccupancy[baseOccupancy] || 
                    spaceTypesByOccupancy[Object.keys(spaceTypesByOccupancy)[0]];
  
  // Calculate total area
  const totalArea = spaces.reduce((sum, space) => {
    const area = parseFloat(space.area) || 0;
    return sum + area;
  }, 0);
  
  // Add a new space
  const addSpace = () => {
    const newSpace: Space = {
      id: uuidv4(),
      name: '',
      type: '',
      area: '',
      floorLevel: '1',
      notes: ''
    };
    onSpacesChange([...spaces, newSpace]);
  };
  
  // Remove a space
  const removeSpace = (id: string) => {
    onSpacesChange(spaces.filter(space => space.id !== id));
  };
  
  // Update space properties
  const updateSpace = (id: string, field: keyof Space, value: string) => {
    const updatedSpaces = spaces.map(space => {
      if (space.id === id) {
        // Auto-suggest name based on type if name is empty
        if (field === 'type' && !space.name) {
          const selectedType = spaceTypes.find(st => st.value === value);
          if (selectedType) {
            return { ...space, [field]: value, name: selectedType.label };
          }
        }
        return { ...space, [field]: value };
      }
      return space;
    });
    onSpacesChange(updatedSpaces);
  };
  
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Space Breakdown</h3>
        <div className="text-sm font-medium">
          Total Area: <span className="text-primary">{totalArea.toLocaleString()} sf</span>
        </div>
      </div>
      
      {spaces.length === 0 && (
        <div className="text-center p-6 bg-gray-50 rounded-md border border-dashed">
          <p className="text-muted-foreground">No spaces defined yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add spaces to calculate occupant load</p>
        </div>
      )}
      
      {spaces.map((space, index) => {
        const densityCheck = space.type ? checkDensityWarning(space.type) : { warning: false };
        
        return (
          <Card key={space.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{`Space ${index + 1}`}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeSpace(space.id)}
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
                    onChange={(e) => updateSpace(space.id, 'name', e.target.value)}
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
                      onChange={(e) => updateSpace(space.id, 'type', e.target.value)}
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
                    onChange={(e) => updateSpace(space.id, 'area', formatArea(e.target.value))}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`space-floor-${space.id}`}>Floor Level</Label>
                  <select
                    id={`space-floor-${space.id}`}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={space.floorLevel}
                    onChange={(e) => updateSpace(space.id, 'floorLevel', e.target.value)}
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
                    onChange={(e) => updateSpace(space.id, 'notes', e.target.value)}
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
      })}
      
      <Button 
        onClick={addSpace} 
        variant="outline" 
        className="w-full"
      >
        + Add Space
      </Button>
      
      {spaces.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p>IBC Table 1004.5 determines occupant load factors for various space types.</p>
        </div>
      )}
    </div>
  );
};

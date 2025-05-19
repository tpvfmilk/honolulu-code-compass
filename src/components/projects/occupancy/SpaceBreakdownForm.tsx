
import React from 'react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { Space } from './types/occupancyDefinitions';
import { SpaceEntryCard } from './SpaceEntryCard';
import { EmptySpacesState } from './EmptySpacesState';
import { calculateTotalArea } from './spaceUtils';

interface SpaceBreakdownFormProps {
  spaces: Space[];
  primaryOccupancy: string;
  onSpacesChange: (spaces: Space[]) => void;
  stories?: string; // Number of stories from the project data
}

export const SpaceBreakdownForm = ({ 
  spaces, 
  primaryOccupancy, 
  onSpacesChange,
  stories = "1" // Default to 1 if not provided
}: SpaceBreakdownFormProps) => {
  // Calculate total area
  const totalArea = calculateTotalArea(spaces);
  
  // Add a new space
  const addSpace = () => {
    const newSpace: Space = {
      id: uuidv4(),
      name: '',
      type: '',
      area: '',
      floorLevel: '1',
      notes: '',
      spaceType: '',
      occupiedBy: '',
      loadFactor: ''
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
        return { ...space, [field]: value };
      }
      return space;
    });
    onSpacesChange(updatedSpaces);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Space Breakdown</h3>
        <div className="text-sm font-medium">
          Total Area: <span className="text-primary">{totalArea.toLocaleString()} sf</span>
        </div>
      </div>
      
      {spaces.length === 0 ? (
        <EmptySpacesState />
      ) : (
        spaces.map((space, index) => (
          <SpaceEntryCard
            key={space.id}
            space={space}
            index={index}
            primaryOccupancy={primaryOccupancy}
            onUpdate={updateSpace}
            onRemove={removeSpace}
            stories={stories}
          />
        ))
      )}
      
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

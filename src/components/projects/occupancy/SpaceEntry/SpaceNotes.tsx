
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Space } from '../types/occupancyDefinitions';
import { SpaceTypeInfo } from '@/services/dataService';

interface SpaceNotesProps {
  space: Space;
  spaceTypes: SpaceTypeInfo[];
  onUpdate: (id: string, field: keyof Space, value: string) => void;
}

export const SpaceNotes: React.FC<SpaceNotesProps> = ({
  space,
  spaceTypes,
  onUpdate
}) => {
  // Get the factor from the space object directly if available, or find it in spaceTypes
  const getFactor = (): number => {
    if (space.loadFactor) {
      return Number(space.loadFactor);
    }
    
    if (space.type) {
      const selectedType = spaceTypes.find(type => type.code === space.type);
      return selectedType ? selectedType.occupant_load_factor : 100;
    }
    
    return 100; // Default value
  };
  
  const factor = getFactor();
  const occupantLoad = space.type && space.area ? calculateOccupantLoad(space.area, factor) : 0;

  // Helper function to calculate occupant load
  function calculateOccupantLoad(area: string, factor: number): number {
    const areaNum = parseFloat(area) || 0;
    // Use Math.ceil to round up to the next whole number as per IBC
    return Math.ceil(areaNum / factor);
  }

  return (
    <>
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
          {occupantLoad} people
          <span className="ml-2 text-xs">
            ({space.area} sf ÷ {factor} sf/person)
          </span>
        </div>
      )}
    </>
  );
};

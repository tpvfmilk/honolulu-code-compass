
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Space } from '../types/occupancyTypes';
import { SpaceTypeInfo } from '@/services/dataService';
import { calculateOccupantLoad, getFactorForType } from './spaceEntryUtils';

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
          {calculateOccupantLoad(space.area, getFactorForType(space.type, spaceTypes))} people
          <span className="ml-2 text-xs">
            ({space.area} sf ÷ {getFactorForType(space.type, spaceTypes)} sf/person)
          </span>
        </div>
      )}
    </>
  );
};

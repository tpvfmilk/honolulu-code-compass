
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Space } from '../types/occupancyTypes';
import { formatArea } from './spaceEntryUtils';

interface SpaceAreaInfoProps {
  space: Space;
  onUpdate: (id: string, field: keyof Space, value: string) => void;
}

export const SpaceAreaInfo: React.FC<SpaceAreaInfoProps> = ({
  space,
  onUpdate
}) => {
  return (
    <>
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
    </>
  );
};

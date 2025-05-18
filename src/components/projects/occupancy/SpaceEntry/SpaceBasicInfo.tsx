import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Space } from '../types/occupancyDefinitions';
import { SpaceTypeInfo } from '@/services/dataService';

interface SpaceBasicInfoProps {
  space: Space;
  spaceTypes: SpaceTypeInfo[];
  onUpdate: (id: string, field: keyof Space, value: string) => void;
  loading: boolean;
}

export const SpaceBasicInfo: React.FC<SpaceBasicInfoProps> = ({
  space,
  spaceTypes,
  onUpdate,
  loading
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`space-name-${space.id}`}>Space Name</Label>
        <Input
          id={`space-name-${space.id}`}
          value={space.name}
          onChange={(e) => onUpdate(space.id, 'name', e.target.value)}
          placeholder="e.g. Office, Lobby, etc."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`space-type-${space.id}`}>Space Type</Label>
        <select
          id={`space-type-${space.id}`}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={space.type}
          onChange={(e) => onUpdate(space.id, 'type', e.target.value)}
          disabled={loading}
        >
          <option value="">Select a space type</option>
          {spaceTypes.map((type) => (
            <option key={type.code} value={type.code}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

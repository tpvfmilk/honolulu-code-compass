
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  // Handle space type selection with load factor
  const handleSpaceTypeChange = (value: string) => {
    // Update the space type
    onUpdate(space.id, 'type', value);
    
    // Find the selected space type to get its name and load factor
    const selectedType = spaceTypes.find(type => type.code === value);
    if (selectedType) {
      // If the name field is empty, suggest the name from the selected type
      if (!space.name) {
        onUpdate(space.id, 'name', selectedType.name);
      }
      
      // Update the load factor as well
      onUpdate(space.id, 'loadFactor', selectedType.occupant_load_factor.toString());
    }
  };

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
        <Select
          value={space.type}
          onValueChange={handleSpaceTypeChange}
          disabled={loading}
        >
          <SelectTrigger id={`space-type-${space.id}`}>
            <SelectValue placeholder="Select a space type" />
          </SelectTrigger>
          <SelectContent>
            {spaceTypes.map((type) => (
              <SelectItem key={type.code} value={type.code}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

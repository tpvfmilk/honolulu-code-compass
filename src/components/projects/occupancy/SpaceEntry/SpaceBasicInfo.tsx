
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Space } from '../types/occupancyDefinitions';
import { SpaceTypeInfo, fetchAllOccupancyGroups } from '@/services/dataService';

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
  const [occupancyGroups, setOccupancyGroups] = useState<any[]>([]);
  
  // Fetch all occupancy groups
  useEffect(() => {
    const fetchOccupancyGroups = async () => {
      const groups = await fetchAllOccupancyGroups();
      setOccupancyGroups(groups);
    };
    
    fetchOccupancyGroups();
  }, []);

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
      
      // Always update the load factor from the selected space type
      // This is the critical part - the load factor comes from the space type
      onUpdate(space.id, 'loadFactor', selectedType.occupant_load_factor.toString());
    }
  };

  // Handle occupancy group selection (for reference only)
  const handleOccupancyGroupChange = (value: string) => {
    onUpdate(space.id, 'occupancyType', value);
    // Note: we don't change the load factor here as it should be
    // determined only by the space type
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

      <div className="space-y-2">
        <Label htmlFor={`occupancy-type-${space.id}`}>Occupancy Group</Label>
        <Select
          value={space.occupancyType || ""}
          onValueChange={handleOccupancyGroupChange}
          disabled={loading}
        >
          <SelectTrigger id={`occupancy-type-${space.id}`}>
            <SelectValue placeholder="Select occupancy group" />
          </SelectTrigger>
          <SelectContent>
            {occupancyGroups.map((group) => (
              <SelectItem key={group.id} value={group.code}>
                {group.code} - {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

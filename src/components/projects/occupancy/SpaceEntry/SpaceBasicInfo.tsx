
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
    console.log('Space type selected:', value);
    
    // Update the space type - this is critical to persist the selection
    onUpdate(space.id, 'type', value);
    
    // Find the selected space type to get its name and load factor
    const selectedType = spaceTypes.find(type => type.code === value);
    if (selectedType) {
      console.log('Selected type data:', selectedType);
      
      // If the name field is empty, suggest the name from the selected type
      if (!space.name) {
        onUpdate(space.id, 'name', selectedType.name);
      }
      
      // Always update the load factor from the selected space type
      console.log('Setting load factor to:', selectedType.occupant_load_factor);
      onUpdate(space.id, 'loadFactor', selectedType.occupant_load_factor.toString());
      
      // Also store the space type name for reference
      onUpdate(space.id, 'spaceType', selectedType.name);
    }
  };

  // Handle occupancy group selection (for reference only)
  const handleOccupancyGroupChange = (value: string) => {
    onUpdate(space.id, 'occupancyType', value);
  };

  // Ensure we have a valid type value
  const spaceTypeValue = space.type || "";
  console.log(`Rendering Space Basic Info with type=${spaceTypeValue}`);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            value={spaceTypeValue}
            onValueChange={handleSpaceTypeChange}
            disabled={loading}
          >
            <SelectTrigger 
              id={`space-type-${space.id}`} 
              className="w-full text-ellipsis"
            >
              <SelectValue placeholder="Select a space type" />
            </SelectTrigger>
            <SelectContent className="w-full max-h-[300px] overflow-y-auto">
              {spaceTypes.map((type) => (
                <SelectItem key={type.code} value={type.code}>
                  {type.name} ({type.occupant_load_factor})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {spaceTypeValue && (
            <div className="text-xs text-muted-foreground mt-1">
              Selected: {space.spaceType || spaceTypeValue} (Load Factor: {space.loadFactor || 'Not set'})
            </div>
          )}
        </div>
      </div>

      {/* Moved to its own row - full width */}
      <div className="space-y-2">
        <Label htmlFor={`occupancy-type-${space.id}`}>Occupancy Group</Label>
        <Select
          value={space.occupancyType || ""}
          onValueChange={handleOccupancyGroupChange}
          disabled={loading}
        >
          <SelectTrigger 
            id={`occupancy-type-${space.id}`}
            className="w-full text-ellipsis"
          >
            <SelectValue placeholder="Select occupancy group" />
          </SelectTrigger>
          <SelectContent className="w-full max-h-[300px] overflow-y-auto">
            {occupancyGroups.map((group) => (
              <SelectItem key={group.id} value={group.code}>
                {group.code} - {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

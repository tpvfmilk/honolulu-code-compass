
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Space } from '../types/occupancyDefinitions';
import { formatArea } from './spaceEntryUtils';

interface SpaceAreaInfoProps {
  space: Space;
  onUpdate: (id: string, field: keyof Space, value: string) => void;
  stories?: string; // Number of stories from the project data
}

export const SpaceAreaInfo: React.FC<SpaceAreaInfoProps> = ({
  space,
  onUpdate,
  stories = "1" // Default to 1 if not provided
}) => {
  // Generate floor level options based on number of stories
  const generateFloorOptions = () => {
    const options = [];
    const numStories = parseInt(stories) || 1;
    
    console.log(`Generating floor options for ${numStories} stories`);
    
    // Always include basement option
    options.push({ value: "B", label: "Basement" });
    
    // Always include ground floor/1st floor
    options.push({ value: "1", label: "Ground Floor" });
    
    // Add additional floors based on number of stories
    for (let i = 2; i <= numStories; i++) {
      const suffix = i === 2 ? "nd" : i === 3 ? "rd" : "th";
      options.push({ value: i.toString(), label: `${i}${suffix} Floor` });
    }
    
    return options;
  };
  
  const floorOptions = generateFloorOptions();

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
          {floorOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

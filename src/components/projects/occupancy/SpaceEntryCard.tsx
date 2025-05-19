
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Space } from './types/occupancyDefinitions';
import { SpaceTypeInfo, fetchAllSpaceTypes } from '@/services/dataService';
import { SpaceBasicInfo } from './SpaceEntry/SpaceBasicInfo';
import { SpaceAreaInfo } from './SpaceEntry/SpaceAreaInfo';
import { SpaceNotes } from './SpaceEntry/SpaceNotes';

interface SpaceEntryCardProps {
  space: Space;
  index: number;
  primaryOccupancy: string;
  onUpdate: (id: string, field: keyof Space, value: string) => void;
  onRemove: (id: string) => void;
  stories?: string; // Number of stories from the project data
}

export const SpaceEntryCard = ({ 
  space, 
  index, 
  primaryOccupancy, 
  onUpdate, 
  onRemove,
  stories = "1" // Default to 1 if not provided
}: SpaceEntryCardProps) => {
  const [spaceTypes, setSpaceTypes] = useState<SpaceTypeInfo[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch all space types instead of filtering by occupancy group
  useEffect(() => {
    const fetchSpaceTypesData = async () => {
      setLoading(true);
      try {
        // Fetch all space types
        const spaceTypesData = await fetchAllSpaceTypes();
        setSpaceTypes(spaceTypesData);
      } catch (error) {
        console.error('Error fetching space types:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpaceTypesData();
  }, []);

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{`Space ${index + 1}`}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onRemove(space.id)}
            aria-label="Remove space"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Space Basic Info (Name & Type) */}
          <SpaceBasicInfo 
            space={space} 
            spaceTypes={spaceTypes} 
            onUpdate={onUpdate} 
            loading={loading} 
          />
          
          {/* Space Area Info (Area & Floor) */}
          <SpaceAreaInfo 
            space={space} 
            onUpdate={onUpdate}
            stories={stories}
          />
          
          {/* Space Notes & Occupant Load */}
          <SpaceNotes 
            space={space} 
            spaceTypes={spaceTypes} 
            onUpdate={onUpdate} 
          />
        </div>
      </CardContent>
    </Card>
  );
};


// Import the required components and types
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Space } from './types/occupancyDefinitions';
import { SpaceTypeInfo, fetchAllSpaceTypes } from '@/services/dataService';
import { SpaceBasicInfo } from './SpaceEntry/SpaceBasicInfo';
import { SpaceAreaInfo } from './SpaceEntry/SpaceAreaInfo';
import { SpaceNotes } from './SpaceEntry/SpaceNotes';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(true);
  
  // Fetch space types based on primary occupancy when component mounts
  React.useEffect(() => {
    const loadSpaceTypes = async () => {
      setLoading(true);
      try {
        // Get all space types
        const types = await fetchAllSpaceTypes();
        setSpaceTypes(types);
      } catch (error) {
        console.error("Error loading space types:", error);
        toast.error("Failed to load space types");
      } finally {
        setLoading(false);
      }
    };
    
    loadSpaceTypes();
  }, [primaryOccupancy]);
  
  console.log(`Space ${index + 1} has stories=${stories} and floorLevel=${space.floorLevel}`);

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium">Space {index + 1}</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(space.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Info */}
          <SpaceBasicInfo 
            space={space}
            spaceTypes={spaceTypes}
            onUpdate={onUpdate}
            loading={loading}
          />
          
          {/* Area Info */}
          <SpaceAreaInfo 
            space={space}
            onUpdate={onUpdate}
            stories={stories}
          />
          
          {/* Notes */}
          <SpaceNotes 
            space={space} 
            onUpdate={onUpdate} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

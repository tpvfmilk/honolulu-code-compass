
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Space } from './types/occupancyDefinitions';
import { SpaceBasicInfo } from './SpaceEntry/SpaceBasicInfo';
import { SpaceAreaInfo } from './SpaceEntry/SpaceAreaInfo';
import { SpaceNotes } from './SpaceEntry/SpaceNotes';
import { SpaceTypeInfo, fetchAllSpaceTypes } from '@/services/dataService';
import { calculateSpaceOccupantLoad } from './spaceUtils';

interface SpaceEntryCardProps {
  space: Space;
  index: number;
  primaryOccupancy: string;
  onUpdate: (id: string, field: keyof Space, value: string) => void;
  onRemove: (id: string) => void;
  stories?: string;
}

export const SpaceEntryCard: React.FC<SpaceEntryCardProps> = ({
  space,
  index,
  primaryOccupancy,
  onUpdate,
  onRemove,
  stories = "1"
}) => {
  const [spaceTypes, setSpaceTypes] = useState<SpaceTypeInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [occupantLoad, setOccupantLoad] = useState<number>(0);
  
  // Fetch space types
  useEffect(() => {
    const fetchSpaceTypes = async () => {
      setLoading(true);
      try {
        const types = await fetchAllSpaceTypes();
        setSpaceTypes(types);
        console.log(`Space ${index} - Loaded space types:`, types);
        
        // After loading space types, if we have a type selected, ensure we have the correct load factor
        if (space.type) {
          const selectedType = types.find(type => type.code === space.type);
          if (selectedType && (!space.loadFactor || space.loadFactor !== selectedType.occupant_load_factor.toString())) {
            console.log(`Updating load factor for space ${space.id} from ${space.loadFactor} to ${selectedType.occupant_load_factor}`);
            onUpdate(space.id, 'loadFactor', selectedType.occupant_load_factor.toString());
          }
        }
      } catch (error) {
        console.error('Error loading space types:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpaceTypes();
  }, [space.id]);
  
  // Calculate occupant load when area or type changes
  useEffect(() => {
    const load = calculateSpaceOccupantLoad(space, primaryOccupancy);
    setOccupantLoad(load);
  }, [space.area, space.loadFactor, space.type, primaryOccupancy]);
  
  return (
    <Card className="relative">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <CardTitle className="text-base font-medium">
          Space {index + 1}: {space.name || "Unnamed Space"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(space.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <SpaceBasicInfo 
          space={space}
          spaceTypes={spaceTypes}
          onUpdate={onUpdate}
          loading={loading}
        />
        
        <SpaceAreaInfo 
          space={space}
          onUpdate={onUpdate}
          stories={stories}
        />
        
        <SpaceNotes 
          space={space}
          onUpdate={onUpdate}
          spaceTypes={spaceTypes}
        />
      </CardContent>
    </Card>
  );
};

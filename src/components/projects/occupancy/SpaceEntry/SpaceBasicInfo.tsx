
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Space } from '../types/occupancyTypes';
import { SpaceTypeInfo } from '@/services/dataService';
import { checkDensityWarning } from './spaceEntryUtils';

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
  const densityCheck = space.type ? checkDensityWarning(space.type, spaceTypes) : { warning: false };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`space-name-${space.id}`}>Space Name</Label>
        <Input
          id={`space-name-${space.id}`}
          value={space.name}
          onChange={(e) => onUpdate(space.id, 'name', e.target.value)}
          placeholder="e.g. Main Office"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`space-type-${space.id}`}>Space Type</Label>
        <div className="flex items-center gap-2">
          <select
            id={`space-type-${space.id}`}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={space.type}
            onChange={(e) => {
              onUpdate(space.id, 'type', e.target.value);
              // Updating spaceType with type for compatibility
              onUpdate(space.id, 'spaceType', e.target.value);
            }}
            disabled={loading}
          >
            <option value="">Select type...</option>
            {spaceTypes.map((type) => (
              <option key={type.id} value={type.code}>
                {type.name} ({type.occupant_load_factor} sf/person)
              </option>
            ))}
          </select>
          
          {densityCheck.warning && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{densityCheck.message}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </>
  );
};

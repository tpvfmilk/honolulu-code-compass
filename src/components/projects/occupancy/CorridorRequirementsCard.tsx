
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CorridorRequirementsCardProps {
  corridorRequirements: {
    minWidth: number;
    fireRating: number;
    reasoning: string;
  } | null;
  isCalculating: boolean;
}

export const CorridorRequirementsCard = ({ corridorRequirements, isCalculating }: CorridorRequirementsCardProps) => {
  if (!corridorRequirements && !isCalculating) return null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          Corridor Requirements
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Per IBC Section 1020: Corridors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isCalculating ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center space-y-2">
              <div className="h-4 w-40 bg-slate-200 rounded"></div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : corridorRequirements ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Minimum Width</div>
                <div className="text-2xl font-bold">
                  {corridorRequirements.minWidth}"
                  <span className="text-sm font-normal ml-1">
                    ({(corridorRequirements.minWidth / 12).toFixed(1)}')
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Fire Rating</div>
                <div className="text-2xl font-bold">
                  {corridorRequirements.fireRating > 0 ? 
                    `${corridorRequirements.fireRating} hour` : 
                    "None required"}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm font-medium">Reasoning</div>
              <div className="text-blue-900 mt-1">
                {corridorRequirements.reasoning}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Corridor width requirements are based on occupant load and occupancy type.</p>
              <p className="mt-1">IBC Section 1020.2: Corridor Width and Capacity</p>
              <p className="mt-1">IBC Table 1020.1: Corridor Fire-Resistance Rating</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              Add occupant information to calculate corridor requirements
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ExitRequirementsCardProps {
  exitRequirements: {
    requiredExits: number;
    doorWidth: number;
    stairWidth: number;
    capacityPerExit: number;
    suggestedConfig: string;
  } | null;
  isCalculating: boolean;
}

export const ExitRequirementsCard = ({ exitRequirements, isCalculating }: ExitRequirementsCardProps) => {
  if (!exitRequirements && !isCalculating) return null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          Exit Requirements
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Based on IBC Tables 1006.2.1 and Section 1005</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isCalculating ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-4 w-40 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : exitRequirements ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Required Exits</div>
                <div className="text-2xl font-bold">{exitRequirements.requiredExits}</div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Occupants Per Exit</div>
                <div className="text-2xl font-bold">{exitRequirements.capacityPerExit}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Exit Width Requirements</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center border-b pb-1">
                  <span>Door Width:</span>
                  <span className="font-bold">{exitRequirements.doorWidth}" total</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-1">
                  <span>Stair Width:</span>
                  <span className="font-bold">{exitRequirements.stairWidth}" total</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm font-medium">Suggested Configuration</div>
              <div className="text-lg font-bold text-blue-900">
                {exitRequirements.suggestedConfig}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Door Width:</span> 0.2 inches per occupant
              </p>
              <p>
                <span className="font-medium">Stair Width:</span> 0.3 inches per occupant
              </p>
              <p className="mt-1">IBC Section 1005.3: Exit Capacity</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">Define spaces to calculate exit requirements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

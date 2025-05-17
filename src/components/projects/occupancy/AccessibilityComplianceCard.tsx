
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AccessibilityComplianceCardProps {
  accessibilityRequirements: {
    elevatorRequired: boolean;
    accessibleParking: number;
    vanAccessible: number;
    rationale: string[];
  } | null;
  elevatorProvided: boolean;
  isCalculating: boolean;
}

export const AccessibilityComplianceCard = ({ 
  accessibilityRequirements, 
  elevatorProvided,
  isCalculating 
}: AccessibilityComplianceCardProps) => {
  if (!accessibilityRequirements && !isCalculating) return null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          Accessibility Compliance
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Per IBC Chapter 11 and ADA Standards</p>
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
              <div className="h-4 w-36 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : accessibilityRequirements ? (
          <div className="space-y-4">
            {/* Elevator Requirements */}
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Elevator Requirements</div>
              <div className="flex items-center mt-1 justify-between">
                <div className="font-medium">
                  {accessibilityRequirements.elevatorRequired ? 'Elevator Required' : 'Elevator Not Required'}
                </div>
                <div>
                  {accessibilityRequirements.elevatorRequired ? (
                    elevatorProvided ? (
                      <span className="inline-flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" /> Provided
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" /> Not Provided
                      </span>
                    )
                  ) : (
                    <span className="text-muted-foreground">Not applicable</span>
                  )}
                </div>
              </div>
              
              {accessibilityRequirements.rationale.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <div>Reasoning:</div>
                  <ul className="list-disc pl-4 mt-1">
                    {accessibilityRequirements.rationale.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Accessible Parking Requirements */}
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Accessible Parking Requirements</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-sm">Standard Accessible:</div>
                  <div className="text-xl font-bold">
                    {accessibilityRequirements.accessibleParking - accessibilityRequirements.vanAccessible}
                  </div>
                </div>
                <div>
                  <div className="text-sm">Van Accessible:</div>
                  <div className="text-xl font-bold">
                    {accessibilityRequirements.vanAccessible}
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium mt-2">
                Total: {accessibilityRequirements.accessibleParking} accessible spaces required
              </div>
            </div>
            
            {/* Additional Requirements */}
            <div className="border-t pt-3">
              <div className="text-sm font-medium mb-2">Additional Requirements:</div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Accessible route from public way to entrance
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Accessible entrances
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Accessible toilet rooms
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Accessibility signage
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              Enter accessibility details to check compliance
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, X, AlertCircle } from 'lucide-react';

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
        <CardTitle className="text-lg font-semibold">Accessibility Requirements</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isCalculating ? (
          <div className="h-24 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center space-y-2">
              <div className="h-4 w-40 bg-slate-200 rounded"></div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : accessibilityRequirements ? (
          <div className="space-y-4">
            {/* Elevator Requirement */}
            <div className="bg-slate-50 p-3 rounded-md flex justify-between items-center">
              <div>
                <div className="font-medium">Elevator Required</div>
                {accessibilityRequirements.elevatorRequired && accessibilityRequirements.rationale.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {accessibilityRequirements.rationale[0]}
                  </div>
                )}
              </div>
              <div>
                {accessibilityRequirements.elevatorRequired ? (
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Yes</span>
                    {elevatorProvided ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">No</span>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Accessible Parking */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Accessible Parking</div>
                <div className="text-2xl font-bold">{accessibilityRequirements.accessibleParking}</div>
                <div className="text-xs text-muted-foreground">spaces required</div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Van-Accessible</div>
                <div className="text-2xl font-bold">{accessibilityRequirements.vanAccessible}</div>
                <div className="text-xs text-muted-foreground">spaces required</div>
              </div>
            </div>
            
            {/* Violations */}
            {accessibilityRequirements.elevatorRequired && !elevatorProvided && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <div className="font-medium flex items-center text-red-800 mb-1">
                  <AlertCircle className="h-4 w-4 mr-1" /> Compliance Issues
                </div>
                <p className="text-sm text-red-700">
                  Elevator is required but not provided. Multi-story buildings with public access require elevator access to all floors.
                </p>
              </div>
            )}
            
            {/* Additional Requirements */}
            <div className="text-sm">
              <div className="font-medium mb-1">Other Requirements</div>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Accessible route from parking to building entrance</li>
                <li>Accessible restrooms on each floor</li>
                <li>Compliant door clearances and hardware</li>
                <li>Accessible signage and wayfinding</li>
              </ul>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>IBC Chapter 11: Accessibility</p>
              <p>ICC A117.1: Accessible and Usable Buildings and Facilities</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">Input accessibility data to view requirements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

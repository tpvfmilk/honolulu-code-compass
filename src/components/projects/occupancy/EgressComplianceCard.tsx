
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, AlertTriangle, AlertCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { TravelDistances, TravelLimits } from './useOccupancyCalculations';

interface EgressComplianceCardProps {
  travelDistanceCompliance: {
    maxTravelCompliant: boolean;
    commonPathCompliant: boolean;
    deadEndCompliant: boolean;
    allowableLimits: TravelLimits;
    violations: string[];
  } | null;
  travelDistances: TravelDistances;
  isCalculating: boolean;
  isSprinklered: boolean;
}

export const EgressComplianceCard = ({
  travelDistanceCompliance,
  travelDistances,
  isCalculating,
  isSprinklered
}: EgressComplianceCardProps) => {
  if (!travelDistanceCompliance && !isCalculating) return null;
  
  // Helper to render status icon
  const renderStatusIcon = (isCompliant: boolean) => {
    if (isCompliant) {
      return <Check className="h-4 w-4 text-green-600" />;
    }
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };
  
  // Display actual value or placeholder
  const displayValue = (value: string) => {
    return value ? `${value} ft` : '-';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Egress Compliance</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isCalculating ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-20 w-48 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : travelDistanceCompliance ? (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead className="text-right">Allowable</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="w-16 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Max Exit Access Travel</TableCell>
                    <TableCell className="text-right">
                      {travelDistanceCompliance.allowableLimits.maxTravel} ft
                    </TableCell>
                    <TableCell className="text-right">
                      {displayValue(travelDistances.maxExitAccess)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderStatusIcon(travelDistanceCompliance.maxTravelCompliant)}
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium">Common Path Travel</TableCell>
                    <TableCell className="text-right">
                      {travelDistanceCompliance.allowableLimits.commonPath} ft
                    </TableCell>
                    <TableCell className="text-right">
                      {displayValue(travelDistances.commonPath)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderStatusIcon(travelDistanceCompliance.commonPathCompliant)}
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium">Dead End Corridor</TableCell>
                    <TableCell className="text-right">
                      {travelDistanceCompliance.allowableLimits.deadEnd} ft
                    </TableCell>
                    <TableCell className="text-right">
                      {displayValue(travelDistances.deadEnd)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderStatusIcon(travelDistanceCompliance.deadEndCompliant)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            {travelDistanceCompliance.violations.length > 0 && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <div className="font-medium flex items-center text-red-800 mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1" /> Compliance Issues
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {travelDistanceCompliance.violations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>IBC Table 1017.1: Exit Access Travel Distance</p>
              {isSprinklered && (
                <p className="mt-1">✓ Sprinkler increase applied to allowable distances</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">Enter travel distances to check compliance</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

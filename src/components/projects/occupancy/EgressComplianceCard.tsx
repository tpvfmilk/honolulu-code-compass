
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Check, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { TravelLimits, TravelDistances } from './useOccupancyCalculations';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  
  const getStatusIcon = (isCompliant: boolean, value?: string) => {
    if (!value) return null;
    
    if (isCompliant) {
      return <Check className="h-4 w-4 text-green-600" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          Egress Compliance
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Per IBC Section 1017: Exit Access Travel Distance</p>
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
        ) : travelDistanceCompliance ? (
          <div className="space-y-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Requirement</TableHead>
                    <TableHead>Allowable</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead className="w-16 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Maximum Exit Access Travel
                    </TableCell>
                    <TableCell>
                      {travelDistanceCompliance.allowableLimits.maxTravel} ft
                    </TableCell>
                    <TableCell>
                      {travelDistances.maxExitAccess || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusIcon(travelDistanceCompliance.maxTravelCompliant, travelDistances.maxExitAccess)}
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium">
                      Common Path of Travel
                    </TableCell>
                    <TableCell>
                      {travelDistanceCompliance.allowableLimits.commonPath} ft
                    </TableCell>
                    <TableCell>
                      {travelDistances.commonPath || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusIcon(travelDistanceCompliance.commonPathCompliant, travelDistances.commonPath)}
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium">
                      Dead End Corridor
                    </TableCell>
                    <TableCell>
                      {travelDistanceCompliance.allowableLimits.deadEnd} ft
                    </TableCell>
                    <TableCell>
                      {travelDistances.deadEnd || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusIcon(travelDistanceCompliance.deadEndCompliant, travelDistances.deadEnd)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            {travelDistanceCompliance.violations.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center gap-2 text-red-800 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>Egress Travel Distance Violations</span>
                </div>
                <ul className="text-sm text-red-800 mt-2 pl-6 list-disc">
                  {travelDistanceCompliance.violations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              {isSprinklered && (
                <p className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  Increased travel distance allowances applied (sprinklered building)
                </p>
              )}
              <p className="mt-1">IBC Table 1017.1: Exit Access Travel Distance Limits</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              Enter travel distances to check compliance
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

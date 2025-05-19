
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { SpaceWithLoad } from './useOccupancyCalculations';

interface OccupantLoadCardProps {
  occupantLoad: {
    total: number;
    bySpace: SpaceWithLoad[];
    hasHighDensity: boolean;
  } | null;
  isCalculating: boolean;
}

export const OccupantLoadCard = ({ occupantLoad, isCalculating }: OccupantLoadCardProps) => {
  if (!occupantLoad && !isCalculating) return null;
  
  // Calculate load using Math.floor (we're showing the actual calculated results here)
  const calculateLoad = (area: string, factor: number) => {
    return Math.floor(parseFloat(area) / factor);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Occupant Load Calculation</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isCalculating ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-24 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : occupantLoad ? (
          <>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold">{occupantLoad.total}</div>
              <div className="text-sm text-muted-foreground">Total Occupant Load</div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Space</TableHead>
                    <TableHead>Space Type</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead className="text-right">Area (sf)</TableHead>
                    <TableHead className="text-right">Factor</TableHead>
                    <TableHead className="text-right">Load</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {occupantLoad.bySpace.map((space) => (
                    <TableRow key={space.id}>
                      <TableCell className="font-medium">
                        {space.name || "Unnamed Space"}
                      </TableCell>
                      <TableCell>
                        {space.type || "Unknown"}
                        {space.highDensity && (
                          <span className="ml-1 text-orange-500">(!)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {space.occupancyType || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {parseFloat(space.area).toLocaleString() || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        ÷ {space.loadFactor}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold">{space.occupantLoad}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  <TableRow>
                    <TableCell colSpan={5} className="font-semibold text-right">
                      TOTAL OCCUPANT LOAD
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {occupantLoad.total}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              <p>IBC Table 1004.5: Occupant Load Factors</p>
              {occupantLoad.hasHighDensity && (
                <p className="text-orange-600 mt-1">
                  (!) High-density spaces detected, verify space planning
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">Add spaces to calculate occupant load</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

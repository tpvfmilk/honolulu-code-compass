
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { SpaceWithLoad } from './types/occupancyTypes';
import { SpaceTypeInfo, fetchAllSpaceTypes } from '@/services/dataService';

interface OccupantLoadCardProps {
  occupantLoad: {
    total: number;
    bySpace: SpaceWithLoad[];
    hasHighDensity: boolean;
  } | null;
  isCalculating: boolean;
}

export const OccupantLoadCard = ({ occupantLoad, isCalculating }: OccupantLoadCardProps) => {
  const [spaceTypes, setSpaceTypes] = useState<SpaceTypeInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch space types to get human-readable names
  useEffect(() => {
    const loadSpaceTypes = async () => {
      setLoading(true);
      try {
        const types = await fetchAllSpaceTypes();
        setSpaceTypes(types);
        console.log("Loaded space types for display:", types);
      } catch (error) {
        console.error('Error loading space types:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSpaceTypes();
  }, []);

  // Log the occupant load when it changes to help debug
  useEffect(() => {
    if (occupantLoad) {
      console.log("Occupant load spaces:", occupantLoad.bySpace);
      
      // Debug each space to see what type info we have
      occupantLoad.bySpace.forEach(space => {
        console.log(`Space ${space.name} has type=${space.type}, spaceType=${space.spaceType}, loadFactor=${space.loadFactor}`);
      });
    }
  }, [occupantLoad]);

  if (!occupantLoad && !isCalculating) return null;
  
  // Get human-readable name for space type
  const getSpaceTypeName = (typeCode: string, spaceTypeName: string) => {
    // If we already have a name stored, use it
    if (spaceTypeName) return spaceTypeName;
    
    if (!typeCode) return "Unknown";
    console.log(`Finding type name for code: ${typeCode}`);
    
    const spaceType = spaceTypes.find(type => type.code === typeCode);
    if (spaceType) {
      console.log(`Found space type: ${spaceType.name}`);
      return spaceType.name;
    }
    
    // If no match is found, return the code as fallback
    return typeCode;
  };

  // Get the actual load factor from the database if available
  const getActualLoadFactor = (typeCode: string, currentFactor: number) => {
    if (!typeCode) return currentFactor;
    
    const spaceType = spaceTypes.find(type => type.code === typeCode);
    if (spaceType) {
      return spaceType.occupant_load_factor;
    }
    
    return currentFactor;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Occupant Load Calculation</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isCalculating || loading ? (
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
                  {occupantLoad.bySpace.map((space) => {
                    // Get the proper load factor
                    const actualLoadFactor = getActualLoadFactor(space.type, space.loadFactor);
                    // Recalculate load if the factor is different
                    const actualLoad = actualLoadFactor !== space.loadFactor 
                      ? Math.ceil(parseFloat(space.area) / actualLoadFactor)
                      : space.occupantLoad;
                    
                    return (
                      <TableRow key={space.id}>
                        <TableCell className="font-medium">
                          {space.name || "Unnamed Space"}
                        </TableCell>
                        <TableCell>
                          {getSpaceTypeName(space.type, space.spaceType)}
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
                          ÷ {actualLoadFactor}
                          {actualLoadFactor !== space.loadFactor && (
                            <span className="text-xs text-red-500 ml-1">(was {space.loadFactor})</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold">{actualLoad}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
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

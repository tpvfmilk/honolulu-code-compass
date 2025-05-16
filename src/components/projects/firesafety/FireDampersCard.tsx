
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FireDampersCardProps {
  sprinklered: boolean;
  highRise: boolean;
  occupancyGroup: string;
  calculations: {
    fireDamperLocations: string[];
    smokeDamperLocations: string[];
    exceptions: string[];
    reference: string;
  };
}

export const FireDampersCard = ({
  sprinklered,
  highRise,
  occupancyGroup,
  calculations
}: FireDampersCardProps) => {
  return (
    <Card>
      <CardHeader className="bg-red-50 border-b border-red-100">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Fire & Smoke Dampers</span>
          <span className="text-sm font-normal text-muted-foreground">
            {calculations.reference}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-medium">Fire Dampers Required At:</div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {calculations.fireDamperLocations.map((location, index) => (
                <li key={index}>{location}</li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-2">
            <div className="font-medium">Smoke Dampers Required At:</div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {calculations.smokeDamperLocations.map((location, index) => (
                <li key={index}>{location}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {calculations.exceptions.length > 0 && (
          <div className="space-y-2 mt-4 border-t pt-3">
            <div className="font-medium">Exceptions & Notes:</div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {calculations.exceptions.map((exception, index) => (
                <li key={index}>{exception}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          Building conditions: {sprinklered ? "Sprinklered, " : "Non-sprinklered, "}
          {highRise ? "High-rise, " : ""}
          {occupancyGroup} occupancy
        </div>
      </CardContent>
    </Card>
  );
};

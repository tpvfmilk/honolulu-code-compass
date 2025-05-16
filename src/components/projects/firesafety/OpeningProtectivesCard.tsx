
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OpeningProtectivesCardProps {
  wallRatings: Array<{
    wallType: string;
    doorRating: string;
    windowRating: string;
    maxGlassArea: string;
    wallApplication: string;
  }>;
}

export const OpeningProtectivesCard = ({
  wallRatings
}: OpeningProtectivesCardProps) => {
  return (
    <Card>
      <CardHeader className="bg-red-50 border-b border-red-100">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Opening Protectives</span>
          <span className="text-sm font-normal text-muted-foreground">
            IBC Table 716.1
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-sm font-medium text-gray-700">
                <th className="py-2 text-left">Wall Type</th>
                <th className="py-2 text-center">Door Rating</th>
                <th className="py-2 text-center">Window Rating</th>
                <th className="py-2 text-right">Maximum Glass Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wallRatings.map((rating, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-slate-50" : ""}>
                  <td className="py-2 text-left">
                    <div>{rating.wallType}</div>
                    <div className="text-xs text-muted-foreground">{rating.wallApplication}</div>
                  </td>
                  <td className="py-2 text-center">{rating.doorRating}</td>
                  <td className="py-2 text-center">{rating.windowRating}</td>
                  <td className="py-2 text-right">{rating.maxGlassArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-xs text-muted-foreground mt-4">
          Note: Fire door assemblies and fire window assemblies must be labeled and installed in accordance with their listings.
        </div>
      </CardContent>
    </Card>
  );
};

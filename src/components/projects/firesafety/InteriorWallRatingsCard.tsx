
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "../types";
import { Badge } from "@/components/ui/badge";

interface InteriorWallRatingsCardProps {
  formData: FormData;
  occupancySeparations: {
    separations: Array<{
      from: string;
      to: string;
      rating: number;
    }>;
    required: boolean;
    reference: string;
  };
  corridorRating: {
    rating: number;
    sprinkleredExempt: boolean;
  };
}

export const InteriorWallRatingsCard = ({
  formData,
  occupancySeparations,
  corridorRating
}: InteriorWallRatingsCardProps) => {
  return (
    <Card>
      <CardHeader className="bg-red-50 border-b border-red-100">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Interior Wall Fire Ratings</span>
          <span className="text-sm font-normal text-muted-foreground">
            IBC 508, 709, 1020
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Occupancy Separations */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Occupancy Separations</div>
          
          {formData.fireSafety.hasMixedOccupancy && formData.fireSafety.occupancySeparationType === 'separated' ? (
            occupancySeparations.separations.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {occupancySeparations.separations.map((sep, index) => (
                  <div key={index} className="flex justify-between p-2 bg-slate-50 rounded border">
                    <div>{sep.from} to {sep.to}</div>
                    <Badge className={sep.rating >= 2 ? "bg-red-500" : (sep.rating >= 1 ? "bg-yellow-500" : "bg-green-500")}>
                      {sep.rating}-hour
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                No occupancy separations defined
              </div>
            )
          ) : (
            <div className="text-sm text-muted-foreground italic">
              Not applicable (single occupancy or non-separated)
            </div>
          )}
        </div>

        {/* Corridor Ratings */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Corridor Ratings</div>
          <div className="p-3 bg-slate-50 rounded border">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{corridorRating.rating}-hour</span> corridor walls required
                {corridorRating.sprinkleredExempt && formData.sprinklerSystem && (
                  <span className="text-sm text-green-600 ml-1">(exempted by sprinkler system)</span>
                )}
              </div>
              <Badge className={corridorRating.rating > 0 ? "bg-yellow-500" : "bg-green-500"}>
                {corridorRating.rating > 0 ? "Required" : "Not Required"}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Based on {formData.occupancyGroup} occupancy</div>
          </div>
        </div>
        
        {/* Incidental Use Areas */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Incidental Use Areas</div>
          <div className="space-y-1">
            <div className="text-sm">Common incidental use areas requiring fire barriers:</div>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Furnace rooms over 400,000 Btu/hr <Badge variant="outline">1-hour</Badge></li>
              <li>Storage rooms over 100 square feet <Badge variant="outline">1-hour</Badge></li>
              <li>Electrical equipment rooms <Badge variant="outline">1-hour</Badge></li>
              <li>Waste/linen collection rooms <Badge variant="outline">1-hour</Badge></li>
              <li>Paint shops <Badge variant="outline">2-hour</Badge></li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

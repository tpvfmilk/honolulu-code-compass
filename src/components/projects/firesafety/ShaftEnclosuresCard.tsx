
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShaftEnclosuresCardProps {
  constructionType: string;
  stories: string;
  calculations: {
    exitStairways: number;
    elevatorShafts: number;
    mechanicalShafts: number;
    otherShafts: number;
  };
}

export const ShaftEnclosuresCard = ({
  constructionType,
  stories,
  calculations
}: ShaftEnclosuresCardProps) => {
  const storiesNum = parseInt(stories) || 0;

  return (
    <Card>
      <CardHeader className="bg-red-50 border-b border-red-100">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Shaft Enclosures</span>
          <span className="text-sm font-normal text-muted-foreground">
            IBC Section 713
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="text-sm text-muted-foreground mb-2">
          Based on {storiesNum}-story building with {constructionType} construction
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm">Exit Stairways</div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
              <Badge className={calculations.exitStairways > 1 ? "bg-red-500" : "bg-yellow-500"}>
                {calculations.exitStairways}-hour
              </Badge>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm">Elevator Shafts</div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
              <Badge className={calculations.elevatorShafts > 1 ? "bg-red-500" : "bg-yellow-500"}>
                {calculations.elevatorShafts}-hour
              </Badge>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm">Mechanical Shafts</div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
              <Badge className={calculations.mechanicalShafts > 1 ? "bg-red-500" : "bg-yellow-500"}>
                {calculations.mechanicalShafts}-hour
              </Badge>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm">Other Shafts</div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
              <Badge className={calculations.otherShafts > 1 ? "bg-red-500" : "bg-yellow-500"}>
                {calculations.otherShafts}-hour
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          Note: Shaft enclosures connecting 4 or more stories require 2-hour fire-resistance rating.
          All others require 1-hour fire-resistance rating.
        </div>
      </CardContent>
    </Card>
  );
};


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExteriorWallRatingCardProps {
  separationDistance: string;
  exteriorWallRating: {
    rating: number;
    openings: number;
    openingProtection: string;
    reference: string;
    notes?: string;
  };
  sprinklered?: boolean;
}

export const ExteriorWallRatingCard = ({
  separationDistance,
  exteriorWallRating,
  sprinklered = false
}: ExteriorWallRatingCardProps) => {
  return (
    <Card>
      <CardHeader className="bg-red-50 border-b border-red-100">
        <CardTitle className="text-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Exterior Wall Fire Ratings</span>
            {sprinklered && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Sprinklered
              </Badge>
            )}
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {exteriorWallRating.reference}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="text-sm text-muted-foreground">
          Based on {separationDistance}′ separation distance from property line
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1">
            <div className="text-sm font-medium">Fire Rating</div>
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${exteriorWallRating.rating > 0 ? "text-red-600" : "text-green-600"}`}>
                {exteriorWallRating.rating}-hour
              </div>
            </div>
            <Progress 
              value={(3 - exteriorWallRating.rating) / 3 * 100} 
              className={`h-2 ${exteriorWallRating.rating > 0 ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
            />
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Opening Restrictions</div>
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${exteriorWallRating.openings < 50 ? "text-red-600" : "text-green-600"}`}>
                {exteriorWallRating.openings}%
              </div>
              <div className="text-sm">maximum</div>
            </div>
            <Progress 
              value={exteriorWallRating.openings} 
              className={`h-2 ${exteriorWallRating.openings < 50 ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
            />
          </div>
          
          <div className="col-span-2 p-3 bg-slate-50 rounded border">
            <div className="text-sm font-medium mb-1">Opening Protection</div>
            <div className="text-sm">{exteriorWallRating.openingProtection}</div>
          </div>
          
          {exteriorWallRating.notes && (
            <div className="col-span-2 flex gap-2 text-sm text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-80">
                    <p>Additional requirements may apply</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span>{exteriorWallRating.notes}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

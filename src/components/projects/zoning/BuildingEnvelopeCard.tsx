
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ZoningCalculationsState } from "./types/zoningTypes";
import { useState, useEffect } from "react";

type BuildingEnvelopeCardProps = {
  heightLimits: ZoningCalculationsState['heightLimits'];
  coverage: ZoningCalculationsState['coverage'];
  lotArea: number;
  actualHeight?: number;
  actualStories?: number;
  actualBuildingArea?: number;
};

export const BuildingEnvelopeCard = ({ 
  heightLimits, 
  coverage, 
  lotArea,
  actualHeight,
  actualStories,
  actualBuildingArea 
}: BuildingEnvelopeCardProps) => {
  const [coverageProgress, setCoverageProgress] = useState(0);
  const [farProgress, setFarProgress] = useState(0);
  const [heightProgress, setHeightProgress] = useState(0);
  const [storiesProgress, setStoriesProgress] = useState(0);

  useEffect(() => {
    // Calculate the actual coverage percentage if we have actualBuildingArea
    if (coverage && actualBuildingArea) {
      const actualCoveragePercent = Math.min(100, (actualBuildingArea / lotArea) * 100);
      setCoverageProgress(Math.round((actualCoveragePercent / coverage.maxCoveragePercent) * 100));
    } else if (coverage) {
      // Default animation showing 75% of max
      setTimeout(() => setCoverageProgress(75), 300);
    }
    
    // Calculate the actual FAR progress if we have actualBuildingArea
    if (coverage && actualBuildingArea) {
      const actualFAR = actualBuildingArea / lotArea;
      setFarProgress(Math.round((actualFAR / coverage.farBase) * 100));
    } else if (coverage) {
      // Default animation showing 85% of max
      setTimeout(() => setFarProgress(85), 500);
    }
    
    // Calculate height progress if we have actualHeight
    if (heightLimits && actualHeight) {
      setHeightProgress(Math.round((actualHeight / heightLimits.maxHeight) * 100));
    } else if (heightLimits) {
      // Default animation showing 80% of max
      setTimeout(() => setHeightProgress(80), 700);
    }
    
    // Calculate stories progress if we have actualStories
    if (heightLimits && actualStories) {
      setStoriesProgress(Math.round((actualStories / heightLimits.maxStories) * 100));
    } else if (heightLimits) {
      // Default animation showing 70% of max
      setTimeout(() => setStoriesProgress(70), 900);
    }
  }, [heightLimits, coverage, lotArea, actualHeight, actualStories, actualBuildingArea]);
  
  if (!heightLimits || !coverage) return null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Building Envelope</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm">Building Height</p>
            <p className="text-sm font-medium">
              {actualHeight ? `${actualHeight}' / ` : ""}
              {heightLimits.maxHeight}' max
            </p>
          </div>
          <Progress value={heightProgress} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm">Number of Stories</p>
            <p className="text-sm font-medium">
              {actualStories ? `${actualStories} / ` : ""}
              {heightLimits.maxStories} max
            </p>
          </div>
          <Progress value={storiesProgress} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm">Lot Coverage</p>
            <p className="text-sm font-medium">
              {actualBuildingArea 
                ? `${((actualBuildingArea / lotArea) * 100).toFixed(1)}% / ` 
                : ""}
              {coverage.maxCoveragePercent.toFixed(1)}% max
            </p>
          </div>
          <Progress value={coverageProgress} className="h-2" />
          {actualBuildingArea && (
            <p className="text-xs text-muted-foreground">
              {actualBuildingArea.toLocaleString()} / {coverage.maxCoverage.toLocaleString()} sq ft
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm">Floor Area Ratio (FAR)</p>
            <p className="text-sm font-medium">
              {actualBuildingArea 
                ? `${(actualBuildingArea / lotArea).toFixed(2)} / ` 
                : ""}
              {coverage.farBase.toFixed(2)} max
            </p>
          </div>
          <Progress value={farProgress} className="h-2" />
          {actualBuildingArea && (
            <p className="text-xs text-muted-foreground">
              {actualBuildingArea.toLocaleString()} / {coverage.maxFloorArea.toLocaleString()} sq ft
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

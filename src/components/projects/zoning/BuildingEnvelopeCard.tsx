
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ZoningCalculationsState } from "../types/zoning/zoningTypes";
import { useState, useEffect } from "react";
import { CircleCheck, CircleX, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  
  // Calculated compliance values
  const heightCompliance = actualHeight && heightLimits ? {
    compliant: actualHeight <= heightLimits.maxHeight,
    warning: actualHeight > heightLimits.maxHeight * 0.85 && actualHeight <= heightLimits.maxHeight,
    value: Math.min(100, (actualHeight / heightLimits.maxHeight) * 100)
  } : null;
  
  const storiesCompliance = actualStories && heightLimits ? {
    compliant: actualStories <= heightLimits.maxStories,
    warning: actualStories === heightLimits.maxStories,
    value: Math.min(100, (actualStories / heightLimits.maxStories) * 100)
  } : null;
  
  const coverageCompliance = actualBuildingArea && coverage && lotArea ? {
    actualPercent: (actualBuildingArea / lotArea) * 100,
    compliant: actualBuildingArea <= coverage.maxCoverage,
    warning: actualBuildingArea > coverage.maxCoverage * 0.85 && actualBuildingArea <= coverage.maxCoverage,
    value: Math.min(100, (actualBuildingArea / coverage.maxCoverage) * 100)
  } : null;
  
  const farCompliance = actualBuildingArea && coverage && lotArea ? {
    actualFAR: actualBuildingArea / lotArea,
    compliant: (actualBuildingArea / lotArea) <= coverage.farBase,
    warning: (actualBuildingArea / lotArea) > coverage.farBase * 0.85 && (actualBuildingArea / lotArea) <= coverage.farBase,
    value: Math.min(100, ((actualBuildingArea / lotArea) / coverage.farBase) * 100)
  } : null;

  useEffect(() => {
    // Calculate the actual coverage percentage if we have actualBuildingArea
    if (coverage && actualBuildingArea) {
      setCoverageProgress(coverageCompliance?.value || 0);
    } else if (coverage) {
      // Default animation showing 75% of max
      setTimeout(() => setCoverageProgress(75), 300);
    }
    
    // Calculate the actual FAR progress if we have actualBuildingArea
    if (coverage && actualBuildingArea) {
      setFarProgress(farCompliance?.value || 0);
    } else if (coverage) {
      // Default animation showing 85% of max
      setTimeout(() => setFarProgress(85), 500);
    }
    
    // Calculate height progress if we have actualHeight
    if (heightLimits && actualHeight) {
      setHeightProgress(heightCompliance?.value || 0);
    } else if (heightLimits) {
      // Default animation showing 80% of max
      setTimeout(() => setHeightProgress(80), 700);
    }
    
    // Calculate stories progress if we have actualStories
    if (heightLimits && actualStories) {
      setStoriesProgress(storiesCompliance?.value || 0);
    } else if (heightLimits) {
      // Default animation showing 70% of max
      setTimeout(() => setStoriesProgress(70), 900);
    }
  }, [heightLimits, coverage, lotArea, actualHeight, actualStories, actualBuildingArea, heightCompliance, storiesCompliance, coverageCompliance, farCompliance]);
  
  // Helper function for status color
  const getStatusColor = (compliant: boolean | undefined, warning: boolean | undefined) => {
    if (compliant === false) return "text-destructive";
    if (warning) return "text-amber-500";
    return "text-green-600";
  };

  // Helper function for progress bar indicator color
  const getProgressColor = (compliant: boolean | undefined, warning: boolean | undefined) => {
    if (compliant === false) return "bg-destructive";
    if (warning) return "bg-amber-500";
    return "bg-green-600";
  };

  // Helper function for status icon
  const StatusIcon = ({ compliant, warning }: { compliant?: boolean, warning?: boolean }) => {
    if (compliant === false) return <CircleX className="w-4 h-4 inline ml-1 text-destructive" />;
    if (warning) return <AlertTriangle className="w-4 h-4 inline ml-1 text-amber-500" />;
    if (compliant) return <CircleCheck className="w-4 h-4 inline ml-1 text-green-600" />;
    return null;
  };
  
  if (!heightLimits || !coverage) return null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Building Envelope</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Building Height */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Building Height</p>
            <div className="flex items-center gap-1">
              <p className={`text-sm font-medium ${actualHeight ? getStatusColor(heightCompliance?.compliant, heightCompliance?.warning) : ""}`}>
                {actualHeight ? `${actualHeight}' / ` : ""}
                {heightLimits.maxHeight}' max
                <StatusIcon compliant={heightCompliance?.compliant} warning={heightCompliance?.warning} />
              </p>
              {heightCompliance && !heightCompliance.compliant && (
                <Badge className="ml-1 bg-destructive text-xs">Exceeds Limit</Badge>
              )}
            </div>
          </div>
          <Progress 
            value={heightProgress} 
            className="h-2"
            indicatorClassName={
              actualHeight 
                ? getProgressColor(heightCompliance?.compliant, heightCompliance?.warning)
                : undefined
            }
          />
        </div>
        
        {/* Number of Stories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Number of Stories</p>
            <div className="flex items-center gap-1">
              <p className={`text-sm font-medium ${actualStories ? getStatusColor(storiesCompliance?.compliant, storiesCompliance?.warning) : ""}`}>
                {actualStories ? `${actualStories} / ` : ""}
                {heightLimits.maxStories} max
                <StatusIcon compliant={storiesCompliance?.compliant} warning={storiesCompliance?.warning} />
              </p>
              {storiesCompliance && !storiesCompliance.compliant && (
                <Badge className="ml-1 bg-destructive text-xs">Exceeds Limit</Badge>
              )}
            </div>
          </div>
          <Progress 
            value={storiesProgress} 
            className="h-2"
            indicatorClassName={
              actualStories 
                ? getProgressColor(storiesCompliance?.compliant, storiesCompliance?.warning)
                : undefined
            }
          />
        </div>
        
        {/* Lot Coverage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Lot Coverage</p>
            <div className="flex items-center gap-1">
              <p className={`text-sm font-medium ${actualBuildingArea ? getStatusColor(coverageCompliance?.compliant, coverageCompliance?.warning) : ""}`}>
                {coverageCompliance 
                  ? `${coverageCompliance.actualPercent.toFixed(1)}% / ` 
                  : ""}
                {coverage.maxCoveragePercent.toFixed(1)}% max
                <StatusIcon compliant={coverageCompliance?.compliant} warning={coverageCompliance?.warning} />
              </p>
              {coverageCompliance && !coverageCompliance.compliant && (
                <Badge className="ml-1 bg-destructive text-xs">Exceeds Limit</Badge>
              )}
            </div>
          </div>
          <Progress 
            value={coverageProgress} 
            className="h-2"
            indicatorClassName={
              actualBuildingArea 
                ? getProgressColor(coverageCompliance?.compliant, coverageCompliance?.warning)
                : undefined
            }
          />
          {actualBuildingArea && (
            <p className="text-xs text-muted-foreground">
              {actualBuildingArea.toLocaleString()} / {coverage.maxCoverage.toLocaleString()} sq ft
            </p>
          )}
        </div>
        
        {/* Floor Area Ratio (FAR) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Floor Area Ratio (FAR)</p>
            <div className="flex items-center gap-1">
              <p className={`text-sm font-medium ${actualBuildingArea ? getStatusColor(farCompliance?.compliant, farCompliance?.warning) : ""}`}>
                {farCompliance 
                  ? `${farCompliance.actualFAR.toFixed(2)} / ` 
                  : ""}
                {coverage.farBase.toFixed(2)} max
                <StatusIcon compliant={farCompliance?.compliant} warning={farCompliance?.warning} />
              </p>
              {farCompliance && !farCompliance.compliant && (
                <Badge className="ml-1 bg-destructive text-xs">Exceeds Limit</Badge>
              )}
            </div>
          </div>
          <Progress 
            value={farProgress} 
            className="h-2"
            indicatorClassName={
              actualBuildingArea 
                ? getProgressColor(farCompliance?.compliant, farCompliance?.warning)
                : undefined
            }
          />
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

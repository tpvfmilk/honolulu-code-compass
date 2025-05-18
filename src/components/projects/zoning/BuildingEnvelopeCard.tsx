
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ZoningCalculationsState } from "../types/zoning/zoningTypes";
import { useState, useEffect } from "react";
import { CircleCheck, CircleX, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
  
  // For FAR or special calculation methods, determine which max value to use
  const getMaxFloorArea = () => {
    if (!coverage) return 0;
    
    if (coverage.specialRuleApplies && coverage.calculationMethod === "UnitBased") {
      return coverage.maxFloorArea; // This is already the minimum of unit-based and lot coverage
    } else {
      return coverage.maxFloorArea; // Standard FAR calculation
    }
  };
  
  const farCompliance = actualBuildingArea && coverage ? {
    actualFAR: actualBuildingArea / lotArea,
    compliant: actualBuildingArea <= getMaxFloorArea(),
    warning: actualBuildingArea > getMaxFloorArea() * 0.85 && actualBuildingArea <= getMaxFloorArea(),
    value: Math.min(100, (actualBuildingArea / getMaxFloorArea()) * 100)
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

  // Determine whether to show special calculation method description
  const showSpecialCalculation = coverage.specialRuleApplies && coverage.specialRuleExplanation;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Building Envelope</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Special District Rule Notification */}
        {showSpecialCalculation && (
          <div className="bg-blue-50 border border-blue-200 p-2 rounded-md text-xs text-blue-700 flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{coverage.specialRuleExplanation}</span>
          </div>
        )}
      
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
        
        {/* Floor Area Limit - Conditional display based on calculation method */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">
                {coverage.specialRuleApplies && coverage.calculationMethod === "UnitBased" 
                  ? "Maximum Building Area" 
                  : "Floor Area Ratio (FAR)"}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {coverage.specialRuleApplies && coverage.calculationMethod === "UnitBased" 
                      ? "Maximum building area is determined by the number of allowed dwelling units (3,000 sq ft per unit), limited by lot coverage."
                      : "Floor Area Ratio (FAR) is the ratio of a building's total floor area to the size of the land upon which it is built."}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-1">
              {coverage.specialRuleApplies && coverage.calculationMethod === "UnitBased" ? (
                <p className={`text-sm font-medium ${
                  actualBuildingArea ? getStatusColor(farCompliance?.compliant, farCompliance?.warning) : ""
                }`}>
                  {actualBuildingArea 
                    ? `${actualBuildingArea.toLocaleString()} / ` 
                    : ""}
                  {coverage.maxFloorArea.toLocaleString()} sq ft max
                  <StatusIcon compliant={farCompliance?.compliant} warning={farCompliance?.warning} />
                </p>
              ) : (
                <p className={`text-sm font-medium ${
                  actualBuildingArea ? getStatusColor(farCompliance?.compliant, farCompliance?.warning) : ""
                }`}>
                  {farCompliance 
                    ? `${farCompliance.actualFAR.toFixed(2)} / ` 
                    : ""}
                  {coverage.farBase.toFixed(2)} max
                  <StatusIcon compliant={farCompliance?.compliant} warning={farCompliance?.warning} />
                </p>
              )}
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
          {actualBuildingArea && !coverage.specialRuleApplies && (
            <p className="text-xs text-muted-foreground">
              {actualBuildingArea.toLocaleString()} / {coverage.maxFloorArea.toLocaleString()} sq ft
            </p>
          )}
          
          {/* Special calculation method detail explanation */}
          {coverage.specialRuleApplies && coverage.calculationMethod === "UnitBased" && 
           coverage.maxAreaByUnits && (
            <div className="text-xs text-muted-foreground">
              <span>Calculated as: min(</span>
              <span className="font-medium">{Math.floor(lotArea / (coverage.maxAreaByUnits / 3000))} units × 3,000 sq ft = {coverage.maxAreaByUnits.toLocaleString()} sq ft</span>
              <span>, </span>
              <span className="font-medium">{coverage.maxCoveragePercent.toFixed(1)}% lot coverage = {coverage.maxCoverage.toLocaleString()} sq ft</span>
              <span>)</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

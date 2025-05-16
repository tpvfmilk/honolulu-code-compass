
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type BuildingEnvelopeProps = {
  heightLimits: {
    maxHeight: number;
    maxStories: number;
  } | null;
  coverage: {
    maxCoveragePercent: number;
    maxCoverage: number;
    farBase: number;
    farConditional?: number;
    maxFloorArea: number;
    maxConditionalFloorArea?: number;
  } | null;
  lotArea: number;
};

export const BuildingEnvelopeCard = ({ heightLimits, coverage, lotArea }: BuildingEnvelopeProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  if (!heightLimits || !coverage) return null;
  
  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Building Height & Coverage Limits</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {/* Height Limits Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Maximum Height:</h3>
          <div className="flex justify-between items-center bg-muted/30 p-3 rounded-md">
            <div>
              <span className="text-2xl font-bold">{heightLimits.maxHeight}</span>
              <span className="text-sm ml-1">feet</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Maximum</span>
              <div className="text-sm font-medium">{heightLimits.maxStories} stories</div>
            </div>
          </div>
        </div>
        
        {/* Lot Coverage Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Lot Coverage:</h3>
            <span className="text-sm font-bold">{coverage.maxCoveragePercent}% maximum</span>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">{formatNumber(coverage.maxCoverage)} sf</span> of {formatNumber(lotArea)} sf lot
            </div>
            <Progress value={50} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 sf</span>
              <span>{formatNumber(coverage.maxCoverage)} sf maximum</span>
            </div>
          </div>
        </div>
        
        {/* Floor Area Ratio (FAR) Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium flex items-center">
              Floor Area Ratio (FAR)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Floor Area Ratio (FAR) is the ratio of a building's total floor area to the size of the lot. For example, a FAR of 0.5 means you can build floor area up to half the lot size.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Base FAR:</span>
                <span className="font-medium">{coverage.farBase} ({formatNumber(coverage.maxFloorArea)} sf total)</span>
              </div>
              <Progress value={60} className="h-2 mt-1" />
            </div>
            
            {coverage.farConditional && coverage.maxConditionalFloorArea && (
              <div className="pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    Conditional FAR:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            type="button"
                            onClick={(e) => e.preventDefault()}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>With 8' side yards, you qualify for increased FAR of {coverage.farConditional}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span className="font-medium">{coverage.farConditional} ({formatNumber(coverage.maxConditionalFloorArea)} sf total)</span>
                </div>
                <Progress value={40} className="h-2 mt-1" />
              </div>
            )}
          </div>
        </div>
        
        {/* Expandable Details Section */}
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen} className="pt-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm gap-2 text-muted-foreground">
              <ChevronDown className={`h-4 w-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
              Show Calculation Details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="rounded-md bg-muted p-3 text-xs space-y-2">
              <p><strong>Coverage Calculation:</strong> Lot Area × Max Coverage % = {formatNumber(lotArea)} × {coverage.maxCoveragePercent}% = {formatNumber(coverage.maxCoverage)} sf</p>
              <p><strong>Base FAR Calculation:</strong> Lot Area × FAR = {formatNumber(lotArea)} × {coverage.farBase} = {formatNumber(coverage.maxFloorArea)} sf</p>
              {coverage.farConditional && coverage.maxConditionalFloorArea && (
                <p><strong>Conditional FAR Calculation:</strong> Lot Area × FAR = {formatNumber(lotArea)} × {coverage.farConditional} = {formatNumber(coverage.maxConditionalFloorArea)} sf (with 8' side yards)</p>
              )}
              <p><strong>Code Reference:</strong> Honolulu LUO Chapter 21-3.70 (development standards)</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

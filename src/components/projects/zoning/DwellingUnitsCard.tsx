
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

type DwellingUnitsProps = {
  dwellingUnits: {
    maxUnits: number;
    allowsOhana: boolean;
    allowsADU: boolean;
    requiredParking: {
      main: number;
      ohana: number;
      adu: number;
      total: number;
    };
  } | null;
  zoning: string;
  lotArea: number;
  calculationMethod?: "FAR" | "UnitBased" | "LotCoverage";
};

export const DwellingUnitsCard = ({ 
  dwellingUnits, 
  zoning, 
  lotArea,
  calculationMethod
}: DwellingUnitsProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  if (!dwellingUnits) return null;
  
  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  // Determine if this is R-5 zoning with the special 3,000 sq ft per unit rule
  const isR5Zoning = zoning === "R-5";
  const isUnitBasedCalculation = calculationMethod === "UnitBased";

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dwelling Units & Parking</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Special R-5 Rule Notification */}
        {isR5Zoning && isUnitBasedCalculation && (
          <div className="bg-blue-50 border border-blue-200 p-2 rounded-md text-xs text-blue-700 flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              In R-5 zoning, each dwelling unit allows 3,000 sq ft of building area. 
              Maximum building size is limited by both the number of allowed units and lot coverage.
            </span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dwelling Units Column */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              Dwelling Units Allowed:
              {isUnitBasedCalculation && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-1 h-4 w-4 inline-block text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      Number of dwelling units directly determines maximum building area in this zone.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h3>
            <div className="space-y-3 bg-muted/20 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm">Main Dwelling Units:</span>
                <span className="font-medium">{dwellingUnits.maxUnits}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Ohana Unit:</span>
                <span className="font-medium">
                  {dwellingUnits.allowsOhana ? (
                    <span className="text-green-600">Allowed</span>
                  ) : (
                    <span className="text-red-500">Not Allowed</span>
                  )}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">ADU (Accessory Dwelling Unit):</span>
                <span className="font-medium">
                  {dwellingUnits.allowsADU ? (
                    <span className="text-green-600">Allowed</span>
                  ) : (
                    <span className="text-red-500">Not Allowed</span>
                  )}
                </span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium">Maximum Total Units:</span>
                <span className="font-bold">
                  {dwellingUnits.maxUnits + 
                    (dwellingUnits.allowsOhana ? 1 : 0) + 
                    (dwellingUnits.allowsADU ? 1 : 0)
                  }
                </span>
              </div>
              
              {/* R-5 specific information about building size per unit */}
              {isR5Zoning && isUnitBasedCalculation && (
                <div className="pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground block mb-1">Maximum Building Area:</span>
                  <span className="font-medium block">
                    {formatNumber(dwellingUnits.maxUnits * 3000)} sq ft 
                    <span className="text-xs text-muted-foreground ml-1">
                      ({dwellingUnits.maxUnits} × 3,000 sq ft)
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Parking Requirements Column */}
          <div>
            <h3 className="text-sm font-medium mb-3">Parking Requirements:</h3>
            <div className="space-y-3 bg-muted/20 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm">Main Dwelling:</span>
                <span className="font-medium">{dwellingUnits.requiredParking.main} spaces</span>
              </div>
              
              {dwellingUnits.allowsOhana && (
                <div className="flex justify-between">
                  <span className="text-sm">Ohana Unit:</span>
                  <span className="font-medium">{dwellingUnits.requiredParking.ohana} space</span>
                </div>
              )}
              
              {dwellingUnits.allowsADU && (
                <div className="flex justify-between">
                  <span className="text-sm">ADU:</span>
                  <span className="font-medium">{dwellingUnits.requiredParking.adu} space</span>
                </div>
              )}
              
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium">Total Required:</span>
                <span className="font-bold">{dwellingUnits.requiredParking.total} spaces</span>
              </div>
            </div>
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
              <p><strong>Dwelling Unit Calculation:</strong> Lot Area ÷ Minimum Lot Size = {formatNumber(lotArea)} ÷ {formatNumber(lotArea / dwellingUnits.maxUnits)} = {dwellingUnits.maxUnits} unit(s)</p>
              <p><strong>Ohana Requirements:</strong> Minimum 5,000 sf lot in residential zones</p>
              <p><strong>ADU Requirements:</strong> Minimum 3,500 sf lot in residential zones</p>
              <p><strong>Parking Calculation:</strong> {dwellingUnits.requiredParking.main} (main) + {dwellingUnits.requiredParking.ohana} (ohana) + {dwellingUnits.requiredParking.adu} (ADU) = {dwellingUnits.requiredParking.total} spaces</p>
              <p><strong>Code Reference:</strong> Honolulu LUO Chapter 21-6 (Off-Street Parking)</p>
              
              {/* R-5 specific calculation detail */}
              {isR5Zoning && isUnitBasedCalculation && (
                <p><strong>R-5 Building Area:</strong> {dwellingUnits.maxUnits} units × 3,000 sq ft = {formatNumber(dwellingUnits.maxUnits * 3000)} sq ft maximum building area (subject to lot coverage limitations)</p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};


import { FormData } from "../types";
import { ZoningCalculationsState } from "../zoning/types/zoningTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ZoningSelector } from "../zoning/ZoningSelector";
import { PropertyFeaturesCheckboxes } from "../zoning/PropertyFeaturesCheckboxes";
import { SetbackCalculationCard } from "../zoning/SetbackCalculationCard";
import { BuildingEnvelopeCard } from "../zoning/BuildingEnvelopeCard";
import { DwellingUnitsCard } from "../zoning/DwellingUnitsCard";
import { LotAreaInput } from "../zoning/LotAreaInput";

type ZoningInfoStepProps = {
  formData: FormData;
  calculations: ZoningCalculationsState;
  isCalculating: boolean;
  updateFormData: (key: keyof FormData, value: string | boolean) => void;
  zoningDistricts: Array<{ value: string; label: string; group: string }>;
};

export const ZoningInfoStep = ({ 
  formData, 
  calculations, 
  isCalculating, 
  updateFormData,
  zoningDistricts
}: ZoningInfoStepProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Column - Input Form (40%) */}
      <div className="w-full md:w-2/5">
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="district">Zoning District</Label>
                <ZoningSelector 
                  value={formData.district} 
                  onChange={(value) => updateFormData("district", value)}
                  zoningDistricts={zoningDistricts}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lotArea">Lot Area (sq ft)</Label>
                <LotAreaInput
                  id="lotArea" 
                  value={formData.lotArea}
                  onChange={(value) => updateFormData("lotArea", value)}
                />
              </div>
              
              <PropertyFeaturesCheckboxes
                isCornerLot={formData.isCornerLot}
                isHistoric={formData.isHistoric}
                isSMA={formData.isSMA}
                onCornerLotChange={(value) => updateFormData("isCornerLot", value)}
                onHistoricChange={(value) => updateFormData("isHistoric", value)}
                onSMAChange={(value) => updateFormData("isSMA", value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right Column - Calculation Results (60%) */}
      <div className="w-full md:w-3/5">
        <div className="space-y-4">
          {isCalculating ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Calculating zoning requirements...</p>
              </div>
            </div>
          ) : formData.district && formData.lotArea ? (
            <>
              <SetbackCalculationCard 
                setbacks={calculations.setbacks} 
                isCornerLot={formData.isCornerLot} 
              />
              
              <BuildingEnvelopeCard 
                heightLimits={calculations.heightLimits}
                coverage={calculations.coverage}
                lotArea={parseFloat(formData.lotArea.replace(/,/g, ''))}
              />
              
              <DwellingUnitsCard 
                dwellingUnits={calculations.dwellingUnits}
                zoning={formData.district}
                lotArea={parseFloat(formData.lotArea.replace(/,/g, ''))}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">No Calculations Yet</h3>
                <p className="text-muted-foreground">
                  Enter zoning district and lot area to generate calculations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

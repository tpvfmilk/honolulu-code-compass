
import { FormData } from "../types";
import { ZoningCalculationsState } from "../zoning/types/zoningTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  updateFormData: (key: keyof FormData, value: string | boolean | number) => void;
  zoningDistricts: Array<{ value: string; label: string; group: string }>;
};

export const ZoningInfoStep = ({ 
  formData, 
  calculations, 
  isCalculating, 
  updateFormData,
  zoningDistricts
}: ZoningInfoStepProps) => {
  // Calculate acres from square feet
  const lotAreaSqFt = parseFloat((formData.lotArea || "0").replace(/,/g, ''));
  const lotAreaAcres = (lotAreaSqFt / 43560).toFixed(2);

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
                <Label htmlFor="lotArea">Lot Area</Label>
                <div className="space-y-1">
                  <LotAreaInput
                    id="lotArea" 
                    value={formData.lotArea}
                    onChange={(value) => updateFormData("lotArea", value)}
                  />
                  {lotAreaSqFt > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {lotAreaAcres} acres
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Property Features</Label>
                <PropertyFeaturesCheckboxes
                  isCornerLot={formData.isCornerLot}
                  isHistoric={formData.isHistoric}
                  isSMA={formData.isSMA}
                  onCornerLotChange={(value) => updateFormData("isCornerLot", value)}
                  onHistoricChange={(value) => updateFormData("isHistoric", value)}
                  onSMAChange={(value) => updateFormData("isSMA", value)}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Building Characteristics</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="buildingType" className="text-sm">Building Type</Label>
                  <Input
                    id="buildingType" 
                    value={formData.buildingType || ""}
                    onChange={(e) => updateFormData("buildingType", e.target.value)}
                    placeholder="e.g., Single-Family Dwelling"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stories" className="text-sm">Actual Stories</Label>
                    <Input
                      id="stories" 
                      value={formData.stories || ""}
                      onChange={(e) => updateFormData("stories", e.target.value)}
                      placeholder="e.g., 2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm">Actual Height (feet)</Label>
                    <Input
                      id="height" 
                      value={formData.height || ""}
                      onChange={(e) => updateFormData("height", e.target.value)}
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalBuildingArea" className="text-sm">Total Building Area (sq ft)</Label>
                  <Input
                    id="totalBuildingArea" 
                    value={formData.totalBuildingArea || ""}
                    onChange={(e) => updateFormData("totalBuildingArea", e.target.value)}
                    placeholder="e.g., 2,500"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <Label>Land Use</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="existing_use" className="text-sm">Existing Use</Label>
                  <Input
                    id="existing_use" 
                    value={formData.existing_use || ""}
                    onChange={(e) => updateFormData("existing_use", e.target.value)}
                    placeholder="e.g., Residential"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="proposed_use" className="text-sm">Proposed Use</Label>
                  <Input
                    id="proposed_use" 
                    value={formData.proposed_use || ""}
                    onChange={(e) => updateFormData("proposed_use", e.target.value)}
                    placeholder="e.g., Mixed-Use Commercial/Residential"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <Label>Parking Requirements</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="standard_stalls_required" className="text-sm">Standard Stalls Required</Label>
                    <Input
                      id="standard_stalls_required"
                      type="number"
                      min="0" 
                      value={formData.standard_stalls_required || ""}
                      onChange={(e) => updateFormData("standard_stalls_required", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standard_stalls_provided" className="text-sm">Standard Stalls Provided</Label>
                    <Input
                      id="standard_stalls_provided"
                      type="number"
                      min="0" 
                      value={formData.standard_stalls_provided || ""}
                      onChange={(e) => updateFormData("standard_stalls_provided", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ada_stalls_required" className="text-sm">ADA Stalls Required</Label>
                    <Input
                      id="ada_stalls_required"
                      type="number"
                      min="0" 
                      value={formData.ada_stalls_required || ""}
                      onChange={(e) => updateFormData("ada_stalls_required", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ada_stalls_provided" className="text-sm">ADA Stalls Provided</Label>
                    <Input
                      id="ada_stalls_provided"
                      type="number"
                      min="0" 
                      value={formData.ada_stalls_provided || ""}
                      onChange={(e) => updateFormData("ada_stalls_provided", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loading_spaces_required" className="text-sm">Loading Spaces Required</Label>
                    <Input
                      id="loading_spaces_required"
                      type="number"
                      min="0" 
                      value={formData.loading_spaces_required || ""}
                      onChange={(e) => updateFormData("loading_spaces_required", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loading_spaces_provided" className="text-sm">Loading Spaces Provided</Label>
                    <Input
                      id="loading_spaces_provided"
                      type="number"
                      min="0" 
                      value={formData.loading_spaces_provided || ""}
                      onChange={(e) => updateFormData("loading_spaces_provided", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
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
                actualHeight={formData.height ? parseFloat(formData.height) : undefined}
                actualStories={formData.stories ? parseInt(formData.stories) : undefined}
                actualBuildingArea={formData.totalBuildingArea ? parseFloat(formData.totalBuildingArea.replace(/,/g, '')) : undefined}
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

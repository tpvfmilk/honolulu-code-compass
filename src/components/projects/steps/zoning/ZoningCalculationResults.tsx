
import { FormData } from "../../types";
import { ZoningCalculationsState } from "../../types/zoning/zoningTypes";
import { SetbackCalculationCard } from "../../zoning/SetbackCalculationCard";
import { BuildingEnvelopeCard } from "../../zoning/BuildingEnvelopeCard";
import { DwellingUnitsCard } from "../../zoning/DwellingUnitsCard";

type ZoningCalculationResultsProps = {
  formData: FormData;
  calculations: ZoningCalculationsState;
  isCalculating: boolean;
  actualHeight?: number;
  actualStories?: number;
  actualBuildingArea?: number;
};

export const ZoningCalculationResults = ({ 
  formData, 
  calculations,
  isCalculating,
  actualHeight,
  actualStories,
  actualBuildingArea
}: ZoningCalculationResultsProps) => {
  const lotArea = parseFloat(formData.lotArea.replace(/,/g, ''));

  if (isCalculating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Calculating zoning requirements...</p>
        </div>
      </div>
    );
  }
  
  if (!formData.district || !formData.lotArea) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">No Calculations Yet</h3>
          <p className="text-muted-foreground">
            Enter zoning district and lot area to generate calculations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SetbackCalculationCard 
        setbacks={calculations.setbacks} 
        isCornerLot={formData.isCornerLot} 
      />
      
      <BuildingEnvelopeCard 
        heightLimits={calculations.heightLimits}
        coverage={calculations.coverage}
        lotArea={lotArea}
        actualHeight={actualHeight}
        actualStories={actualStories}
        actualBuildingArea={actualBuildingArea}
      />
      
      <DwellingUnitsCard 
        dwellingUnits={calculations.dwellingUnits}
        zoning={formData.district}
        lotArea={lotArea}
      />
    </div>
  );
};

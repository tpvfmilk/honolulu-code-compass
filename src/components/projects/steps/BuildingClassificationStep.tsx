
import { FormData } from "../types";
import { Card } from "@/components/ui/card";
import { ConstructionTypeSelector } from "../building/ConstructionTypeSelector";
import { OccupancyGroupSelector } from "../building/OccupancyGroupSelector";
import { BuildingDimensionsSection } from "../building/BuildingDimensionsSection";
import { BuildingSystemsSection } from "../building/BuildingSystemsSection";
import { MixedOccupancySection } from "../building/MixedOccupancySection";
import { ComplianceDisplay } from "../building/ComplianceDisplay";

type BuildingClassificationStepProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean | any) => void;
  buildingTypes: string[];
};

export const BuildingClassificationStep = ({ 
  formData, 
  updateFormData,
  buildingTypes
}: BuildingClassificationStepProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - 2/3 width */}
      <div className="md:col-span-2 space-y-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Construction Classification</h3>
            <div className="space-y-6">
              <ConstructionTypeSelector 
                value={formData.constructionType} 
                onChange={(value) => updateFormData('constructionType', value)} 
              />
              <OccupancyGroupSelector 
                value={formData.occupancyGroup} 
                onChange={(value) => updateFormData('occupancyGroup', value)} 
              />
            </div>
          </div>
        </Card>
        
        <MixedOccupancySection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <BuildingDimensionsSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <BuildingSystemsSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </div>
      
      {/* Right Column - 1/3 width */}
      <div className="md:col-span-1 space-y-6">
        <ComplianceDisplay 
          formData={formData} 
          isCalculating={false} 
        />
      </div>
    </div>
  );
};

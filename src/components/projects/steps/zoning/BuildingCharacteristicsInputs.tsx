
import { FormData } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type BuildingCharacteristicsInputsProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean | number) => void;
};

export const BuildingCharacteristicsInputs = ({ 
  formData, 
  updateFormData
}: BuildingCharacteristicsInputsProps) => {
  return (
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
  );
};


import { FormData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BuildingClassificationStepProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean) => void;
  buildingTypes: string[];
};

export const BuildingClassificationStep = ({ 
  formData, 
  updateFormData,
  buildingTypes
}: BuildingClassificationStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="buildingType">Building Type</Label>
        <Select
          value={formData.buildingType}
          onValueChange={(value) => updateFormData("buildingType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select building type" />
          </SelectTrigger>
          <SelectContent>
            {buildingTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="stories">Number of Stories</Label>
        <Input
          id="stories"
          type="number"
          placeholder="Enter number of stories"
          value={formData.stories}
          onChange={(e) => updateFormData("stories", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="height">Building Height (feet)</Label>
        <Input
          id="height"
          type="number"
          placeholder="Enter building height in feet"
          value={formData.height}
          onChange={(e) => updateFormData("height", e.target.value)}
          required
        />
      </div>
    </div>
  );
};

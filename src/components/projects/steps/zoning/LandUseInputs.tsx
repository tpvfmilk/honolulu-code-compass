
import { FormData } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type LandUseInputsProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean | number) => void;
};

export const LandUseInputs = ({ 
  formData, 
  updateFormData
}: LandUseInputsProps) => {
  return (
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
  );
};

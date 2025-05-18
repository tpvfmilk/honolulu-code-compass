
import { FormData } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type ParkingRequirementsInputsProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean | number) => void;
};

export const ParkingRequirementsInputs = ({ 
  formData, 
  updateFormData
}: ParkingRequirementsInputsProps) => {
  return (
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
  );
};

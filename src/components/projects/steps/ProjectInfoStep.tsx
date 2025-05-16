
import { FormData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProjectInfoStepProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean) => void;
};

export const ProjectInfoStep = ({ formData, updateFormData }: ProjectInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          placeholder="Enter project name"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tmk">TMK Number</Label>
        <Input
          id="tmk"
          placeholder="Format: X-X-XXX:XXX"
          value={formData.tmk}
          onChange={(e) => updateFormData("tmk", e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Tax Map Key (TMK) is a unique identifier for your property
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Property Address (Optional)</Label>
        <Input
          id="address"
          placeholder="Enter property address"
          value={formData.address}
          onChange={(e) => updateFormData("address", e.target.value)}
        />
      </div>
    </div>
  );
};

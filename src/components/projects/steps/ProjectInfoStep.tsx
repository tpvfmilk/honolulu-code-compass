
import { useState } from "react";
import { FormData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ProjectInfoStepProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean) => void;
};

export const ProjectInfoStep = ({ formData, updateFormData }: ProjectInfoStepProps) => {
  const [tmkError, setTmkError] = useState<string | null>(null);

  // TMK validation regex pattern: X-X-XXX:XXX
  const tmkPattern = /^\d-\d-\d{3}:\d{3}$/;

  const validateTmk = (value: string) => {
    if (!value) {
      setTmkError("TMK number is required");
      return false;
    }
    
    if (!tmkPattern.test(value)) {
      setTmkError("TMK must follow the format X-X-XXX:XXX (e.g., 3-5-001:002)");
      return false;
    }
    
    setTmkError(null);
    return true;
  };

  const handleTmkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData("tmk", value);
    validateTmk(value);
  };

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
          onChange={handleTmkChange}
          required
          className={tmkError ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        
        {tmkError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2 text-xs">{tmkError}</AlertDescription>
          </Alert>
        )}
        
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

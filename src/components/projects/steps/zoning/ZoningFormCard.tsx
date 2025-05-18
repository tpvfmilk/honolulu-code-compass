
import { FormData } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { ZoningFormInputs } from "./ZoningFormInputs";
import { BuildingCharacteristicsInputs } from "./BuildingCharacteristicsInputs";
import { LandUseInputs } from "./LandUseInputs";
import { ParkingRequirementsInputs } from "./ParkingRequirementsInputs";

type ZoningFormCardProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean | number) => void;
  zoningDistricts: Array<{ value: string; label: string; group: string }>;
  lotAreaAcres: string;
};

export const ZoningFormCard = ({ 
  formData, 
  updateFormData,
  zoningDistricts,
  lotAreaAcres
}: ZoningFormCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <ZoningFormInputs
          formData={formData}
          updateFormData={updateFormData}
          zoningDistricts={zoningDistricts}
          lotAreaAcres={lotAreaAcres}
        />
        
        <BuildingCharacteristicsInputs
          formData={formData}
          updateFormData={updateFormData}
        />
        
        <LandUseInputs
          formData={formData}
          updateFormData={updateFormData}
        />
        
        <ParkingRequirementsInputs
          formData={formData}
          updateFormData={updateFormData}
        />
      </CardContent>
    </Card>
  );
};

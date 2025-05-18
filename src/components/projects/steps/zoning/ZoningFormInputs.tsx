
import { FormData } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ZoningSelector } from "../../zoning/ZoningSelector";
import { PropertyFeaturesCheckboxes } from "../../zoning/PropertyFeaturesCheckboxes";
import { LotAreaInput } from "../../zoning/LotAreaInput";

type ZoningFormInputsProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean | number) => void;
  zoningDistricts: Array<{ value: string; label: string; group: string }>;
  lotAreaAcres: string;
};

export const ZoningFormInputs = ({ 
  formData, 
  updateFormData,
  zoningDistricts,
  lotAreaAcres
}: ZoningFormInputsProps) => {
  return (
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
          {parseFloat((formData.lotArea || "0").replace(/,/g, '')) > 0 && (
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
    </div>
  );
};

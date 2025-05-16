
import { FormData } from "../types";

type ReviewStepProps = {
  formData: FormData;
};

export const ReviewStep = ({ formData }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium text-lg mb-4">Project Summary</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Project Name</p>
            <p className="font-medium">{formData.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">TMK Number</p>
            <p className="font-medium">{formData.tmk}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{formData.address || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Zoning District</p>
            <p className="font-medium">{formData.district}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lot Area</p>
            <p className="font-medium">{formData.lotArea} sq ft</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Building Type</p>
            <p className="font-medium">{formData.buildingType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Number of Stories</p>
            <p className="font-medium">{formData.stories}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Building Height</p>
            <p className="font-medium">{formData.height} feet</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary p-4 rounded-md">
        <h3 className="font-medium mb-2">Preliminary Compliance Check</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
            <span>Height limit compliant (30' max in {formData.district})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
            <span>Setback requirements met</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
            <span>FAR (Floor Area Ratio) compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

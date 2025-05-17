
import { FormData } from "../types";

type ReviewStepProps = {
  formData: FormData;
};

export const ReviewStep = ({ formData }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium text-lg mb-4">Project Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Project Type</p>
            <p className="font-medium">{formData.project_type || "New Construction"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">County</p>
            <p className="font-medium">{formData.county || "Not specified"}</p>
          </div>
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
            <p className="text-sm text-muted-foreground">Client / Owner</p>
            <p className="font-medium">
              {formData.client_name ? formData.client_name : "Not provided"}
              {formData.property_owner && formData.client_name !== formData.property_owner && 
                ` / ${formData.property_owner}`}
            </p>
          </div>
        </div>
        
        {/* Show renovation-specific fields if applicable */}
        {(formData.project_type === "Renovation" || 
          formData.project_type === "Addition" || 
          formData.project_type === "Change of Use") && (
          <>
            <h4 className="font-medium mt-4 mb-2">Renovation Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Year of Construction</p>
                <p className="font-medium">{formData.year_of_construction || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Original Building Code</p>
                <p className="font-medium">{formData.original_building_code || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alteration Level</p>
                <p className="font-medium">{formData.alteration_level || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Work Area</p>
                <p className="font-medium">{formData.work_area_percentage ? `${formData.work_area_percentage}%` : "Not specified"}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium text-lg mb-4">Zoning Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
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
            <p className="font-medium">{formData.buildingType || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Number of Stories</p>
            <p className="font-medium">{formData.stories || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Building Height</p>
            <p className="font-medium">{formData.height ? `${formData.height} feet` : "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Building Area</p>
            <p className="font-medium">{formData.totalBuildingArea ? `${formData.totalBuildingArea} sq ft` : "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Existing Use</p>
            <p className="font-medium">{formData.existing_use || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Proposed Use</p>
            <p className="font-medium">{formData.proposed_use || "Not specified"}</p>
          </div>
        </div>
        
        <h4 className="font-medium mt-4 mb-2">Parking</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Standard Stalls</p>
            <p className="font-medium">
              {formData.standard_stalls_provided || 0} / {formData.standard_stalls_required || 0} required
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ADA Stalls</p>
            <p className="font-medium">
              {formData.ada_stalls_provided || 0} / {formData.ada_stalls_required || 0} required
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Loading Spaces</p>
            <p className="font-medium">
              {formData.loading_spaces_provided || 0} / {formData.loading_spaces_required || 0} required
            </p>
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
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full ${
              (formData.standard_stalls_provided || 0) >= (formData.standard_stalls_required || 0) ? 
              "bg-green-500 text-white" : "bg-yellow-500 text-white"
            } flex items-center justify-center text-xs`}>
              {(formData.standard_stalls_provided || 0) >= (formData.standard_stalls_required || 0) ? "✓" : "!"}
            </div>
            <span>Parking requirements {
              (formData.standard_stalls_provided || 0) >= (formData.standard_stalls_required || 0) ? 
              "met" : "not met - variance may be required"
            }</span>
          </div>
        </div>
      </div>
    </div>
  );
};

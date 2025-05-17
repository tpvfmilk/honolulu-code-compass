
import { useState } from "react";
import { FormData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type ProjectInfoStepProps = {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string | boolean | number) => void;
};

export const ProjectInfoStep = ({ formData, updateFormData }: ProjectInfoStepProps) => {
  const [tmkError, setTmkError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showRenovationFields, setShowRenovationFields] = useState(
    formData.project_type === "Renovation" || 
    formData.project_type === "Addition" || 
    formData.project_type === "Change of Use"
  );

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

  const handleProjectTypeChange = (value: string) => {
    updateFormData("project_type", value);
    setShowRenovationFields(
      value === "Renovation" || 
      value === "Addition" || 
      value === "Change of Use"
    );
  };

  return (
    <div className="space-y-4">
      {/* Project Type Selection */}
      <div className="space-y-2">
        <Label>Project Type</Label>
        <RadioGroup
          value={formData.project_type || ""}
          onValueChange={handleProjectTypeChange}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="New Construction" id="new-construction" />
            <Label htmlFor="new-construction" className="cursor-pointer">New Construction</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="Renovation" id="renovation" />
            <Label htmlFor="renovation" className="cursor-pointer">Renovation</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="Addition" id="addition" />
            <Label htmlFor="addition" className="cursor-pointer">Addition</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="Change of Use" id="change-of-use" />
            <Label htmlFor="change-of-use" className="cursor-pointer">Change of Use</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Basic Project Info */}
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
        <Label htmlFor="address">Property Address</Label>
        <Input
          id="address"
          placeholder="Enter property address"
          value={formData.address}
          onChange={(e) => updateFormData("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client Name */}
        <div className="space-y-2">
          <Label htmlFor="client_name">Client Name</Label>
          <Input
            id="client_name"
            placeholder="Enter client name"
            value={formData.client_name || ""}
            onChange={(e) => updateFormData("client_name", e.target.value)}
          />
        </div>
        
        {/* Property Owner */}
        <div className="space-y-2">
          <Label htmlFor="property_owner">Property Owner</Label>
          <Input
            id="property_owner"
            placeholder="Enter property owner"
            value={formData.property_owner || ""}
            onChange={(e) => updateFormData("property_owner", e.target.value)}
          />
        </div>
      </div>

      {/* County Selection */}
      <div className="space-y-2">
        <Label htmlFor="county">County</Label>
        <Select 
          value={formData.county || ""} 
          onValueChange={(value) => updateFormData("county", value)}
        >
          <SelectTrigger id="county">
            <SelectValue placeholder="Select county" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Honolulu">Honolulu</SelectItem>
            <SelectItem value="Hawaii">Hawaii</SelectItem>
            <SelectItem value="Maui">Maui</SelectItem>
            <SelectItem value="Kauai">Kauai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Fields Toggle */}
      <Collapsible
        open={showAdvanced}
        onOpenChange={setShowAdvanced}
        className="border rounded-lg p-4 mt-6"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <h3 className="text-lg font-medium">Advanced Fields</h3>
          {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {/* Environmental Designations */}
          <h4 className="font-medium">Environmental Designations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lava_zone">Lava Zone</Label>
              <Select 
                value={formData.lava_zone || ""} 
                onValueChange={(value) => updateFormData("lava_zone", value)}
              >
                <SelectTrigger id="lava_zone">
                  <SelectValue placeholder="Select lava zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zone 1">Zone 1 (Highest Risk)</SelectItem>
                  <SelectItem value="Zone 2">Zone 2</SelectItem>
                  <SelectItem value="Zone 3">Zone 3</SelectItem>
                  <SelectItem value="Zone 4">Zone 4</SelectItem>
                  <SelectItem value="Zone 5">Zone 5</SelectItem>
                  <SelectItem value="Zone 6">Zone 6</SelectItem>
                  <SelectItem value="Zone 7">Zone 7</SelectItem>
                  <SelectItem value="Zone 8">Zone 8</SelectItem>
                  <SelectItem value="Zone 9">Zone 9 (Lowest Risk)</SelectItem>
                  <SelectItem value="None">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seismic_zone">Seismic Zone</Label>
              <Select 
                value={formData.seismic_zone || ""} 
                onValueChange={(value) => updateFormData("seismic_zone", value)}
              >
                <SelectTrigger id="seismic_zone">
                  <SelectValue placeholder="Select seismic zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zone 0">Zone 0</SelectItem>
                  <SelectItem value="Zone 1">Zone 1</SelectItem>
                  <SelectItem value="Zone 2A">Zone 2A</SelectItem>
                  <SelectItem value="Zone 2B">Zone 2B</SelectItem>
                  <SelectItem value="Zone 3">Zone 3</SelectItem>
                  <SelectItem value="Zone 4">Zone 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="flood_zone">Flood Zone</Label>
              <Select 
                value={formData.flood_zone || ""} 
                onValueChange={(value) => updateFormData("flood_zone", value)}
              >
                <SelectTrigger id="flood_zone">
                  <SelectValue placeholder="Select flood zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zone A">Zone A</SelectItem>
                  <SelectItem value="Zone AE">Zone AE</SelectItem>
                  <SelectItem value="Zone AH">Zone AH</SelectItem>
                  <SelectItem value="Zone AO">Zone AO</SelectItem>
                  <SelectItem value="Zone V">Zone V</SelectItem>
                  <SelectItem value="Zone VE">Zone VE</SelectItem>
                  <SelectItem value="Zone X">Zone X</SelectItem>
                  <SelectItem value="None">Not in Flood Zone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Historic Status */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="historic_status">Historic Property</Label>
              <Switch
                id="historic_status"
                checked={formData.historic_status || false}
                onCheckedChange={(checked) => updateFormData("historic_status", checked)}
              />
            </div>
            {formData.historic_status && (
              <div className="space-y-2 mt-2">
                <Label htmlFor="historic_review_type">Historic Review Type</Label>
                <Select 
                  value={formData.historic_review_type || ""} 
                  onValueChange={(value) => updateFormData("historic_review_type", value)}
                >
                  <SelectTrigger id="historic_review_type">
                    <SelectValue placeholder="Select review type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Renovation Review">Renovation Review</SelectItem>
                    <SelectItem value="Conservation">Conservation</SelectItem>
                    <SelectItem value="Restoration">Restoration</SelectItem>
                    <SelectItem value="Addition Review">Addition Review</SelectItem>
                    <SelectItem value="National Register">National Register</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Renovation-Specific Fields */}
      {showRenovationFields && (
        <div className="border rounded-lg p-4 mt-4 space-y-4">
          <h3 className="text-lg font-medium">Renovation Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year_of_construction">Year of Original Construction</Label>
              <Input
                id="year_of_construction"
                type="number"
                placeholder="Enter year"
                value={formData.year_of_construction || ""}
                onChange={(e) => updateFormData("year_of_construction", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="original_building_code">Original Building Code</Label>
              <Input
                id="original_building_code"
                placeholder="E.g., IBC 2006"
                value={formData.original_building_code || ""}
                onChange={(e) => updateFormData("original_building_code", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alteration_level">Alteration Level</Label>
              <Select 
                value={formData.alteration_level || ""} 
                onValueChange={(value) => updateFormData("alteration_level", value)}
              >
                <SelectTrigger id="alteration_level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_area_percentage">Work Area Percentage</Label>
              <div className="relative">
                <Input
                  id="work_area_percentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter percentage"
                  value={formData.work_area_percentage || ""}
                  onChange={(e) => updateFormData("work_area_percentage", parseFloat(e.target.value) || 0)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="compliance_method">Compliance Method</Label>
              <Select 
                value={formData.compliance_method || ""} 
                onValueChange={(value) => updateFormData("compliance_method", value)}
              >
                <SelectTrigger id="compliance_method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prescriptive">Prescriptive</SelectItem>
                  <SelectItem value="Work Area">Work Area</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

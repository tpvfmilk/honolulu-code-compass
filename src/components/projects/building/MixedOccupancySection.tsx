
import { useState } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { FormData, SecondaryOccupancy, occupancyGroups } from "../types";

interface MixedOccupancySectionProps {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

export const MixedOccupancySection = ({ formData, updateFormData }: MixedOccupancySectionProps) => {
  const [showMixedOccupancy, setShowMixedOccupancy] = useState(formData.mixedOccupancyType !== "None");
  
  const handleToggleChange = (checked: boolean) => {
    setShowMixedOccupancy(checked);
    updateFormData("mixedOccupancyType", checked ? "Separated" : "None");
    
    if (!checked) {
      // Clear any existing secondary occupancies
      updateFormData("secondaryOccupancies", []);
    } else if (formData.secondaryOccupancies.length === 0) {
      // Add one empty secondary occupancy when enabling
      updateFormData("secondaryOccupancies", [{ group: "", area: "", floorLevel: "" }]);
    }
  };
  
  const handleMixedOccupancyTypeChange = (value: string) => {
    updateFormData("mixedOccupancyType", value);
  };
  
  const addSecondaryOccupancy = () => {
    const newOccupancies = [...formData.secondaryOccupancies, { group: "", area: "", floorLevel: "" }];
    updateFormData("secondaryOccupancies", newOccupancies);
  };
  
  const updateSecondaryOccupancy = (index: number, field: keyof SecondaryOccupancy, value: string) => {
    const updatedOccupancies = [...formData.secondaryOccupancies];
    updatedOccupancies[index] = { ...updatedOccupancies[index], [field]: value };
    updateFormData("secondaryOccupancies", updatedOccupancies);
  };
  
  const removeSecondaryOccupancy = (index: number) => {
    const updatedOccupancies = [...formData.secondaryOccupancies];
    updatedOccupancies.splice(index, 1);
    updateFormData("secondaryOccupancies", updatedOccupancies);
  };
  
  return (
    <Card>
      <CardHeader className="bg-gray-50 rounded-t-lg">
        <CardTitle>Mixed Occupancy</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="hasMixedOccupancy">Multiple Occupancy Groups in Building?</Label>
            <Switch 
              id="hasMixedOccupancy"
              checked={showMixedOccupancy}
              onCheckedChange={handleToggleChange}
            />
          </div>
          
          {showMixedOccupancy && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Occupancy Separation Method</Label>
                <RadioGroup 
                  value={formData.mixedOccupancyType} 
                  onValueChange={handleMixedOccupancyTypeChange}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Separated" id="separated" />
                    <Label htmlFor="separated">Separated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Non-separated" id="non-separated" />
                    <Label htmlFor="non-separated">Non-separated (Accessory Uses)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <Label>Secondary Occupancy Groups</Label>
                {formData.secondaryOccupancies.map((occupancy, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end border-b pb-4">
                    <div className="md:col-span-3">
                      <Label className="mb-2 block">Occupancy</Label>
                      <Select 
                        value={occupancy.group} 
                        onValueChange={(value) => updateSecondaryOccupancy(index, "group", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select occupancy" />
                        </SelectTrigger>
                        <SelectContent>
                          {occupancyGroups.map((group) => (
                            <SelectGroup key={group.group}>
                              <SelectLabel>{group.group}</SelectLabel>
                              {group.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`area-${index}`} className="mb-2 block">
                        Area (sq ft)
                      </Label>
                      <Input 
                        id={`area-${index}`}
                        value={occupancy.area} 
                        onChange={(e) => updateSecondaryOccupancy(index, "area", e.target.value)} 
                        placeholder="Area in sq ft"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`floor-${index}`} className="mb-2 block">
                        Floor Level
                      </Label>
                      <Input 
                        id={`floor-${index}`}
                        value={occupancy.floorLevel} 
                        onChange={(e) => updateSecondaryOccupancy(index, "floorLevel", e.target.value)}
                        placeholder="e.g., 1, 2, Basement"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => removeSecondaryOccupancy(index)}
                        disabled={formData.secondaryOccupancies.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  type="button" 
                  size="sm"
                  className="mt-2"
                  onClick={addSecondaryOccupancy}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Occupancy
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FormData } from "../types";

interface BuildingSystemsSectionProps {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

export const BuildingSystemsSection = ({ formData, updateFormData }: BuildingSystemsSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-gray-50 rounded-t-lg">
        <CardTitle>Building Systems & Features</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Sprinkler System */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sprinklerSystem" 
              checked={formData.sprinklerSystem}
              onCheckedChange={(checked) => 
                updateFormData("sprinklerSystem", checked === true)
              } 
            />
            <Label htmlFor="sprinklerSystem" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Automatic Sprinkler System
            </Label>
          </div>
          
          {/* Sprinkler Type (conditional) */}
          {formData.sprinklerSystem && (
            <div className="ml-6 mt-2 space-y-2">
              <Label>Sprinkler System Type</Label>
              <Select
                value={formData.sprinklerType}
                onValueChange={(value) => updateFormData("sprinklerType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sprinkler type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NFPA-13">NFPA 13 (Commercial)</SelectItem>
                  <SelectItem value="NFPA-13R">NFPA 13R (Residential)</SelectItem>
                  <SelectItem value="NFPA-13D">NFPA 13D (Single Family)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Other systems/features */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fireAlarm" 
              checked={formData.fireAlarm}
              onCheckedChange={(checked) => 
                updateFormData("fireAlarm", checked === true)
              } 
            />
            <Label htmlFor="fireAlarm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Fire Alarm System
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="standpipe" 
              checked={formData.standpipe}
              onCheckedChange={(checked) => 
                updateFormData("standpipe", checked === true)
              } 
            />
            <Label htmlFor="standpipe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Standpipe System
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="highRise" 
              checked={formData.highRise}
              onCheckedChange={(checked) => 
                updateFormData("highRise", checked === true)
              } 
            />
            <Label htmlFor="highRise" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              High-Rise Building (>75 feet)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="unlimitedArea" 
              checked={formData.unlimitedArea}
              onCheckedChange={(checked) => 
                updateFormData("unlimitedArea", checked === true)
              } 
            />
            <Label htmlFor="unlimitedArea" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Unlimited Area Building
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "../types";

interface BuildingDimensionsSectionProps {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string) => void;
}

export const BuildingDimensionsSection = ({ formData, updateFormData }: BuildingDimensionsSectionProps) => {
  return (
    <Card>
      <CardHeader className="bg-gray-50 rounded-t-lg">
        <CardTitle>Building Dimensions</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number of Stories */}
          <div className="space-y-2">
            <Label htmlFor="stories">Number of Stories</Label>
            <Input
              id="stories"
              type="number"
              placeholder="Enter number of stories"
              value={formData.stories}
              onChange={(e) => updateFormData("stories", e.target.value)}
              required
            />
          </div>
          
          {/* Building Height */}
          <div className="space-y-2">
            <Label htmlFor="height">Building Height (feet)</Label>
            <Input
              id="height"
              type="number"
              placeholder="Enter building height in feet"
              value={formData.height}
              onChange={(e) => updateFormData("height", e.target.value)}
              required
            />
          </div>
          
          {/* Ground Floor Area */}
          <div className="space-y-2">
            <Label htmlFor="groundFloorArea">Ground Floor Area (sq ft)</Label>
            <Input
              id="groundFloorArea"
              type="number"
              placeholder="Enter ground floor area"
              value={formData.groundFloorArea}
              onChange={(e) => updateFormData("groundFloorArea", e.target.value)}
              required
            />
          </div>
          
          {/* Total Building Area */}
          <div className="space-y-2">
            <Label htmlFor="totalBuildingArea">Total Building Area (sq ft)</Label>
            <Input
              id="totalBuildingArea"
              type="number"
              placeholder="Enter total building area"
              value={formData.totalBuildingArea}
              onChange={(e) => updateFormData("totalBuildingArea", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Total area includes all floors
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

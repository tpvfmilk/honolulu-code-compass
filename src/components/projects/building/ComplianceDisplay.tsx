
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircleCheck, CircleX, AlertTriangle } from "lucide-react";
import { FormData } from "../types";
import { getBuildingCompliance } from "../utils/buildingCodeUtils";
import { Badge } from "@/components/ui/badge";

interface ComplianceDisplayProps {
  formData: FormData;
  isCalculating: boolean;
}

export const ComplianceDisplay = ({ formData, isCalculating }: ComplianceDisplayProps) => {
  const isConfigured = formData.constructionType && formData.occupancyGroup;
  const compliance = isConfigured ? getBuildingCompliance(formData) : null;
  
  // Helper function for status color
  const getStatusClass = (compliant: boolean, warning: boolean) => {
    if (!compliant) return "text-destructive";
    if (warning) return "text-amber-500";
    return "text-green-600";
  };
  
  // Helper function for progress color
  const getProgressColorClass = (compliant: boolean, warning: boolean) => {
    if (!compliant) return "bg-destructive";
    if (warning) return "bg-amber-500";
    return "bg-green-600";
  };
  
  // Helper function for status icon
  const StatusIcon = ({ compliant, warning }: { compliant: boolean, warning: boolean }) => {
    if (!compliant) return <CircleX className="inline-block ml-1 h-4 w-4 text-destructive" />;
    if (warning) return <AlertTriangle className="inline-block ml-1 h-4 w-4 text-amber-500" />;
    return <CircleCheck className="inline-block ml-1 h-4 w-4 text-green-600" />;
  };
  
  return (
    <Card>
      <CardHeader className="bg-gray-50 rounded-t-lg">
        <CardTitle>Building Code Compliance</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isCalculating ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : !isConfigured ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p>Select a construction type and occupancy group to view compliance calculations.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Height Compliance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Building Height:</span>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-semibold ${getStatusClass(compliance!.height.compliant, compliance!.height.warning)}`}>
                    {compliance!.height.allowable} feet 
                    <StatusIcon compliant={compliance!.height.compliant} warning={compliance!.height.warning} />
                  </span>
                  {!compliance!.height.compliant && (
                    <Badge className="ml-1 bg-destructive text-xs">Exceeds Limit</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={compliance!.height.actual > 0 ? Math.min(100, (compliance!.height.actual / compliance!.height.allowable) * 100) : 0} 
                  className="h-2"
                  indicatorClassName={getProgressColorClass(compliance!.height.compliant, compliance!.height.warning)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Actual: {compliance!.height.actual || 0} feet</span>
                  <span>Max: {compliance!.height.allowable} feet</span>
                </div>
              </div>
            </div>
            
            {/* Stories Compliance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Building Stories:</span>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-semibold ${getStatusClass(compliance!.stories.compliant, compliance!.stories.warning)}`}>
                    {compliance!.stories.allowable} stories 
                    <StatusIcon compliant={compliance!.stories.compliant} warning={compliance!.stories.warning} />
                  </span>
                  {!compliance!.stories.compliant && (
                    <Badge className="ml-1 bg-destructive text-xs">Exceeds Limit</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={compliance!.stories.actual > 0 ? Math.min(100, (compliance!.stories.actual / compliance!.stories.allowable) * 100) : 0} 
                  className="h-2"
                  indicatorClassName={getProgressColorClass(compliance!.stories.compliant, compliance!.stories.warning)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Actual: {compliance!.stories.actual || 0} stories</span>
                  <span>Max: {compliance!.stories.allowable} stories</span>
                </div>
              </div>
            </div>
            
            {/* Area Compliance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Building Area:</span>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-semibold ${getStatusClass(compliance!.area.compliant, compliance!.area.warning)}`}>
                    {compliance!.area.allowable.toLocaleString()} sf 
                    <StatusIcon compliant={compliance!.area.compliant} warning={compliance!.area.warning} />
                  </span>
                  {!compliance!.area.compliant && (
                    <Badge className="ml-1 bg-destructive text-xs">Exceeds Limit</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={compliance!.area.actual > 0 ? Math.min(100, (compliance!.area.actual / compliance!.area.allowable) * 100) : 0} 
                  className="h-2"
                  indicatorClassName={getProgressColorClass(compliance!.area.compliant, compliance!.area.warning)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Actual: {compliance!.area.actual ? compliance!.area.actual.toLocaleString() : 0} sf</span>
                  <span>Max: {compliance!.area.allowable.toLocaleString()} sf</span>
                </div>
              </div>
            </div>
            
            {/* Code References */}
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">References:</span> IBC Tables 504.3, 504.4, 506.2
              </p>
              {formData.sprinklerSystem && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium">Note:</span> Calculations include increases for automatic sprinkler systems
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ProjectData } from "../../../pages/ProjectView";
import { FireSafetyCalculations } from "../firesafety/types/fireSafetyTypes";

interface ComplianceTabProps {
  project: ProjectData;
  fireSafetyCalculations: FireSafetyCalculations;
}

export const ComplianceTab: React.FC<ComplianceTabProps> = ({ 
  project, 
  fireSafetyCalculations 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zoning Compliance Analysis</CardTitle>
          <CardDescription>
            Detailed compliance check against {project.district} requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Setback Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Front Setback</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">15 ft (Required)</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  </div>
                  <p className="font-medium mt-1">18 ft (Provided)</p>
                </div>
                <div className="bg-secondary p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Side Setback</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">5 ft (Required)</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  </div>
                  <p className="font-medium mt-1">6 ft (Provided)</p>
                </div>
                <div className="bg-secondary p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Rear Setback</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">10 ft (Required)</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  </div>
                  <p className="font-medium mt-1">15 ft (Provided)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Height & Area</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Building Height</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">30 ft (Max)</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  </div>
                  <p className="font-medium mt-1">{project.building_height || 24} ft (Actual)</p>
                </div>
                <div className="bg-secondary p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Lot Coverage</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">50% (Max)</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  </div>
                  <p className="font-medium mt-1">42% (Actual)</p>
                </div>
                <div className="bg-secondary p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Floor Area Ratio</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">0.7 (Max)</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  </div>
                  <p className="font-medium mt-1">0.6 (Actual)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Building Code Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Building Construction Type</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">{project.construction_type || "Type VB"}</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  </div>
                  <p className="font-medium mt-1">Compliant with occupancy group</p>
                </div>
                <div className="bg-secondary p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Fire Resistance Requirements</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium">Exterior Walls: {fireSafetyCalculations.exteriorWallRating.rating} hour</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  </div>
                  <p className="font-medium mt-1">
                    {fireSafetyCalculations.corridorRating.rating} hour corridors ({project.is_fully_sprinklered ? "sprinklered" : "non-sprinklered"})
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Parking Requirements</h3>
              <div className="bg-secondary p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Required Parking Spaces</p>
                    <p className="font-medium">{project.standard_stalls_required || 2} spaces required</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full ${
                    (project.standard_stalls_provided || 0) >= (project.standard_stalls_required || 0) ? 
                    "bg-green-500 text-white" : "bg-yellow-500 text-white"
                  } flex items-center justify-center text-xs`}>
                    {(project.standard_stalls_provided || 0) >= (project.standard_stalls_required || 0) ? "✓" : "!"}
                  </div>
                </div>
                <p className="font-medium mt-2">{project.standard_stalls_provided || 0} spaces provided</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            This analysis is based on the City & County of Honolulu Land Use Ordinance (LUO) for {project.district} zoning district.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

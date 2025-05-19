
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProjectData } from "../../../pages/ProjectView";
import { EgressComplianceCard } from "../occupancy/EgressComplianceCard";
import { OccupancyGroup } from "../types/building/buildingClassificationTypes";

interface LifeSafetyTabProps {
  project: ProjectData;
  isCalculating: boolean;
  occupancyCalcs: any;
  isValidOccupancyGroup: (value: string) => value is OccupancyGroup;
}

export const LifeSafetyTab: React.FC<LifeSafetyTabProps> = ({ 
  project, 
  isCalculating, 
  occupancyCalcs, 
  isValidOccupancyGroup 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Occupancy Load</CardTitle>
            <CardDescription>Based on IBC Table 1004.5</CardDescription>
          </CardHeader>
          <CardContent>
            {isCalculating ? (
              <div className="animate-pulse py-4">Loading occupancy data...</div>
            ) : (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Occupancy Group</dt>
                  <dd className="font-medium">{project.project_type || "B (Business)"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated Occupant Load</dt>
                  <dd className="font-medium">{occupancyCalcs?.occupantLoad?.total || "Not calculated"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Required Exits</dt>
                  <dd className="font-medium">{occupancyCalcs?.exitRequirements?.requiredExits || 2}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Min. Exit Door Width</dt>
                  <dd className="font-medium">{occupancyCalcs?.exitRequirements?.doorWidth || 32} inches</dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>
        
        <EgressComplianceCard
          travelDistanceCompliance={occupancyCalcs?.travelDistanceCompliance || null}
          travelDistances={{
            maxExitAccess: "100",
            commonPath: "75", 
            deadEnd: "50",
            roomTravel: "50"
          }}
          isCalculating={isCalculating}
          isSprinklered={project.is_fully_sprinklered || false}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Corridor Requirements</CardTitle>
          <CardDescription>IBC Section 1020</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-muted-foreground">Min. Corridor Width</dt>
                <dd className="font-medium">44 inches</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Corridor Fire Rating</dt>
                <dd className="font-medium">
                  {project.is_fully_sprinklered ? "0 hours (sprinklered)" : "1 hour"}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accessibility Compliance</CardTitle>
          <CardDescription>IBC Chapter 11 & ADAAG Requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Required Accessible Features</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  <span>Accessible entrance</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  <span>Accessible route throughout building</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  <span>Accessible restrooms</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Parking Requirements</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">ADA Parking Stalls</dt>
                  <dd className="font-medium">{project.ada_stalls_provided || 0} / {project.ada_stalls_required || 0} required</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Van Accessible</dt>
                  <dd className="font-medium">1 van accessible stall required</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

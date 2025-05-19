
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { ProjectData } from "../../../pages/ProjectView";

interface SummaryTabProps {
  project: ProjectData;
  statusColors: Record<string, string>;
  statusText: Record<string, string>;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ 
  project, 
  statusColors, 
  statusText 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Project Name</dt>
                <dd className="font-medium">{project.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">TMK</dt>
                <dd className="font-medium">{project.tmk}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <span className={`text-xs py-1 px-2 rounded-full ${statusColors[project.status]}`}>
                    {statusText[project.status]}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last Updated</dt>
                <dd className="font-medium">{project.lastUpdated.toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Project Type</dt>
                <dd className="font-medium">{project.project_type || "Not specified"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Building Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Construction Type</dt>
                <dd className="font-medium">{project.construction_type || "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Occupancy Group</dt>
                <dd className="font-medium">{project.project_type || "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Sprinkler System</dt>
                <dd className="font-medium">{project.is_fully_sprinklered ? "Yes" : "No"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Building Stories</dt>
                <dd className="font-medium">{project.stories || "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Building Height</dt>
                <dd className="font-medium">{project.building_height ? `${project.building_height} ft` : "Not specified"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Zoning Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Zoning District</dt>
                <dd className="font-medium">{project.district}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Lot Area</dt>
                <dd className="font-medium">{project.lot_area_sqft ? `${project.lot_area_sqft.toLocaleString()} sq ft` : "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Existing Use</dt>
                <dd className="font-medium">{project.existing_use || "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Proposed Use</dt>
                <dd className="font-medium">{project.proposed_use || "Not specified"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Parking Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Standard Stalls</p>
                <p className="font-medium">
                  {project.standard_stalls_provided || 0} / {project.standard_stalls_required || 0} required
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ADA Stalls</p>
                <p className="font-medium">
                  {project.ada_stalls_provided || 0} / {project.ada_stalls_required || 0} required
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Loading Spaces</p>
                <p className="font-medium">
                  {project.loading_spaces_provided || 0} / {project.loading_spaces_required || 0} required
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Generated Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-secondary rounded-md">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{project.name} - Code Information Sheet</p>
                  <p className="text-xs text-muted-foreground">Generated on 5/10/2023</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-primary">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

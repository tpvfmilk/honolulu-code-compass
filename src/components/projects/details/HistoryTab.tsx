
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProjectData } from "../../../pages/ProjectView";

interface HistoryTabProps {
  project: ProjectData;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project History</CardTitle>
          <CardDescription>
            A record of changes made to this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4 py-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Project created</p>
                  <p className="text-sm text-muted-foreground">
                    Initial project setup with basic information
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">John Architect</p>
                  <p className="text-xs text-muted-foreground">{project.lastUpdated.toLocaleDateString()}, 10:23 AM</p>
                </div>
              </div>
            </div>
            <div className="border-l-2 border-muted pl-4 py-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Zoning information updated</p>
                  <p className="text-sm text-muted-foreground">
                    Added setback details and lot coverage calculations
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">John Architect</p>
                  <p className="text-xs text-muted-foreground">{project.lastUpdated.toLocaleDateString()}, 1:45 PM</p>
                </div>
              </div>
            </div>
            <div className="border-l-2 border-muted pl-4 py-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Code sheet generated</p>
                  <p className="text-sm text-muted-foreground">
                    First version of the code information sheet created
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">John Architect</p>
                  <p className="text-xs text-muted-foreground">{project.lastUpdated.toLocaleDateString()}, 2:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React from "react";
import { SummaryTab } from "./SummaryTab";
import { LifeSafetyTab } from "./LifeSafetyTab";
import { ComplianceTab } from "./ComplianceTab";
import { HistoryTab } from "./HistoryTab";
import { TabContentProps } from "./types";
import { getStatusConfig } from "./StatusIndicator";
import { OccupancyGroup } from "../types/building/buildingClassificationTypes";

interface TabsContentProps extends TabContentProps {
  activeTab: string;
}

export const TabContent: React.FC<TabsContentProps> = ({
  project,
  fireSafetyCalculations,
  occupancyCalcs,
  isCalculating,
  activeTab
}) => {
  const { statusColors, statusText } = getStatusConfig();

  // Helper function to validate occupancy group
  const isValidOccupancyGroup = (value: string): value is OccupancyGroup => {
    const validGroups: string[] = [
      "A-1", "A-2", "A-3", "A-4", "A-5", 
      "B", 
      "E", 
      "F-1", "F-2", 
      "H-1", "H-2", "H-3", "H-4", "H-5", 
      "I-1", "I-2", "I-3", "I-4", 
      "M", 
      "R-1", "R-2", "R-3", "R-4", 
      "S-1", "S-2", 
      "U"
    ];
    return validGroups.includes(value);
  };

  switch (activeTab) {
    case "summary":
      return <SummaryTab project={project} statusColors={statusColors} statusText={statusText} />;
    case "lifesafety":
      return <LifeSafetyTab 
              project={project} 
              isCalculating={isCalculating} 
              occupancyCalcs={occupancyCalcs} 
              isValidOccupancyGroup={isValidOccupancyGroup} 
            />;
    case "compliance":
      return <ComplianceTab project={project} fireSafetyCalculations={fireSafetyCalculations} />;
    case "history":
      return <HistoryTab project={project} />;
    default:
      return <div>Select a tab</div>;
  }
};


import { FireSafetyCalculations } from "../firesafety/types/fireSafetyTypes";
import { ProjectData } from "../../../pages/ProjectView";
import { OccupancyGroup } from "../types/building/buildingClassificationTypes";

export interface ProjectDetailTabProps {
  project: ProjectData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface OccupancyCalculations {
  occupantLoad?: {
    total: number;
    byFloor?: Record<string, number>;
  };
  exitRequirements?: {
    requiredExits: number;
    doorWidth: number;
  };
  travelDistanceCompliance?: any;
}

export interface TabContentProps {
  project: ProjectData;
  fireSafetyCalculations: FireSafetyCalculations;
  occupancyCalcs: OccupancyCalculations;
  isCalculating: boolean;
}

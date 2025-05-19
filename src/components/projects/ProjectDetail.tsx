
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileText, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFireSafetyCalculations } from "./firesafety/useFireSafetyCalculations";
import { useOccupancyCalculations } from "./occupancy/hooks/useOccupancyCalculations";
import { ProjectData } from "../../pages/ProjectView";
import { OccupancyGroup } from "./types/building/buildingClassificationTypes";
import { TabContent } from "./details/TabContent";

type ProjectDetailProps = {
  project: ProjectData;
};

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  
  // Validate occupancyGroup
  const isValidOccupancyGroup = (value: string | undefined): value is OccupancyGroup => {
    if (!value) return false;
    
    const validGroups: string[] = [
      "A-1", "A-2", "A-3", "A-4", "A-5", 
      "B", "E", "F-1", "F-2", 
      "H-1", "H-2", "H-3", "H-4", "H-5", 
      "I-1", "I-2", "I-3", "I-4", "M", 
      "R-1", "R-2", "R-3", "R-4", 
      "S-1", "S-2", "U"
    ];
    return validGroups.includes(value);
  };

  const projectType = project?.project_type || "";
  const occupancyGroup = isValidOccupancyGroup(projectType) ? projectType : "" as OccupancyGroup | "";
  
  // Get fire safety calculations using the validated occupancyGroup
  const fireSafetyCalculations = useFireSafetyCalculations({
    occupancyGroup,
    sprinklerSystem: project?.is_fully_sprinklered || false,
    highRise: project?.building_height ? project.building_height > 75 : false,
    stories: project?.stories?.toString() || "1",
    fireSafety: { 
      separationDistance: "5", // Default value
      hasMixedOccupancy: false,
      occupancySeparationType: 'non-separated',
      secondaryOccupancies: [],
      fireAlarmRequired: false,
      fireAlarmType: "",
      standpipeRequired: false,
      emergencyPower: false
    }
  });

  // Get occupancy calculations with default values
  const { calculations: occupancyCalcs, isCalculating } = useOccupancyCalculations({
    occupancyDetails: {
      spaces: [],
      travelDistances: {
        maxExitAccess: "100",
        commonPath: "75",
        deadEnd: "50",
        roomTravel: "50"
      },
      numberOfEmployees: "10",
      isPublicAccommodation: true,
      elevatorProvided: false,
      totalParkingSpaces: project?.standard_stalls_provided?.toString() || "0"
    },
    occupancyGroup,
    sprinklerSystem: project?.is_fully_sprinklered || false,
    stories: project?.stories?.toString() || "1",
    totalBuildingArea: project?.total_building_area?.toString() || "0"
  });

  const handleGeneratePDF = () => {
    toast({
      title: "PDF Generated",
      description: "Your code information sheet has been generated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={handleGeneratePDF}
          className="hawaii-gradient flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          <span>Generate Code Sheet</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="summary">Project Summary</TabsTrigger>
          <TabsTrigger value="lifesafety">Life Safety</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <TabContent 
            project={project}
            activeTab={activeTab}
            fireSafetyCalculations={fireSafetyCalculations}
            occupancyCalcs={occupancyCalcs}
            isCalculating={isCalculating}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

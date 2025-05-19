
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Download, FileText, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EgressComplianceCard } from "./occupancy/EgressComplianceCard";
import { useFireSafetyCalculations } from "./firesafety/useFireSafetyCalculations";
import { useOccupancyCalculations } from "./occupancy/hooks/useOccupancyCalculations";
import { ProjectData } from "../../pages/ProjectView";
import { OccupancyGroup } from "./types/building/buildingClassificationTypes";

type ProjectDetailProps = {
  project: ProjectData;
};

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  
  // Properly cast the project_type to OccupancyGroup or use empty string if not valid
  const projectType = project.project_type || "";
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

  const occupancyGroup = isValidOccupancyGroup(projectType) ? projectType : "" as OccupancyGroup | "";
  
  // Get fire safety calculations using the validated occupancyGroup
  const fireSafetyCalculations = useFireSafetyCalculations({
    occupancyGroup,
    fireSafety: {
      separationDistance: "10",
      hasMixedOccupancy: false,
      occupancySeparationType: "",
      secondaryOccupancies: [],
      fireAlarmRequired: false,
      fireAlarmType: "",
      standpipeRequired: false,
      emergencyPower: false
    },
    sprinklerSystem: project.is_fully_sprinklered || false,
    stories: project.stories?.toString() || "1"
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
      totalParkingSpaces: project.standard_stalls_provided?.toString() || "0"
    },
    occupancyGroup,
    sprinklerSystem: project.is_fully_sprinklered || false,
    stories: project.stories?.toString() || "1",
    totalBuildingArea: project.total_building_area?.toString() || "0"
  });

  const handleGeneratePDF = () => {
    toast({
      title: "PDF Generated",
      description: "Your code information sheet has been generated",
    });
  };

  // Calculated properties based on project data
  const setbacks = {
    front: "15 feet",
    side: "5 feet",
    rear: "10 feet",
  };

  const maxHeight = "30 feet";
  const maxStories = "2 stories";
  const maxLotCoverage = "50%";

  const statusColors = {
    "draft": "bg-gray-200 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "completed": "bg-green-100 text-green-800",
    "needs-revision": "bg-amber-100 text-amber-800",
  };
  
  const statusText = {
    "draft": "Draft",
    "in-progress": "In Progress",
    "completed": "Completed",
    "needs-revision": "Needs Revision",
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
        
        <TabsContent value="summary" className="space-y-6">
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
        </TabsContent>

        {/* New Life Safety Tab */}
        <TabsContent value="lifesafety" className="space-y-6">
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
            
            {/* Egress Compliance Card */}
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
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

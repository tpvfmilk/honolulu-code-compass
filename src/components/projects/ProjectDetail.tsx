
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Project } from "../dashboard/ProjectCard";
import { Download, FileText, History, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ProjectDetailProps = {
  project: Project;
};

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  const handleGeneratePDF = () => {
    toast({
      title: "PDF Generated",
      description: "Your code information sheet has been generated",
    });
  };

  const handleEditProject = () => {
    navigate(`/project/edit/${project.id}`);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">TMK: {project.tmk}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleEditProject}
          >
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button 
            onClick={handleGeneratePDF}
            className="hawaii-gradient flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Code Sheet</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="summary">Project Summary</TabsTrigger>
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
                    <dt className="text-muted-foreground">Created By</dt>
                    <dd className="font-medium">John Architect</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

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
                    <dd className="font-medium">7,500 sq ft</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Building Type</dt>
                    <dd className="font-medium">Single-Family Dwelling</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Stories</dt>
                    <dd className="font-medium">2</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Building Height</dt>
                    <dd className="font-medium">24 feet</dd>
                  </div>
                </dl>
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
                <div className="flex justify-between items-center p-3 bg-secondary rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{project.name} - Calculation Worksheet</p>
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
                      <p className="font-medium mt-1">24 ft (Actual)</p>
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
                  <h3 className="font-semibold text-lg mb-3">Parking Requirements</h3>
                  <div className="bg-secondary p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Required Parking Spaces</p>
                        <p className="font-medium">2 spaces (1 space per dwelling unit + 1 guest)</p>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                    </div>
                    <p className="font-medium mt-2">3 spaces provided (2-car garage + 1 driveway)</p>
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

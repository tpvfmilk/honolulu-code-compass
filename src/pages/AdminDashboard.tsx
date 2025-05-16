
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Upload, Download, Database, Users, FileText, Settings, Search, Edit, Trash, ArrowUp, ArrowDown, InfoCircle } from "lucide-react";
import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface ZoningDistrict {
  id: string;
  code: string;
  name: string;
  maxHeight: number;
  maxStories: number;
  setbacks: {
    front: number;
    side: number;
    rear: number;
  };
}

interface HeightAreaLimitRecord {
  id: string;
  constructionType: string;
  occupancyGroup: string;
  maxHeight: number;
  maxStories: number;
  maxAreaPerFloor: number;
  sprinklerHeightBonus: number;
  sprinklerStoryBonus: number;
  sprinklerAreaMultiplier: number;
  ibcTableReference: string;
  notes: string;
}

interface FireRatingRecord {
  id: string;
  constructionType: string;
  structuralFrame: number;
  bearingWallsExterior: number;
  bearingWallsInterior: number;
  nonbearingPartitions: number;
  floorConstruction: number;
  roofConstruction: number;
  ibcTableReference: string;
}

interface LoadFactorRecord {
  id: string;
  occupancyGroup: string;
  spaceType: string;
  loadFactor: number;
  description: string;
  ibcTableReference: string;
}

// Sample height area data
const MOCK_HEIGHT_AREA_DATA: HeightAreaLimitRecord[] = [
  {
    id: "1",
    constructionType: "V-B",
    occupancyGroup: "A-1",
    maxHeight: 40,
    maxStories: 1,
    maxAreaPerFloor: 11500,
    sprinklerHeightBonus: 20,
    sprinklerStoryBonus: 1,
    sprinklerAreaMultiplier: 2.0,
    ibcTableReference: "Table 504.3",
    notes: "Assembly fixed seating"
  },
  {
    id: "2",
    constructionType: "V-B",
    occupancyGroup: "B",
    maxHeight: 40,
    maxStories: 2,
    maxAreaPerFloor: 19000,
    sprinklerHeightBonus: 20,
    sprinklerStoryBonus: 1,
    sprinklerAreaMultiplier: 2.0,
    ibcTableReference: "Table 504.3",
    notes: "Business occupancy"
  },
  {
    id: "3",
    constructionType: "III-B",
    occupancyGroup: "R-2",
    maxHeight: 55,
    maxStories: 3,
    maxAreaPerFloor: 16000,
    sprinklerHeightBonus: 20,
    sprinklerStoryBonus: 1,
    sprinklerAreaMultiplier: 3.0,
    ibcTableReference: "Table 504.4",
    notes: "Multi-family residential"
  },
];

// Sample fire rating data
const MOCK_FIRE_RATING_DATA: FireRatingRecord[] = [
  {
    id: "1",
    constructionType: "I-A",
    structuralFrame: 3,
    bearingWallsExterior: 3,
    bearingWallsInterior: 3,
    nonbearingPartitions: 0,
    floorConstruction: 2,
    roofConstruction: 1.5,
    ibcTableReference: "Table 601",
  },
  {
    id: "2",
    constructionType: "II-B",
    structuralFrame: 0,
    bearingWallsExterior: 0,
    bearingWallsInterior: 0,
    nonbearingPartitions: 0,
    floorConstruction: 0,
    roofConstruction: 0,
    ibcTableReference: "Table 601",
  },
];

// Sample load factor data
const MOCK_LOAD_FACTOR_DATA: LoadFactorRecord[] = [
  {
    id: "1",
    occupancyGroup: "A-1",
    spaceType: "Fixed seating",
    loadFactor: 0,
    description: "Number of fixed seats",
    ibcTableReference: "Table 1004.5",
  },
  {
    id: "2",
    occupancyGroup: "B",
    spaceType: "Office space",
    loadFactor: 150,
    description: "Sq ft per occupant",
    ibcTableReference: "Table 1004.5",
  },
];

const MOCK_ZONING_DISTRICTS: ZoningDistrict[] = [
  {
    id: "1",
    code: "R-3.5",
    name: "Residential",
    maxHeight: 25,
    maxStories: 2,
    setbacks: { front: 10, side: 5, rear: 5 }
  },
  {
    id: "2",
    code: "R-5",
    name: "Residential",
    maxHeight: 25,
    maxStories: 2,
    setbacks: { front: 10, side: 5, rear: 5 }
  },
  {
    id: "3",
    code: "R-7.5",
    name: "Residential",
    maxHeight: 25,
    maxStories: 2,
    setbacks: { front: 10, side: 5, rear: 5 }
  },
  {
    id: "4",
    code: "R-10",
    name: "Residential",
    maxHeight: 25,
    maxStories: 2,
    setbacks: { front: 10, side: 5, rear: 10 }
  },
  {
    id: "5",
    code: "AMX-2",
    name: "Apartment Mixed Use",
    maxHeight: 60,
    maxStories: 4,
    setbacks: { front: 10, side: 10, rear: 10 }
  },
];

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("height-area");
  const isMobile = useMobile();
  
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // For CSV upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Filter data based on search query
  const filteredHeightAreaData = MOCK_HEIGHT_AREA_DATA.filter(record => 
    record.constructionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.occupancyGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFireRatingData = MOCK_FIRE_RATING_DATA.filter(record => 
    record.constructionType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredLoadFactorData = MOCK_LOAD_FACTOR_DATA.filter(record => 
    record.occupancyGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.spaceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredZoningDistricts = MOCK_ZONING_DISTRICTS.filter(district => 
    district.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success("CSV data uploaded successfully!");
        }
      }, 300);
    }
  };
  
  const handleDownloadTemplate = (tableType: string) => {
    toast.success(`${tableType} template downloaded.`);
  };

  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Code Data Management</h1>
          <p className="text-muted-foreground">Manage IBC tables, building codes, and calculation parameters</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="height-area">Height & Area</TabsTrigger>
            <TabsTrigger value="fire-ratings">Fire Ratings</TabsTrigger>
            <TabsTrigger value="load-factors">Load Factors</TabsTrigger>
            <TabsTrigger value="occupancy-separations">Separations</TabsTrigger>
            <TabsTrigger value="travel-distances">Travel Distances</TabsTrigger>
          </TabsList>
          
          {/* Height & Area Table */}
          <TabsContent value="height-area" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="space-y-1.5 flex-1">
                  <CardTitle>Height & Area Limits</CardTitle>
                  <CardDescription>
                    Manage maximum heights, stories, and areas by construction type and occupancy
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownloadTemplate("Height & Area")}>
                    <Download className="h-4 w-4 mr-2" /> Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    <label htmlFor="height-area-csv" className="cursor-pointer">Upload CSV</label>
                    <input 
                      id="height-area-csv" 
                      type="file" 
                      accept=".csv" 
                      className="hidden"
                      onChange={handleFileUpload} 
                    />
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {isUploading && (
                  <div className="mb-4">
                    <p className="text-sm mb-2">Uploading CSV file...</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Construction</TableHead>
                        <TableHead>Occupancy</TableHead>
                        <TableHead>Max Height (ft)</TableHead>
                        <TableHead>Max Stories</TableHead>
                        <TableHead>Max Area (sq ft)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHeightAreaData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No records found. Try a different search or add a new record.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredHeightAreaData.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.constructionType}</TableCell>
                            <TableCell>{record.occupancyGroup}</TableCell>
                            <TableCell>{record.maxHeight}</TableCell>
                            <TableCell>{record.maxStories}</TableCell>
                            <TableCell>{record.maxAreaPerFloor.toLocaleString()}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredHeightAreaData.length} of {MOCK_HEIGHT_AREA_DATA.length} records
                  </p>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Fire Ratings Table */}
          <TabsContent value="fire-ratings" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="space-y-1.5 flex-1">
                  <CardTitle>Fire Ratings</CardTitle>
                  <CardDescription>
                    Fire resistance ratings for building elements by construction type (IBC Table 601)
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownloadTemplate("Fire Ratings")}>
                    <Download className="h-4 w-4 mr-2" /> Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" /> Upload CSV
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Construction Type</TableHead>
                        <TableHead>Structural Frame</TableHead>
                        <TableHead>Bearing Walls (Ext)</TableHead>
                        <TableHead>Bearing Walls (Int)</TableHead>
                        <TableHead>Floor Construction</TableHead>
                        <TableHead>Roof Construction</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFireRatingData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.constructionType}</TableCell>
                          <TableCell>{record.structuralFrame} hr</TableCell>
                          <TableCell>{record.bearingWallsExterior} hr</TableCell>
                          <TableCell>{record.bearingWallsInterior} hr</TableCell>
                          <TableCell>{record.floorConstruction} hr</TableCell>
                          <TableCell>{record.roofConstruction} hr</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredFireRatingData.length} of {MOCK_FIRE_RATING_DATA.length} records
                  </p>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Load Factors Table */}
          <TabsContent value="load-factors" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="space-y-1.5 flex-1">
                  <CardTitle>Load Factors</CardTitle>
                  <CardDescription>
                    Occupant load factors for different space types (IBC Table 1004.5)
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownloadTemplate("Load Factors")}>
                    <Download className="h-4 w-4 mr-2" /> Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" /> Upload CSV
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Occupancy</TableHead>
                        <TableHead>Space Type</TableHead>
                        <TableHead>Load Factor</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLoadFactorData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.occupancyGroup}</TableCell>
                          <TableCell>{record.spaceType}</TableCell>
                          <TableCell>{record.loadFactor}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredLoadFactorData.length} of {MOCK_LOAD_FACTOR_DATA.length} records
                  </p>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Occupancy Separations Tab */}
          <TabsContent value="occupancy-separations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Required Separation of Occupancies</CardTitle>
                <CardDescription>
                  Required separations between different occupancy groups (IBC Table 508.4)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Occupancy separation data management will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Travel Distances Tab */}
          <TabsContent value="travel-distances" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Egress Travel Distances</CardTitle>
                <CardDescription>
                  Maximum travel distances by occupancy and conditions (IBC Table 1017.2)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Travel distance data management will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Zoning Districts Tab (Kept from original) */}
          <TabsContent value="zoning" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="space-y-1.5 flex-1">
                  <CardTitle>Zoning Districts</CardTitle>
                  <CardDescription>
                    Manage all zoning districts and their requirements
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add District
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search districts..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2 pl-4 font-medium">Code</th>
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Max Height</th>
                        <th className="text-left p-2 font-medium">Max Stories</th>
                        <th className="text-left p-2 font-medium">Setbacks</th>
                        <th className="text-right p-2 pr-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredZoningDistricts.map((district) => (
                        <tr key={district.id} className="border-b last:border-0">
                          <td className="p-2 pl-4 font-medium">{district.code}</td>
                          <td className="p-2">{district.name}</td>
                          <td className="p-2">{district.maxHeight}′</td>
                          <td className="p-2">{district.maxStories}</td>
                          <td className="p-2">
                            F: {district.setbacks.front}′, 
                            S: {district.setbacks.side}′, 
                            R: {district.setbacks.rear}′
                          </td>
                          <td className="text-right p-2 pr-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

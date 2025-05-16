
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { useState } from "react";

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

  const filteredDistricts = MOCK_ZONING_DISTRICTS.filter(district => 
    district.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage zoning districts, building codes, and system settings</p>
        </div>

        <Tabs defaultValue="zoning" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="zoning">Zoning Districts</TabsTrigger>
            <TabsTrigger value="codes">Building Codes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

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
                      {filteredDistricts.map((district) => (
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

            <Card>
              <CardHeader>
                <CardTitle>Requirements Settings</CardTitle>
                <CardDescription>
                  Configure how code requirements are calculated and displayed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Additional settings for zoning requirements will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Building Codes</CardTitle>
                <CardDescription>
                  Manage building code references and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Building code management interface will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage system users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  User management interface will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

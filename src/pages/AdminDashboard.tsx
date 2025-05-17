
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { HeightAreaTable } from "@/components/admin/tables/HeightAreaTable";
import { FireRatingsTable } from "@/components/admin/tables/FireRatingsTable";
import { LoadFactorsTable } from "@/components/admin/tables/LoadFactorsTable";
import { ZoningDistrictsTable } from "@/components/admin/tables/ZoningDistrictsTable";
import { PlaceholderTable } from "@/components/admin/tables/PlaceholderTable";
import { TravelDistancesTable } from "@/components/admin/tables/TravelDistancesTable";
import { OccupancySeparationsTable } from "@/components/admin/tables/OccupancySeparationsTable";

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("height-area");
  
  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Code Data Management</h1>
          <p className="text-muted-foreground">Manage IBC tables, building codes, and calculation parameters</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="height-area">Height & Area</TabsTrigger>
            <TabsTrigger value="fire-ratings">Fire Ratings</TabsTrigger>
            <TabsTrigger value="load-factors">Load Factors</TabsTrigger>
            <TabsTrigger value="occupancy-separations">Separations</TabsTrigger>
            <TabsTrigger value="travel-distances">Travel Distances</TabsTrigger>
            <TabsTrigger value="zoning">Zoning Districts</TabsTrigger>
          </TabsList>
          
          {/* Height & Area Table */}
          <TabsContent value="height-area" className="space-y-4">
            <HeightAreaTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>
          
          {/* Fire Ratings Table */}
          <TabsContent value="fire-ratings" className="space-y-4">
            <FireRatingsTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>
          
          {/* Load Factors Table */}
          <TabsContent value="load-factors" className="space-y-4">
            <LoadFactorsTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>
          
          {/* Occupancy Separations Tab */}
          <TabsContent value="occupancy-separations" className="space-y-4">
            <OccupancySeparationsTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>
          
          {/* Travel Distances Tab */}
          <TabsContent value="travel-distances" className="space-y-4">
            <TravelDistancesTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>
          
          {/* Zoning Districts Tab */}
          <TabsContent value="zoning" className="space-y-4">
            <ZoningDistrictsTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

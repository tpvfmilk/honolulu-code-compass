
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
import { Plus, Upload, Download, Database, Users, FileText, Settings, Search, Edit, Trash, ArrowUp, ArrowDown, Info } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { HeightAreaTable } from "@/components/admin/tables/HeightAreaTable";
import { FireRatingsTable } from "@/components/admin/tables/FireRatingsTable";
import { LoadFactorsTable } from "@/components/admin/tables/LoadFactorsTable";
import { ZoningDistrictsTable } from "@/components/admin/tables/ZoningDistrictsTable";
import { PlaceholderTable } from "@/components/admin/tables/PlaceholderTable";

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("height-area");
  const isMobile = useIsMobile();
  
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
            <PlaceholderTable 
              title="Required Separation of Occupancies" 
              description="Required separations between different occupancy groups (IBC Table 508.4)" 
            />
          </TabsContent>
          
          {/* Travel Distances Tab */}
          <TabsContent value="travel-distances" className="space-y-4">
            <PlaceholderTable 
              title="Egress Travel Distances" 
              description="Maximum travel distances by occupancy and conditions (IBC Table 1017.2)" 
            />
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

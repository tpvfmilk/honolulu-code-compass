
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, FileText, Ruler, Database, Table as TableIcon, Map, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TableStats } from "../types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ComplianceAdminDashboard = () => {
  const [stats, setStats] = useState<TableStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch actual table record counts from database
        const tables = [
          { name: "construction_types", label: "Construction Types", icon: <Building className="h-8 w-8 text-blue-600" /> },
          { name: "occupancy_groups", label: "Occupancy Groups", icon: <Users className="h-8 w-8 text-green-600" /> },
          { name: "height_area_limits", label: "Height & Area Limits", icon: <Ruler className="h-8 w-8 text-purple-600" /> },
          { name: "fire_separation_requirements", label: "Fire Ratings", icon: <FileText className="h-8 w-8 text-amber-600" /> },
          { name: "space_types", label: "Space Types", icon: <TableIcon className="h-8 w-8 text-indigo-600" /> },
          { name: "zoning_districts", label: "Zoning Districts", icon: <Map className="h-8 w-8 text-emerald-600" /> },
          { name: "parking_requirements", label: "Parking Requirements", icon: <Car className="h-8 w-8 text-rose-600" /> },
        ];
        
        const statsPromises = tables.map(async (table) => {
          // Use the table name with a type assertion
          const { count, error } = await supabase
            .from(table.name as any)
            .select('*', { count: 'exact', head: true });
          
          // Get the most recent updated record, handling possible null/undefined properly
          let lastUpdated = '';
          try {
            const { data: mostRecent, error: recentError } = await supabase
              .from(table.name as any)
              .select('updated_at')
              .order('updated_at', { ascending: false })
              .limit(1);
              
            if (mostRecent && mostRecent.length > 0 && 'updated_at' in mostRecent[0]) {
              lastUpdated = mostRecent[0].updated_at || '';
            }
          } catch (e) {
            console.error(`Error fetching last updated date for ${table.name}:`, e);
          }

          return {
            table_name: table.label,
            record_count: count || 0,
            last_updated: lastUpdated,
            icon: table.icon
          };
        });
        
        const tableStats = await Promise.all(statsPromises);
        setStats(tableStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
        
        // Fallback to mock data if there's an error
        const mockStats: TableStats[] = [
          { table_name: "Construction Types", record_count: 12, last_updated: "2023-05-20", icon: <Building className="h-8 w-8 text-blue-600" /> },
          { table_name: "Occupancy Groups", record_count: 25, last_updated: "2023-05-18", icon: <Users className="h-8 w-8 text-green-600" /> },
          { table_name: "Height & Area Limits", record_count: 45, last_updated: "2023-05-15", icon: <Ruler className="h-8 w-8 text-purple-600" /> },
          { table_name: "Fire Ratings", record_count: 30, last_updated: "2023-05-19", icon: <FileText className="h-8 w-8 text-amber-600" /> },
          { table_name: "Space Types", record_count: 28, last_updated: "2023-05-17", icon: <TableIcon className="h-8 w-8 text-indigo-600" /> },
          { table_name: "Zoning Districts", record_count: 15, last_updated: "2023-05-16", icon: <Map className="h-8 w-8 text-emerald-600" /> },
          { table_name: "Parking Requirements", record_count: 20, last_updated: "2023-05-21", icon: <Car className="h-8 w-8 text-rose-600" /> },
        ];
        
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Data Dashboard</h1>
        <p className="text-muted-foreground">
          Manage building code compliance data and regulations
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Data Tables</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-muted/20"></CardHeader>
                  <CardContent>
                    <div className="h-4 w-24 bg-muted/40 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-muted/30 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.table_name} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">{stat.table_name}</CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stat.record_count}</p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(stat.last_updated).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tables" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Button asChild variant="outline" className="h-32 flex flex-col items-center justify-center hover:bg-blue-50">
              <Link to="/compliance-admin/construction-types">
                <Building className="h-10 w-10 mb-2 text-blue-600" />
                <span className="font-medium">Construction Types</span>
                <span className="text-xs text-muted-foreground mt-1">Type I-A through V-B</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-32 flex flex-col items-center justify-center hover:bg-green-50">
              <Link to="/compliance-admin/occupancy-groups">
                <Users className="h-10 w-10 mb-2 text-green-600" />
                <span className="font-medium">Occupancy Groups</span>
                <span className="text-xs text-muted-foreground mt-1">A-1, B, R-2, etc.</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-32 flex flex-col items-center justify-center hover:bg-purple-50">
              <Link to="/compliance-admin/height-area">
                <Ruler className="h-10 w-10 mb-2 text-purple-600" />
                <span className="font-medium">Height & Area Limits</span>
                <span className="text-xs text-muted-foreground mt-1">By construction & occupancy</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-32 flex flex-col items-center justify-center hover:bg-amber-50">
              <Link to="/compliance-admin/fire-ratings">
                <FileText className="h-10 w-10 mb-2 text-amber-600" />
                <span className="font-medium">Fire Ratings</span>
                <span className="text-xs text-muted-foreground mt-1">Separation requirements</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-32 flex flex-col items-center justify-center hover:bg-indigo-50">
              <Link to="/compliance-admin/space-types">
                <TableIcon className="h-10 w-10 mb-2 text-indigo-600" />
                <span className="font-medium">Space Types</span>
                <span className="text-xs text-muted-foreground mt-1">With occupant load factors</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-32 flex flex-col items-center justify-center hover:bg-emerald-50">
              <Link to="/compliance-admin/zoning-districts">
                <Map className="h-10 w-10 mb-2 text-emerald-600" />
                <span className="font-medium">Zoning Districts</span>
                <span className="text-xs text-muted-foreground mt-1">Setbacks, FAR, height limits</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-32 flex flex-col items-center justify-center hover:bg-rose-50">
              <Link to="/compliance-admin/parking">
                <Car className="h-10 w-10 mb-2 text-rose-600" />
                <span className="font-medium">Parking Requirements</span>
                <span className="text-xs text-muted-foreground mt-1">By occupancy & use type</span>
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

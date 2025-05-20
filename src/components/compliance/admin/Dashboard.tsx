
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, FileText, Ruler } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TableStats } from "../types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ComplianceAdminDashboard = () => {
  const [stats, setStats] = useState<TableStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This would ideally fetch real stats from the database
        // For now we'll use mock data
        const mockStats: TableStats[] = [
          { table_name: "Construction Types", record_count: 12, last_updated: "2023-05-20" },
          { table_name: "Occupancy Groups", record_count: 25, last_updated: "2023-05-18" },
          { table_name: "Height Area Limits", record_count: 45, last_updated: "2023-05-15" },
          { table_name: "Fire Ratings", record_count: 30, last_updated: "2023-05-19" },
        ];
        
        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIcon = (tableName: string) => {
    switch (tableName) {
      case "Construction Types":
        return <Building className="h-8 w-8 text-blue-600" />;
      case "Occupancy Groups":
        return <Users className="h-8 w-8 text-green-600" />;
      case "Height Area Limits":
        return <Ruler className="h-8 w-8 text-purple-600" />;
      case "Fire Ratings":
        return <FileText className="h-8 w-8 text-amber-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Data Dashboard</h1>
        <p className="text-muted-foreground">
          Manage building code compliance data and regulations
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.table_name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{stat.table_name}</CardTitle>
                {getIcon(stat.table_name)}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.record_count}</p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {stat.last_updated}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Link to="/compliance-admin/construction-types">
              <Building className="h-8 w-8 mb-2" />
              <span>Manage Construction Types</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Link to="/compliance-admin/occupancy-groups">
              <Users className="h-8 w-8 mb-2" />
              <span>Manage Occupancy Groups</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center">
            <Link to="/compliance-admin/fire-ratings">
              <FileText className="h-8 w-8 mb-2" />
              <span>Manage Fire Ratings</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

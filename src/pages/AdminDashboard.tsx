
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SearchableTable } from "@/components/admin/SearchableTable";
import { 
  FireRatingsTable, 
  HeightAreaTable,
  ZoningDistrictsTable,
  LoadFactorsTable,
  PlaceholderTable
} from "@/components/admin/tables";

interface AdminDashboardProps {
  onLogout: () => Promise<void>;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const tables = [
    { name: "Fire Ratings", component: FireRatingsTable },
    { name: "Height & Area", component: HeightAreaTable },
    { name: "Zoning Districts", component: ZoningDistrictsTable },
    { name: "Load Factors", component: LoadFactorsTable },
    { name: "Occupancy Categories", component: PlaceholderTable },
    { name: "Plumbing Fixtures", component: PlaceholderTable },
    { name: "Accessibility", component: PlaceholderTable }
  ];
  
  return (
    <AppLayout onLogout={async () => await onLogout()}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <SearchableTable 
          tables={tables}
          defaultTableIndex={0}
        />
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

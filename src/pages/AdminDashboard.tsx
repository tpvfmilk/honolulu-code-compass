
import React, { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  
  const tables = [
    { name: "Fire Ratings", component: FireRatingsTable },
    { name: "Height & Area", component: HeightAreaTable },
    { name: "Zoning Districts", component: ZoningDistrictsTable },
    { name: "Load Factors", component: LoadFactorsTable },
    { 
      name: "Occupancy Categories", 
      component: (props: any) => (
        <PlaceholderTable 
          {...props} 
          title="Occupancy Categories" 
          description="Classification of occupancy types and detailed requirements"
        />
      )
    },
    { 
      name: "Plumbing Fixtures", 
      component: (props: any) => (
        <PlaceholderTable 
          {...props} 
          title="Plumbing Fixtures" 
          description="Required plumbing fixtures by occupancy type and occupant load"
        />
      )
    },
    { 
      name: "Accessibility", 
      component: (props: any) => (
        <PlaceholderTable 
          {...props} 
          title="Accessibility" 
          description="ADA and accessibility compliance requirements"
        />
      )
    }
  ];
  
  return (
    <AppLayout onLogout={async () => await onLogout()}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <SearchableTable 
          tables={tables}
          defaultTableIndex={0}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

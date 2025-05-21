
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchZoningDistricts } from "@/services/dataService";
import { PlaceholderTable } from "@/components/admin/tables/PlaceholderTable";

export const ZoningDistrictsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Will implement actual data fetching later
  return (
    <PlaceholderTable 
      title="Zoning Districts" 
      description="Manage zoning districts with setbacks, height limits, and FAR requirements" 
    />
  );
};

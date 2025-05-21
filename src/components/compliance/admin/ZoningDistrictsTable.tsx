
import { useState } from "react";
import { PlaceholderTable } from "@/components/admin/tables/PlaceholderTable";

export const ZoningDistrictsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <PlaceholderTable 
      title="Zoning Districts" 
      description="Manage zoning districts with setbacks, height limits, and FAR requirements" 
    />
  );
};

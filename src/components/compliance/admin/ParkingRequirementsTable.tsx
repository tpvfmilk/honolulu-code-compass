
import { useState } from "react";
import { PlaceholderTable } from "@/components/admin/tables/PlaceholderTable";

export const ParkingRequirementsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <PlaceholderTable 
      title="Parking Requirements" 
      description="Manage parking requirements by occupancy and use type" 
    />
  );
};

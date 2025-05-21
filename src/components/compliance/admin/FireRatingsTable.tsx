
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlaceholderTable } from "@/components/admin/tables/PlaceholderTable";

export const FireRatingsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Will implement actual data fetching later
  return (
    <PlaceholderTable 
      title="Fire Ratings Requirements" 
      description="Manage required fire resistance ratings for building elements and separations" 
    />
  );
};


import { useState } from "react";
import { PlaceholderTable } from "@/components/admin/tables/PlaceholderTable";

export const FireRatingsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <PlaceholderTable 
      title="Fire Ratings Requirements" 
      description="Manage required fire resistance ratings for building elements and separations" 
    />
  );
};

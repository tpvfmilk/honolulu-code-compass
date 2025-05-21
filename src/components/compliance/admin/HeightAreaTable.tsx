
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Download, Upload } from "lucide-react";
import { PlaceholderTable } from "@/components/admin/tables/PlaceholderTable";

export const HeightAreaTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <PlaceholderTable 
      title="Height & Area Limits" 
      description="Manage allowable building heights and areas based on construction type and occupancy group" 
    />
  );
};


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";
import { SearchableTable } from "@/components/admin/SearchableTable";
import { useState } from "react";
import { toast } from "sonner";

interface PlaceholderTableProps {
  title?: string;
  description?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const PlaceholderTable = ({ 
  title = "Coming Soon", 
  description = "This table will be available in a future update",
  searchQuery,
  setSearchQuery
}: PlaceholderTableProps) => {
  const handleAction = (action: string) => {
    toast.info(`${action} functionality will be implemented soon.`);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAction("Download Template")}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Template</span>
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAction("Upload CSV")}
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
            <Button 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleAction("Add New Record")}
            >
              <Plus className="h-4 w-4" />
              <span>Add Record</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchableTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="bg-muted/50 rounded-md p-12 flex flex-col items-center justify-center">
          <p className="text-xl font-medium text-muted-foreground mb-2">Coming Soon</p>
          <p className="text-center text-muted-foreground mb-4 max-w-md">
            This table view is under development and will be available in an upcoming update.
          </p>
          <Button 
            variant="outline"
            onClick={() => handleAction("Request Implementation")}
          >
            Request Priority Implementation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

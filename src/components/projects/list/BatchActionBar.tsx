
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Trash } from "lucide-react";
import { ToastFunction } from "@/hooks/use-toast";

interface BatchActionBarProps {
  selectedCount: number;
  onCancel: () => void;
  onDelete: () => void;
  toast: ToastFunction;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  onCancel,
  onDelete,
  toast,
}) => {
  return (
    <div className="bg-muted p-2 rounded-md flex items-center justify-between">
      <span className="text-sm font-medium">
        {selectedCount} projects selected
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Generate reports for selected projects
            toast({
              title: "Generating Reports",
              description: `Preparing reports for ${selectedCount} projects.`,
            });
          }}
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate Reports
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

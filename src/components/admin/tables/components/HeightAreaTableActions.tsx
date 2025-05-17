
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Download, Upload } from "lucide-react";
import { useState } from "react";
import { HeightAreaLimitRecord } from "../../types";
import { HeightAreaForm } from "../../forms/HeightAreaForm";

interface HeightAreaTableActionsProps {
  onAddRecord: (record: HeightAreaLimitRecord) => void;
  onDownloadTemplate?: () => void;
  onUpload?: () => void;
}

export const HeightAreaTableActions = ({
  onAddRecord,
  onDownloadTemplate,
  onUpload
}: HeightAreaTableActionsProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const handleAddSuccess = (record: HeightAreaLimitRecord) => {
    onAddRecord(record);
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {onDownloadTemplate && (
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={onDownloadTemplate}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Template</span>
        </Button>
      )}
      
      {onUpload && (
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={onUpload}
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Record</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <HeightAreaForm 
            onClose={() => setIsAddDialogOpen(false)}
            onSave={handleAddSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

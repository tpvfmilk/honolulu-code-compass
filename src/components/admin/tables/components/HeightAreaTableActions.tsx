
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CsvUploader } from "@/components/admin/CsvUploader";
import { Download, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface HeightAreaTableActionsProps {
  onAddRecord: () => void;
}

export const HeightAreaTableActions = ({ onAddRecord }: HeightAreaTableActionsProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleDownloadTemplate = () => {
    toast.info("Template download functionality will be implemented soon.");
  };

  const handleCsvUpload = async (csvData: any[]) => {
    try {
      console.log("CSV data to process:", csvData);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully processed ${csvData.length} records`);
      setIsUploadOpen(false);
      return true;
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("Failed to process CSV data");
      return false;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1"
        onClick={handleDownloadTemplate}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Template</span>
      </Button>
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Height & Area Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file with height and area limitations data. Download the template for the correct format.
            </DialogDescription>
          </DialogHeader>
          <CsvUploader 
            onUpload={handleCsvUpload} 
            templateName="height_area_limits" 
          />
        </DialogContent>
      </Dialog>
      <Button 
        size="sm"
        className="flex items-center gap-1"
        onClick={onAddRecord}
      >
        <Plus className="h-4 w-4" />
        <span>Add Record</span>
      </Button>
    </div>
  );
};

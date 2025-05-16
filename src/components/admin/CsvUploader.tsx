
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CsvUploaderProps {
  templateName: string;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
}

export const CsvUploader = ({ templateName, onFileUpload, onDownloadTemplate }: CsvUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success("CSV data uploaded successfully!");
          onFileUpload(file);
        }
      }, 300);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={onDownloadTemplate}>
          <Download className="h-4 w-4 mr-2" /> Template
        </Button>
        <Button size="sm" variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          <label htmlFor={`${templateName}-csv`} className="cursor-pointer">Upload CSV</label>
          <input 
            id={`${templateName}-csv`} 
            type="file" 
            accept=".csv" 
            className="hidden"
            onChange={handleFileUpload} 
          />
        </Button>
      </div>
      
      {isUploading && (
        <div className="mb-4">
          <p className="text-sm mb-2">Uploading CSV file...</p>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </>
  );
};

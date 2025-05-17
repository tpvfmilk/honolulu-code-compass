
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Check, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface CsvUploaderProps {
  onUpload: (data: any[]) => Promise<boolean>;
  templateName: string;
}

export const CsvUploader = ({ onUpload, templateName }: CsvUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length && files[0].type === "text/csv") {
      handleFileSelection(files[0]);
    } else {
      toast.error("Please upload a CSV file");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setFile(file);
    
    // Read file preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split("\n").slice(0, 6); // Get first 6 lines for preview
      const parsedLines = lines.map(line => line.split(","));
      setPreviewData(parsedLines);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulating progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = Math.min(prev + 10, 90);
        return newProgress;
      });
    }, 200);
    
    try {
      // Parse CSV
      const text = await file.text();
      const lines = text.split("\n").filter(line => line.trim() && !line.startsWith("#"));
      const headers = lines[0].split(",").map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        const row: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        
        return row;
      });
      
      // Call the provided upload handler
      const success = await onUpload(data);
      clearInterval(progressInterval);
      
      if (success) {
        setUploadProgress(100);
        toast.success(`${file.name} uploaded successfully`);
        
        // Reset after successful upload
        setTimeout(() => {
          setFile(null);
          setPreviewData([]);
          setIsUploading(false);
          setUploadProgress(0);
        }, 1500);
      } else {
        toast.error("Upload failed. Please check your file and try again.");
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Upload error:", error);
      toast.error("Error processing the file. Please check the format and try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
    setPreviewData([]);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const downloadTemplate = () => {
    // In real implementation, this would download a template CSV file
    toast.info(`Template ${templateName}_template.csv would be downloaded here`);
  };

  return (
    <div className="w-full space-y-4">
      {!file ? (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-primary bg-primary/5" : "border-gray-300"
            } transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <Upload className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <p className="text-lg font-medium">Drag and drop your CSV file here</p>
                <p className="text-muted-foreground">or click to browse files</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                Select CSV File
              </Button>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                <AlertCircle className="h-3 w-3" />
                <span>Only CSV files are supported. Max size 5MB.</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={downloadTemplate}
            >
              <FileText className="h-4 w-4" />
              <span>Download Template</span>
            </Button>
          </div>
        </>
      ) : (
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB • {previewData.length - 1} rows
                </p>
              </div>
            </div>
            {!isUploading && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancelUpload}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {previewData.length > 0 && (
            <div className="overflow-auto max-h-60 border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {previewData[0].map((header, index) => (
                      <th 
                        key={index}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.slice(1, 5).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex}
                          className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              {uploadProgress === 100 && (
                <div className="flex items-center justify-center text-green-600 space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Upload complete!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={handleCancelUpload}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload}>
                Upload File
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

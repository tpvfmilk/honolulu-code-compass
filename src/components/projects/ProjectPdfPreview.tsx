
import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { ProjectData } from "../../pages/ProjectView";
import { generateProjectCodeSheet } from "../../services/pdfService";

interface ProjectPdfPreviewProps {
  project: ProjectData;
}

export const ProjectPdfPreview = ({ project }: ProjectPdfPreviewProps) => {
  const { toast } = useToast();
  const [excelPreviewUrl, setExcelPreviewUrl] = useState<string | null>(null);
  const [isExcelGenerating, setIsExcelGenerating] = useState(false);

  const handleGenerateExcel = () => {
    if (!project) return;
    
    setIsExcelGenerating(true);
    
    try {
      // Generate the Excel data URL
      const excelUrl = generateProjectCodeSheet(project);
      setExcelPreviewUrl(excelUrl);
      
      toast({
        title: "Excel Generated",
        description: "Your code information sheet has been generated successfully."
      });
    } catch (err) {
      console.error("Error generating Excel:", err);
      toast({
        title: "Error",
        description: "Failed to generate Excel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExcelGenerating(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!excelPreviewUrl || !project) return;
    
    // Create an anchor element and set properties
    const link = document.createElement("a");
    link.href = excelPreviewUrl;
    link.download = `${project.name}-Code-Sheet.xlsx`;
    
    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your Excel file is being downloaded."
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          onClick={handleGenerateExcel}
          className="hawaii-gradient flex items-center gap-2"
          disabled={isExcelGenerating}
        >
          <FileText className="h-4 w-4" />
          <span>{isExcelGenerating ? "Generating..." : "Generate Code Sheet"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Code Information Sheet</SheetTitle>
          <SheetDescription>
            Preview of the generated Excel for {project.name}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          {excelPreviewUrl ? (
            <>
              <div className="border rounded-md overflow-hidden p-4 bg-secondary">
                <div className="text-center mb-4">
                  <FileText className="h-12 w-12 mx-auto text-primary" />
                  <p className="mt-2 font-medium">{project.name}-Code-Sheet.xlsx</p>
                  <p className="text-sm text-muted-foreground">Excel file is ready for download</p>
                </div>
              </div>
              <Button 
                onClick={handleDownloadExcel}
                className="hawaii-gradient flex items-center gap-2 self-end"
              >
                <FileText className="h-4 w-4" />
                <span>Download Excel</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p>Click "Generate Code Sheet" to create the Excel file</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

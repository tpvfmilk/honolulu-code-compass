
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
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleGeneratePDF = () => {
    if (!project) return;
    
    setIsPdfGenerating(true);
    
    try {
      // Generate the PDF data URL
      const pdfUrl = generateProjectCodeSheet(project);
      setPdfPreviewUrl(pdfUrl);
      
      toast({
        title: "PDF Generated",
        description: "Your code information sheet has been generated successfully."
      });
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfPreviewUrl || !project) return;
    
    // Create an anchor element and set properties
    const link = document.createElement("a");
    link.href = pdfPreviewUrl;
    link.download = `${project.name}-Code-Sheet.pdf`;
    
    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your PDF is being downloaded."
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          onClick={handleGeneratePDF}
          className="hawaii-gradient flex items-center gap-2"
          disabled={isPdfGenerating}
        >
          <FileText className="h-4 w-4" />
          <span>{isPdfGenerating ? "Generating..." : "Generate Code Sheet"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Code Information Sheet</SheetTitle>
          <SheetDescription>
            Preview of the generated PDF for {project.name}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          {pdfPreviewUrl ? (
            <>
              <div className="border rounded-md overflow-hidden h-[70vh]">
                <iframe 
                  src={pdfPreviewUrl} 
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
              <Button 
                onClick={handleDownloadPDF}
                className="hawaii-gradient flex items-center gap-2 self-end"
              >
                <FileText className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p>Click "Generate Code Sheet" to preview the PDF</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

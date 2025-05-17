
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProjectDetail } from "../components/projects/ProjectDetail";
import { NotFound } from "./NotFound";
import { getProjectById } from "../services/dataService";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateProjectCodeSheet } from "../services/pdfService";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Define an interface for the project data structure
export interface ProjectData {
  id: string;
  name: string;
  tmk: string;
  status: "draft" | "in-progress" | "completed" | "needs-revision";
  district: string;
  lastUpdated: Date;
  address?: string;
  client_name?: string;
  property_owner?: string;
}

const ProjectView = ({ onLogout }: { onLogout: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) {
        setError("No project ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const projectData = await getProjectById(id);
        
        if (!projectData) {
          setError("Project not found");
          setIsLoading(false);
          return;
        }

        // Convert the project data to match our ProjectData interface
        const formattedProject: ProjectData = {
          id: projectData.id || "",
          name: projectData.name || "",
          tmk: projectData.tmk || "",
          status: (projectData.status as "draft" | "in-progress" | "completed" | "needs-revision") || "draft",
          district: projectData.district || "Unknown", // This field might need to be fetched from project_data
          lastUpdated: new Date(projectData.updated_at || Date.now()),
          address: projectData.address || "",
          client_name: projectData.client_name || "",
          property_owner: projectData.property_owner || ""
        };

        setProject(formattedProject);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data");
        toast({
          title: "Error",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id, toast]);

  const handleEditProject = () => {
    if (project) {
      navigate(`/project/edit/${project.id}`);
    }
  };

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

  if (isLoading) {
    return (
      <AppLayout onLogout={onLogout}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-lg">Loading project data...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !project) {
    return <NotFound />;
  }

  return (
    <AppLayout onLogout={onLogout}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">TMK: {project.tmk}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleEditProject}
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Project</span>
          </Button>
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
        </div>
      </div>
      <ProjectDetail project={project} />
    </AppLayout>
  );
};

export default ProjectView;

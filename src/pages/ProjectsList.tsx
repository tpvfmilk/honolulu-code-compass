
import { FC, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle } from "lucide-react";
import { Project, ProjectData } from "@/components/projects/types/projectListTypes";
import { ProjectStatsCards } from "@/components/projects/list/ProjectStatsCards";
import { ProjectSearchFilters } from "@/components/projects/list/ProjectSearchFilters";
import { ProjectsGrid } from "@/components/projects/list/ProjectsGrid";
import { ProjectsTable } from "@/components/projects/list/ProjectsTable";
import { BatchActionBar } from "@/components/projects/list/BatchActionBar";
import { DeleteProjectDialog } from "@/components/projects/list/DeleteProjectDialog";
import { EmptyProjectsState } from "@/components/projects/list/EmptyProjectsState";

interface ProjectsListProps {
  onLogout: () => Promise<void>;
}

const ProjectsList: FC<ProjectsListProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) throw error;

        // Map database results to the Project type
        const mappedProjects: Project[] = (data || []).map((item: ProjectData) => ({
          id: item.id,
          name: item.name,
          tmk: item.tmk || '',
          status: (item.status as "draft" | "in_progress" | "submitted" | "approved" | "rejected") || 'draft',
          project_type: determineProjectType(item),  // Helper function to determine project type
          address: item.address || '',
          created_at: item.created_at || '',
          updated_at: item.updated_at || ''
        }));

        setProjects(mappedProjects);
        setFilteredProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  // Helper function to determine project type from other fields
  const determineProjectType = (project: ProjectData): string => {
    // This is a placeholder logic - you may want to replace with actual logic
    // based on your application's requirements or store project_type in the database
    if (project.client_name?.toLowerCase().includes('commercial')) {
      return 'commercial';
    } else if (project.address?.toLowerCase().includes('apartment') || 
              project.address?.toLowerCase().includes('condo')) {
      return 'mixed';
    } else {
      return 'residential'; // Default type
    }
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...projects];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.tmk.toLowerCase().includes(query) ||
          project.address.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((project) => project.project_type === typeFilter);
    }

    setFilteredProjects(result);
  }, [searchQuery, statusFilter, typeFilter, projects]);

  // Handle project creation
  const handleCreateProject = () => {
    navigate("/project/new");
  };

  // Handle project viewing
  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // Handle project selection (for batch operations)
  const handleSelectProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Handle single project deletion
  const handleSingleProjectDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion of a single project
  const confirmSingleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectToDelete);

      if (error) throw error;

      setProjects((prev) => prev.filter((project) => project.id !== projectToDelete));
      
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProjectToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // Handle batch deletion
  const handleBatchDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProjects.length} projects?`)) {
      try {
        const { error } = await supabase
          .from("projects")
          .delete()
          .in("id", selectedProjects);

        if (error) throw error;

        setProjects((prev) => prev.filter((project) => !selectedProjects.includes(project.id)));
        setSelectedProjects([]);

        toast({
          title: "Success",
          description: `${selectedProjects.length} projects deleted successfully.`,
        });
      } catch (error) {
        console.error("Error deleting projects:", error);
        toast({
          title: "Error",
          description: "Failed to delete projects. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Generate project statistics
  const getProjectStats = () => {
    const total = projects.length;
    const inProgress = projects.filter((p) => p.status === "in_progress").length;
    const submitted = projects.filter((p) => p.status === "submitted").length;
    const approved = projects.filter((p) => p.status === "approved").length;

    return { total, inProgress, submitted, approved };
  };

  const stats = getProjectStats();

  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your building code compliance projects
            </p>
          </div>
          <Button onClick={handleCreateProject} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Statistics */}
        <ProjectStatsCards stats={stats} />

        {/* Search and Filters */}
        <ProjectSearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Selected Projects Actions */}
        {selectedProjects.length > 0 && (
          <BatchActionBar 
            selectedCount={selectedProjects.length} 
            onCancel={() => setSelectedProjects([])} 
            onDelete={handleBatchDelete}
            toast={toast}
          />
        )}

        {/* Projects Display */}
        {isLoading ? (
          <ProjectsSkeletonLoader viewMode={viewMode} />
        ) : filteredProjects.length === 0 ? (
          <EmptyProjectsState 
            hasProjects={projects.length > 0}
            onCreateProject={handleCreateProject}
            onClearFilters={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
          />
        ) : viewMode === "grid" ? (
          <ProjectsGrid 
            projects={filteredProjects}
            selectedProjects={selectedProjects}
            onSelectProject={handleSelectProject}
            onViewProject={handleViewProject}
            onDeleteProject={handleSingleProjectDelete}
            navigate={navigate}
          />
        ) : (
          <ProjectsTable 
            projects={filteredProjects}
            selectedProjects={selectedProjects}
            onSelectProject={handleSelectProject}
            onViewProject={handleViewProject}
            onDeleteProject={handleSingleProjectDelete}
            navigate={navigate}
          />
        )}
      </div>

      <DeleteProjectDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={confirmSingleDelete}
      />
    </AppLayout>
  );
};

// Simple skeleton loader component
const ProjectsSkeletonLoader = ({ viewMode }: { viewMode: "grid" | "list" }) => {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 animate-pulse rounded-lg h-[200px]"
          ></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="border rounded-md animate-pulse">
      <div className="h-12 bg-gray-100"></div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-14 bg-gray-50 border-t"></div>
      ))}
    </div>
  );
};

export default ProjectsList;

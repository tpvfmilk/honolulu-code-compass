
import { FC, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Filter, Search, Grid, List, MoreVertical, FileText, Copy, Trash, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

// Define the project type
interface Project {
  id: string;
  name: string;
  tmk: string;
  status: "draft" | "in_progress" | "submitted" | "approved" | "rejected";
  project_type: string;
  address: string;
  created_at: string;
  updated_at: string;
}

// Define the database type that matches Supabase schema
interface ProjectData {
  id: string;
  name: string;
  tmk: string | null;
  status: string | null;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
  current_step: number | null;
  is_complete: boolean | null;
  property_owner: string | null;
  client_name: string | null;
  user_id: string;
}

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

  // Get status badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-200 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-amber-100 text-amber-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.submitted}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by name, TMK, or address..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="mixed">Mixed-Use</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <div className="border rounded-md p-2 flex gap-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Selected Projects Actions */}
        {selectedProjects.length > 0 && (
          <div className="bg-muted p-2 rounded-md flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedProjects.length} projects selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedProjects([])}>
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Generate reports for selected projects
                  toast({
                    title: "Generating Reports",
                    description: `Preparing reports for ${selectedProjects.length} projects.`,
                  });
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Projects Display */}
        {isLoading ? (
          // Skeleton loader for projects
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 animate-pulse rounded-lg h-[200px]"
              ></div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          // Empty state
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {projects.length === 0
                ? "You haven't created any projects yet"
                : "No projects match your current filters"}
            </p>
            {projects.length === 0 ? (
              <Button onClick={handleCreateProject}>Create Your First Project</Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          // Grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleViewProject(project.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 overflow-hidden">
                      <CardTitle className="text-lg truncate" title={project.name}>
                        {project.name}
                      </CardTitle>
                    </div>
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleSelectProject(project.id)}
                      className="mr-2 mt-1"
                      onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => navigate(`/project/${project.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/project/edit/${project.id}`)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSingleProjectDelete(project.id);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm text-muted-foreground mb-2">
                    TMK: {project.tmk}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3 truncate" title={project.address}>
                    {project.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getStatusBadgeColor(project.status)}
                      variant="secondary"
                    >
                      {project.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                    <Badge variant="outline">{project.project_type}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 text-xs text-muted-foreground">
                  Last updated: {new Date(project.updated_at).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          // List view
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <Checkbox
                      checked={
                        selectedProjects.length === filteredProjects.length &&
                        filteredProjects.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProjects(filteredProjects.map((p) => p.id));
                        } else {
                          setSelectedProjects([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>TMK</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => handleSelectProject(project.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      onClick={() => handleViewProject(project.id)}
                    >
                      {project.name}
                    </TableCell>
                    <TableCell>{project.tmk}</TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeColor(project.status)}
                        variant="secondary"
                      >
                        {project.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.project_type}</TableCell>
                    <TableCell>
                      {new Date(project.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProject(project.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => navigate(`/project/edit/${project.id}`)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSingleProjectDelete(project.id);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSingleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default ProjectsList;

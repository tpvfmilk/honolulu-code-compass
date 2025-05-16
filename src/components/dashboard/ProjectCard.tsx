
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type Project = {
  id: string;
  name: string;
  tmk: string;
  status: "draft" | "in-progress" | "completed" | "needs-revision";
  district: string;
  lastUpdated: Date;
};

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  const statusColors = {
    "draft": "bg-gray-200 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "completed": "bg-green-100 text-green-800",
    "needs-revision": "bg-amber-100 text-amber-800",
  };
  
  const statusText = {
    "draft": "Draft",
    "in-progress": "In Progress",
    "completed": "Completed",
    "needs-revision": "Needs Revision",
  };

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:hawaii-card-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
          <Badge className={statusColors[project.status]}>
            {statusText[project.status]}
          </Badge>
        </div>
        <CardDescription>TMK: {project.tmk}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Zoning District:</span>
            <span className="font-medium">{project.district}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="font-medium">
              {project.lastUpdated.toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" className="w-full" onClick={handleClick}>
          <span>View Details</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

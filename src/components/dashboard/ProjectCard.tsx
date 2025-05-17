
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  
  const statusConfig = {
    "draft": {
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: "Draft"
    },
    "in-progress": {
      bg: "bg-ocean-100",
      text: "text-ocean-800",
      label: "In Progress"
    },
    "completed": {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Completed"
    },
    "needs-revision": {
      bg: "bg-amber-100",
      text: "text-amber-800",
      label: "Needs Revision"
    },
  };

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-gray-100 h-full flex flex-col" onClick={handleClick}>
      <CardHeader className="pb-2 cursor-pointer">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1">
            {project.name}
          </CardTitle>
          <Badge className={cn(
            "px-2 py-0.5 text-xs font-medium",
            statusConfig[project.status].bg, 
            statusConfig[project.status].text
          )}>
            {statusConfig[project.status].label}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-500">TMK: {project.tmk}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-1 cursor-pointer">
        <div className="text-sm space-y-2">
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Zoning District</span>
            <span className="font-medium text-gray-900">{project.district}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center text-gray-500">
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>Last Updated</span>
            </div>
            <span className="font-medium text-gray-900">
              {project.lastUpdated.toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t border-gray-50">
        <Button variant="ghost" className="w-full hover:bg-gray-50 hover:text-ocean-700 text-gray-700 justify-between">
          <span>View Details</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

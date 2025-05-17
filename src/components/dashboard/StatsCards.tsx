
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutGrid, 
  CheckCircle, 
  Clock,
  Timer
} from "lucide-react";

type StatsCardsProps = {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
};

export const StatsCards = ({
  totalProjects,
  completedProjects,
  inProgressProjects,
}: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Projects",
      value: totalProjects,
      description: "All project submissions",
      icon: LayoutGrid,
      iconColor: "text-ocean-600 bg-ocean-100",
    },
    {
      title: "Completed",
      value: completedProjects,
      description: "Ready for submission",
      icon: CheckCircle,
      iconColor: "text-green-600 bg-green-100",
    },
    {
      title: "In Progress",
      value: inProgressProjects,
      description: "Currently being worked on",
      icon: Clock,
      iconColor: "text-amber-600 bg-amber-100", 
    },
    {
      title: "Time Saved",
      value: Math.round(totalProjects * 2.5),
      description: "Hours (est.)",
      icon: Timer,
      iconColor: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i} className="border border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              {card.title}
            </CardTitle>
            <div className={`h-8 w-8 rounded-md flex items-center justify-center ${card.iconColor}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <CardDescription className="text-gray-500 mt-1">{card.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

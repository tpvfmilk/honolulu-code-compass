
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      icon: "📁",
    },
    {
      title: "Completed",
      value: completedProjects,
      description: "Ready for submission",
      icon: "✅",
    },
    {
      title: "In Progress",
      value: inProgressProjects,
      description: "Currently being worked on",
      icon: "⏳",
    },
    {
      title: "Time Saved",
      value: Math.round(totalProjects * 2.5),
      description: "Hours (est.)",
      icon: "⏱️",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i} className="hawaii-card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-lg">
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <CardDescription>{card.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

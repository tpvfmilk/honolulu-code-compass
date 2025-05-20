
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsProps {
  stats: {
    total: number;
    inProgress: number;
    submitted: number;
    approved: number;
  };
}

export const ProjectStatsCards: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
};

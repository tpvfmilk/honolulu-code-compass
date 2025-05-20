
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleType } from "./types";
import { XCircle } from "lucide-react";

interface TroubleshootingTabProps {
  groupedTroubleshooting: Record<string, ArticleType[]>;
}

export const TroubleshootingTab = ({ groupedTroubleshooting }: TroubleshootingTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(groupedTroubleshooting).map(([category, articles]) => (
        <Card key={category} className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <XCircle className="h-5 w-5 mr-2" /> 
              {category} Issues
            </CardTitle>
            <CardDescription>
              Solutions for common problems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {articles.map(article => (
                <li key={article.id} className="flex items-start py-2 hover:bg-muted px-2 rounded-md transition-colors">
                  <article.icon className="h-5 w-5 mr-2 mt-0.5 text-destructive" />
                  <div>
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

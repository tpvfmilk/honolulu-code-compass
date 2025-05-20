
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleType } from "./types";
import { FileQuestion } from "lucide-react";

interface FaqsTabProps {
  groupedFaqs: Record<string, ArticleType[]>;
}

export const FaqsTab = ({ groupedFaqs }: FaqsTabProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Object.entries(groupedFaqs).map(([category, articles]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileQuestion className="h-5 w-5 mr-2" /> 
              {category} FAQs
            </CardTitle>
            <CardDescription>
              Frequently asked questions about {category.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map(article => (
                <div key={article.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <h4 className="font-medium">{article.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

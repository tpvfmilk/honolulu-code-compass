
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { KBCategory, KBArticle } from "./types";
import { fetchFromSupabase } from "@/integrations/supabase/client";

export const KnowledgeGrid = () => {
  const [categories, setCategories] = useState<KBCategory[]>([]);
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKnowledgeBaseData = async () => {
      try {
        setLoading(true);
        // Fetch categories ordered by display_order
        const categoriesData = await fetchFromSupabase<KBCategory>(
          'kb_categories' as any,
          { select: '*, article_count' }
        );
        
        // Fetch all published articles
        const articlesData = await fetchFromSupabase<KBArticle>(
          'kb_articles' as any,
          { select: '*, category_id' }
        );
        
        // Filter published articles and count by category
        const publishedArticles = articlesData.filter(article => article.published_at !== null);
        
        // Update categories with accurate article counts
        const categoriesWithCounts = categoriesData.map(category => {
          const categoryArticles = publishedArticles.filter(a => a.category_id === category.id);
          return {
            ...category,
            article_count: categoryArticles.length
          };
        });
        
        setCategories(categoriesWithCounts.sort((a, b) => a.display_order - b.display_order));
        setArticles(publishedArticles);
        setLoading(false);
      } catch (err) {
        console.error("Error loading knowledge base data:", err);
        setError("Failed to load knowledge base data. Please try again later.");
        setLoading(false);
      }
    };

    loadKnowledgeBaseData();
  }, []);

  // Group articles by category_id
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category_id]) {
      acc[article.category_id] = [];
    }
    acc[article.category_id].push(article);
    return acc;
  }, {} as Record<string, KBArticle[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((category) => (
        <Card key={category.id} className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="h-5 w-5 mr-2" /> 
              {category.name} ({category.article_count})
            </CardTitle>
            <CardDescription>
              Browse articles related to {category.name.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {articlesByCategory[category.id]?.map(article => (
                <li key={article.id} className="flex items-start py-2 hover:bg-muted px-2 rounded-md transition-colors">
                  <FileText className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <Link to={`/knowledge-base/article/${article.id}`} className="hover:text-primary transition-colors">
                    {article.title}
                  </Link>
                </li>
              )) || (
                <li className="text-sm text-muted-foreground">No articles available yet.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

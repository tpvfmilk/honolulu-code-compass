
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Clock, FileText, Eye } from "lucide-react";
import { KBArticle, KBCategory } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const ArticleView = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<KBArticle | null>(null);
  const [category, setCategory] = useState<KBCategory | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!articleId) return;
      
      try {
        setLoading(true);
        
        // Fetch the article
        const { data: articleData, error: articleError } = await supabase
          .from('kb_articles')
          .select('*')
          .eq('id', articleId)
          .single();
          
        if (articleError) throw articleError;
        
        // Increment view count
        await supabase
          .from('kb_articles')
          .update({ view_count: (articleData.view_count || 0) + 1 })
          .eq('id', articleId);
        
        setArticle(articleData);
        
        // Fetch the category
        if (articleData.category_id) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('kb_categories')
            .select('*')
            .eq('id', articleData.category_id)
            .single();
            
          if (categoryError) throw categoryError;
          
          setCategory(categoryData);
          
          // Fetch related articles from the same category
          const { data: relatedData, error: relatedError } = await supabase
            .from('kb_articles')
            .select('*')
            .eq('category_id', articleData.category_id)
            .neq('id', articleId)
            .order('view_count', { ascending: false })
            .limit(3);
            
          if (relatedError) throw relatedError;
          
          setRelatedArticles(relatedData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchArticleData();
  }, [articleId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <p className="text-destructive">{error || "Article not found"}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/help">Back to Knowledge Base</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Link to="/help" className="hover:text-primary">Knowledge Base</Link>
        <ChevronRight className="h-4 w-4" />
        {category && (
          <>
            <span>{category.name}</span>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-foreground font-medium truncate">{article.title}</span>
      </nav>
      
      {/* Article content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" /> 
            <span>{article.title}</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Updated: {format(new Date(article.updated_at), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{article.view_count} views</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </CardContent>
      </Card>
      
      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related articles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {relatedArticles.map(related => (
                <li key={related.id} className="flex items-start py-2 hover:bg-muted px-2 rounded-md transition-colors">
                  <FileText className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <Link to={`/knowledge-base/article/${related.id}`} className="hover:text-primary transition-colors">
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center mt-8">
        <Button asChild variant="outline">
          <Link to="/help">Back to Knowledge Base</Link>
        </Button>
      </div>
    </div>
  );
};

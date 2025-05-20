
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Eye, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KBArticle, KBCategory } from "../types";

export const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<KBCategory[]>([]);
  const [recentArticles, setRecentArticles] = useState<KBArticle[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('kb_categories')
          .select('*')
          .order('display_order');

        if (error) {
          throw error;
        }

        setCategories(data || []);
        
        // Set default category if available
        if (data && data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    // Fetch recent articles
    const fetchRecentArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('kb_articles')
          .select('*, category:category_id(name)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        setRecentArticles(data || []);
      } catch (error) {
        console.error("Error fetching recent articles:", error);
        toast.error("Failed to load recent articles");
      }
    };

    fetchCategories();
    fetchRecentArticles();
  }, []);

  const handleSave = async (publish: boolean = false) => {
    if (!title.trim()) {
      toast.error("Please enter a title for the article");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      setSubmitting(true);

      const articleData = {
        title,
        content,
        category_id: categoryId,
        published_at: publish ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('kb_articles')
        .insert([articleData])
        .select();

      if (error) {
        throw error;
      }

      toast.success(publish ? "Article published successfully!" : "Draft saved successfully!");
      
      // Reset form
      setTitle("");
      setContent("");
      
      // Refresh recent articles
      const { data: recentData, error: recentError } = await supabase
        .from('kb_articles')
        .select('*, category:category_id(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!recentError) {
        setRecentArticles(recentData || []);
      }

    } catch (error: any) {
      console.error("Error saving article:", error);
      toast.error(error.message || "Failed to save article");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Create and manage knowledge base articles</p>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor" onClick={() => setPreviewMode(false)}>Editor</TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Article</CardTitle>
              <CardDescription>
                Write a new knowledge base article. Fill out the title, select a category, and compose your content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter article title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Article Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Write your article content here..." 
                  className="min-h-[300px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button 
                  variant="default"
                  onClick={() => handleSave(true)}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? "Publishing..." : "Publish Article"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? "Saving..." : "Save as Draft"}
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setPreviewMode(true)} 
                  className="flex-1"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {title || "Untitled Article"}
              </CardTitle>
              <CardDescription>
                Preview of how your article will appear to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {content ? (
                  <div className="whitespace-pre-wrap">{content}</div>
                ) : (
                  <p className="text-muted-foreground">No content yet. Start writing in the editor tab.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setPreviewMode(false)}
            >
              Back to Editor
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Articles</CardTitle>
            <CardDescription>Recently created or updated articles</CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/articles')}
          >
            View All Articles
          </Button>
        </CardHeader>
        <CardContent>
          {recentArticles.length > 0 ? (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="flex items-start p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-medium truncate">{article.title}</h4>
                      <span className="text-xs text-muted-foreground ml-2">
                        {article.published_at ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(article.updated_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto opacity-20 mb-2" />
              <p>No articles yet. Create your first article above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { FileText, Plus, Edit, Trash2, Eye, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { KBArticle, KBCategory } from "../types";

export const Articles = () => {
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [categories, setCategories] = useState<KBCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDisplayOrder, setCategoryDisplayOrder] = useState("0");
  const [editingCategory, setEditingCategory] = useState<KBCategory | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'article' | 'category'} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kb_articles')
        .select(`
          *,
          category:category_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kb_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const displayOrder = parseInt(categoryDisplayOrder) || 0;
      
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('kb_categories')
          .update({ 
            name: categoryName, 
            display_order: displayOrder,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        
        toast.success("Category updated successfully");
      } else {
        // Create new category
        const { error } = await supabase
          .from('kb_categories')
          .insert([{ 
            name: categoryName, 
            display_order: displayOrder 
          }]);

        if (error) throw error;
        
        toast.success("Category created successfully");
      }
      
      // Reset form and refresh categories
      setCategoryName("");
      setCategoryDisplayOrder("0");
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleEditCategory = (category: KBCategory) => {
    setCategoryName(category.name);
    setCategoryDisplayOrder(category.display_order.toString());
    setEditingCategory(category);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'category') {
        const { error } = await supabase
          .from('kb_categories')
          .delete()
          .eq('id', itemToDelete.id);
          
        if (error) throw error;
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        const { error } = await supabase
          .from('kb_articles')
          .delete()
          .eq('id', itemToDelete.id);
          
        if (error) throw error;
        toast.success("Article deleted successfully");
        fetchArticles();
      }
    } catch (error: any) {
      console.error("Error deleting item:", error);
      toast.error(error.message || "Failed to delete item");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const confirmDelete = (id: string, type: 'article' | 'category') => {
    setItemToDelete({id, type});
    setDeleteConfirmOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Articles Management</h1>
        <p className="text-muted-foreground">Manage knowledge base articles and categories</p>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Articles</CardTitle>
                <CardDescription>
                  Manage published and draft articles
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/admin/dashboard')}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-center">
                    <p className="text-muted-foreground">Loading articles...</p>
                  </div>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto opacity-20 mb-2" />
                  <p>No articles found. Create your first article from the Dashboard.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{(article.category as any)?.name || "Unknown"}</TableCell>
                        <TableCell>{formatDate(article.updated_at)}</TableCell>
                        <TableCell className="text-center">{article.view_count}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            article.published_at ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {article.published_at ? "Published" : "Draft"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => navigate(`/knowledge-base/article/${article.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toast.info("Edit functionality coming soon")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => confirmDelete(article.id, 'article')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingCategory ? "Edit Category" : "Create Category"}</CardTitle>
                <CardDescription>
                  {editingCategory 
                    ? "Update an existing category" 
                    : "Add a new category for organizing articles"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input 
                      id="categoryName" 
                      placeholder="Enter category name" 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input 
                      id="displayOrder" 
                      type="number" 
                      min="0"
                      placeholder="0" 
                      value={categoryDisplayOrder}
                      onChange={(e) => setCategoryDisplayOrder(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Categories are displayed in ascending order (lower numbers first)
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={handleSaveCategory}
                      className="flex-1"
                    >
                      {editingCategory ? "Update Category" : "Create Category"}
                    </Button>
                    {editingCategory && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryName("");
                          setCategoryDisplayOrder("0");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Current categories and article counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse text-center py-4">
                    <p className="text-muted-foreground">Loading categories...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No categories yet. Create your first category.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div 
                        key={category.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {category.article_count} {category.article_count === 1 ? "article" : "articles"} • 
                            Order: {category.display_order}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => confirmDelete(category.id, 'category')}
                            disabled={category.article_count > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {itemToDelete?.type === 'category' 
                ? "Are you sure you want to delete this category? This action cannot be undone."
                : "Are you sure you want to delete this article? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Articles;

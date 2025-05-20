
import { useEffect, useState } from "react";
import { Navigate, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Book, FileText, MessageSquare, LogOut, Settings, Users, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KBAdminUser } from "../types";
import { toast } from "sonner";

export const AdminLayout = () => {
  const [admin, setAdmin] = useState<KBAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('kb_admin');
    
    if (adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (err) {
        console.error("Error parsing admin data:", err);
        localStorage.removeItem('kb_admin');
      }
    }
    
    setLoading(false);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('kb_admin');
    setAdmin(null);
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };
  
  // If not logged in, redirect to login page
  if (!loading && !admin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/20 p-4 flex flex-col">
        <div className="flex items-center mb-6 px-2">
          <Book className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold">KB Admin</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Button
            variant={isActive("/admin/dashboard") ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/admin/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <Button
            variant={isActive("/admin/articles") ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/admin/articles">
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </Link>
          </Button>
          
          <Button
            variant={isActive("/admin/categories") ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/admin/categories">
              <Settings className="h-4 w-4 mr-2" />
              Categories
            </Link>
          </Button>
          
          <Button
            variant={isActive("/admin/feedback") ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/admin/feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </Link>
          </Button>
        </nav>
        
        <div className="pt-4">
          <Separator className="my-4" />
          <div className="px-2 mb-2">
            <p className="text-sm font-medium">{admin?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{admin?.role}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

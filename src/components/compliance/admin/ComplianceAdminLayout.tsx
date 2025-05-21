
import { useEffect, useState } from "react";
import { Navigate, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  BookOpenText, 
  FileText, 
  LogOut, 
  Settings, 
  Home, 
  Building, 
  Users,
  Table,
  Ruler,
  FlameKindling,
  Database,
  Map,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ComplianceAdminUser } from "../types";
import { toast } from "sonner";

export const ComplianceAdminLayout = () => {
  const [admin, setAdmin] = useState<ComplianceAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if compliance admin is logged in
    const adminData = localStorage.getItem('compliance_admin');
    
    if (adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (err) {
        console.error("Error parsing compliance admin data:", err);
        localStorage.removeItem('compliance_admin');
      }
    }
    
    setLoading(false);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('compliance_admin');
    setAdmin(null);
    toast.success("Logged out successfully");
    navigate("/compliance-admin/login");
  };
  
  // If not logged in, redirect to login page
  if (!loading && !admin) {
    return <Navigate to="/compliance-admin/login" replace />;
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
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r bg-slate-50 p-4 flex flex-col`}>
        <div className={`flex items-center mb-6 px-2 ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
          <Database className="h-6 w-6 mr-2 text-amber-600" />
          {sidebarOpen && <h1 className="text-xl font-bold">Information Database</h1>}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="self-end mb-2" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '«' : '»'}
        </Button>
        
        <nav className="space-y-1 flex-1">
          <Button
            variant={isActive("/compliance-admin/dashboard") ? "default" : "ghost"}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            asChild
          >
            <Link to="/compliance-admin/dashboard">
              <Home className="h-4 w-4 mr-2" />
              {sidebarOpen && "Dashboard"}
            </Link>
          </Button>
          
          <Button
            variant={isActive("/compliance-admin/construction-types") ? "default" : "ghost"}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            asChild
          >
            <Link to="/compliance-admin/construction-types">
              <Building className="h-4 w-4 mr-2" />
              {sidebarOpen && "Construction Types"}
            </Link>
          </Button>
          
          <Button
            variant={isActive("/compliance-admin/occupancy-groups") ? "default" : "ghost"}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            asChild
          >
            <Link to="/compliance-admin/occupancy-groups">
              <Users className="h-4 w-4 mr-2" />
              {sidebarOpen && "Occupancy Groups"}
            </Link>
          </Button>
          
          <Button
            variant={isActive("/compliance-admin/space-types") ? "default" : "ghost"}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            asChild
          >
            <Link to="/compliance-admin/space-types">
              <Table className="h-4 w-4 mr-2" />
              {sidebarOpen && "Space Types"}
            </Link>
          </Button>
          
          <Button
            variant={isActive("/compliance-admin/height-area") ? "default" : "ghost"}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            asChild
          >
            <Link to="/compliance-admin/height-area">
              <Ruler className="h-4 w-4 mr-2" />
              {sidebarOpen && "Height & Area"}
            </Link>
          </Button>
          
          <Button
            variant={isActive("/compliance-admin/fire-ratings") ? "default" : "ghost"}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            asChild
          >
            <Link to="/compliance-admin/fire-ratings">
              <FlameKindling className="h-4 w-4 mr-2" />
              {sidebarOpen && "Fire Ratings"}
            </Link>
          </Button>
          
          <Button
            variant={isActive("/compliance-admin/zoning-districts") ? "default" : "ghost"}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            asChild
          >
            <Link to="/compliance-admin/zoning-districts">
              <Map className="h-4 w-4 mr-2" />
              {sidebarOpen && "Zoning Districts"}
            </Link>
          </Button>
          
          <Button
            variant={isActive("/compliance-admin/parking") ? "default" : "ghost"}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            asChild
          >
            <Link to="/compliance-admin/parking">
              <Car className="h-4 w-4 mr-2" />
              {sidebarOpen && "Parking Requirements"}
            </Link>
          </Button>
        </nav>
        
        <div className="pt-4">
          <Separator className="my-4" />
          {sidebarOpen && (
            <div className="px-2 mb-2">
              <p className="text-sm font-medium">{admin?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{admin?.role}</p>
            </div>
          )}
          <Button 
            variant="ghost" 
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`} 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {sidebarOpen && "Logout"}
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

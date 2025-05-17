import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, FileText, Settings, Users, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type AppLayoutProps = {
  children: ReactNode;
  onLogout: () => void;
};

export const AppLayout = ({ children, onLogout }: AppLayoutProps) => {
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    onLogout();
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  );
};

const AppSidebar = ({ onLogout }: { onLogout: () => void }) => {
  const sidebar = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-primary font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar 
      className={sidebar.state === "collapsed" ? "w-14" : "w-60"} 
      collapsible="icon"
    >
      <div className={`p-4 border-b flex ${sidebar.state === "collapsed" ? "justify-center" : "justify-between"} items-center`}>
        {sidebar.state !== "collapsed" && (
          <div className="font-semibold text-primary">HI Code Compliance</div>
        )}
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end className={getNavCls}>
                    <Home className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/projects" className={getNavCls}>
                    <FileText className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Projects</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls}>
                    <Settings className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/team" className={getNavCls}>
                    <Users className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Team</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Logout</span>}
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AppHeader = () => {
  return (
    <header className="border-b py-3 px-6 bg-card">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-primary">Hawaii Building Code Compliance</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">John Architect</span>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
            JA
          </div>
        </div>
      </div>
    </header>
  );
};

const AppFooter = () => {
  return (
    <footer className="border-t py-3 px-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Hawaii Building Code Compliance Platform
    </footer>
  );
};

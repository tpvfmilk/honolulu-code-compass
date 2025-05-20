
import { ChevronRight, Home, FileText, User, HelpCircle, LogOut, Database, MessageCircle } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

interface AppSidebarProps {
  onLogout: () => void;
}

export const AppSidebar = ({ onLogout }: AppSidebarProps) => {
  const sidebar = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);
  const getNavCls = ({ isActive }: { isActive: boolean; }) => 
    isActive ? "bg-sidebar-accent text-primary font-medium" : "hover:bg-sidebar-accent/50";
  
  return (
    <Sidebar className={sidebar.state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <div className={`p-4 border-b flex ${sidebar.state === "collapsed" ? "justify-center" : "justify-between"} items-center`}>
        {sidebar.state !== "collapsed" && <div className="font-semibold text-primary">Comply</div>}
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard" className={getNavCls}>
                    <Home className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Home</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/projects" className={getNavCls}>
                    <FileText className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>My Projects</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/project/new" className={getNavCls}>
                    <FileText className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>New Project</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/admin" className={getNavCls}>
                    <Database className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Admin Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/feedback" className={getNavCls}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Feedback</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/help" className={getNavCls}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Help Desk</span>}
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
                  <NavLink to="/profile" className={getNavCls}>
                    <User className="mr-2 h-4 w-4" />
                    {sidebar.state !== "collapsed" && <span>Profile</span>}
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


import { FC, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import {
  Menu,
  X,
  User,
  LayoutGrid,
  BookOpen,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => Promise<void>;
}

export const AppLayout: FC<AppLayoutProps> = ({ 
  children,
  onLogout
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const location = useLocation();

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Get current path for active link highlighting
  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-md hover:bg-gray-100"
              >
                {isOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
              </button>
            )}
            <Link to="/" className="font-bold text-lg">
              Hawaii Code Pro
            </Link>
          </div>
          
          {isMobile ? (
            <div className="flex items-center gap-3">
              <Link to="/projects" className="p-1.5 rounded-md hover:bg-gray-100">
                <LayoutGrid className="h-5 w-5 text-gray-700" />
              </Link>
              <Link to="/profile" className="p-1.5 rounded-md hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-700" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/profile" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm transition-colors",
                  isActivePath('/profile') 
                    ? "bg-ocean-50 text-ocean-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm font-medium px-3 py-2 rounded-md"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Overlay for mobile */}
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-white border-r border-gray-100 z-50 transition-all duration-300 ease-in-out",
            isMobile 
              ? "fixed inset-y-0 left-0 w-64" 
              : "sticky top-16 self-start h-[calc(100vh-4rem)] w-64",
            isOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "w-0 opacity-0"
          )}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Hawaii Code Pro</h2>
              <p className="text-sm text-gray-500 mt-1">Building Code Compliance</p>
            </div>
            
            {/* Sidebar Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              <Link
                to="/profile"
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors",
                  isActivePath('/profile')
                    ? "bg-ocean-50 text-ocean-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <User className={cn(
                  "h-5 w-5 mr-3", 
                  isActivePath('/profile') ? "text-ocean-700" : "text-gray-500"
                )} />
                <span>Profile</span>
              </Link>
              
              <Link
                to="/projects"
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors",
                  isActivePath('/projects')
                    ? "bg-ocean-50 text-ocean-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <LayoutGrid className={cn(
                  "h-5 w-5 mr-3", 
                  isActivePath('/projects') ? "text-ocean-700" : "text-gray-500"
                )} />
                <span>My Projects</span>
                {isActivePath('/projects') && (
                  <ChevronRight className="h-4 w-4 ml-auto text-ocean-700" />
                )}
              </Link>
              
              <Link
                to="/code-library"
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors",
                  isActivePath('/code-library')
                    ? "bg-ocean-50 text-ocean-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <BookOpen className={cn(
                  "h-5 w-5 mr-3", 
                  isActivePath('/code-library') ? "text-ocean-700" : "text-gray-500"
                )} />
                <span>Code Reference Library</span>
                {isActivePath('/code-library') && (
                  <ChevronRight className="h-4 w-4 ml-auto text-ocean-700" />
                )}
              </Link>
            </nav>
            
            {/* Sidebar Footer */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await onLogout();
                }}
                className="flex items-center w-full px-3 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>
        
        {/* Toggle sidebar button for desktop */}
        {!isMobile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "sticky top-20 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-md z-10 transition-all",
              isOpen ? "-ml-4" : "ml-0"
            )}
          >
            <ChevronRight className={cn(
              "h-4 w-4 text-gray-500 transition-transform",
              isOpen ? "rotate-180" : ""
            )} />
          </button>
        )}
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 py-6 px-4 sm:px-6 transition-all",
          isMobile ? "" : (isOpen ? "ml-0" : "ml-0")
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

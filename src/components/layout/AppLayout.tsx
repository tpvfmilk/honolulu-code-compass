import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import {
  Menu,
  X,
  User,
  LayoutGrid,
  BookOpen
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-lg">
            <Link to="/">Hawaii Code Pro</Link>
          </div>
          
          {isMobile ? (
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-sm text-gray-700 hover:text-gray-900">
                Profile
              </Link>
              <Link to="/projects" className="text-sm text-gray-700 hover:text-gray-900">
                My Projects
              </Link>
              <button
                className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={onLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {isMobile && isOpen ? (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        ) : null}
        
        <aside 
          className={`
            ${isMobile 
              ? "fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out"
              : "sticky top-16 h-[calc(100vh-4rem)]"
            }
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            ${!isMobile && isOpen ? "translate-x-0" : ""}
            w-64 bg-white border-r border-gray-200 py-4 overflow-auto
          `}
        >
          <div className="px-4 pb-4 mb-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Hawaii Code Pro</h2>
            <p className="text-sm text-gray-500">Building Code Compliance</p>
          </div>
          
          <nav className="space-y-1 px-2">
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
            >
              <User className="mr-3 h-5 w-5 text-gray-500" />
              <span>Profile</span>
            </Link>
            
            <Link
              to="/projects"
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
            >
              <LayoutGrid className="mr-3 h-5 w-5 text-gray-500" />
              <span>My Projects</span>
            </Link>
            
            <Link
              to="/code-library"
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
            >
              <BookOpen className="mr-3 h-5 w-5 text-gray-500" />
              <span>Code Reference Library</span>
            </Link>
            
            <button
              className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
              onClick={onLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mr-3 h-5 w-5 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm7.707 3.293a1 1 0 00-1.414 1.414L10.586 10l-2.293 2.293a1 1 0 101.414 1.414L12 11.414l2.293 2.293a1 1 0 001.414-1.414L13.414 10l2.293-2.293a1 1 0 00-1.414-1.414L12 8.586l-2.293-2.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>
        
        <main className="flex-1 py-6 px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

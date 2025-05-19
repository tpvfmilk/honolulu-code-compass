
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-primary font-bold text-xl flex items-center">
              <span className="mr-2">Comply</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/features"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/features") 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Features
            </Link>
            
            <div className="flex items-center pl-4">
              <Link to="/auth">
                <Button variant="outline" className="mr-3">
                  Log in
                </Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden bg-white border-b border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/features"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/features") 
                ? "text-primary" 
                : "text-gray-700 hover:text-primary"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-3 space-y-2 flex-col">
              <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full mb-2">
                  Log in
                </Button>
              </Link>
              <Link to="/auth?signup=true" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

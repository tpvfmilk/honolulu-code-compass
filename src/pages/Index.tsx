// src/pages/Index.tsx
import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, LayoutGrid, BookOpen } from "lucide-react";

const Index: FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-gray-900">
            Hawaii Code Pro
          </Link>
          <div>
            {isLoggedIn ? (
              <Button variant="outline" onClick={() => navigate("/profile")}>
                My Profile
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>Get Started</Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Hawaii Building Code Compliance Made Simple
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Navigate complex building codes with confidence using our comprehensive compliance tools
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {isLoggedIn ? (
              <>
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Analysis</h2>
                  <p className="text-gray-600 mb-6">
                    Create a new project and get a detailed compliance analysis based on your building specifications
                  </p>
                  <Link 
                    to="/project/create" 
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md text-center transition"
                  >
                    Start New Project
                  </Link>
                  <Link 
                    to="/projects" 
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md text-center mt-3 transition"
                  >
                    View Projects
                  </Link>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Reference Library</h2>
                  <p className="text-gray-600 mb-6">
                    Access and search through building codes, get plain language explanations, and bookmark frequently used sections
                  </p>
                  <Link 
                    to="/code-library" 
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md text-center transition"
                  >
                    Browse Code Library
                  </Link>
                  <Link 
                    to="/help" 
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md text-center mt-3 transition"
                  >
                    View Guides
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Project</h2>
                  <p className="text-gray-600 mb-6">
                    Create an account to start new projects and save your progress
                  </p>
                  <Link 
                    to="/auth" 
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md text-center transition"
                  >
                    Sign Up / Log In
                  </Link>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore the Platform</h2>
                  <p className="text-gray-600 mb-6">
                    Learn more about our features and how we can help you with building code compliance
                  </p>
                  <Link 
                    to="/help" 
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md text-center transition"
                  >
                    View Guides
                  </Link>
                </div>
              </>
            )}
          </div>
          
          <div className="py-12 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Sparkles className="mx-auto h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Analysis</h3>
                <p className="text-gray-600">
                  Our AI-powered engine analyzes your project specifications and identifies relevant code requirements
                </p>
              </div>
              
              <div className="text-center">
                <LayoutGrid className="mx-auto h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Coverage</h3>
                <p className="text-gray-600">
                  We cover all major building codes and regulations in Hawaii, ensuring you have a complete view
                </p>
              </div>
              
              <div className="text-center">
                <BookOpen className="mx-auto h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Code Reference</h3>
                <p className="text-gray-600">
                  Access our extensive code reference library, with plain language explanations and bookmarking features
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Hawaii Code Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

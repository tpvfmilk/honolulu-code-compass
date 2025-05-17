
import {
  RouterProvider,
  useNavigate,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession, SessionProvider } from "./hooks/useSession";
import { supabase } from "./integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProjectCreate from "./pages/ProjectCreate";
import ProjectView from "./pages/ProjectView";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";

function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const { session, setSession } = useSession();
  const navigate = useNavigate();
  
  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  // Only navigate when not loading and only if we're on an unauthorized route
  useEffect(() => {
    if (!loading) {
      const currentPath = window.location.pathname;
      
      // Public routes - always accessible
      const publicRoutes = ['/', '/auth', '/help'];
      const isPublicRoute = publicRoutes.includes(currentPath);
      
      // Protected routes - require authentication
      const needsAuth = !isPublicRoute;
      
      // Only redirect if this is not the initial load to prevent redirect loops
      if (!session && needsAuth) {
        console.log("No session and requires auth, redirecting to /auth");
        navigate("/auth");
      } else if (session && currentPath === "/auth") {
        console.log("User is authenticated, redirecting from /auth to /profile");
        navigate("/profile");
      }
      
      // Mark initial load as complete
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [session, loading, navigate, isInitialLoad]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await supabase.auth.signOut();
      console.log("Logout successful, navigating to home");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Define routes with authentication protection
  return (
    <Routes>
      <Route path="/" element={<Index onLogout={handleLogout} />} />
      <Route path="/auth" element={<Auth onLogout={handleLogout} />} />
      <Route path="/help" element={<Help onLogout={handleLogout} />} />
      <Route 
        path="/profile" 
        element={session ? <Profile onLogout={handleLogout} /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/project/new" 
        element={session ? <ProjectCreate onLogout={handleLogout} /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/project/:id" 
        element={session ? <ProjectView onLogout={handleLogout} /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/admin" 
        element={session ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/auth" replace />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <SidebarProvider>
          <AppRoutes />
        </SidebarProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;

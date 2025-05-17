
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
      
      if (!session && needsAuth) {
        navigate("/auth");
      } else if (session && currentPath === "/auth") {
        navigate("/profile");
      }
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Define routes with authentication protection
  return (
    <Routes>
      <Route path="/" element={<Index onLogout={handleLogout} />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/help" element={<Help onLogout={handleLogout} />} />
      <Route 
        path="/profile" 
        element={session ? <Profile onLogout={handleLogout} /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/project/new" 
        element={session ? <ProjectCreate onLogout={handleLogout} /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/project/:id" 
        element={session ? <ProjectView onLogout={handleLogout} /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/admin" 
        element={session ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/auth" />} 
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

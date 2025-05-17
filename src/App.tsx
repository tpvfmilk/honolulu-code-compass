
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession, SessionProvider } from "./hooks/useSession";
import { supabase } from "./integrations/supabase/client";
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [setSession]);

  useEffect(() => {
    if (!session && !loading && window.location.pathname !== "/") {
      navigate("/auth");
    } else if (session && !loading && window.location.pathname === "/auth") {
      navigate("/profile");
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <></>;
  }

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<Index onLogout={handleLogout} />} />
      <Route path="/help" element={<Help onLogout={handleLogout} />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
      <Route path="/project/new" element={<ProjectCreate onLogout={handleLogout} />} />
      <Route path="/project/:id" element={<ProjectView onLogout={handleLogout} />} />
      <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;

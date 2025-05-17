
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

  return (
    <Routes>
      <Route path="/" element={<Index onLogout={() => navigate('/')} />} />
      <Route path="/help" element={<Help />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/project/new" element={<ProjectCreate />} />
      <Route path="/project/:id" element={<ProjectView />} />
      <Route path="/admin" element={<AdminDashboard onLogout={() => navigate('/')} />} />
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

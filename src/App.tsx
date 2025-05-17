import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
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

function App() {
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
  }, []);

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
    <>
      <RouterProvider router={router} />
    </>
  );
}

function SessionApp() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  );
}

export default SessionApp;

// Routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index onLogin={() => navigate('/auth')} />,
    errorElement: <NotFound />,
  },
  {
    path: '/help',
    element: <Help />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/project/new',
    element: <ProjectCreate />,
  },
  {
    path: '/project/:id',
    element: <ProjectView />,
  },
  {
    path: '/admin',
    element: <AdminDashboard onLogout={() => navigate('/')} />,
  },
]);

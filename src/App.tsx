
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import ProjectCreate from "./pages/ProjectCreate";
import ProjectView from "./pages/ProjectView";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import CodeSheetPreview from "./pages/CodeSheetPreview";
import Profile from "./pages/Profile";
import Help from "./pages/Help";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects/new" element={<ProjectCreate onLogout={handleLogout} />} />
              <Route path="/projects/:id" element={<ProjectView onLogout={handleLogout} />} />
              <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
              <Route path="/projects/:id/preview" element={<CodeSheetPreview onLogout={handleLogout} />} />
              <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
              <Route path="/help" element={<Help onLogout={handleLogout} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

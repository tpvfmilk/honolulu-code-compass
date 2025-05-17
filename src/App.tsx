
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';
import './App.css';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Index from './pages/Index';
import ProjectsList from './pages/ProjectsList';
import ProjectView from './pages/ProjectView';
import ProjectCreate from './pages/ProjectCreate';
import AdminDashboard from './pages/AdminDashboard';
import Help from './pages/Help';
import CodeSheetPreview from './pages/CodeSheetPreview';
import NotFound from './pages/NotFound';
import CodeReferenceLibrary from './pages/CodeReferenceLibrary';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthProvider>
      <div className="App">
        <Toaster />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="/projects" element={<ProjectsList onLogout={handleLogout} />} />
            <Route path="/code-library" element={<CodeReferenceLibrary onLogout={handleLogout} />} />
            <Route path="/project/:id" element={<ProjectView onLogout={handleLogout} />} />
            <Route path="/project/create" element={<ProjectCreate onLogout={handleLogout} />} />
            <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
            <Route path="/help" element={<Help onLogout={handleLogout} />} />
            <Route path="/code-sheet-preview" element={<CodeSheetPreview onLogout={handleLogout} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

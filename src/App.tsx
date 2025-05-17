import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
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

  const handleLogin = () => {
    // This function might not be needed, as the state changes automatically
    // with supabase.auth.onAuthStateChange.
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/code-library" element={<CodeReferenceLibrary onLogout={handleLogout} />} />
          <Route path="/project/:id" element={<ProjectView />} />
          <Route path="/project/create" element={<ProjectCreate />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/help" element={<Help />} />
          <Route path="/code-sheet-preview" element={<CodeSheetPreview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

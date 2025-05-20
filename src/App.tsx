
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSession, useSupabaseClient } from './hooks/useSupabaseAuth';

// Import available pages
import LandingPage from './pages/LandingPage';
import Index from './pages/Index';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Features from './pages/Features';

// Import knowledge base routes
import { ArticleView } from "./components/knowledge/ArticleView";
import { AdminLogin } from "./components/knowledge/admin/AdminLogin";
import { AdminLayout } from "./components/knowledge/admin/AdminLayout";

// Import compliance admin routes
import { ComplianceAdminLogin } from './components/compliance/admin/ComplianceAdminLogin';
import { ComplianceAdminLayout } from './components/compliance/admin/ComplianceAdminLayout';
import { ComplianceAdminDashboard } from './components/compliance/admin/Dashboard';

function App() {
  const session = useSession();
  const supabase = useSupabaseClient();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    return Promise.resolve();
  };

  return (
    <Router>
      <Routes>
        {/* Main application routes */}
        <Route path="/" element={
          session ? <Index onLogout={handleLogout} /> : <LandingPage />
        } />
        <Route path="/public" element={<div>Public Page</div>} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/help" element={<Help onLogout={handleLogout} />} />
        <Route path="/legal" element={<div>Legal Page</div>} />
        <Route path="/terms" element={<div>Terms Page</div>} />
        <Route path="/privacy" element={<div>Privacy Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
        <Route path="/features" element={<Features />} />
        
        {/* Authentication routes */}
        <Route path="/auth" element={<Auth onLogout={handleLogout} />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        
        {/* Protected routes - redirect to login if not authenticated */}
        <Route path="/projects" element={
          !session ? (
            <Navigate to="/auth" replace={true} />
          ) : (
            <div>Projects Page</div>
          )
        } />
        
        <Route path="/projects/new" element={
          !session ? (
            <Navigate to="/auth" replace={true} />
          ) : (
            <div>New Project Page</div>
          )
        } />
        
        <Route path="/project/:id" element={
          !session ? (
            <Navigate to="/auth" replace={true} />
          ) : (
            <div>Project Detail Page</div>
          )
        } />
        
        <Route path="/account" element={
          !session ? (
            <Navigate to="/auth" replace={true} />
          ) : (
            <div>Account Page</div>
          )
        } />
        
        {/* Knowledge Base Admin routes */}
        <Route path="/admin/login" element={
          <AdminLogin />
        } />
        
        <Route path="/admin/*" element={
          <AdminLayout />
        } />

        {/* Compliance Admin routes */}
        <Route path="/compliance-admin/login" element={
          <ComplianceAdminLogin />
        } />
        
        <Route path="/compliance-admin" element={<ComplianceAdminLayout />}>
          <Route index element={<Navigate to="/compliance-admin/dashboard" replace />} />
          <Route path="dashboard" element={<ComplianceAdminDashboard />} />
          <Route path="construction-types" element={<div>Construction Types Management</div>} />
          <Route path="occupancy-groups" element={<div>Occupancy Groups Management</div>} />
          <Route path="height-area" element={<div>Height & Area Limits Management</div>} />
          <Route path="fire-ratings" element={<div>Fire Ratings Management</div>} />
        </Route>
        
        {/* Knowledge Base routes */}
        <Route path="/knowledge-base/article/:articleId" element={
          <ArticleView />
        } />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

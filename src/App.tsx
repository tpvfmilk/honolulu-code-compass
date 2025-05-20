
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useSession, useSupabaseClient } from './hooks/useSupabaseAuth';

// Import available pages
import Help from './pages/Help';
import NotFound from './pages/NotFound';

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

  return (
    <Router>
      <Routes>
        {/* Add proper page components as they become available */}
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/public" element={<div>Public Page</div>} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/help" element={<Help onLogout={() => supabase.auth.signOut()} />} />
        <Route path="/legal" element={<div>Legal Page</div>} />
        <Route path="/terms" element={<div>Terms Page</div>} />
        <Route path="/privacy" element={<div>Privacy Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
        
        {/* Protected routes - redirect to login if not authenticated */}
        <Route path="/projects" element={
          !session ? (
            <Navigate to="/login" replace={true} />
          ) : (
            <div>Projects Page</div>
          )
        } />
        
        <Route path="/projects/new" element={
          !session ? (
            <Navigate to="/login" replace={true} />
          ) : (
            <div>New Project Page</div>
          )
        } />
        
        <Route path="/project/:id" element={
          !session ? (
            <Navigate to="/login" replace={true} />
          ) : (
            <div>Project Detail Page</div>
          )
        } />
        
        <Route path="/account" element={
          !session ? (
            <Navigate to="/login" replace={true} />
          ) : (
            <div>Account Page</div>
          )
        } />
        
        <Route path="/login" element={
          <div className="flex min-h-screen items-center justify-center">
            <div>Login Page</div>
          </div>
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

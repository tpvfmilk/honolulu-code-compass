
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useSession, useSupabaseClient } from './hooks/useSupabaseAuth';

// Import available pages
import Help from './pages/Help';
import NotFound from './pages/NotFound';

// Import new routes
import { ArticleView } from "./components/knowledge/ArticleView";
import { AdminLogin } from "./components/knowledge/admin/AdminLogin";
import { AdminLayout } from "./components/knowledge/admin/AdminLayout";

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
        
        {/* Knowledge Base routes */}
        <Route path="/knowledge-base/article/:articleId" element={
          <ArticleView />
        } />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={
          <AdminLogin />
        } />
        
        <Route path="/admin/*" element={
          <AdminLayout />
        } />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

import Account from './pages/Account'
import Home from './pages/Home';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import Project from './pages/Project';
import Public from './pages/Public';
import About from './pages/About';
import Help from './pages/Help';
import Legal from './pages/Legal';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Import new routes
import { ArticleView } from "./components/knowledge/ArticleView";
import { AdminLogin } from "./components/knowledge/admin/AdminLogin";
import { AdminLayout } from "./components/knowledge/admin/AdminLayout";

function App() {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/public" element={<Public />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/help" element={<Help onLogout={() => supabase.auth.signOut()} />} />
        <Route exact path="/legal" element={<Legal />} />
        <Route exact path="/terms" element={<Terms />} />
        <Route exact path="/privacy" element={<Privacy />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route path="/projects" element={
          !session ? (
            <Navigate to="/login" replace={true} />
          ) : (
            <Projects />
          )
        } />
        <Route path="/projects/new" element={
          !session ? (
            <Navigate to="/login" replace={true} />
          ) : (
            <NewProject />
          )
        } />
        <Route path="/project/:id" element={
          !session ? (
            <Navigate to="/login" replace={true} />
          ) : (
            <Project />
          )
        } />
        <Route path="/account" element={
          !session ? (
            <Navigate to="/login" replace={true} />
          ) : (
            <Account session={session} />
          )
        } />
        <Route exact path="/login" element={
          <div className="flex min-h-screen items-center justify-center">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'github']}
              redirectTo="http://localhost:5173/account"
            />
          </div>
        } />
        
        {/* Add new routes for Knowledge Base */}
        <Route path="/knowledge-base/article/:articleId" element={
          <ArticleView />
        } />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={
          <AdminLogin />
        } />
        <Route path="/admin" element={
          <AdminLayout />
        }>
          {/* Admin dashboard (default route) */}
          <Route path="dashboard" element={<div>Dashboard</div>} />
          
          {/* Articles management */}
          <Route path="articles" element={<div>Articles</div>} />
          <Route path="articles/new" element={<div>New Article</div>} />
          <Route path="articles/edit/:articleId" element={<div>Edit Article</div>} />
          
          {/* Categories management */}
          <Route path="categories" element={<div>Categories</div>} />
          
          {/* Feedback management */}
          <Route path="feedback" element={<div>Feedback</div>} />
        </Route>
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

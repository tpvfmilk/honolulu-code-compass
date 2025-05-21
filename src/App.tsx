
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
import Feedback from './pages/Feedback';
import ProjectsList from './pages/ProjectsList';
import ProjectCreate from './pages/ProjectCreate';
import ProjectView from './pages/ProjectView';
import PublicKnowledgeBase from './pages/PublicKnowledgeBase';

// Import knowledge base routes
import { ArticleView } from "./components/knowledge/ArticleView";
import { PublicArticleView } from "./components/knowledge/PublicArticleView";
import { AdminLogin } from "./components/knowledge/admin/AdminLogin";
import { AdminLayout } from "./components/knowledge/admin/AdminLayout";
import Dashboard from "./components/knowledge/admin/Dashboard";
import Articles from "./components/knowledge/admin/Articles";
import FeedbackPage from "./components/knowledge/admin/Feedback";

// Import compliance admin routes
import { ComplianceAdminLogin } from './components/compliance/admin/ComplianceAdminLogin';
import { ComplianceAdminLayout } from './components/compliance/admin/ComplianceAdminLayout';
import { ComplianceAdminDashboard } from './components/compliance/admin/Dashboard';
import { ConstructionTypes } from './components/compliance/admin/ConstructionTypes';
import { OccupancyGroups } from './components/compliance/admin/OccupancyGroups';
import { SpaceTypes } from './components/compliance/admin/SpaceTypes';
import { HeightAreaTable } from './components/compliance/admin/HeightAreaTable';
import { FireRatingsTable } from './components/compliance/admin/FireRatingsTable';
import { ZoningDistrictsTable } from './components/compliance/admin/ZoningDistrictsTable';
import { ParkingRequirementsTable } from './components/compliance/admin/ParkingRequirementsTable';

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
        <Route path="/help" element={
          session ? <Help onLogout={handleLogout} /> : <PublicKnowledgeBase />
        } />
        <Route path="/legal" element={<div>Legal Page</div>} />
        <Route path="/terms" element={<div>Terms Page</div>} />
        <Route path="/privacy" element={<div>Privacy Page</div>} />
        <Route path="/contact" element={<Navigate to="/feedback" replace={true} />} />
        <Route path="/features" element={<Features />} />
        <Route path="/feedback" element={
          !session ? (
            <Navigate to="/auth?redirect=/feedback" replace={true} />
          ) : (
            <Feedback onLogout={handleLogout} />
          )
        } />
        
        {/* Authentication routes */}
        <Route path="/auth" element={<Auth onLogout={handleLogout} />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        
        {/* Protected routes - redirect to login if not authenticated */}
        <Route path="/projects" element={
          !session ? (
            <Navigate to="/auth?redirect=/projects" replace={true} />
          ) : (
            <ProjectsList onLogout={handleLogout} />
          )
        } />
        
        <Route path="/project/new" element={
          !session ? (
            <Navigate to="/auth?redirect=/project/new" replace={true} />
          ) : (
            <ProjectCreate onLogout={handleLogout} />
          )
        } />
        
        {/* Add route for editing projects */}
        <Route path="/project/edit/:id" element={
          !session ? (
            <Navigate to="/auth?redirect=/project" replace={true} />
          ) : (
            <ProjectCreate onLogout={handleLogout} />
          )
        } />
        
        <Route path="/project/:id" element={
          !session ? (
            <Navigate to="/auth?redirect=/project" replace={true} />
          ) : (
            <ProjectView onLogout={handleLogout} />
          )
        } />
        
        <Route path="/account" element={
          !session ? (
            <Navigate to="/auth?redirect=/account" replace={true} />
          ) : (
            <div>Account Page</div>
          )
        } />
        
        {/* Knowledge Base Admin routes */}
        <Route path="/admin/login" element={
          <AdminLogin />
        } />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="articles" element={<Articles />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>

        {/* Compliance Admin routes - renamed to Information Database in the UI */}
        <Route path="/compliance-admin/login" element={
          <ComplianceAdminLogin />
        } />
        
        <Route path="/compliance-admin" element={<ComplianceAdminLayout />}>
          <Route index element={<Navigate to="/compliance-admin/dashboard" replace />} />
          <Route path="dashboard" element={<ComplianceAdminDashboard />} />
          <Route path="construction-types" element={<ConstructionTypes />} />
          <Route path="occupancy-groups" element={<OccupancyGroups />} />
          <Route path="space-types" element={<SpaceTypes />} />
          <Route path="height-area" element={<HeightAreaTable />} />
          <Route path="fire-ratings" element={<FireRatingsTable />} />
          <Route path="zoning-districts" element={<ZoningDistrictsTable />} />
          <Route path="parking" element={<ParkingRequirementsTable />} />
        </Route>
        
        {/* Knowledge Base routes */}
        <Route path="/knowledge-base/article/:articleId" element={
          session ? <ArticleView /> : <PublicArticleView />
        } />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

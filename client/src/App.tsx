import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage, AuthPage, HomePage, EditorPage, ProjectsPage, ProfilePage, NotFoundPage } from './pages';
import { useFloorPlan } from './lib/stores/useFloorPlan';
import "@fontsource/inter";
import './index.css';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentPlan } = useFloorPlan();

  if (!currentPlan) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

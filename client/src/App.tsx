import React, { useState } from 'react';
import { FloorPlanner } from './components/FloorPlanner';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { useFloorPlan } from './lib/stores/useFloorPlan';
import "@fontsource/inter";
import './index.css';

type AppView = 'landing' | 'auth' | 'editor';

function App() {
  const { createNewPlan, currentPlan } = useFloorPlan();
  const [currentView, setCurrentView] = useState<AppView>(
    currentPlan ? 'editor' : 'landing'
  );

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleAuth = () => {
    if (!currentPlan) {
      createNewPlan('My First Floor Plan');
    }
    setCurrentView('editor');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  if (currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (currentView === 'auth') {
    return <AuthPage onAuth={handleAuth} onBack={handleBackToLanding} />;
  }

  return (
    <div className="w-full h-screen font-sans fixed inset-0 overflow-hidden">
      <FloorPlanner />
    </div>
  );
}

export default App;

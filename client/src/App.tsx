import React, { useState } from 'react';
import { FloorPlanner } from './components/FloorPlanner';
import { LandingPage } from './components/LandingPage';
import { useFloorPlan } from './lib/stores/useFloorPlan';
import "@fontsource/inter";
import './index.css';

function App() {
  const { createNewPlan, currentPlan } = useFloorPlan();
  const [showLanding, setShowLanding] = useState(!currentPlan);

  const handleGetStarted = () => {
    if (!currentPlan) {
      createNewPlan('My First Floor Plan');
    }
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="w-full h-screen font-sans">
      <FloorPlanner />
    </div>
  );
}

export default App;

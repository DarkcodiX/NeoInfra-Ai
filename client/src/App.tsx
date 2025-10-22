import React, { useEffect } from 'react';
import { FloorPlanner } from './components/FloorPlanner';
import { useFloorPlan } from './lib/stores/useFloorPlan';
import "@fontsource/inter";
import './index.css';

function App() {
  const { createNewPlan, currentPlan } = useFloorPlan();

  useEffect(() => {
    // Create a default project if none exists
    if (!currentPlan) {
      createNewPlan('My First Floor Plan');
    }
  }, [currentPlan, createNewPlan]);

  return (
    <div className="w-full h-screen font-sans">
      <FloorPlanner />
    </div>
  );
}

export default App;

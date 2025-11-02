import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePage as HomePageComponent } from '../components/HomePage';
import { useFloorPlan } from '../lib/stores/useFloorPlan';

export function HomePage() {
  const navigate = useNavigate();
  const { createNewPlan } = useFloorPlan();

  const handleCreateNew = () => {
    createNewPlan('New Floor Plan');
    navigate('/editor');
  };

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <HomePageComponent
      onCreateNew={handleCreateNew}
      onViewProjects={handleViewProjects}
      onViewProfile={handleViewProfile}
    />
  );
}

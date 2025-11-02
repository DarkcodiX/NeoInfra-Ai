import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage as AuthPageComponent } from '../components/AuthPage';
import { useFloorPlan } from '../lib/stores/useFloorPlan';

export function AuthPage() {
  const navigate = useNavigate();
  const { createNewPlan, currentPlan } = useFloorPlan();

  const handleAuth = () => {
    navigate('/home');
  };

  const handleBack = () => {
    navigate('/');
  };

  return <AuthPageComponent onAuth={handleAuth} onBack={handleBack} />;
}
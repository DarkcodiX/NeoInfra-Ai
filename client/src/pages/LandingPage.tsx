import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage as LandingPageComponent } from '../components/LandingPage';

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return <LandingPageComponent onGetStarted={handleGetStarted} />;
}
import React from 'react';
import { Button } from './ui/button';
import { ViewMode } from '../types/floor-plan';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { Grid3X3, Box } from 'lucide-react';

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useFloorPlan();

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <Button
        variant={viewMode === '2d' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('2d')}
        className="flex items-center gap-2"
      >
        <Grid3X3 className="w-4 h-4" />
        2D
      </Button>
      <Button
        variant={viewMode === '3d' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('3d')}
        className="flex items-center gap-2"
      >
        <Box className="w-4 h-4" />
        3D
      </Button>
    </div>
  );
}

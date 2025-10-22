import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { Tool } from '../types/floor-plan';
import {
  MousePointer,
  Square,
  Minus,
  Armchair,
  Ruler,
  Grid,
  Save,
  FolderOpen,
  Plus
} from 'lucide-react';

const toolIcons: Record<Tool, any> = {
  select: MousePointer,
  room: Square,
  wall: Minus,
  furniture: Armchair,
  measure: Ruler
};

export function Toolbar() {
  const {
    activeTool,
    setActiveTool,
    snapToGrid,
    toggleSnapToGrid,
    showGrid,
    toggleShowGrid,
    savePlan,
    createNewPlan
  } = useFloorPlan();

  const handleNewProject = () => {
    const name = prompt('Enter project name:');
    if (name) {
      createNewPlan(name);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {Object.entries(toolIcons).map(([tool, Icon]) => (
          <Button
            key={tool}
            variant={activeTool === tool ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTool(tool as Tool)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex items-center gap-2">
        <Button
          variant={snapToGrid ? 'default' : 'outline'}
          size="sm"
          onClick={toggleSnapToGrid}
          className="flex items-center gap-2"
        >
          <Grid className="w-4 h-4" />
          Snap
        </Button>
        
        <Button
          variant={showGrid ? 'default' : 'outline'}
          size="sm"
          onClick={toggleShowGrid}
          className="flex items-center gap-2"
        >
          <Grid className="w-4 h-4" />
          Grid
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewProject}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={savePlan}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
    </div>
  );
}

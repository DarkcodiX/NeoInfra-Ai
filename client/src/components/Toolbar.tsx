import React, { useRef } from 'react';
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
  Plus,
  Download
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
    createNewPlan,
    currentPlan
  } = useFloorPlan();

  const handleNewProject = () => {
    const name = prompt('Enter project name:');
    if (name) {
      createNewPlan(name);
    }
  };

  const handleExport = () => {
    if (!currentPlan) {
      alert('No floor plan to export');
      return;
    }

    // Create a JSON export
    const dataStr = JSON.stringify(currentPlan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentPlan.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-2"
          disabled={!currentPlan}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  );
}

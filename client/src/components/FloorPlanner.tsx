import React from 'react';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { ViewModeToggle } from './ViewModeToggle';
import { Canvas2D } from './Canvas2D';
import { Canvas3D } from './Canvas3D';
import { PropertyPanel } from './PropertyPanel';
import { AIComposer } from './AIComposer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function FloorPlanner() {
  const { viewMode, currentPlan } = useFloorPlan();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">NeoInfra AI</h1>
          {currentPlan && (
            <span className="text-sm text-gray-600">
              {currentPlan.name}
            </span>
          )}
        </div>
        <ViewModeToggle />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative">
          {viewMode === '2d' ? (
            <Canvas2D />
          ) : (
            <Canvas3D />
          )}
        </div>
        
        {/* Right Sidebar - AI Composer & Properties */}
        <div className="w-80 bg-white border-l border-gray-200">
          <Tabs defaultValue="ai" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 m-2">
              <TabsTrigger value="ai" className="text-xs">AI Composer</TabsTrigger>
              <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="ai" className="h-full m-0 p-4 overflow-y-auto">
                <AIComposer />
              </TabsContent>
              <TabsContent value="properties" className="h-full m-0">
                <PropertyPanel />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

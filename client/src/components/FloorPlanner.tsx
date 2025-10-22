import React from 'react';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { Toolbar } from './Toolbar';
import { ViewModeToggle } from './ViewModeToggle';
import { Canvas2D } from './Canvas2D';
import { Canvas3D } from './Canvas3D';
import { FurnitureLibrary } from './FurnitureLibrary';
import { PropertyPanel } from './PropertyPanel';
import { ProjectGallery } from './ProjectGallery';
import { RoomCustomizer } from './RoomCustomizer';
import { ShoppingList } from './ShoppingList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function FloorPlanner() {
  const { viewMode, currentPlan } = useFloorPlan();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Floor Planner</h1>
          {currentPlan && (
            <span className="text-sm text-gray-600">
              {currentPlan.name}
            </span>
          )}
        </div>
        <ViewModeToggle />
      </div>
      
      {/* Toolbar */}
      <Toolbar />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200">
          <Tabs defaultValue="projects" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 m-2">
              <TabsTrigger value="projects" className="text-xs">Projects</TabsTrigger>
              <TabsTrigger value="furniture" className="text-xs">Furniture</TabsTrigger>
              <TabsTrigger value="rooms" className="text-xs">Rooms</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="projects" className="h-full m-0">
                <ProjectGallery />
              </TabsContent>
              <TabsContent value="furniture" className="h-full m-0">
                <FurnitureLibrary />
              </TabsContent>
              <TabsContent value="rooms" className="h-full m-0">
                <RoomCustomizer />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 relative">
          {viewMode === '2d' ? (
            <Canvas2D />
          ) : (
            <Canvas3D />
          )}
        </div>
        
        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200">
          <Tabs defaultValue="properties" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 m-2">
              <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
              <TabsTrigger value="shopping" className="text-xs">Shopping List</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="properties" className="h-full m-0">
                <PropertyPanel />
              </TabsContent>
              <TabsContent value="shopping" className="h-full m-0">
                <ShoppingList />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

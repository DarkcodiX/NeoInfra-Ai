import React from 'react';
import { FloorPlanner } from '../components/FloorPlanner';

export function EditorPage() {
  return (
    <div className="w-full h-screen font-sans fixed inset-0 overflow-hidden">
      <FloorPlanner />
    </div>
  );
}
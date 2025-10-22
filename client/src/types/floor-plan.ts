export interface Point {
  x: number;
  y: number;
}

export interface Room {
  id: string;
  name: string;
  points: Point[];
  color: string;
  floorTexture: string;
  wallColor: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
}

export interface FurnitureItem {
  id: string;
  type: string;
  name: string;
  position: Point;
  rotation: number;
  scale: Point;
  color?: string;
  model?: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  rooms: Room[];
  walls: Wall[];
  furniture: FurnitureItem[];
  scale: number;
  gridSize: number;
  created: Date;
  modified: Date;
}

export type ViewMode = '2d' | '3d';
export type Tool = 'select' | 'room' | 'wall' | 'furniture' | 'measure';

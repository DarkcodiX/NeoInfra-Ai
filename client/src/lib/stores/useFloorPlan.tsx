import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { FloorPlan, Room, Wall, FurnitureItem, ViewMode, Tool, Point } from '../../types/floor-plan';
import { templateFloorPlans } from '../template-data';

interface FloorPlanState {
  // Current state
  currentPlan: FloorPlan | null;
  viewMode: ViewMode;
  activeTool: Tool;
  selectedItem: string | null;
  isDrawing: boolean;
  snapToGrid: boolean;
  showGrid: boolean;
  
  // Saved plans
  savedPlans: FloorPlan[];
  
  // Actions
  setCurrentPlan: (plan: FloorPlan) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveTool: (tool: Tool) => void;
  setSelectedItem: (id: string | null) => void;
  setIsDrawing: (drawing: boolean) => void;
  toggleSnapToGrid: () => void;
  toggleShowGrid: () => void;
  
  // Plan operations
  createNewPlan: (name: string) => void;
  savePlan: () => void;
  loadPlan: (id: string) => void;
  deletePlan: (id: string) => void;
  
  // Room operations
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  
  // Wall operations
  addWall: (wall: Omit<Wall, 'id'>) => void;
  updateWall: (id: string, updates: Partial<Wall>) => void;
  deleteWall: (id: string) => void;
  
  // Furniture operations
  addFurniture: (furniture: Omit<FurnitureItem, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  deleteFurniture: (id: string) => void;
  
  // Utility functions
  generateId: () => string;
  snapPoint: (point: Point) => Point;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useFloorPlan = create<FloorPlanState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentPlan: null,
    viewMode: '2d',
    activeTool: 'select',
    selectedItem: null,
    isDrawing: false,
    snapToGrid: true,
    showGrid: true,
    savedPlans: [],
    
    // Basic setters
    setCurrentPlan: (plan) => set({ currentPlan: plan }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setActiveTool: (tool) => set({ activeTool: tool, selectedItem: null }),
    setSelectedItem: (id) => set({ selectedItem: id }),
    setIsDrawing: (drawing) => set({ isDrawing: drawing }),
    toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
    toggleShowGrid: () => set((state) => ({ showGrid: !state.showGrid })),
    
    // Plan operations
    createNewPlan: (name) => {
      const newPlan: FloorPlan = {
        id: generateId(),
        name,
        rooms: [],
        walls: [],
        furniture: [],
        scale: 1,
        gridSize: 0.5,
        created: new Date(),
        modified: new Date()
      };
      set({ currentPlan: newPlan });
    },
    
    savePlan: () => {
      const { currentPlan, savedPlans } = get();
      if (!currentPlan) return;
      
      const updatedPlan = { ...currentPlan, modified: new Date() };
      const existingIndex = savedPlans.findIndex(p => p.id === currentPlan.id);
      
      let newSavedPlans;
      if (existingIndex >= 0) {
        newSavedPlans = [...savedPlans];
        newSavedPlans[existingIndex] = updatedPlan;
      } else {
        newSavedPlans = [...savedPlans, updatedPlan];
      }
      
      set({ currentPlan: updatedPlan, savedPlans: newSavedPlans });
      
      // Save to localStorage
      localStorage.setItem('floorPlans', JSON.stringify(newSavedPlans));
    },
    
    loadPlan: (id) => {
      const { savedPlans } = get();
      const plan = [...savedPlans, ...templateFloorPlans].find(p => p.id === id);
      if (plan) {
        set({ currentPlan: plan });
      }
    },
    
    deletePlan: (id) => {
      const { savedPlans } = get();
      const newSavedPlans = savedPlans.filter(p => p.id !== id);
      set({ savedPlans: newSavedPlans });
      localStorage.setItem('floorPlans', JSON.stringify(newSavedPlans));
    },
    
    // Room operations
    addRoom: (roomData) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const room: Room = { ...roomData, id: generateId() };
      const updatedPlan = {
        ...currentPlan,
        rooms: [...currentPlan.rooms, room],
        modified: new Date()
      };
      set({ currentPlan: updatedPlan });
    },
    
    updateRoom: (id, updates) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const updatedRooms = currentPlan.rooms.map(room =>
        room.id === id ? { ...room, ...updates } : room
      );
      const updatedPlan = {
        ...currentPlan,
        rooms: updatedRooms,
        modified: new Date()
      };
      set({ currentPlan: updatedPlan });
    },
    
    deleteRoom: (id) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const updatedPlan = {
        ...currentPlan,
        rooms: currentPlan.rooms.filter(room => room.id !== id),
        modified: new Date()
      };
      set({ currentPlan: updatedPlan, selectedItem: null });
    },
    
    // Wall operations
    addWall: (wallData) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const wall: Wall = { ...wallData, id: generateId() };
      const updatedPlan = {
        ...currentPlan,
        walls: [...currentPlan.walls, wall],
        modified: new Date()
      };
      set({ currentPlan: updatedPlan });
    },
    
    updateWall: (id, updates) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const updatedWalls = currentPlan.walls.map(wall =>
        wall.id === id ? { ...wall, ...updates } : wall
      );
      const updatedPlan = {
        ...currentPlan,
        walls: updatedWalls,
        modified: new Date()
      };
      set({ currentPlan: updatedPlan });
    },
    
    deleteWall: (id) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const updatedPlan = {
        ...currentPlan,
        walls: currentPlan.walls.filter(wall => wall.id !== id),
        modified: new Date()
      };
      set({ currentPlan: updatedPlan, selectedItem: null });
    },
    
    // Furniture operations
    addFurniture: (furnitureData) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const furniture: FurnitureItem = { ...furnitureData, id: generateId() };
      const updatedPlan = {
        ...currentPlan,
        furniture: [...currentPlan.furniture, furniture],
        modified: new Date()
      };
      set({ currentPlan: updatedPlan });
    },
    
    updateFurniture: (id, updates) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const updatedFurniture = currentPlan.furniture.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      const updatedPlan = {
        ...currentPlan,
        furniture: updatedFurniture,
        modified: new Date()
      };
      set({ currentPlan: updatedPlan });
    },
    
    deleteFurniture: (id) => {
      const { currentPlan } = get();
      if (!currentPlan) return;
      
      const updatedPlan = {
        ...currentPlan,
        furniture: currentPlan.furniture.filter(item => item.id !== id),
        modified: new Date()
      };
      set({ currentPlan: updatedPlan, selectedItem: null });
    },
    
    // Utility functions
    generateId,
    snapPoint: (point) => {
      const { snapToGrid, currentPlan } = get();
      if (!snapToGrid || !currentPlan) return point;
      
      const gridSize = currentPlan.gridSize;
      return {
        x: Math.round(point.x / gridSize) * gridSize,
        y: Math.round(point.y / gridSize) * gridSize
      };
    }
  }))
);

// Load saved plans from localStorage on initialization
if (typeof window !== 'undefined') {
  const savedPlans = localStorage.getItem('floorPlans');
  if (savedPlans) {
    try {
      const plans = JSON.parse(savedPlans);
      useFloorPlan.setState({ savedPlans: plans });
    } catch (error) {
      console.error('Failed to load saved plans:', error);
    }
  }
}

import { create } from 'zustand';
import { FurnitureTemplate } from '../furniture-data';

interface FurnitureState {
  selectedFurniture: FurnitureTemplate | null;
  draggedFurniture: FurnitureTemplate | null;
  isDragging: boolean;
  
  setSelectedFurniture: (furniture: FurnitureTemplate | null) => void;
  setDraggedFurniture: (furniture: FurnitureTemplate | null) => void;
  setIsDragging: (dragging: boolean) => void;
}

export const useFurniture = create<FurnitureState>((set) => ({
  selectedFurniture: null,
  draggedFurniture: null,
  isDragging: false,
  
  setSelectedFurniture: (furniture) => set({ selectedFurniture: furniture }),
  setDraggedFurniture: (furniture) => set({ draggedFurniture: furniture }),
  setIsDragging: (dragging) => set({ isDragging: dragging })
}));

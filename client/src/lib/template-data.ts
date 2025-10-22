import { FloorPlan, Room, Wall } from '../types/floor-plan';

export const templateFloorPlans: FloorPlan[] = [
  {
    id: 'studio-apartment',
    name: 'Studio Apartment',
    created: new Date(),
    modified: new Date(),
    scale: 1,
    gridSize: 0.5,
    rooms: [
      {
        id: 'main-room',
        name: 'Studio',
        points: [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
          { x: 6, y: 4 },
          { x: 0, y: 4 }
        ],
        color: '#F7FAFC',
        floorTexture: 'wood',
        wallColor: '#E2E8F0',
        dimensions: { width: 6, height: 4 }
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        points: [
          { x: 4, y: 0 },
          { x: 6, y: 0 },
          { x: 6, y: 2 },
          { x: 4, y: 2 }
        ],
        color: '#EDF2F7',
        floorTexture: 'tiles',
        wallColor: '#CBD5E0',
        dimensions: { width: 2, height: 2 }
      }
    ],
    walls: [
      { id: 'w1', start: { x: 0, y: 0 }, end: { x: 6, y: 0 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w2', start: { x: 6, y: 0 }, end: { x: 6, y: 4 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w3', start: { x: 6, y: 4 }, end: { x: 0, y: 4 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w4', start: { x: 0, y: 4 }, end: { x: 0, y: 0 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w5', start: { x: 4, y: 0 }, end: { x: 4, y: 2 }, thickness: 0.15, color: '#4A5568' }
    ],
    furniture: [
      {
        id: 'bed-1',
        type: 'bed',
        name: 'Double Bed',
        position: { x: 1, y: 1 },
        rotation: 0,
        scale: { x: 1, y: 1 },
        color: '#2F4F4F'
      },
      {
        id: 'sofa-1',
        type: 'sofa',
        name: 'Modern Sofa',
        position: { x: 3, y: 3 },
        rotation: 180,
        scale: { x: 1, y: 1 },
        color: '#4A5568'
      }
    ]
  },
  {
    id: 'one-bedroom',
    name: 'One Bedroom Apartment',
    created: new Date(),
    modified: new Date(),
    scale: 1,
    gridSize: 0.5,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        points: [
          { x: 0, y: 0 },
          { x: 5, y: 0 },
          { x: 5, y: 4 },
          { x: 0, y: 4 }
        ],
        color: '#F7FAFC',
        floorTexture: 'wood',
        wallColor: '#E2E8F0',
        dimensions: { width: 5, height: 4 }
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        points: [
          { x: 5, y: 0 },
          { x: 8, y: 0 },
          { x: 8, y: 4 },
          { x: 5, y: 4 }
        ],
        color: '#FDF2F8',
        floorTexture: 'carpet',
        wallColor: '#FCE7F3',
        dimensions: { width: 3, height: 4 }
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        points: [
          { x: 0, y: 4 },
          { x: 4, y: 4 },
          { x: 4, y: 6 },
          { x: 0, y: 6 }
        ],
        color: '#F0FDF4',
        floorTexture: 'tiles',
        wallColor: '#DCFCE7',
        dimensions: { width: 4, height: 2 }
      }
    ],
    walls: [
      { id: 'w1', start: { x: 0, y: 0 }, end: { x: 8, y: 0 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w2', start: { x: 8, y: 0 }, end: { x: 8, y: 4 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w3', start: { x: 8, y: 4 }, end: { x: 4, y: 4 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w4', start: { x: 4, y: 4 }, end: { x: 4, y: 6 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w5', start: { x: 4, y: 6 }, end: { x: 0, y: 6 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w6', start: { x: 0, y: 6 }, end: { x: 0, y: 0 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w7', start: { x: 5, y: 0 }, end: { x: 5, y: 4 }, thickness: 0.15, color: '#4A5568' },
      { id: 'w8', start: { x: 0, y: 4 }, end: { x: 5, y: 4 }, thickness: 0.15, color: '#4A5568' }
    ],
    furniture: []
  },
  {
    id: 'modern-loft',
    name: 'Modern Loft',
    created: new Date(),
    modified: new Date(),
    scale: 1,
    gridSize: 0.5,
    rooms: [
      {
        id: 'main-space',
        name: 'Open Living Space',
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 8 },
          { x: 0, y: 8 }
        ],
        color: '#F8FAFC',
        floorTexture: 'concrete',
        wallColor: '#F1F5F9',
        dimensions: { width: 10, height: 8 }
      }
    ],
    walls: [
      { id: 'w1', start: { x: 0, y: 0 }, end: { x: 10, y: 0 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w2', start: { x: 10, y: 0 }, end: { x: 10, y: 8 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w3', start: { x: 10, y: 8 }, end: { x: 0, y: 8 }, thickness: 0.2, color: '#4A5568' },
      { id: 'w4', start: { x: 0, y: 8 }, end: { x: 0, y: 0 }, thickness: 0.2, color: '#4A5568' }
    ],
    furniture: []
  }
];

export interface FurnitureCategory {
  id: string;
  name: string;
  items: FurnitureTemplate[];
}

export interface FurnitureTemplate {
  id: string;
  name: string;
  category: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  color: string;
  icon: string;
  model?: string;
}

export const furnitureCategories: FurnitureCategory[] = [
  {
    id: 'seating',
    name: 'Seating',
    items: [
      {
        id: 'sofa-1',
        name: 'Modern Sofa',
        category: 'seating',
        dimensions: { width: 2.0, height: 0.8, depth: 0.9 },
        color: '#4A5568',
        icon: '🛋️'
      },
      {
        id: 'chair-1',
        name: 'Office Chair',
        category: 'seating',
        dimensions: { width: 0.6, height: 1.2, depth: 0.6 },
        color: '#2D3748',
        icon: '🪑'
      },
      {
        id: 'armchair-1',
        name: 'Armchair',
        category: 'seating',
        dimensions: { width: 0.8, height: 0.9, depth: 0.8 },
        color: '#553C9A',
        icon: '🛏️'
      }
    ]
  },
  {
    id: 'tables',
    name: 'Tables',
    items: [
      {
        id: 'dining-table-1',
        name: 'Dining Table',
        category: 'tables',
        dimensions: { width: 1.6, height: 0.75, depth: 0.9 },
        color: '#8B4513',
        icon: '🍽️'
      },
      {
        id: 'coffee-table-1',
        name: 'Coffee Table',
        category: 'tables',
        dimensions: { width: 1.2, height: 0.4, depth: 0.6 },
        color: '#D2691E',
        icon: '☕'
      },
      {
        id: 'desk-1',
        name: 'Work Desk',
        category: 'tables',
        dimensions: { width: 1.4, height: 0.75, depth: 0.7 },
        color: '#A0522D',
        icon: '💻'
      }
    ]
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    items: [
      {
        id: 'bed-1',
        name: 'Double Bed',
        category: 'bedroom',
        dimensions: { width: 1.6, height: 0.5, depth: 2.0 },
        color: '#2F4F4F',
        icon: '🛏️'
      },
      {
        id: 'wardrobe-1',
        name: 'Wardrobe',
        category: 'bedroom',
        dimensions: { width: 1.2, height: 2.0, depth: 0.6 },
        color: '#696969',
        icon: '👔'
      },
      {
        id: 'nightstand-1',
        name: 'Nightstand',
        category: 'bedroom',
        dimensions: { width: 0.5, height: 0.6, depth: 0.4 },
        color: '#8B4513',
        icon: '🕯️'
      }
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    items: [
      {
        id: 'fridge-1',
        name: 'Refrigerator',
        category: 'kitchen',
        dimensions: { width: 0.7, height: 1.8, depth: 0.7 },
        color: '#C0C0C0',
        icon: '❄️'
      },
      {
        id: 'stove-1',
        name: 'Kitchen Stove',
        category: 'kitchen',
        dimensions: { width: 0.6, height: 0.9, depth: 0.6 },
        color: '#2F4F4F',
        icon: '🔥'
      },
      {
        id: 'counter-1',
        name: 'Kitchen Counter',
        category: 'kitchen',
        dimensions: { width: 2.0, height: 0.9, depth: 0.6 },
        color: '#D2691E',
        icon: '🍳'
      }
    ]
  }
];

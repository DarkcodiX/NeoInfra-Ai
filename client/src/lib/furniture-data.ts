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
  price?: number;
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
        icon: '🛋️',
        price: 899
      },
      {
        id: 'sofa-2',
        name: 'L-Shaped Sofa',
        category: 'seating',
        dimensions: { width: 2.5, height: 0.8, depth: 2.5 },
        color: '#2C5282',
        icon: '🛋️',
        price: 1299
      },
      {
        id: 'chair-1',
        name: 'Office Chair',
        category: 'seating',
        dimensions: { width: 0.6, height: 1.2, depth: 0.6 },
        color: '#2D3748',
        icon: '🪑',
        price: 249
      },
      {
        id: 'chair-2',
        name: 'Dining Chair',
        category: 'seating',
        dimensions: { width: 0.5, height: 1.0, depth: 0.5 },
        color: '#8B4513',
        icon: '🪑',
        price: 149
      },
      {
        id: 'armchair-1',
        name: 'Armchair',
        category: 'seating',
        dimensions: { width: 0.8, height: 0.9, depth: 0.8 },
        color: '#553C9A',
        icon: '🪑',
        price: 449
      },
      {
        id: 'bench-1',
        name: 'Bench',
        category: 'seating',
        dimensions: { width: 1.2, height: 0.5, depth: 0.4 },
        color: '#A0522D',
        icon: '🪑',
        price: 199
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
        icon: '🍽️',
        price: 599
      },
      {
        id: 'dining-table-2',
        name: 'Round Dining Table',
        category: 'tables',
        dimensions: { width: 1.2, height: 0.75, depth: 1.2 },
        color: '#654321',
        icon: '🍽️',
        price: 699
      },
      {
        id: 'coffee-table-1',
        name: 'Coffee Table',
        category: 'tables',
        dimensions: { width: 1.2, height: 0.4, depth: 0.6 },
        color: '#D2691E',
        icon: '☕',
        price: 299
      },
      {
        id: 'coffee-table-2',
        name: 'Glass Coffee Table',
        category: 'tables',
        dimensions: { width: 1.0, height: 0.4, depth: 0.6 },
        color: '#87CEEB',
        icon: '☕',
        price: 349
      },
      {
        id: 'desk-1',
        name: 'Work Desk',
        category: 'tables',
        dimensions: { width: 1.4, height: 0.75, depth: 0.7 },
        color: '#A0522D',
        icon: '💻',
        price: 399
      },
      {
        id: 'desk-2',
        name: 'Executive Desk',
        category: 'tables',
        dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
        color: '#654321',
        icon: '💻',
        price: 799
      },
      {
        id: 'side-table-1',
        name: 'Side Table',
        category: 'tables',
        dimensions: { width: 0.5, height: 0.6, depth: 0.5 },
        color: '#DEB887',
        icon: '🏺',
        price: 129
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
        icon: '🛏️',
        price: 799
      },
      {
        id: 'bed-2',
        name: 'Queen Bed',
        category: 'bedroom',
        dimensions: { width: 1.8, height: 0.5, depth: 2.1 },
        color: '#36454F',
        icon: '🛏️',
        price: 999
      },
      {
        id: 'bed-3',
        name: 'King Bed',
        category: 'bedroom',
        dimensions: { width: 2.0, height: 0.5, depth: 2.2 },
        color: '#2C3539',
        icon: '🛏️',
        price: 1299
      },
      {
        id: 'wardrobe-1',
        name: 'Wardrobe',
        category: 'bedroom',
        dimensions: { width: 1.2, height: 2.0, depth: 0.6 },
        color: '#696969',
        icon: '👔',
        price: 649
      },
      {
        id: 'wardrobe-2',
        name: 'Walk-in Closet',
        category: 'bedroom',
        dimensions: { width: 2.0, height: 2.0, depth: 0.6 },
        color: '#5F6A6A',
        icon: '👔',
        price: 1199
      },
      {
        id: 'nightstand-1',
        name: 'Nightstand',
        category: 'bedroom',
        dimensions: { width: 0.5, height: 0.6, depth: 0.4 },
        color: '#8B4513',
        icon: '🕯️',
        price: 149
      },
      {
        id: 'dresser-1',
        name: 'Dresser',
        category: 'bedroom',
        dimensions: { width: 1.2, height: 1.0, depth: 0.5 },
        color: '#A0522D',
        icon: '🗄️',
        price: 499
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
        icon: '❄️',
        price: 1299
      },
      {
        id: 'fridge-2',
        name: 'French Door Fridge',
        category: 'kitchen',
        dimensions: { width: 0.9, height: 1.8, depth: 0.7 },
        color: '#A9A9A9',
        icon: '❄️',
        price: 1899
      },
      {
        id: 'stove-1',
        name: 'Kitchen Stove',
        category: 'kitchen',
        dimensions: { width: 0.6, height: 0.9, depth: 0.6 },
        color: '#2F4F4F',
        icon: '🔥',
        price: 899
      },
      {
        id: 'counter-1',
        name: 'Kitchen Counter',
        category: 'kitchen',
        dimensions: { width: 2.0, height: 0.9, depth: 0.6 },
        color: '#D2691E',
        icon: '🍳',
        price: 1499
      },
      {
        id: 'island-1',
        name: 'Kitchen Island',
        category: 'kitchen',
        dimensions: { width: 1.5, height: 0.9, depth: 1.0 },
        color: '#8B4513',
        icon: '🏝️',
        price: 1899
      },
      {
        id: 'dishwasher-1',
        name: 'Dishwasher',
        category: 'kitchen',
        dimensions: { width: 0.6, height: 0.85, depth: 0.6 },
        color: '#C0C0C0',
        icon: '🍽️',
        price: 699
      },
      {
        id: 'microwave-1',
        name: 'Microwave',
        category: 'kitchen',
        dimensions: { width: 0.5, height: 0.3, depth: 0.4 },
        color: '#808080',
        icon: '📻',
        price: 249
      }
    ]
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    items: [
      {
        id: 'bathtub-1',
        name: 'Bathtub',
        category: 'bathroom',
        dimensions: { width: 1.7, height: 0.6, depth: 0.8 },
        color: '#FFFFFF',
        icon: '🛁',
        price: 1299
      },
      {
        id: 'shower-1',
        name: 'Shower',
        category: 'bathroom',
        dimensions: { width: 0.9, height: 2.0, depth: 0.9 },
        color: '#E8E8E8',
        icon: '🚿',
        price: 899
      },
      {
        id: 'toilet-1',
        name: 'Toilet',
        category: 'bathroom',
        dimensions: { width: 0.4, height: 0.8, depth: 0.7 },
        color: '#FFFFFF',
        icon: '🚽',
        price: 349
      },
      {
        id: 'sink-1',
        name: 'Bathroom Sink',
        category: 'bathroom',
        dimensions: { width: 0.6, height: 0.85, depth: 0.5 },
        color: '#FFFFFF',
        icon: '🚰',
        price: 299
      },
      {
        id: 'vanity-1',
        name: 'Vanity Cabinet',
        category: 'bathroom',
        dimensions: { width: 1.2, height: 0.85, depth: 0.5 },
        color: '#8B7355',
        icon: '🗄️',
        price: 799
      }
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    items: [
      {
        id: 'bookshelf-1',
        name: 'Bookshelf',
        category: 'storage',
        dimensions: { width: 0.8, height: 2.0, depth: 0.3 },
        color: '#8B4513',
        icon: '📚',
        price: 399
      },
      {
        id: 'cabinet-1',
        name: 'Storage Cabinet',
        category: 'storage',
        dimensions: { width: 0.8, height: 1.5, depth: 0.4 },
        color: '#A0522D',
        icon: '🗄️',
        price: 449
      },
      {
        id: 'shelf-1',
        name: 'Wall Shelf',
        category: 'storage',
        dimensions: { width: 1.0, height: 0.3, depth: 0.25 },
        color: '#DEB887',
        icon: '📦',
        price: 79
      },
      {
        id: 'drawer-1',
        name: 'Drawer Unit',
        category: 'storage',
        dimensions: { width: 0.6, height: 0.7, depth: 0.4 },
        color: '#696969',
        icon: '🗃️',
        price: 249
      }
    ]
  },
  {
    id: 'decor',
    name: 'Decor',
    items: [
      {
        id: 'plant-1',
        name: 'Indoor Plant',
        category: 'decor',
        dimensions: { width: 0.4, height: 1.0, depth: 0.4 },
        color: '#228B22',
        icon: '🪴',
        price: 49
      },
      {
        id: 'lamp-1',
        name: 'Floor Lamp',
        category: 'decor',
        dimensions: { width: 0.3, height: 1.6, depth: 0.3 },
        color: '#FFD700',
        icon: '💡',
        price: 129
      },
      {
        id: 'rug-1',
        name: 'Area Rug',
        category: 'decor',
        dimensions: { width: 2.0, height: 0.01, depth: 3.0 },
        color: '#8B4513',
        icon: '🧺',
        price: 199
      },
      {
        id: 'mirror-1',
        name: 'Wall Mirror',
        category: 'decor',
        dimensions: { width: 0.8, height: 1.2, depth: 0.05 },
        color: '#C0C0C0',
        icon: '🪞',
        price: 149
      },
      {
        id: 'tv-1',
        name: 'TV Stand',
        category: 'decor',
        dimensions: { width: 1.4, height: 0.5, depth: 0.4 },
        color: '#2F4F4F',
        icon: '📺',
        price: 349
      }
    ]
  }
];

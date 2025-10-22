import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { furnitureCategories } from '../lib/furniture-data';
import { ShoppingCart, DollarSign, Package } from 'lucide-react';

export function ShoppingList() {
  const { currentPlan } = useFloorPlan();

  const getFurnitureDetails = (furnitureType: string) => {
    for (const category of furnitureCategories) {
      const found = category.items.find(f => f.id === furnitureType);
      if (found) return found;
    }
    return null;
  };

  const shoppingItems = useMemo(() => {
    if (!currentPlan) return [];
    
    const itemsWithDetails = currentPlan.furniture.map(item => {
      const details = getFurnitureDetails(item.type);
      return {
        ...item,
        catalogName: details?.name || item.name,
        price: details?.price || 0,
        icon: details?.icon || '📦'
      };
    });

    return itemsWithDetails;
  }, [currentPlan]);

  const totalCost = useMemo(() => {
    return shoppingItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [shoppingItems]);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof shoppingItems> = {};
    shoppingItems.forEach(item => {
      const details = getFurnitureDetails(item.type);
      const category = details?.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  }, [shoppingItems]);

  if (!currentPlan) {
    return (
      <Card className="w-80 h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No floor plan loaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Shopping List
        </CardTitle>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Package className="w-4 h-4" />
              Total Items:
            </span>
            <Badge variant="secondary">{shoppingItems.length}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-gray-900 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Estimated Cost:
            </span>
            <span className="text-green-600 text-lg">${totalCost.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {shoppingItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No furniture added yet</p>
                <p className="text-xs mt-1">Add furniture to see your shopping list</p>
              </div>
            ) : (
              Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {category}
                  </h3>
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="text-2xl flex-shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.catalogName}</p>
                        <p className="text-xs text-gray-500">Position: ({item.position.x.toFixed(1)}, {item.position.y.toFixed(1)})</p>
                        {item.rotation !== 0 && (
                          <p className="text-xs text-gray-400">Rotation: {item.rotation}°</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {item.price > 0 ? (
                          <p className="font-semibold text-sm text-green-600">
                            ${item.price}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">N/A</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      {shoppingItems.length > 0 && (
        <div className="flex-shrink-0 border-t p-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Export Shopping List
          </button>
        </div>
      )}
    </Card>
  );
}

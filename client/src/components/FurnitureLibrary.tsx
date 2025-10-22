import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { furnitureCategories } from '../lib/furniture-data';
import { useFurniture } from '../lib/stores/useFurniture';
import { useFloorPlan } from '../lib/stores/useFloorPlan';

export function FurnitureLibrary() {
  const { setDraggedFurniture, selectedFurniture, setSelectedFurniture } = useFurniture();
  const { setActiveTool } = useFloorPlan();

  const handleFurnitureSelect = (furniture: any) => {
    setSelectedFurniture(furniture);
    setDraggedFurniture(furniture);
    setActiveTool('furniture');
  };

  return (
    <Card className="w-80 h-full">
      <CardHeader>
        <CardTitle className="text-lg">Furniture Library</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {furnitureCategories.map(category => (
              <div key={category.id}>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map(item => (
                    <Button
                      key={item.id}
                      variant={selectedFurniture?.id === item.id ? "default" : "outline"}
                      className="h-20 flex-col gap-2 p-2"
                      onClick={() => handleFurnitureSelect(item)}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="text-xs text-center leading-tight">
                        {item.name}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

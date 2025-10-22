import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ColorPicker } from './ui/color-picker';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { Trash2 } from 'lucide-react';

export function PropertyPanel() {
  const {
    currentPlan,
    selectedItem,
    updateRoom,
    updateFurniture,
    deleteRoom,
    deleteFurniture,
    setSelectedItem
  } = useFloorPlan();

  if (!currentPlan || !selectedItem) {
    return (
      <Card className="w-80 h-full">
        <CardHeader>
          <CardTitle className="text-lg">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select an item to edit properties</p>
        </CardContent>
      </Card>
    );
  }

  // Find selected item
  const selectedRoom = currentPlan.rooms.find(r => r.id === selectedItem);
  const selectedFurniture = currentPlan.furniture.find(f => f.id === selectedItem);

  const handleDelete = () => {
    if (selectedRoom) {
      deleteRoom(selectedItem);
    } else if (selectedFurniture) {
      deleteFurniture(selectedItem);
    }
    setSelectedItem(null);
  };

  return (
    <Card className="w-80 h-full">
      <CardHeader>
        <CardTitle className="text-lg">Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedRoom && (
          <>
            <div>
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                value={selectedRoom.name}
                onChange={(e) => updateRoom(selectedItem, { name: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Floor Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <ColorPicker
                  color={selectedRoom.color}
                  onChange={(color) => updateRoom(selectedItem, { color })}
                />
                <span className="text-sm text-gray-600">{selectedRoom.color}</span>
              </div>
            </div>
            
            <div>
              <Label>Wall Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <ColorPicker
                  color={selectedRoom.wallColor}
                  onChange={(wallColor) => updateRoom(selectedItem, { wallColor })}
                />
                <span className="text-sm text-gray-600">{selectedRoom.wallColor}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Width (m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedRoom.dimensions.width.toFixed(1)}
                  disabled
                />
              </div>
              <div>
                <Label>Height (m)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedRoom.dimensions.height.toFixed(1)}
                  disabled
                />
              </div>
            </div>
          </>
        )}
        
        {selectedFurniture && (
          <>
            <div>
              <Label htmlFor="furniture-name">Name</Label>
              <Input
                id="furniture-name"
                value={selectedFurniture.name}
                onChange={(e) => updateFurniture(selectedItem, { name: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <ColorPicker
                  color={selectedFurniture.color || '#8B4513'}
                  onChange={(color) => updateFurniture(selectedItem, { color })}
                />
                <span className="text-sm text-gray-600">{selectedFurniture.color}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>X Position</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedFurniture.position.x.toFixed(1)}
                  onChange={(e) => updateFurniture(selectedItem, {
                    position: { ...selectedFurniture.position, x: parseFloat(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label>Y Position</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedFurniture.position.y.toFixed(1)}
                  onChange={(e) => updateFurniture(selectedItem, {
                    position: { ...selectedFurniture.position, y: parseFloat(e.target.value) }
                  })}
                />
              </div>
            </div>
            
            <div>
              <Label>Rotation (°)</Label>
              <Input
                type="number"
                step="15"
                min="0"
                max="360"
                value={selectedFurniture.rotation || 0}
                onChange={(e) => updateFurniture(selectedItem, { rotation: parseInt(e.target.value) })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Scale X</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5"
                  value={selectedFurniture.scale.x}
                  onChange={(e) => updateFurniture(selectedItem, {
                    scale: { ...selectedFurniture.scale, x: parseFloat(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label>Scale Y</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5"
                  value={selectedFurniture.scale.y}
                  onChange={(e) => updateFurniture(selectedItem, {
                    scale: { ...selectedFurniture.scale, y: parseFloat(e.target.value) }
                  })}
                />
              </div>
            </div>
          </>
        )}
        
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="w-full flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

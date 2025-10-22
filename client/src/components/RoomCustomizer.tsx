import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { ColorPicker } from './ui/color-picker';
import { useFloorPlan } from '../lib/stores/useFloorPlan';

const floorTextures = [
  { value: 'wood', label: 'Hardwood' },
  { value: 'carpet', label: 'Carpet' },
  { value: 'tiles', label: 'Tiles' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'marble', label: 'Marble' }
];

export function RoomCustomizer() {
  const { currentPlan, updateRoom, selectedItem } = useFloorPlan();
  
  if (!currentPlan || !selectedItem) {
    return (
      <Card className="w-80 h-full">
        <CardHeader>
          <CardTitle className="text-lg">Room Customizer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select a room to customize</p>
        </CardContent>
      </Card>
    );
  }

  const selectedRoom = currentPlan.rooms.find(r => r.id === selectedItem);
  
  if (!selectedRoom) {
    return (
      <Card className="w-80 h-full">
        <CardHeader>
          <CardTitle className="text-lg">Room Customizer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Selected item is not a room</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 h-full">
      <CardHeader>
        <CardTitle className="text-lg">Room Customizer</CardTitle>
        <p className="text-sm text-gray-600">Customizing: {selectedRoom.name}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Floor Settings */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Floor</Label>
          
          <div>
            <Label>Floor Material</Label>
            <Select
              value={selectedRoom.floorTexture}
              onValueChange={(value) => updateRoom(selectedItem, { floorTexture: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {floorTextures.map(texture => (
                  <SelectItem key={texture.value} value={texture.value}>
                    {texture.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
        
        {/* Wall Settings */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Walls</Label>
          
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
        </div>
        
        {/* Room Info */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Room Information</Label>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Width</Label>
              <p className="font-mono">{selectedRoom.dimensions.width.toFixed(1)}m</p>
            </div>
            <div>
              <Label>Height</Label>
              <p className="font-mono">{selectedRoom.dimensions.height.toFixed(1)}m</p>
            </div>
            <div className="col-span-2">
              <Label>Area</Label>
              <p className="font-mono">
                {(selectedRoom.dimensions.width * selectedRoom.dimensions.height).toFixed(1)}m²
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Presets */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Quick Presets</Label>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className="p-2 text-xs border rounded-lg hover:bg-gray-50"
              onClick={() => updateRoom(selectedItem, {
                color: '#F7FAFC',
                wallColor: '#E2E8F0',
                floorTexture: 'wood'
              })}
            >
              🏠 Living Room
            </button>
            
            <button
              className="p-2 text-xs border rounded-lg hover:bg-gray-50"
              onClick={() => updateRoom(selectedItem, {
                color: '#FDF2F8',
                wallColor: '#FCE7F3',
                floorTexture: 'carpet'
              })}
            >
              🛏️ Bedroom
            </button>
            
            <button
              className="p-2 text-xs border rounded-lg hover:bg-gray-50"
              onClick={() => updateRoom(selectedItem, {
                color: '#F0FDF4',
                wallColor: '#DCFCE7',
                floorTexture: 'tiles'
              })}
            >
              🍳 Kitchen
            </button>
            
            <button
              className="p-2 text-xs border rounded-lg hover:bg-gray-50"
              onClick={() => updateRoom(selectedItem, {
                color: '#EFF6FF',
                wallColor: '#DBEAFE',
                floorTexture: 'tiles'
              })}
            >
              🛁 Bathroom
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

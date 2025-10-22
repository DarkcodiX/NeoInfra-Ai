import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { useFurniture } from '../lib/stores/useFurniture';
import { Point, Room } from '../types/floor-plan';

export function Canvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    currentPlan,
    activeTool,
    selectedItem,
    setSelectedItem,
    showGrid,
    snapToGrid,
    snapPoint,
    addRoom,
    addWall,
    addFurniture,
    updateRoom,
    updateFurniture,
    isDrawing,
    setIsDrawing
  } = useFloorPlan();
  
  const { draggedFurniture, isDragging } = useFurniture();
  
  const [scale, setScale] = useState(20); // pixels per meter
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  const [currentDrawing, setCurrentDrawing] = useState<Point[]>([]);

  const pixelToMeter = useCallback((x: number, y: number): Point => {
    return {
      x: (x - offset.x) / scale,
      y: (y - offset.y) / scale
    };
  }, [offset, scale]);

  const meterToPixel = useCallback((x: number, y: number): Point => {
    return {
      x: x * scale + offset.x,
      y: y * scale + offset.y
    };
  }, [offset, scale]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!currentPlan || !showGrid) return;
    
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    const gridSize = currentPlan.gridSize * scale;
    
    // Vertical lines
    for (let x = offset.x % gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = offset.y % gridSize; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [currentPlan, showGrid, scale, offset]);

  const drawRooms = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!currentPlan) return;
    
    currentPlan.rooms.forEach(room => {
      if (room.points.length < 3) return;
      
      const pixelPoints = room.points.map(p => meterToPixel(p.x, p.y));
      
      // Fill room
      ctx.fillStyle = room.color;
      ctx.beginPath();
      ctx.moveTo(pixelPoints[0].x, pixelPoints[0].y);
      pixelPoints.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fill();
      
      // Room outline
      ctx.strokeStyle = selectedItem === room.id ? '#3B82F6' : '#6B7280';
      ctx.lineWidth = selectedItem === room.id ? 3 : 2;
      ctx.stroke();
      
      // Room label
      if (pixelPoints.length > 2) {
        const centerX = pixelPoints.reduce((sum, p) => sum + p.x, 0) / pixelPoints.length;
        const centerY = pixelPoints.reduce((sum, p) => sum + p.y, 0) / pixelPoints.length;
        
        ctx.fillStyle = '#1F2937';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(room.name, centerX, centerY);
      }
    });
  }, [currentPlan, selectedItem, meterToPixel]);

  const drawWalls = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!currentPlan) return;
    
    currentPlan.walls.forEach(wall => {
      const start = meterToPixel(wall.start.x, wall.start.y);
      const end = meterToPixel(wall.end.x, wall.end.y);
      
      ctx.strokeStyle = selectedItem === wall.id ? '#3B82F6' : wall.color;
      ctx.lineWidth = wall.thickness * scale;
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
  }, [currentPlan, selectedItem, meterToPixel, scale]);

  const drawFurniture = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!currentPlan) return;
    
    currentPlan.furniture.forEach(item => {
      const pos = meterToPixel(item.position.x, item.position.y);
      const width = (item.scale.x || 1) * 1 * scale; // Default 1m width
      const height = (item.scale.y || 1) * 1 * scale; // Default 1m height
      
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate((item.rotation || 0) * Math.PI / 180);
      
      // Draw furniture as colored rectangle
      ctx.fillStyle = item.color || '#8B4513';
      ctx.strokeStyle = selectedItem === item.id ? '#3B82F6' : '#4A5568';
      ctx.lineWidth = selectedItem === item.id ? 3 : 1;
      
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.strokeRect(-width/2, -height/2, width, height);
      
      // Draw furniture label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, 0, 3);
      
      ctx.restore();
    });
  }, [currentPlan, selectedItem, meterToPixel, scale]);

  const drawCurrentDrawing = useCallback((ctx: CanvasRenderingContext2D) => {
    if (currentDrawing.length === 0) return;
    
    const pixelPoints = currentDrawing.map(p => meterToPixel(p.x, p.y));
    
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    if (pixelPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(pixelPoints[0].x, pixelPoints[0].y);
      pixelPoints.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }
    
    // Draw points
    ctx.fillStyle = '#3B82F6';
    pixelPoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    ctx.setLineDash([]);
  }, [currentDrawing, meterToPixel]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw components
    drawGrid(ctx, canvas);
    drawRooms(ctx);
    drawWalls(ctx);
    drawFurniture(ctx);
    drawCurrentDrawing(ctx);
  }, [drawGrid, drawRooms, drawWalls, drawFurniture, drawCurrentDrawing]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const meterPoint = pixelToMeter(x, y);
    const snappedPoint = snapToGrid ? snapPoint(meterPoint) : meterPoint;
    
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) { // Middle mouse or Shift+Left
      setIsPanning(true);
      setLastPanPoint({ x, y });
      return;
    }
    
    switch (activeTool) {
      case 'room':
        if (isDrawing) {
          // Add point to current drawing
          setCurrentDrawing(prev => [...prev, snappedPoint]);
        } else {
          // Start new room
          setIsDrawing(true);
          setCurrentDrawing([snappedPoint]);
        }
        break;
        
      case 'wall':
        if (isDrawing && currentDrawing.length === 1) {
          // Complete wall
          addWall({
            start: currentDrawing[0],
            end: snappedPoint,
            thickness: 0.2,
            color: '#4A5568'
          });
          setIsDrawing(false);
          setCurrentDrawing([]);
        } else {
          // Start wall
          setIsDrawing(true);
          setCurrentDrawing([snappedPoint]);
        }
        break;
        
      case 'furniture':
        if (draggedFurniture) {
          addFurniture({
            type: draggedFurniture.id,
            name: draggedFurniture.name,
            position: snappedPoint,
            rotation: 0,
            scale: { x: 1, y: 1 },
            color: draggedFurniture.color
          });
        }
        break;
        
      case 'select':
        // Find clicked item
        let clickedItem: string | null = null;
        
        if (currentPlan) {
          // Check furniture first (top layer)
          for (const item of currentPlan.furniture) {
            const itemPos = meterToPixel(item.position.x, item.position.y);
            const width = (item.scale.x || 1) * 1 * scale;
            const height = (item.scale.y || 1) * 1 * scale;
            
            if (x >= itemPos.x - width/2 && x <= itemPos.x + width/2 &&
                y >= itemPos.y - height/2 && y <= itemPos.y + height/2) {
              clickedItem = item.id;
              break;
            }
          }
          
          // Check rooms
          if (!clickedItem) {
            for (const room of currentPlan.rooms) {
              const pixelPoints = room.points.map(p => meterToPixel(p.x, p.y));
              if (pointInPolygon({ x, y }, pixelPoints)) {
                clickedItem = room.id;
                break;
              }
            }
          }
        }
        
        setSelectedItem(clickedItem);
        break;
    }
  }, [
    activeTool, isDrawing, currentDrawing, draggedFurniture, currentPlan,
    pixelToMeter, meterToPixel, snapToGrid, snapPoint, scale,
    addWall, addFurniture, setSelectedItem, setIsDrawing
  ]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isPanning && lastPanPoint) {
      const deltaX = x - lastPanPoint.x;
      const deltaY = y - lastPanPoint.y;
      
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x, y });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (activeTool === 'room' && isDrawing && currentDrawing.length >= 3) {
      // Complete room
      addRoom({
        name: `Room ${(currentPlan?.rooms.length || 0) + 1}`,
        points: currentDrawing,
        color: '#F7FAFC',
        floorTexture: 'wood',
        wallColor: '#E2E8F0',
        dimensions: {
          width: Math.max(...currentDrawing.map(p => p.x)) - Math.min(...currentDrawing.map(p => p.x)),
          height: Math.max(...currentDrawing.map(p => p.y)) - Math.min(...currentDrawing.map(p => p.y))
        }
      });
      setIsDrawing(false);
      setCurrentDrawing([]);
    }
  }, [activeTool, isDrawing, currentDrawing, addRoom, currentPlan]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(5, Math.min(100, prev * scaleFactor)));
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        draw();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [draw]);

  return (
    <div className="relative w-full h-full bg-gray-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
        {activeTool === 'room' && (
          <p>Click to add points, double-click to complete room</p>
        )}
        {activeTool === 'wall' && (
          <p>Click start point, then end point to create wall</p>
        )}
        {activeTool === 'furniture' && draggedFurniture && (
          <p>Click to place {draggedFurniture.name}</p>
        )}
        {activeTool === 'select' && (
          <p>Click items to select them</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Scroll to zoom • Shift+drag to pan • Middle-click to pan
        </p>
      </div>
    </div>
  );
}

// Helper function to check if point is inside polygon
function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
        (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
      inside = !inside;
    }
  }
  return inside;
}

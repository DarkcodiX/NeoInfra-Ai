import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { furnitureCategories } from '../lib/furniture-data';

// Helper function to adjust color brightness for accent walls
function adjustColorBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount * 255));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount * 255));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount * 255));
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

// 3D Room Component - modern walls with no overlaps
function Room3D({ room }: { room: any }) {
  const floorLevel = room.floor || 0;
  const floorHeight = 3.5; // 3.5m per floor
  const baseY = floorLevel * floorHeight;
  
  // Get room points in 3D space
  const roomPoints = room.points || [];

  return (
    <group>
      {/* Clean walls - single mesh per wall, no overlaps */}
      {roomPoints.map((point: any, index: number) => {
        const nextPoint = roomPoints[(index + 1) % roomPoints.length];
        
        // Calculate wall dimensions
        const dx = nextPoint.x - point.x;
        const dz = nextPoint.y - point.y;
        const wallLength = Math.sqrt(dx * dx + dz * dz);
        
        // Skip walls that are too short (likely errors)
        if (wallLength < 0.1) return null;
        
        const wallAngle = Math.atan2(dz, dx);
        
        // Wall center position
        const centerX = (point.x + nextPoint.x) / 2;
        const centerZ = (point.y + nextPoint.y) / 2;
        
        // Offset wall inward to prevent overlaps with adjacent rooms
        const offsetDistance = 0.08; // Slightly more than half wall thickness
        const normalAngle = wallAngle + Math.PI / 2;
        const offsetX = Math.cos(normalAngle) * offsetDistance;
        const offsetZ = Math.sin(normalAngle) * offsetDistance;
        
        // Create unique key to prevent duplicate rendering
        const wallKey = `${room.id}-wall-${index}`;
        
        // Determine if this is an accent wall (first wall of room)
        const isAccentWall = index === 0;
        const wallColor = room.wallColor || '#FFFFFF';
        
        return (
          <mesh
            key={wallKey}
            position={[centerX + offsetX, baseY + 1.5, centerZ + offsetZ]}
            rotation={[0, wallAngle, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallLength - 0.02, 3, 0.12]} />
            <meshStandardMaterial 
              color={isAccentWall ? adjustColorBrightness(wallColor, -0.15) : wallColor}
              roughness={0.8}
              metalness={0.02}
            />
          </mesh>
        );
      })}

      
      {/* Room label */}
      <Text
        position={[
          roomPoints.reduce((sum: number, p: any) => sum + p.x, 0) / roomPoints.length,
          baseY + 3.3,
          roomPoints.reduce((sum: number, p: any) => sum + p.y, 0) / roomPoints.length
        ]}
        fontSize={0.35}
        color="#34495E"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
    </group>
  );
}

// 3D Furniture Component with detailed models
function Furniture3D({ item }: { item: any }) {
  const getFurnitureDimensions = (furnitureType: string) => {
    for (const category of furnitureCategories) {
      const found = category.items.find(f => f.id === furnitureType);
      if (found) return found.dimensions;
    }
    return { width: 1, depth: 1, height: 1 }; // Default
  };

  const dims = getFurnitureDimensions(item.type);
  const scaledWidth = (item.scale?.x || 1) * dims.width;
  const scaledHeight = (item.scale?.y || 1) * dims.height;
  const scaledDepth = (item.scale?.z || item.scale?.x || 1) * dims.depth;

  // Better furniture colors based on type
  const getFurnitureColor = (type: string, defaultColor: string) => {
    if (type.includes('sofa')) return defaultColor || '#4A5568';
    if (type.includes('bed')) return defaultColor || '#2C3E50';
    if (type.includes('table')) return defaultColor || '#8B4513';
    if (type.includes('chair')) return defaultColor || '#34495E';
    if (type.includes('wardrobe')) return defaultColor || '#495057';
    if (type.includes('fridge')) return defaultColor || '#E8F4FD';
    return defaultColor || '#6C757D';
  };

  // Calculate floor level for furniture - must sit ON TOP of floor
  const floorLevel = item.floor || 0;
  const floorHeight = 3.5; // Same as Room3D
  const baseY = floorLevel * floorHeight;
  
  // Position furniture ON the floor surface (floor is at baseY + 0.01)
  const basePosition: [number, number, number] = [item.position.x, baseY + 0.02, item.position.y];
  const rotation: [number, number, number] = [0, (item.rotation || 0) * Math.PI / 180, 0];
  const color = getFurnitureColor(item.type, item.color);

  // Create detailed furniture models based on type
  const renderFurniture = () => {
    switch (item.type) {
      case 'sofa-1':
      case 'sofa-2':
        return (
          <group position={basePosition} rotation={rotation}>
            {/* Sofa frame (wooden) */}
            <mesh position={[0, scaledHeight * 0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 1.05, scaledHeight * 0.3, scaledDepth * 1.05]} />
              <meshStandardMaterial color="#8B4513" roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Main cushion base */}
            <mesh position={[0, scaledHeight * 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.95, scaledHeight * 0.4, scaledDepth * 0.9]} />
              <meshStandardMaterial color={color} roughness={0.9} metalness={0.0} />
            </mesh>
            {/* Individual seat cushions */}
            {[-scaledWidth * 0.25, scaledWidth * 0.25].map((x, i) => (
              <mesh key={i} position={[x, scaledHeight * 0.45, scaledDepth * 0.1]} castShadow receiveShadow>
                <boxGeometry args={[scaledWidth * 0.4, scaledHeight * 0.2, scaledDepth * 0.6]} />
                <meshStandardMaterial color={color} roughness={0.95} metalness={0.0} />
              </mesh>
            ))}
            {/* Backrest cushions */}
            {[-scaledWidth * 0.25, scaledWidth * 0.25].map((x, i) => (
              <mesh key={i} position={[x, scaledHeight * 0.75, -scaledDepth * 0.35]} castShadow receiveShadow>
                <boxGeometry args={[scaledWidth * 0.4, scaledHeight * 0.6, scaledDepth * 0.25]} />
                <meshStandardMaterial color={color} roughness={0.95} metalness={0.0} />
              </mesh>
            ))}
            {/* Armrests with padding */}
            <mesh position={[-scaledWidth * 0.45, scaledHeight * 0.55, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.15, scaledHeight * 0.7, scaledDepth * 0.9]} />
              <meshStandardMaterial color={color} roughness={0.9} metalness={0.0} />
            </mesh>
            <mesh position={[scaledWidth * 0.45, scaledHeight * 0.55, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.15, scaledHeight * 0.7, scaledDepth * 0.9]} />
              <meshStandardMaterial color={color} roughness={0.9} metalness={0.0} />
            </mesh>
            {/* Decorative piping */}
            <mesh position={[0, scaledHeight * 0.58, scaledDepth * 0.45]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.9, 0.02, 0.02]} />
              <meshStandardMaterial color="#2C3E50" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        );

      case 'bed-1':
      case 'bed-2':
      case 'bed-3':
        return (
          <group position={basePosition} rotation={rotation}>
            {/* Bed frame base */}
            <mesh position={[0, scaledHeight * 0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 1.1, scaledHeight * 0.25, scaledDepth * 1.1]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Box spring */}
            <mesh position={[0, scaledHeight * 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 1.05, scaledHeight * 0.15, scaledDepth * 1.05]} />
              <meshStandardMaterial color="#F5F5DC" roughness={0.8} />
            </mesh>
            {/* Mattress with realistic texture */}
            <mesh position={[0, scaledHeight * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth, scaledHeight * 0.25, scaledDepth]} />
              <meshStandardMaterial color="#FFFAFA" roughness={0.95} metalness={0.0} />
            </mesh>
            {/* Pillows */}
            {[-scaledWidth * 0.25, scaledWidth * 0.25].map((x, i) => (
              <mesh key={i} position={[x, scaledHeight * 0.65, -scaledDepth * 0.35]} castShadow receiveShadow>
                <boxGeometry args={[scaledWidth * 0.3, scaledHeight * 0.15, scaledDepth * 0.25]} />
                <meshStandardMaterial color="#F0F8FF" roughness={0.9} />
              </mesh>
            ))}
            {/* Luxury headboard with tufting */}
            <mesh position={[0, scaledHeight * 0.9, -scaledDepth * 0.55]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 1.1, scaledHeight * 0.9, 0.15]} />
              <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
            </mesh>
            {/* Headboard buttons (tufting) */}
            {[-0.3, 0, 0.3].map(x => 
              [0.3, 0.6].map((y, i) => (
                <mesh key={`${x}-${y}`} position={[x * scaledWidth, scaledHeight * y, -scaledDepth * 0.54]} castShadow receiveShadow>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshStandardMaterial color="#2C3E50" roughness={0.2} metalness={0.8} />
                </mesh>
              ))
            )}
            {/* Bed sheets */}
            <mesh position={[0, scaledHeight * 0.52, scaledDepth * 0.1]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.95, 0.01, scaledDepth * 0.6]} />
              <meshStandardMaterial color="#E6E6FA" roughness={0.8} />
            </mesh>
          </group>
        );

      case 'dining-table-1':
      case 'dining-table-2':
      case 'coffee-table-1':
      case 'coffee-table-2':
        return (
          <group position={basePosition} rotation={rotation}>
            {/* Table top with wood grain effect */}
            <mesh position={[0, scaledHeight - 0.04, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth, 0.08, scaledDepth]} />
              <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Table edge trim */}
            <mesh position={[0, scaledHeight - 0.08, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 1.02, 0.02, scaledDepth * 1.02]} />
              <meshStandardMaterial color="#654321" roughness={0.4} metalness={0.2} />
            </mesh>
            {/* Elegant table legs with taper */}
            {[-0.4, 0.4].map(x => 
              [-0.4, 0.4].map(z => (
                <group key={`${x}-${z}`}>
                  {/* Main leg */}
                  <mesh position={[x * scaledWidth, scaledHeight * 0.5, z * scaledDepth]} castShadow receiveShadow>
                    <boxGeometry args={[0.1, scaledHeight * 0.9, 0.1]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
                  </mesh>
                  {/* Leg cap */}
                  <mesh position={[x * scaledWidth, scaledHeight * 0.95, z * scaledDepth]} castShadow receiveShadow>
                    <boxGeometry args={[0.12, 0.05, 0.12]} />
                    <meshStandardMaterial color="#654321" roughness={0.4} metalness={0.2} />
                  </mesh>
                </group>
              ))
            )}
            {/* Cross support beams */}
            <mesh position={[0, scaledHeight * 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.7, 0.05, 0.05]} />
              <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
            <mesh position={[0, scaledHeight * 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.05, 0.05, scaledDepth * 0.7]} />
              <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
          </group>
        );

      case 'chair-1':
      case 'chair-2':
        return (
          <group position={basePosition} rotation={rotation}>
            {/* Seat */}
            <mesh position={[0, scaledHeight * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth, 0.1, scaledDepth]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, scaledHeight * 0.75, -scaledDepth * 0.4]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth, scaledHeight * 0.5, 0.1]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            {/* Chair legs */}
            {[-0.4, 0.4].map(x => 
              [-0.4, 0.4].map(z => (
                <mesh key={`${x}-${z}`} position={[x * scaledWidth, scaledHeight * 0.25, z * scaledDepth]} castShadow receiveShadow>
                  <boxGeometry args={[0.05, scaledHeight * 0.5, 0.05]} />
                  <meshStandardMaterial color={color} roughness={0.6} />
                </mesh>
              ))
            )}
          </group>
        );

      case 'wardrobe-1':
      case 'wardrobe-2':
        return (
          <group position={basePosition} rotation={rotation}>
            {/* Main body */}
            <mesh position={[0, scaledHeight * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth, scaledHeight, scaledDepth]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* Doors */}
            <mesh position={[-scaledWidth * 0.25, scaledHeight * 0.5, scaledDepth * 0.51]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.45, scaledHeight * 0.9, 0.02]} />
              <meshStandardMaterial color="#F8F9FA" roughness={0.4} />
            </mesh>
            <mesh position={[scaledWidth * 0.25, scaledHeight * 0.5, scaledDepth * 0.51]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.45, scaledHeight * 0.9, 0.02]} />
              <meshStandardMaterial color="#F8F9FA" roughness={0.4} />
            </mesh>
          </group>
        );

      case 'fridge-1':
      case 'fridge-2':
        return (
          <group position={basePosition} rotation={rotation}>
            {/* Main body */}
            <mesh position={[0, scaledHeight * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth, scaledHeight, scaledDepth]} />
              <meshStandardMaterial color="#F8F9FA" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Door */}
            <mesh position={[0, scaledHeight * 0.5, scaledDepth * 0.51]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.9, scaledHeight * 0.9, 0.02]} />
              <meshStandardMaterial color="#E8F4FD" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Handle */}
            <mesh position={[scaledWidth * 0.35, scaledHeight * 0.6, scaledDepth * 0.52]} castShadow receiveShadow>
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <meshStandardMaterial color="#C0C0C0" roughness={0.1} metalness={0.9} />
            </mesh>
          </group>
        );

      case 'tv-1':
        return (
          <group position={basePosition} rotation={rotation}>
            {/* TV Stand */}
            <mesh position={[0, scaledHeight * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth, scaledHeight, scaledDepth]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            {/* TV Screen */}
            <mesh position={[0, scaledHeight + 0.3, scaledDepth * 0.3]} castShadow receiveShadow>
              <boxGeometry args={[scaledWidth * 0.8, 0.6, 0.05]} />
              <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.9} />
            </mesh>
          </group>
        );

      default:
        // Default furniture as improved box
        return (
          <mesh
            position={[basePosition[0], basePosition[1] + scaledHeight / 2, basePosition[2]]}
            rotation={rotation}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[scaledWidth, scaledHeight, scaledDepth]} />
            <meshStandardMaterial 
              color={color}
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
        );
    }
  };

  return renderFurniture();
}

// 3D Scene Component
function Scene3D() {
  const { currentPlan } = useFloorPlan();
  
  // Debug logging
  React.useEffect(() => {
    console.log('Canvas3D - Current Plan:', currentPlan);
    if (currentPlan) {
      console.log('Rooms:', currentPlan.rooms?.length || 0);
      console.log('Furniture:', currentPlan.furniture?.length || 0);
    }
  }, [currentPlan]);
  
  if (!currentPlan) {
    console.log('Canvas3D - No plan loaded');
    return (
      <group>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Text position={[0, 2, 0]} fontSize={0.6} color="#B8A873" anchorX="center" anchorY="middle">
          Ready to Design
        </Text>
        <Text position={[0, 1, 0]} fontSize={0.35} color="#6B7280" anchorX="center" anchorY="middle">
          Use AI Composer to generate your floor plan
        </Text>
        <Text position={[0, 0.2, 0]} fontSize={0.25} color="#9CA3AF" anchorX="center" anchorY="middle">
          Describe your dream space and watch it come to life in 3D
        </Text>
      </group>
    );
  }

  // Safety check for rooms and furniture
  const rooms = currentPlan.rooms || [];
  const furniture = currentPlan.furniture || [];
  
  console.log('Canvas3D - Rendering:', rooms.length, 'rooms and', furniture.length, 'furniture items');

  return (
    <>
      {/* Professional Studio Lighting Setup */}
      <ambientLight intensity={0.4} color="#F5F5DC" />
      <directionalLight
        position={[20, 30, 15]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={200}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0001}
        color="#FFFAF0"
      />
      <hemisphereLight args={['#B0D4F1', '#3A3A3A', 0.7]} />
      <pointLight position={[-15, 18, -15]} intensity={1.5} color="#FFE4B5" distance={50} decay={2} />
      <pointLight position={[15, 18, 15]} intensity={1.3} color="#E0F6FF" distance={50} decay={2} />
      <pointLight position={[0, 25, 0]} intensity={1.0} color="#FFFFFF" distance={60} decay={2} />
      <spotLight
        position={[0, 30, 0]}
        angle={Math.PI / 5}
        penumbra={0.6}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#FFFACD"
        distance={80}
        decay={2}
      />
      
      {/* Modern ground plane with subtle gradient */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial 
          color="#E8ECEF" 
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>
      
      {/* Rooms */}
      {rooms.map(room => (
        <Room3D key={room.id} room={room} />
      ))}
      
      {/* Furniture */}
      {furniture.map(item => (
        <Furniture3D key={item.id} item={item} />
      ))}
      
      {/* Grid helper */}
      <Grid
        args={[20, 20]}
        position={[0, 0, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#ccc"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#999"
      />
    </>
  );
}

// Main Canvas3D Component
export function Canvas3D() {
  return (
    <div className="w-full h-full bg-gray-100">
      <Canvas
        camera={{
          position: [10, 8, 10],
          fov: 55,
          near: 0.1,
          far: 1000
        }}
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#B8A873" />
          </mesh>
        }>
          <Scene3D />
        </Suspense>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
      
      {/* 3D Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
        <p>Left-drag to rotate • Right-drag to pan • Scroll to zoom</p>
      </div>
    </div>
  );
}

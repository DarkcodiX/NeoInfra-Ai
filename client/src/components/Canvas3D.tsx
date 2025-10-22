import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFloorPlan } from '../lib/stores/useFloorPlan';

// 3D Room Component
function Room3D({ room }: { room: any }) {
  const points = room.points.map((p: any) => [p.x, 0, p.y]);
  
  // Create floor geometry
  const floorGeometry = new THREE.Shape();
  if (points.length > 0) {
    floorGeometry.moveTo(points[0][0], points[0][2]);
    for (let i = 1; i < points.length; i++) {
      floorGeometry.lineTo(points[i][0], points[i][2]);
    }
    floorGeometry.closePath();
  }

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <shapeGeometry args={[floorGeometry]} />
        <meshStandardMaterial color={room.color} />
      </mesh>
      
      {/* Walls */}
      {points.map((point: number[], index: number) => {
        const nextPoint = points[(index + 1) % points.length];
        const wallLength = Math.sqrt(
          Math.pow(nextPoint[0] - point[0], 2) + 
          Math.pow(nextPoint[2] - point[2], 2)
        );
        const wallAngle = Math.atan2(nextPoint[2] - point[2], nextPoint[0] - point[0]);
        
        return (
          <mesh
            key={index}
            position={[
              (point[0] + nextPoint[0]) / 2,
              1.25,
              (point[2] + nextPoint[2]) / 2
            ]}
            rotation={[0, wallAngle, 0]}
          >
            <boxGeometry args={[wallLength, 2.5, 0.2]} />
            <meshStandardMaterial color={room.wallColor} />
          </mesh>
        );
      })}
      
      {/* Room label */}
      <Text
        position={[
          points.reduce((sum: number, p: number[]) => sum + p[0], 0) / points.length,
          2.8,
          points.reduce((sum: number, p: number[]) => sum + p[2], 0) / points.length
        ]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
    </group>
  );
}

// 3D Furniture Component
function Furniture3D({ item }: { item: any }) {
  const getFurnitureGeometry = (type: string) => {
    switch (type) {
      case 'bed':
        return <boxGeometry args={[1.6, 0.5, 2.0]} />;
      case 'sofa':
        return <boxGeometry args={[2.0, 0.8, 0.9]} />;
      case 'chair':
        return <boxGeometry args={[0.6, 1.2, 0.6]} />;
      case 'table':
        return <boxGeometry args={[1.2, 0.75, 0.6]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      position={[item.position.x, 0.5, item.position.y]}
      rotation={[0, (item.rotation || 0) * Math.PI / 180, 0]}
    >
      {getFurnitureGeometry(item.type)}
      <meshStandardMaterial color={item.color || '#8B4513'} />
    </mesh>
  );
}

// 3D Scene Component
function Scene3D() {
  const { currentPlan } = useFloorPlan();
  
  if (!currentPlan) {
    return (
      <Text position={[0, 0, 0]} fontSize={0.5} color="gray">
        No floor plan loaded
      </Text>
    );
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        shadow-mapSize={[2048, 2048]}
        castShadow
      />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Rooms */}
      {currentPlan.rooms.map(room => (
        <Room3D key={room.id} room={room} />
      ))}
      
      {/* Furniture */}
      {currentPlan.furniture.map(item => (
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
          position: [8, 6, 8],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        <Suspense fallback={null}>
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

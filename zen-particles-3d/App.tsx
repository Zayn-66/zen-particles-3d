import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Particles from './components/Particles';
import UI from './components/UI';
import CameraFeed from './components/CameraFeed';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black overflow-hidden selection:bg-none">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          dpr={[1, 2]} // Optimize pixel ratio
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.5} />
          
          <Suspense fallback={null}>
            <Particles />
          </Suspense>

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={2} 
            maxDistance={15}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <UI />

      {/* Logic / Invisible Components */}
      <CameraFeed />
      
    </div>
  );
};

export default App;

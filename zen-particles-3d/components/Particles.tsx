import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { generateParticles } from '../utils/geometry';

const Particles: React.FC = () => {
  const currentShape = useStore(state => state.currentShape);
  const particleColor = useStore(state => state.particleColor);
  const handDistance = useStore(state => state.handDistance);
  
  const pointsRef = useRef<THREE.Points>(null);
  
  // Target positions based on shape
  const targetPositions = useMemo(() => {
    return generateParticles(currentShape);
  }, [currentShape]);

  // Current positions buffer (we lerp this to target)
  const currentPositions = useMemo(() => {
    return new Float32Array(targetPositions.length);
  }, [targetPositions.length]);

  // Initial random scatter for startup
  useMemo(() => {
    for(let i=0; i<currentPositions.length; i++) {
        currentPositions[i] = (Math.random() - 0.5) * 10;
    }
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positionsAttribute = pointsRef.current.geometry.attributes.position;
    const count = positionsAttribute.count;
    
    // Smooth dampening factor
    const lerpFactor = 4 * delta; 
    
    // Interaction Factor: 
    // handDistance 0 (closed) -> Particles condense/shrink
    // handDistance 1 (open) -> Particles expand/normal
    // We can also add rotation speed based on hand
    
    const expansion = 0.2 + (handDistance * 0.8); // 0.2 min scale, 1.0 max
    
    // Rotate entire system slowly
    pointsRef.current.rotation.y += delta * 0.1 * (handDistance + 0.1);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Target coordinates
      let tx = targetPositions[i3];
      let ty = targetPositions[i3 + 1];
      let tz = targetPositions[i3 + 2];

      // Apply expansion/breathing from hand
      tx *= expansion;
      ty *= expansion;
      tz *= expansion;

      // Add slight noise movement (breathing)
      const time = state.clock.elapsedTime;
      const noise = Math.sin(time + i) * 0.05 * handDistance;
      
      tx += noise;
      ty += noise;
      tz += noise;

      // Lerp current to target
      currentPositions[i3] += (tx - currentPositions[i3]) * lerpFactor;
      currentPositions[i3+1] += (ty - currentPositions[i3+1]) * lerpFactor;
      currentPositions[i3+2] += (tz - currentPositions[i3+2]) * lerpFactor;
      
      // Update geometry
      positionsAttribute.setXYZ(i, currentPositions[i3], currentPositions[i3+1], currentPositions[i3+2]);
    }
    
    positionsAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={currentPositions.length / 3}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={particleColor}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Particles;

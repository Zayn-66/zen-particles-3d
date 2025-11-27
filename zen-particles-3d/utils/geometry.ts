import { ParticleShape } from '../types';
import * as THREE from 'three';

const COUNT = 4000; // Particle count

// Helper to get random point in sphere
const randomInSphere = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// Helper to get random unit vector (direction)
const randomUnitVector = () => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    sinPhi * Math.cos(theta),
    sinPhi * Math.sin(theta),
    Math.cos(phi)
  );
};

export const generateParticles = (shape: ParticleShape): Float32Array => {
  const positions = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    let x = 0, y = 0, z = 0;

    switch (shape) {
      case ParticleShape.HEART: {
        // Hollow Heart Surface using Ray Marching / Binary Search
        // Equation: (x^2 + (9/4)z^2 + y^2 - 1)^3 - x^2*y^3 - (9/80)z^2*y^3 = 0
        // We shoot a ray from origin (which is inside) and find the root.
        
        let found = false;
        let attempts = 0;

        while (!found && attempts < 10) {
          attempts++;
          const dir = randomUnitVector();
          
          // Ray: P = t * dir
          // We search t in range [0, 3]
          let minT = 0;
          let maxT = 3.0;
          let t = 0;

          // Binary search for surface
          for(let step=0; step<15; step++) {
            t = (minT + maxT) * 0.5;
            
            const px = dir.x * t;
            const py = dir.y * t;
            const pz = dir.z * t;

            const x2 = px * px;
            const y2 = py * py;
            const z2 = pz * pz;
            const y3 = py * py * py;

            // F(x,y,z)
            const a = x2 + 2.25 * z2 + y2 - 1;
            const val = (a * a * a) - (x2 * y3) - (0.1125 * z2 * y3);

            if (val < 0) {
              // Inside, move out
              minT = t;
            } else {
              // Outside, move in
              maxT = t;
            }
          }

          // t is now our surface distance
          // We apply a scale factor to make the heart a nice size
          const scale = 1.5; 
          x = dir.x * t * scale;
          y = dir.y * t * scale;
          z = dir.z * t * scale;
          
          // Shift y slightly down so it centers better visually
          y += 0.5;

          found = true;
        }
        break;
      }

      case ParticleShape.SATURN: {
        const isRing = Math.random() > 0.4;
        if (isRing) {
          // Ring
          const angle = Math.random() * Math.PI * 2;
          const dist = 2.5 + Math.random() * 1.5;
          x = Math.cos(angle) * dist;
          z = Math.sin(angle) * dist;
          y = (Math.random() - 0.5) * 0.1;
          // Tilt
          const tilt = 0.4;
          const yNew = y * Math.cos(tilt) - z * Math.sin(tilt);
          const zNew = y * Math.sin(tilt) + z * Math.cos(tilt);
          y = yNew; z = zNew;
        } else {
          // Planet
          const v = randomInSphere(1.2);
          x = v.x; y = v.y; z = v.z;
        }
        break;
      }

      case ParticleShape.FLOWER: {
        // Rose/Flower parametric
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        // k = petals
        const k = 5; 
        const r = 2 * Math.sin(k * theta); // rose curve radius in 2d
        
        // Map to 3D roughly
        x = r * Math.cos(theta) * Math.sin(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = Math.cos(phi) * 1.5;
        
        // Add volume
        const v = randomInSphere(0.1);
        x += v.x; y += v.y; z += v.z;
        break;
      }

      case ParticleShape.SPIRAL: {
        // Galaxy Spiral
        const branches = 3;
        const radius = Math.random() * 4;
        const spinAngle = radius * 5;
        const branchAngle = (i % branches) * ((2 * Math.PI) / branches);
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;

        x = Math.cos(branchAngle + spinAngle) * radius + randomX;
        y = randomY * 2; // Flat galaxy
        z = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        break;
      }

      case ParticleShape.FIREWORK: {
        // Explosion sphere
        const v = randomInSphere(3);
        x = v.x; y = v.y; z = v.z;
        break;
      }
      
      default:
        x = (Math.random() - 0.5) * 5;
        y = (Math.random() - 0.5) * 5;
        z = (Math.random() - 0.5) * 5;
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }

  return positions;
};
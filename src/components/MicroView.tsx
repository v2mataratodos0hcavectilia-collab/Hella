import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationState } from '../types';

// Simple orbit controls using mouse events
function SimpleOrbitControls() {
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const spherical = useRef(new THREE.Spherical().setFromVector3(
    new THREE.Vector3().copy(camera.position)
  ));

  useEffect(() => {
    const domElement = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      previousMouse.current = { x: e.clientX, y: e.clientY };

      spherical.current.theta -= deltaX * 0.005;
      spherical.current.phi -= deltaY * 0.005;
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi));
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.current.radius += e.deltaY * 0.005;
      spherical.current.radius = Math.max(2, Math.min(8, spherical.current.radius));
    };

    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      domElement.removeEventListener('mousedown', onMouseDown);
      domElement.removeEventListener('mousemove', onMouseMove);
      domElement.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
    };
  }, [gl]);

  useFrame(() => {
    const pos = new THREE.Vector3().setFromSpherical(spherical.current);
    camera.position.copy(pos);
    camera.lookAt(0, 0.2, 0);
  });

  return null;
}

function BladderMesh({ state }: { state: SimulationState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wallRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const wallMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const fillRatio = Math.min(1.2, state.bladderVolume / state.maxCapacity);
  const pressureNorm = state.bladderPressure / 120;

  useFrame(() => {
    if (meshRef.current) {
      const scale = 0.5 + fillRatio * 0.8;
      meshRef.current.scale.setScalar(scale);
      const pulse = Math.sin(Date.now() * 0.003 * (1 + pressureNorm * 2)) * 0.02 * pressureNorm;
      meshRef.current.scale.multiplyScalar(1 + pulse);
    }
    if (wallRef.current) {
      const wallScale = 0.55 + fillRatio * 0.85;
      wallRef.current.scale.setScalar(wallScale);
    }
    if (matRef.current) {
      if (pressureNorm < 0.33) {
        matRef.current.color.setRGB(0.2, 0.5, 0.9);
      } else if (pressureNorm < 0.66) {
        matRef.current.color.setRGB(0.9, 0.8, 0.2);
      } else {
        matRef.current.color.setRGB(0.9, 0.2, 0.1);
      }
    }
    if (wallMatRef.current) {
      if (pressureNorm < 0.33) {
        wallMatRef.current.color.setRGB(0.2, 0.5, 0.9);
      } else if (pressureNorm < 0.66) {
        wallMatRef.current.color.setRGB(0.9, 0.8, 0.2);
      } else {
        wallMatRef.current.color.setRGB(0.9, 0.2, 0.1);
      }
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      <mesh ref={wallRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          ref={wallMatRef}
          color="#3388ee"
          transparent
          opacity={0.3}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color="#3388ee"
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function UreterDrip({ state }: { state: SimulationState }) {
  const dropsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (dropsRef.current) {
      dropsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        // Flow rate affects speed
        const flowSpeed = 0.5 + (state.urethralFlow * 0.1);
        const t = ((Date.now() * 0.001 * flowSpeed + i * 0.5) % 2) / 2;
        
        // Follow curved path along ureter
        const startX = i === 0 ? -0.8 : 0.8;
        const endX = 0;
        const startY = 1.5;
        const endY = 0.2;
        
        // Curved interpolation
        const curve = Math.sin(t * Math.PI);
        mesh.position.x = startX + (endX - startX) * t + curve * 0.1;
        mesh.position.y = startY + (endY - startY) * t;
        mesh.position.z = curve * 0.05;
        
        mesh.scale.setScalar(Math.sin(t * Math.PI) * 0.5);
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = Math.sin(t * Math.PI) * 0.8;
      });
    }
  });

  return (
    <group ref={dropsRef}>
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[i === 0 ? -0.8 : 0.8, 1.5, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ffcc00" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Urethra({ state }: { state: SimulationState }) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const sphincter1Ref = useRef<THREE.Mesh>(null);
  const sphincter2Ref = useRef<THREE.Mesh>(null);
  const sphMat1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const sphMat2Ref = useRef<THREE.MeshStandardMaterial>(null);
  const flowRef = useRef<THREE.Mesh>(null);
  
  const sphincterTension = state.sphincterLocked ? 1 : (1 - state.sphincterFatigue / 100);
  const trembling = state.sphincterTrembling;

  useFrame(() => {
    if (tubeRef.current) {
      const tremble = trembling ? Math.sin(Date.now() * 0.02) * 0.02 : 0;
      tubeRef.current.position.x = tremble;
      // More realistic urethra thickness
      const baseThickness = 0.12;
      const squeeze = baseThickness + sphincterTension * 0.08;
      tubeRef.current.scale.x = squeeze;
      tubeRef.current.scale.z = squeeze;
    }
    
    // Sphincter color based on fatigue
    const fatigue = state.sphincterFatigue;
    let r = 1, g = 0.53, b = 0.53;
    if (fatigue > 80) { r = 1; g = 0.27; b = 0.27; }
    else if (fatigue > 50) { r = 1; g = 0.67; b = 0; }
    
    if (sphMat1Ref.current) sphMat1Ref.current.color.setRGB(r, g, b);
    if (sphMat2Ref.current) sphMat2Ref.current.color.setRGB(r, g, b);

    // Sphincter tension affects size
    if (sphincter1Ref.current) {
      sphincter1Ref.current.scale.setScalar(0.8 + sphincterTension * 0.4);
    }
    if (sphincter2Ref.current) {
      sphincter2Ref.current.scale.setScalar(0.8 + sphincterTension * 0.4);
    }
    
    // Flow animation based on flow rate
    if (flowRef.current && state.urethralFlow > 0) {
      const flowScale = Math.min(1, state.urethralFlow / 25); // Normalize to max flow
      flowRef.current.scale.x = 0.5 + flowScale * 0.5;
      flowRef.current.scale.z = 0.5 + flowScale * 0.5;
      const mat = flowRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.4 + flowScale * 0.4;
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      {/* More realistic urethra - thicker, anatomical shape */}
      <mesh ref={tubeRef}>
        <cylinderGeometry args={[0.1, 0.08, 0.8, 24]} />
        <meshStandardMaterial 
          color="#d4737d" 
          transparent 
          opacity={0.75} 
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      
      {/* Internal sphincter - rotated to be horizontal */}
      <mesh ref={sphincter1Ref} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.05, 16, 32]} />
        <meshStandardMaterial ref={sphMat1Ref} color="#ff8888" roughness={0.4} metalness={0.2} />
      </mesh>
      
      {/* External sphincter - rotated to be horizontal */}
      <mesh ref={sphincter2Ref} position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.06, 16, 32]} />
        <meshStandardMaterial ref={sphMat2Ref} color="#ff8888" roughness={0.4} metalness={0.2} />
      </mesh>
      
      {/* Flow visualization - scales with flow rate */}
      {state.urethralFlow > 0 && (
        <mesh ref={flowRef} position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.3, 12]} />
          <meshStandardMaterial 
            color="#ffdd00" 
            transparent 
            opacity={0.6}
            emissive="#ffaa00"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}

function PelvisOutline() {
  return (
    <group>
      <mesh position={[-1.5, -0.5, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.15, 2, 1]} />
        <meshStandardMaterial color="#e8dcc8" transparent opacity={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[1.5, -0.5, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.15, 2, 1]} />
        <meshStandardMaterial color="#e8dcc8" transparent opacity={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[0, -1.2, 0.5]}>
        <boxGeometry args={[0.8, 0.3, 0.2]} />
        <meshStandardMaterial color="#e8dcc8" transparent opacity={0.3} roughness={0.8} />
      </mesh>
    </group>
  );
}

function BloodVessels() {
  const vesselsRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (vesselsRef.current) {
      const pulse = Math.sin(Date.now() * 0.004) * 0.01;
      vesselsRef.current.scale.setScalar(1 + pulse);
    }
  });

  return (
    <group ref={vesselsRef}>
      <mesh position={[-0.6, 0.5, 0.3]} rotation={[0.3, 0.5, 0]}>
        <torusGeometry args={[0.4, 0.02, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#cc2222" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.6, 0.5, 0.3]} rotation={[0.3, -0.5, 0]}>
        <torusGeometry args={[0.4, 0.02, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#cc2222" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.5, -0.2, 0.4]} rotation={[0.2, 0.3, 0.1]}>
        <torusGeometry args={[0.3, 0.015, 8, 32, Math.PI * 0.8]} />
        <meshStandardMaterial color="#3344aa" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.5, -0.2, 0.4]} rotation={[0.2, -0.3, -0.1]}>
        <torusGeometry args={[0.3, 0.015, 8, 32, Math.PI * 0.8]} />
        <meshStandardMaterial color="#3344aa" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function NerveSignals({ state }: { state: SimulationState }) {
  const nervesRef = useRef<THREE.Group>(null);
  const urgeNorm = state.urgeSignal / 100;

  useFrame(() => {
    if (nervesRef.current) {
      nervesRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const flicker = Math.sin(Date.now() * 0.005 + i * 1.5) * 0.3 + 0.7;
        mat.emissiveIntensity = urgeNorm * flicker * 2;
        mat.opacity = 0.3 + urgeNorm * 0.5;
      });
    }
  });

  return (
    <group ref={nervesRef}>
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 0.7;
        const z = Math.sin(angle) * 0.7;
        return (
          <mesh key={i} position={[x, 0.2 + Math.sin(angle) * 0.3, z]}>
            <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
            <meshStandardMaterial 
              color="#ffff00" 
              emissive="#ffaa00"
              emissiveIntensity={urgeNorm}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function KidneyConnectors() {
  return (
    <group>
      <mesh position={[-0.8, 1.0, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.03, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#cc8866" transparent opacity={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[0.8, 1.0, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.03, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#cc8866" transparent opacity={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[-1.0, 1.7, 0]} scale={[0.3, 0.4, 0.2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#8b4513" transparent opacity={0.4} roughness={0.7} />
      </mesh>
      <mesh position={[1.0, 1.7, 0]} scale={[0.3, 0.4, 0.2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#8b4513" transparent opacity={0.4} roughness={0.7} />
      </mesh>
    </group>
  );
}

function PressureOverlay({ state }: { state: SimulationState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const pressureNorm = state.bladderPressure / 120;
    if (meshRef.current) {
      const radius = 0.5 + (state.bladderVolume / state.maxCapacity) * 0.8;
      meshRef.current.scale.setScalar(radius);
    }
    if (matRef.current) {
      if (pressureNorm < 0.33) {
        matRef.current.color.setRGB(0, 0.4, 1);
      } else if (pressureNorm < 0.66) {
        matRef.current.color.setRGB(1, 0.67, 0);
      } else {
        matRef.current.color.setRGB(1, 0, 0);
      }
      matRef.current.opacity = 0.08 + pressureNorm * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.2, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        ref={matRef}
        color="#0066ff"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}

function Scene({ state }: { state: SimulationState }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#ff8866" />
      <pointLight position={[0, 2, 0]} intensity={0.3} color="#6688ff" />
      <pointLight position={[-2, 1, 1]} intensity={0.2} color="#ff4444" />
      
      <SimpleOrbitControls />
      <PelvisOutline />
      <KidneyConnectors />
      <BloodVessels />
      <NerveSignals state={state} />
      <BladderMesh state={state} />
      <UreterDrip state={state} />
      <Urethra state={state} />
      <PressureOverlay state={state} />
    </>
  );
}

export default function MicroView({ state }: { state: SimulationState }) {
  const pressureNorm = state.bladderPressure / 120;
  const fillPercent = (state.bladderVolume / state.maxCapacity) * 100;
  const overlayColor = pressureNorm < 0.33 ? 'rgba(0,100,255,0.08)' : pressureNorm < 0.66 ? 'rgba(255,170,0,0.1)' : 'rgba(255,0,0,0.12)';

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-800">
      <Canvas camera={{ position: [0, 0.3, 4], fov: 50 }}>
        <Scene state={state} />
      </Canvas>
      
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: overlayColor }}
      />
      
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
      }} />
      
      <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        🔬 MICRO VIEW — Coronal Cross-Section
      </div>
      
      <div className="absolute top-2 right-2 text-xs font-mono bg-black/60 px-2 py-1 rounded">
        <span className="text-gray-400">VOL: </span>
        <span style={{ color: fillPercent > 100 ? '#ff4444' : fillPercent > 80 ? '#ffaa00' : '#4488ff' }}>
          {state.bladderVolume.toFixed(0)}ml
        </span>
        <span className="text-gray-500"> / {state.maxCapacity.toFixed(0)}ml</span>
      </div>
      
      <div className="absolute bottom-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        P: {state.bladderPressure.toFixed(1)} cmH₂O | Nerves: {state.nerveSensitivity.toFixed(0)}%
      </div>
      
      <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/60 px-2 py-1.5 rounded"
        style={{ color: pressureNorm < 0.33 ? '#4488ff' : pressureNorm < 0.66 ? '#ffaa00' : '#ff4444' }}>
        {pressureNorm < 0.33 ? '● RELAXED' : pressureNorm < 0.66 ? '● BUILDING' : '● CRITICAL'}
      </div>

      {pressureNorm > 0.9 && (
        <div className="absolute inset-0 pointer-events-none border-2 border-red-500/30 rounded-lg animate-pulse" />
      )}
    </div>
  );
}

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationState } from '../types';

function BladderMesh({ state }: { state: SimulationState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wallRef = useRef<THREE.Mesh>(null);

  const fillRatio = Math.min(1.2, state.bladderVolume / state.maxCapacity);
  const pressureNorm = state.bladderPressure / 120;

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Bladder expands based on fill
      const scale = 0.5 + fillRatio * 0.8;
      meshRef.current.scale.setScalar(scale);
      
      // Subtle pulsing based on pressure
      const pulse = Math.sin(Date.now() * 0.003 * (1 + pressureNorm * 2)) * 0.02 * pressureNorm;
      meshRef.current.scale.multiplyScalar(1 + pulse);
    }
    if (wallRef.current) {
      const wallScale = 0.55 + fillRatio * 0.85;
      wallRef.current.scale.setScalar(wallScale);
    }
  });

  // Thermal color mapping
  const bladderColor = useMemo(() => {
    if (pressureNorm < 0.33) return new THREE.Color(0.2, 0.5, 0.9); // Blue - relaxed
    if (pressureNorm < 0.66) return new THREE.Color(0.9, 0.8, 0.2); // Yellow - building
    return new THREE.Color(0.9, 0.2, 0.1); // Red - critical
  }, [pressureNorm]);

  return (
    <group position={[0, 0.2, 0]}>
      {/* Bladder wall (outer) */}
      <mesh ref={wallRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color={bladderColor}
          transparent
          opacity={0.3}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
          transmission={0.3}
        />
      </mesh>
      
      {/* Bladder interior (fluid) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color={bladderColor}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.05}
          transmission={0.4}
          thickness={0.5}
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
        const t = ((Date.now() * 0.001 + i * 0.5) % 2) / 2;
        mesh.position.y = 1.5 - t * 1.5;
        mesh.scale.setScalar(Math.sin(t * Math.PI) * 0.5);
        (mesh.material as THREE.MeshStandardMaterial).opacity = Math.sin(t * Math.PI) * 0.8;
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
  
  const sphincterTension = state.sphincterLocked ? 1 : (1 - state.sphincterFatigue / 100);
  const trembling = state.sphincterTrembling;

  useFrame(() => {
    if (tubeRef.current) {
      const tremble = trembling ? Math.sin(Date.now() * 0.02) * 0.02 : 0;
      tubeRef.current.position.x = tremble;
      
      const squeeze = 0.08 + sphincterTension * 0.06;
      tubeRef.current.scale.x = squeeze;
      tubeRef.current.scale.z = squeeze;
    }
  });

  const sphincterColor = useMemo(() => {
    if (state.sphincterFatigue > 80) return '#ff4444';
    if (state.sphincterFatigue > 50) return '#ffaa00';
    return '#ff8888';
  }, [state.sphincterFatigue]);

  return (
    <group position={[0, -0.8, 0]}>
      {/* Urethra tube */}
      <mesh ref={tubeRef}>
        <cylinderGeometry args={[0.08, 0.06, 0.8, 16]} />
        <meshPhysicalMaterial
          color="#cc6666"
          transparent
          opacity={0.7}
          roughness={0.6}
        />
      </mesh>
      
      {/* Internal sphincter */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.12, 0.04 * sphincterTension, 16, 32]} />
        <meshStandardMaterial color={sphincterColor} roughness={0.5} />
      </mesh>
      
      {/* External sphincter */}
      <mesh position={[0, -0.1, 0]}>
        <torusGeometry args={[0.14, 0.05 * sphincterTension, 16, 32]} />
        <meshStandardMaterial color={sphincterColor} roughness={0.5} />
      </mesh>

      {/* Flow indicator */}
      {state.urethralFlow > 0 && (
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.04, 0.3, 8]} />
          <meshStandardMaterial color="#ffdd00" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

function PelvisOutline() {
  return (
    <group>
      {/* Pelvic bone outlines */}
      <mesh position={[-1.5, -0.5, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.15, 2, 1]} />
        <meshStandardMaterial color="#e8dcc8" transparent opacity={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[1.5, -0.5, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.15, 2, 1]} />
        <meshStandardMaterial color="#e8dcc8" transparent opacity={0.3} roughness={0.8} />
      </mesh>
      {/* Pubic symphysis */}
      <mesh position={[0, -1.2, 0.5]}>
        <boxGeometry args={[0.8, 0.3, 0.2]} />
        <meshStandardMaterial color="#e8dcc8" transparent opacity={0.3} roughness={0.8} />
      </mesh>
    </group>
  );
}

function PressureOverlay({ state }: { state: SimulationState }) {
  const pressureNorm = state.bladderPressure / 120;
  
  return (
    <mesh position={[0, 0.2, 0]}>
      <sphereGeometry args={[0.5 + state.bladderVolume / state.maxCapacity * 0.8, 16, 16]} />
      <meshBasicMaterial
        color={pressureNorm < 0.33 ? '#0066ff' : pressureNorm < 0.66 ? '#ffaa00' : '#ff0000'}
        transparent
        opacity={0.08 + pressureNorm * 0.1}
        wireframe
      />
    </mesh>
  );
}

function BloodVessels() {
  const vesselsRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (vesselsRef.current) {
      // Subtle pulsing of blood vessels
      const pulse = Math.sin(Date.now() * 0.004) * 0.01;
      vesselsRef.current.scale.setScalar(1 + pulse);
    }
  });

  return (
    <group ref={vesselsRef}>
      {/* Arteries around bladder */}
      <mesh position={[-0.6, 0.5, 0.3]} rotation={[0.3, 0.5, 0]}>
        <torusGeometry args={[0.4, 0.02, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#cc2222" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.6, 0.5, 0.3]} rotation={[0.3, -0.5, 0]}>
        <torusGeometry args={[0.4, 0.02, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#cc2222" transparent opacity={0.6} />
      </mesh>
      {/* Veins */}
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
        // Nerves glow based on urge signal
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
      {/* Left ureter */}
      <mesh position={[-0.8, 1.0, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.03, 0.04, 1.2, 8]} />
        <meshPhysicalMaterial color="#cc8866" transparent opacity={0.5} roughness={0.6} />
      </mesh>
      {/* Right ureter */}
      <mesh position={[0.8, 1.0, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.03, 0.04, 1.2, 8]} />
        <meshPhysicalMaterial color="#cc8866" transparent opacity={0.5} roughness={0.6} />
      </mesh>
      {/* Kidney shapes */}
      <mesh position={[-1.0, 1.7, 0]} scale={[0.3, 0.4, 0.2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial color="#8b4513" transparent opacity={0.4} roughness={0.7} />
      </mesh>
      <mesh position={[1.0, 1.7, 0]} scale={[0.3, 0.4, 0.2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial color="#8b4513" transparent opacity={0.4} roughness={0.7} />
      </mesh>
    </group>
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
      
      <PelvisOutline />
      <KidneyConnectors />
      <BloodVessels />
      <NerveSignals state={state} />
      <BladderMesh state={state} />
      <UreterDrip state={state} />
      <Urethra state={state} />
      <PressureOverlay state={state} />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={8}
        autoRotate={false}
      />
      <Environment preset="studio" />
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
      
      {/* Pressure overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: overlayColor }}
      />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
      }} />
      
      {/* Labels */}
      <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
        🔬 MICRO VIEW — Coronal Cross-Section
      </div>
      
      {/* Volume indicator */}
      <div className="absolute top-2 right-2 text-xs font-mono bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
        <span className="text-gray-400">VOL: </span>
        <span style={{ color: fillPercent > 100 ? '#ff4444' : fillPercent > 80 ? '#ffaa00' : '#4488ff' }}>
          {state.bladderVolume.toFixed(0)}ml
        </span>
        <span className="text-gray-500"> / {state.maxCapacity.toFixed(0)}ml</span>
      </div>
      
      {/* Bottom info */}
      <div className="absolute bottom-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
        P: {state.bladderPressure.toFixed(1)} cmH₂O | Nerves: {state.nerveSensitivity.toFixed(0)}%
      </div>
      
      <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/60 px-2 py-1.5 rounded backdrop-blur-sm"
        style={{ color: pressureNorm < 0.33 ? '#4488ff' : pressureNorm < 0.66 ? '#ffaa00' : '#ff4444' }}>
        {pressureNorm < 0.33 ? '● RELAXED' : pressureNorm < 0.66 ? '● BUILDING' : '● CRITICAL'}
      </div>

      {/* Critical flash */}
      {pressureNorm > 0.9 && (
        <div className="absolute inset-0 pointer-events-none border-2 border-red-500/30 rounded-lg animate-pulse" />
      )}
    </div>
  );
}

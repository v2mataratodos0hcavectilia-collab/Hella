import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationState } from '../types';

function Lungs({ breathingRate, breathDeepness, bloodO2Level }: { 
  breathingRate: number; 
  breathDeepness: number;
  bloodO2Level: number;
}) {
  const leftLungRef = useRef<THREE.Group>(null);
  const rightLungRef = useRef<THREE.Group>(null);
  const leftBronchiRef = useRef<THREE.Mesh>(null);
  const rightBronchiRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    // Ensure minimum breath deepness of 1%
    const effectiveDeepness = Math.max(1, breathDeepness);
    
    // Calculate breath cycle duration (seconds per breath)
    // Higher breathing rate = faster cycle
    const breathCycle = breathingRate > 0 ? 60 / breathingRate : 999; // Very slow if rate is 0
    const time = Date.now() * 0.001;
    const breathPhase = (time % breathCycle) / breathCycle;
    
    // Smooth lung expansion using sine wave for natural breathing
    // Expansion ranges from 1.0 (rest) to 1.0 + (effectiveDeepness * 0.002) (full inhale)
    const maxExpansion = 1.0 + (effectiveDeepness * 0.002); // 1% deepness = 1.002, 100% = 1.2
    
    // Smooth sine wave for natural breathing cycle
    // 0-0.4: Inhale (0 to max expansion)
    // 0.4-0.6: Hold at peak
    // 0.6-1.0: Exhale (max expansion back to 1.0)
    let expansion = 1.0;
    
    if (breathPhase < 0.4) {
      // Inhale phase - smooth acceleration
      const inhaleProgress = breathPhase / 0.4;
      expansion = 1.0 + (Math.sin(inhaleProgress * Math.PI * 0.5) * (maxExpansion - 1.0));
    } else if (breathPhase < 0.6) {
      // Hold phase - maintain peak expansion
      expansion = maxExpansion;
    } else {
      // Exhale phase - smooth deceleration
      const exhaleProgress = (breathPhase - 0.6) / 0.4;
      expansion = maxExpansion - (Math.sin(exhaleProgress * Math.PI * 0.5) * (maxExpansion - 1.0));
    }

    // Apply expansion to lungs
    if (leftLungRef.current) {
      leftLungRef.current.scale.set(expansion, expansion, expansion);
    }
    if (rightLungRef.current) {
      rightLungRef.current.scale.set(expansion, expansion, expansion);
    }

    // Bronchi dilation based on deepness
    const bronchiScale = 0.8 + (effectiveDeepness / 100) * 0.4;
    if (leftBronchiRef.current) {
      leftBronchiRef.current.scale.set(bronchiScale, 1, bronchiScale);
    }
    if (rightBronchiRef.current) {
      rightBronchiRef.current.scale.set(bronchiScale, 1, bronchiScale);
    }
  });

  // Color based on O2 level
  const lungColor = bloodO2Level > 95 ? '#e8a5a5' : bloodO2Level > 85 ? '#d48a8a' : bloodO2Level > 75 ? '#c07070' : '#a85555';
  const healthyColor = bloodO2Level > 90 ? '#f5b5b5' : '#e8a5a5';

  return (
    <group position={[0, 0, 0]}>
      {/* Trachea */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#d4a5a5" roughness={0.7} />
      </mesh>

      {/* Tracheal rings */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[0, 0.6 + i * 0.1, 0]}>
          <torusGeometry args={[0.09, 0.015, 8, 16]} />
          <meshStandardMaterial color="#c89595" roughness={0.6} />
        </mesh>
      ))}

      {/* Main bronchi split */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.07, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#d4a5a5" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.07, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#d4a5a5" roughness={0.7} />
      </mesh>

      {/* Left lung */}
      <group ref={leftLungRef} position={[-0.35, 0, 0]}>
        {/* Upper lobe */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color={lungColor} roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Lower lobe */}
        <mesh position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color={lungColor} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Bronchial tree (left) */}
        <mesh ref={leftBronchiRef} position={[0.15, 0.3, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.05, 0.06, 0.4, 12]} />
          <meshStandardMaterial color="#c89595" roughness={0.7} />
        </mesh>
        
        {/* Secondary bronchi */}
        <mesh position={[0.1, 0.1, 0.1]} rotation={[0.3, 0, 0.6]}>
          <cylinderGeometry args={[0.03, 0.04, 0.25, 10]} />
          <meshStandardMaterial color="#c89595" roughness={0.7} />
        </mesh>
        <mesh position={[0.05, -0.1, 0.05]} rotation={[0.2, 0, 0.7]}>
          <cylinderGeometry args={[0.025, 0.035, 0.2, 10]} />
          <meshStandardMaterial color="#c89595" roughness={0.7} />
        </mesh>

        {/* Alveoli clusters (small spheres representing air sacs) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 0.25 + Math.random() * 0.1;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.8;
          const z = (Math.random() - 0.5) * 0.2;
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial 
                color={healthyColor} 
                roughness={0.9} 
                transparent 
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>

      {/* Right lung (slightly larger) */}
      <group ref={rightLungRef} position={[0.35, 0, 0]}>
        {/* Upper lobe */}
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color={lungColor} roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Middle lobe */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshStandardMaterial color={lungColor} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Lower lobe */}
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={lungColor} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Bronchial tree (right) */}
        <mesh ref={rightBronchiRef} position={[-0.15, 0.35, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.05, 0.06, 0.4, 12]} />
          <meshStandardMaterial color="#c89595" roughness={0.7} />
        </mesh>
        
        {/* Secondary bronchi */}
        <mesh position={[-0.1, 0.15, 0.1]} rotation={[0.3, 0, -0.6]}>
          <cylinderGeometry args={[0.03, 0.04, 0.25, 10]} />
          <meshStandardMaterial color="#c89595" roughness={0.7} />
        </mesh>
        <mesh position={[-0.05, -0.05, 0.05]} rotation={[0.2, 0, -0.7]}>
          <cylinderGeometry args={[0.025, 0.035, 0.2, 10]} />
          <meshStandardMaterial color="#c89595" roughness={0.7} />
        </mesh>

        {/* Alveoli clusters */}
        {[...Array(15)].map((_, i) => {
          const angle = (i / 15) * Math.PI * 2;
          const radius = 0.28 + Math.random() * 0.1;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.8;
          const z = (Math.random() - 0.5) * 0.2;
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial 
                color={healthyColor} 
                roughness={0.9} 
                transparent 
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>

      {/* Diaphragm (muscle sheet below lungs) */}
      <mesh position={[0, -0.6, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial color="#c87070" roughness={0.8} transparent opacity={0.6} />
      </mesh>

      {/* Pulmonary arteries (carrying deoxygenated blood to lungs) */}
      <mesh position={[-0.15, 0.4, 0.15]} rotation={[0.4, 0, 0.3]}>
        <cylinderGeometry args={[0.04, 0.05, 0.3, 12]} />
        <meshStandardMaterial color="#6b3a8a" roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 0.4, 0.15]} rotation={[0.4, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.05, 0.3, 12]} />
        <meshStandardMaterial color="#6b3a8a" roughness={0.6} />
      </mesh>

      {/* Pulmonary veins (carrying oxygenated blood back to heart) */}
      <mesh position={[-0.2, 0.3, -0.1]} rotation={[0.3, 0, 0.4]}>
        <cylinderGeometry args={[0.035, 0.045, 0.25, 12]} />
        <meshStandardMaterial color="#c83030" roughness={0.6} />
      </mesh>
      <mesh position={[0.2, 0.3, -0.1]} rotation={[0.3, 0, -0.4]}>
        <cylinderGeometry args={[0.035, 0.045, 0.25, 12]} />
        <meshStandardMaterial color="#c83030" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Scene({ state }: { state: SimulationState }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#ffaaaa" />
      
      <Lungs 
        breathingRate={state.breathingRate} 
        breathDeepness={state.breathDeepness}
        bloodO2Level={state.bloodO2Level}
      />
    </>
  );
}

interface LungsViewProps {
  state: SimulationState;
}

export default function LungsView({ state }: LungsViewProps) {
  const o2Color = state.bloodO2Level > 95 ? '#4ade80' : state.bloodO2Level > 85 ? '#facc15' : state.bloodO2Level > 75 ? '#fb923c' : '#ef4444';

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-950 via-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-800">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <Scene state={state} />
      </Canvas>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
      }} />

      {/* Labels */}
      <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        🫁 LUNGS VIEW
      </div>

      {/* Breathing rate display */}
      <div className="absolute top-2 right-2 text-right">
        <div className={`text-2xl font-bold font-mono ${
          state.breathingRate > 25 ? 'text-red-400' : state.breathingRate > 18 ? 'text-orange-400' : 'text-blue-400'
        }`}>
          {state.breathingRate.toFixed(0)}
        </div>
        <div className="text-xs text-gray-400 font-mono">BrPM</div>
      </div>

      {/* O2 Level */}
      <div className="absolute bottom-2 left-2 text-xs font-mono bg-black/60 px-2 py-1 rounded">
        <span className="text-gray-400">O₂ Saturation: </span>
        <span style={{ color: o2Color }}>{state.bloodO2Level.toFixed(1)}%</span>
      </div>

      {/* Breath deepness */}
      <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/60 px-2 py-1 rounded">
        <span className="text-gray-400">Depth: </span>
        <span className="text-blue-300">{state.breathDeepness.toFixed(0)}%</span>
      </div>

      {/* Status indicator */}
      <div className="absolute top-12 right-2 text-xs font-mono bg-black/60 px-2 py-1.5 rounded"
        style={{ color: state.bloodO2Level > 90 ? '#4ade80' : state.bloodO2Level > 80 ? '#facc15' : '#ef4444' }}>
        {state.bloodO2Level > 90 ? '● NORMAL' : state.bloodO2Level > 80 ? '● LOW O₂' : '● HYPOXIA'}
      </div>

      {/* Breathing visualization */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-8">
        <svg className="w-full h-full" viewBox="0 0 100 30">
          <path
            d="M 0 15 Q 25 5, 50 15 Q 75 25, 100 15"
            fill="none"
            stroke={state.bloodO2Level > 90 ? '#4ade80' : state.bloodO2Level > 80 ? '#facc15' : '#ef4444'}
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
}

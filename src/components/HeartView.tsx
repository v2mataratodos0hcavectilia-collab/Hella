import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationState } from '../types';

function Heart({ heartRate, urgencyFactor }: { heartRate: number; urgencyFactor: number }) {
  const heartRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);

  useFrame(() => {
    if (heartRef.current) {
      // Heartbeat animation
      const beatInterval = 60 / heartRate; // seconds per beat
      const time = Date.now() * 0.001;
      const beatPhase = (time % beatInterval) / beatInterval;
      
      // Systole (contraction) and diastole (relaxation)
      let scale = 1;
      if (beatPhase < 0.1) {
        // Rapid contraction
        scale = 1 - beatPhase * 2;
      } else if (beatPhase < 0.3) {
        // Relaxation
        scale = 0.8 + (beatPhase - 0.1) * 1;
      } else {
        // Rest
        scale = 1;
      }
      
      scaleRef.current = scale;
      heartRef.current.scale.setScalar(scale);
      
      // Subtle rotation
      heartRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
    }
  });

  // Color based on urgency
  const color = urgencyFactor > 0.8 ? '#ff3333' : urgencyFactor > 0.5 ? '#ff6666' : '#cc4444';

  return (
    <group ref={heartRef}>
      {/* Main heart shape using spheres */}
      <mesh position={[-0.3, 0.2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.3, 0.2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <coneGeometry args={[0.7, 1, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      
      {/* Arteries */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.06, 0.4, 16]} />
        <meshStandardMaterial color="#aa2222" roughness={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.5, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.06, 0.05, 0.3, 16]} />
        <meshStandardMaterial color="#aa2222" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Scene({ state }: { state: SimulationState }) {
  const urgencyFactor = state.urgeSignal / 100;

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#ff6666" />
      
      <Heart heartRate={state.heartRate} urgencyFactor={urgencyFactor} />
    </>
  );
}

interface HeartViewProps {
  state: SimulationState;
}

export default function HeartView({ state }: HeartViewProps) {
  const urgencyFactor = state.urgeSignal / 100;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-red-950 via-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-800">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <Scene state={state} />
      </Canvas>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
      }} />

      {/* Labels */}
      <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        ❤️ HEART VIEW
      </div>

      {/* Heart rate display */}
      <div className="absolute top-2 right-2 text-right">
        <div className={`text-2xl font-bold font-mono ${
          state.heartRate > 100 ? 'text-red-400' : state.heartRate > 85 ? 'text-orange-400' : 'text-pink-400'
        }`}>
          {state.heartRate.toFixed(0)}
        </div>
        <div className="text-xs text-gray-400 font-mono">BPM</div>
      </div>

      {/* Breathing rate */}
      <div className="absolute bottom-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        Resp: {state.breathingRate.toFixed(0)} BrPM
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/60 px-2 py-1.5 rounded"
        style={{ color: urgencyFactor > 0.8 ? '#ff4444' : urgencyFactor > 0.5 ? '#ffaa00' : '#44ff44' }}>
        {urgencyFactor > 0.8 ? '● ELEVATED' : urgencyFactor > 0.5 ? '● MODERATE' : '● NORMAL'}
      </div>

      {/* Pulse visualization */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-8">
        <svg className="w-full h-full" viewBox="0 0 100 30">
          <path
            d="M 0 15 L 20 15 L 25 5 L 30 25 L 35 15 L 100 15"
            fill="none"
            stroke={urgencyFactor > 0.8 ? '#ff4444' : urgencyFactor > 0.5 ? '#ffaa00' : '#44ff44'}
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
}

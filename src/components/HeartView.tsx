import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationState } from '../types';

function AnatomicalHeart({ heartRate, urgencyFactor }: { heartRate: number; urgencyFactor: number }) {
  const heartRef = useRef<THREE.Group>(null);
  const ventricleLeftRef = useRef<THREE.Mesh>(null);
  const ventricleRightRef = useRef<THREE.Mesh>(null);
  const atriumLeftRef = useRef<THREE.Mesh>(null);
  const atriumRightRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (heartRef.current) {
      // Heartbeat animation
      const beatInterval = 60 / heartRate;
      const time = Date.now() * 0.001;
      const beatPhase = (time % beatInterval) / beatInterval;
      
      // Systole and diastole
      let scale = 1;
      if (beatPhase < 0.1) {
        // Atrial contraction
        scale = 1.05;
      } else if (beatPhase < 0.15) {
        // Ventricular contraction
        scale = 0.9;
      } else if (beatPhase < 0.3) {
        // Relaxation
        scale = 0.9 + (beatPhase - 0.15) * 0.67;
      }
      
      heartRef.current.scale.setScalar(scale);
      heartRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
    }

    // Animate individual chambers
    const beatInterval = 60 / heartRate;
    const time = Date.now() * 0.001;
    const beatPhase = (time % beatInterval) / beatInterval;

    if (ventricleLeftRef.current && ventricleRightRef.current) {
      const ventricleScale = beatPhase < 0.15 ? 0.85 : beatPhase < 0.3 ? 0.85 + (beatPhase - 0.15) * 1 : 1;
      ventricleLeftRef.current.scale.setScalar(ventricleScale);
      ventricleRightRef.current.scale.setScalar(ventricleScale);
    }

    if (atriumLeftRef.current && atriumRightRef.current) {
      const atriumScale = beatPhase < 0.1 ? 1.1 : beatPhase < 0.15 ? 1.1 - (beatPhase - 0.1) * 2 : 1;
      atriumLeftRef.current.scale.setScalar(atriumScale);
      atriumRightRef.current.scale.setScalar(atriumScale);
    }
  });

  // Color based on urgency
  const baseColor = urgencyFactor > 0.8 ? '#cc2222' : urgencyFactor > 0.5 ? '#cc4444' : '#aa3333';
  const darkColor = urgencyFactor > 0.8 ? '#881111' : urgencyFactor > 0.5 ? '#992222' : '#772222';

  return (
    <group ref={heartRef} rotation={[0.2, 0, 0.1]}>
      {/* Left Ventricle (larger, forms the apex) */}
      <mesh ref={ventricleLeftRef} position={[0.15, -0.3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={baseColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Ventricle */}
      <mesh ref={ventricleRightRef} position={[-0.2, -0.2, 0.1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={baseColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Atrium */}
      <mesh ref={atriumLeftRef} position={[0.2, 0.3, -0.1]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={darkColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Right Atrium */}
      <mesh ref={atriumRightRef} position={[-0.25, 0.25, 0.05]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={darkColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Aorta (large artery coming out) */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 0.6, 16]} />
        <meshStandardMaterial color="#cc3333" roughness={0.5} />
      </mesh>
      
      {/* Aortic arch */}
      <mesh position={[0.15, 0.75, 0]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[0.2, 0.1, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#cc3333" roughness={0.5} />
      </mesh>

      {/* Pulmonary artery */}
      <mesh position={[-0.1, 0.45, 0.15]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#6644aa" roughness={0.5} />
      </mesh>

      {/* Superior vena cava */}
      <mesh position={[-0.3, 0.5, -0.1]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.09, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#4444aa" roughness={0.5} />
      </mesh>

      {/* Coronary arteries (surface detail) */}
      <mesh position={[0.3, 0, 0.2]} rotation={[0.5, 0.3, 0]}>
        <torusGeometry args={[0.25, 0.02, 8, 32, Math.PI * 0.7]} />
        <meshStandardMaterial color="#ff4444" roughness={0.4} />
      </mesh>
      <mesh position={[-0.1, -0.1, 0.3]} rotation={[0.3, -0.2, 0.5]}>
        <torusGeometry args={[0.2, 0.015, 8, 32, Math.PI * 0.6]} />
        <meshStandardMaterial color="#ff4444" roughness={0.4} />
      </mesh>

      {/* Fat deposits (realistic detail) */}
      <mesh position={[0.1, 0.1, 0.35]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffcc88" roughness={0.8} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.15, 0.3]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffcc88" roughness={0.8} transparent opacity={0.6} />
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
      <pointLight position={[-2, 2, 2]} intensity={0.3} color="#ffaaaa" />
      
      <AnatomicalHeart heartRate={state.heartRate} urgencyFactor={urgencyFactor} />
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
        ❤️ ANATOMICAL HEART VIEW
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

      {/* Overdose warning */}
      {state.isOverdosing && (
        <div className="absolute top-12 left-2 text-xs font-mono text-red-400 bg-red-900/80 px-2 py-1 rounded animate-pulse">
          ⚠️ OVERDOSE: {state.overdoseDrug}
        </div>
      )}
    </div>
  );
}

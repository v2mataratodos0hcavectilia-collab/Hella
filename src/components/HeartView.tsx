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
  const aortaRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (heartRef.current) {
      // Heartbeat animation
      const beatInterval = 60 / heartRate;
      const time = Date.now() * 0.001;
      const beatPhase = (time % beatInterval) / beatInterval;
      
      // More realistic systole and diastole
      let scale = 1;
      let rotationX = 0;
      if (beatPhase < 0.08) {
        // Atrial contraction (rapid)
        scale = 1.08;
        rotationX = -0.02;
      } else if (beatPhase < 0.12) {
        // Isovolumetric contraction
        scale = 1.05;
        rotationX = -0.01;
      } else if (beatPhase < 0.25) {
        // Ventricular ejection (rapid)
        scale = 0.88;
        rotationX = 0.03;
      } else if (beatPhase < 0.35) {
        // Isovolumetric relaxation
        scale = 0.92;
        rotationX = 0.01;
      } else if (beatPhase < 0.6) {
        // Ventricular filling (rapid)
        scale = 0.92 + (beatPhase - 0.35) * 0.32;
        rotationX = 0;
      } else {
        // Diastasis (slow filling)
        scale = 1.0;
        rotationX = 0;
      }
      
      heartRef.current.scale.setScalar(scale);
      heartRef.current.rotation.x = rotationX;
      heartRef.current.rotation.y = Math.sin(time * 0.3) * 0.03;
    }

    // Animate individual chambers with more realistic timing
    const beatInterval = 60 / heartRate;
    const time = Date.now() * 0.001;
    const beatPhase = (time % beatInterval) / beatInterval;

    if (ventricleLeftRef.current && ventricleRightRef.current) {
      // Left ventricle (thicker, more muscular)
      const lvScale = beatPhase < 0.12 ? 1.0 : beatPhase < 0.25 ? 0.82 : beatPhase < 0.35 ? 0.88 : 1.0;
      ventricleLeftRef.current.scale.set(lvScale, lvScale * 0.95, lvScale);
      
      // Right ventricle (thinner)
      const rvScale = beatPhase < 0.12 ? 1.0 : beatPhase < 0.25 ? 0.85 : beatPhase < 0.35 ? 0.90 : 1.0;
      ventricleRightRef.current.scale.set(rvScale, rvScale * 0.9, rvScale);
    }

    if (atriumLeftRef.current && atriumRightRef.current) {
      // Atrial contraction
      const atrialScale = beatPhase < 0.08 ? 1.15 : beatPhase < 0.12 ? 1.05 : 1.0;
      atriumLeftRef.current.scale.setScalar(atrialScale);
      atriumRightRef.current.scale.setScalar(atrialScale * 0.95);
    }

    // Aorta pulse
    if (aortaRef.current) {
      const aortaPulse = beatPhase < 0.25 ? 1.05 : 1.0;
      aortaRef.current.scale.set(aortaPulse, 1.0, aortaPulse);
    }
  });

  // Color based on urgency with more realistic tissue colors
  const baseColor = urgencyFactor > 0.8 ? '#b81c1c' : urgencyFactor > 0.5 ? '#c43535' : '#9c2a2a';
  const darkColor = urgencyFactor > 0.8 ? '#7a1515' : urgencyFactor > 0.5 ? '#8a2020' : '#6b1e1e';
  const muscleColor = urgencyFactor > 0.8 ? '#a01818' : urgencyFactor > 0.5 ? '#b02828' : '#8a2222';

  return (
    <group ref={heartRef} rotation={[0.15, 0, 0.08]}>
      {/* Left Ventricle (larger, forms the apex, thicker wall) */}
      <mesh ref={ventricleLeftRef} position={[0.18, -0.35, 0.05]}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial 
          color={muscleColor} 
          roughness={0.7} 
          metalness={0.15}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>
      
      {/* Right Ventricle (thinner, wraps around) */}
      <mesh ref={ventricleRightRef} position={[-0.22, -0.25, 0.12]}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshStandardMaterial 
          color={baseColor} 
          roughness={0.7} 
          metalness={0.15}
        />
      </mesh>

      {/* Interventricular septum (visible between ventricles) */}
      <mesh position={[0.0, -0.3, 0.08]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.3]} />
        <meshStandardMaterial color={darkColor} roughness={0.8} />
      </mesh>

      {/* Left Atrium (posterior, receives pulmonary veins) */}
      <mesh ref={atriumLeftRef} position={[0.22, 0.32, -0.12]}>
        <sphereGeometry args={[0.36, 48, 48]} />
        <meshStandardMaterial 
          color={darkColor} 
          roughness={0.75} 
          metalness={0.1}
        />
      </mesh>

      {/* Right Atrium (receives vena cava) */}
      <mesh ref={atriumRightRef} position={[-0.28, 0.28, 0.08]}>
        <sphereGeometry args={[0.32, 48, 48]} />
        <meshStandardMaterial 
          color={darkColor} 
          roughness={0.75} 
          metalness={0.1}
        />
      </mesh>

      {/* Aorta (large ascending artery) */}
      <mesh ref={aortaRef} position={[0.05, 0.55, 0]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.14, 0.16, 0.65, 24]} />
        <meshStandardMaterial color="#d43838" roughness={0.6} metalness={0.2} />
      </mesh>
      
      {/* Aortic arch (curved portion) */}
      <mesh position={[0.18, 0.82, 0]} rotation={[0, 0, 0.6]}>
        <torusGeometry args={[0.22, 0.12, 24, 32, Math.PI * 0.8]} />
        <meshStandardMaterial color="#d43838" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Descending aorta */}
      <mesh position={[0.35, 0.65, -0.1]} rotation={[0.3, 0, 0.8]}>
        <cylinderGeometry args={[0.11, 0.12, 0.5, 20]} />
        <meshStandardMaterial color="#c83030" roughness={0.6} />
      </mesh>

      {/* Pulmonary trunk */}
      <mesh position={[-0.08, 0.48, 0.18]} rotation={[0.35, 0, 0.15]}>
        <cylinderGeometry args={[0.1, 0.12, 0.45, 20]} />
        <meshStandardMaterial color="#5a3d8a" roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Left pulmonary artery */}
      <mesh position={[-0.25, 0.55, 0.25]} rotation={[0.5, 0.3, 0.4]}>
        <cylinderGeometry args={[0.07, 0.08, 0.35, 16]} />
        <meshStandardMaterial color="#4a3578" roughness={0.6} />
      </mesh>

      {/* Right pulmonary artery */}
      <mesh position={[0.1, 0.52, 0.28]} rotation={[0.4, -0.2, 0.3]}>
        <cylinderGeometry args={[0.07, 0.08, 0.35, 16]} />
        <meshStandardMaterial color="#4a3578" roughness={0.6} />
      </mesh>

      {/* Superior vena cava */}
      <mesh position={[-0.32, 0.55, -0.08]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.1, 0.11, 0.55, 20]} />
        <meshStandardMaterial color="#3d4a8a" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Inferior vena cava */}
      <mesh position={[-0.28, -0.15, -0.1]} rotation={[0.2, 0, -0.1]}>
        <cylinderGeometry args={[0.11, 0.12, 0.4, 20]} />
        <meshStandardMaterial color="#3d4a8a" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Pulmonary veins (4 total, 2 from each lung) */}
      <mesh position={[0.35, 0.35, -0.2]} rotation={[0.6, 0.4, 0.2]}>
        <cylinderGeometry args={[0.06, 0.07, 0.3, 16]} />
        <meshStandardMaterial color="#8a3535" roughness={0.6} />
      </mesh>
      <mesh position={[0.32, 0.28, -0.25]} rotation={[0.7, 0.3, 0.3]}>
        <cylinderGeometry args={[0.06, 0.07, 0.3, 16]} />
        <meshStandardMaterial color="#8a3535" roughness={0.6} />
      </mesh>

      {/* Coronary arteries (more detailed, wrapping around heart) */}
      {/* Left anterior descending */}
      <mesh position={[0.28, 0.05, 0.25]} rotation={[0.6, 0.4, 0.1]}>
        <torusGeometry args={[0.28, 0.025, 12, 32, Math.PI * 0.75]} />
        <meshStandardMaterial color="#ff3838" roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Circumflex artery */}
      <mesh position={[-0.15, -0.05, 0.32]} rotation={[0.4, -0.3, 0.6]}>
        <torusGeometry args={[0.24, 0.022, 12, 32, Math.PI * 0.65]} />
        <meshStandardMaterial color="#ff3838" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Right coronary artery */}
      <mesh position={[0.05, -0.2, 0.35]} rotation={[0.3, 0.2, 0.4]}>
        <torusGeometry args={[0.26, 0.02, 12, 32, Math.PI * 0.6]} />
        <meshStandardMaterial color="#ff3838" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Epicardial fat deposits (realistic detail) */}
      <mesh position={[0.12, 0.15, 0.38]}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color="#f5d68a" roughness={0.85} transparent opacity={0.65} />
      </mesh>
      <mesh position={[-0.18, 0.2, 0.35]}>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#f5d68a" roughness={0.85} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0.05, -0.1, 0.4]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color="#f5d68a" roughness={0.85} transparent opacity={0.6} />
      </mesh>

      {/* Heart valves (simplified but visible) */}
      {/* Aortic valve */}
      <mesh position={[0.05, 0.25, 0.05]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.08, 0.015, 12, 24]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Mitral valve */}
      <mesh position={[0.2, 0.1, -0.05]} rotation={[0.3, 0.2, 0]}>
        <torusGeometry args={[0.09, 0.015, 12, 24]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Tricuspid valve */}
      <mesh position={[-0.18, 0.08, 0.1]} rotation={[0.2, -0.2, 0]}>
        <torusGeometry args={[0.085, 0.015, 12, 24]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Pulmonary valve */}
      <mesh position={[-0.08, 0.28, 0.18]} rotation={[0.4, 0, 0.2]}>
        <torusGeometry args={[0.07, 0.012, 12, 24]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.5} />
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

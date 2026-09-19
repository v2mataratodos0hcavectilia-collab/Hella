import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationState, FoodType, FOOD_PROPERTIES } from '../types';

function Stomach({ lastFoodEaten, lastFoodTime, simTime, stressLevel }: { 
  lastFoodEaten: FoodType | null;
  lastFoodTime: number;
  simTime: number;
  stressLevel: number;
}) {
  const stomachRef = useRef<THREE.Group>(null);
  const foodParticlesRef = useRef<THREE.Group>(null);
  const acidRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const time = Date.now() * 0.001;
    
    // Stomach churning animation (peristalsis)
    if (stomachRef.current) {
      const churnSpeed = lastFoodEaten ? 0.8 : 0.3;
      stomachRef.current.rotation.z = Math.sin(time * churnSpeed) * 0.05;
      stomachRef.current.rotation.x = Math.cos(time * churnSpeed * 0.7) * 0.03;
      
      // Stomach expands slightly when digesting
      const timeSinceFood = simTime - lastFoodTime;
      const digestionProgress = Math.min(1, timeSinceFood / 7200); // 2 hours to digest
      const expansion = lastFoodEaten ? 1.0 + (1 - digestionProgress) * 0.15 : 1.0;
      stomachRef.current.scale.set(expansion, expansion, expansion);
    }

    // Food particles moving and breaking down
    if (foodParticlesRef.current && lastFoodEaten) {
      const timeSinceFood = simTime - lastFoodTime;
      const digestionProgress = Math.min(1, timeSinceFood / 7200);
      const particles = foodParticlesRef.current;
      
      particles.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        
        // Circular motion (churning)
        const angle = time * 0.5 + (i * Math.PI * 2) / particles.children.length;
        const radius = 0.15 * (1 - digestionProgress * 0.5);
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.y = Math.sin(angle) * radius * 0.8;
        
        // Particles get smaller as they digest
        const particleScale = (1 - digestionProgress) * 0.8 + 0.2;
        mesh.scale.setScalar(particleScale);
        
        // Fade out as digestion completes
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = (1 - digestionProgress) * 0.8;
      });
    }

    // Acid level animation
    if (acidRef.current) {
      const timeSinceFood = simTime - lastFoodTime;
      const acidLevel = lastFoodEaten ? 0.6 + Math.sin(time * 2) * 0.1 : 0.3;
      acidRef.current.scale.y = acidLevel;
      acidRef.current.position.y = -0.2 + acidLevel * 0.1;
    }
  });

  // Determine food color based on type
  const getFoodColor = (food: FoodType | null) => {
    if (!food) return '#8b6f47';
    const category = FOOD_PROPERTIES[food].category;
    switch (category) {
      case 'Breakfast': return '#d4a574';
      case 'Lunch/Dinner': return '#8b6f47';
      case 'Snacks': return '#c9a66b';
      case 'Diuretic': return '#7cb342';
      case 'Spicy': return '#d84315';
      case 'Healthy': return '#66bb6a';
      default: return '#8b6f47';
    }
  };

  const foodColor = getFoodColor(lastFoodEaten);
  const timeSinceFood = simTime - lastFoodTime;
  const isDigesting = lastFoodEaten && timeSinceFood < 7200;

  return (
    <group position={[0, 0, 0]}>
      {/* Esophagus (tube coming from top) */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.5, 16]} />
        <meshStandardMaterial color="#c89090" roughness={0.7} />
      </mesh>

      {/* Esophageal sphincter (top) */}
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 12, 24]} />
        <meshStandardMaterial color="#a87070" roughness={0.6} />
      </mesh>

      {/* Main stomach body (J-shaped) */}
      <group ref={stomachRef}>
        {/* Fundus (top rounded part) */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial 
            color="#d4a0a0" 
            roughness={0.75} 
            metalness={0.1}
          />
        </mesh>

        {/* Body (main chamber) */}
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#d4a0a0" 
            roughness={0.75} 
            metalness={0.1}
          />
        </mesh>

        {/* Antrum (lower part) */}
        <mesh position={[0.1, -0.4, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#c89090" 
            roughness={0.75} 
            metalness={0.1}
          />
        </mesh>

        {/* Pylorus (exit to small intestine) */}
        <mesh position={[0.25, -0.55, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
          <meshStandardMaterial color="#b88080" roughness={0.7} />
        </mesh>

        {/* Pyloric sphincter */}
        <mesh position={[0.3, -0.6, 0]} rotation={[0, 0, 0.3]}>
          <torusGeometry args={[0.09, 0.02, 12, 24]} />
          <meshStandardMaterial color="#a87070" roughness={0.6} />
        </mesh>

        {/* Stomach rugae (folds inside stomach) */}
        {[0, 1, 2, 3, 4].map(i => {
          const angle = (i / 5) * Math.PI * 2;
          const x = Math.cos(angle) * 0.25;
          const y = Math.sin(angle) * 0.2;
          return (
            <mesh key={i} position={[x, y, 0.15]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.08, 0.3, 0.02]} />
              <meshStandardMaterial color="#b88080" roughness={0.8} />
            </mesh>
          );
        })}

        {/* Food particles (if digesting) */}
        {isDigesting && (
          <group ref={foodParticlesRef}>
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[
                Math.cos(i * 0.8) * 0.15,
                Math.sin(i * 0.8) * 0.12,
                (Math.random() - 0.5) * 0.1
              ]}>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial 
                  color={foodColor} 
                  roughness={0.9}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* Gastric acid pool */}
        <mesh ref={acidRef} position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
          <meshStandardMaterial 
            color="#a8d8a8" 
            roughness={0.4}
            transparent
            opacity={0.5}
            emissive="#88b888"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Duodenum (start of small intestine) */}
      <mesh position={[0.4, -0.65, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.06, 0.07, 0.3, 16]} />
        <meshStandardMaterial color="#c89090" roughness={0.7} />
      </mesh>

      {/* Blood vessels supplying stomach */}
      <mesh position={[-0.3, 0, 0.2]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.02, 0.025, 0.4, 10]} />
        <meshStandardMaterial color="#c83030" roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.1, 0.2]} rotation={[0.3, 0, -0.2]}>
        <cylinderGeometry args={[0.02, 0.025, 0.4, 10]} />
        <meshStandardMaterial color="#c83030" roughness={0.6} />
      </mesh>

      {/* Vagus nerve (controls stomach activity) */}
      <mesh position={[-0.15, 0.5, 0.1]} rotation={[0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.015, 0.018, 0.5, 8]} />
        <meshStandardMaterial color="#e8d8a8" roughness={0.7} />
      </mesh>

      {/* Stress indicator - nerve glow increases with stress */}
      {stressLevel > 50 && (
        <mesh position={[-0.15, 0.5, 0.1]} rotation={[0.2, 0, 0.1]}>
          <cylinderGeometry args={[0.02, 0.023, 0.5, 8]} />
          <meshStandardMaterial 
            color="#ffaa00" 
            roughness={0.5}
            transparent
            opacity={stressLevel / 200}
            emissive="#ffaa00"
            emissiveIntensity={stressLevel / 100}
          />
        </mesh>
      )}
    </group>
  );
}

function Scene({ state }: { state: SimulationState }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#ffccaa" />
      
      <Stomach 
        lastFoodEaten={state.lastFoodEaten}
        lastFoodTime={state.lastFoodTime}
        simTime={state.simTime}
        stressLevel={state.stressLevel}
      />
    </>
  );
}

interface StomachViewProps {
  state: SimulationState;
}

export default function StomachView({ state }: StomachViewProps) {
  const timeSinceFood = state.simTime - state.lastFoodTime;
  const digestionProgress = state.lastFoodEaten ? Math.min(100, (timeSinceFood / 7200) * 100) : 0;
  const isDigesting = state.lastFoodEaten && timeSinceFood < 7200;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-orange-950 via-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-800">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <Scene state={state} />
      </Canvas>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
      }} />

      {/* Labels */}
      <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        🍽️ STOMACH VIEW
      </div>

      {/* Digestion status */}
      <div className="absolute top-2 right-2 text-right">
        <div className={`text-sm font-bold font-mono ${
          isDigesting ? 'text-orange-400' : 'text-gray-400'
        }`}>
          {isDigesting ? 'DIGESTING' : 'EMPTY'}
        </div>
        {isDigesting && (
          <div className="text-xs text-gray-400 font-mono">
            {digestionProgress.toFixed(0)}%
          </div>
        )}
      </div>

      {/* Last food eaten */}
      {state.lastFoodEaten && (
        <div className="absolute bottom-2 left-2 text-xs font-mono bg-black/60 px-2 py-1 rounded">
          <span className="text-gray-400">Last Food: </span>
          <span className="text-orange-300">
            {FOOD_PROPERTIES[state.lastFoodEaten].name}
          </span>
        </div>
      )}

      {/* Stress level */}
      <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/60 px-2 py-1 rounded">
        <span className="text-gray-400">Stress: </span>
        <span className={state.stressLevel > 70 ? 'text-red-400' : state.stressLevel > 40 ? 'text-yellow-400' : 'text-green-400'}>
          {state.stressLevel.toFixed(0)}%
        </span>
      </div>

      {/* Digestion progress bar */}
      {isDigesting && (
        <div className="absolute top-12 right-2 w-20">
          <div className="text-[10px] text-gray-400 mb-1">Digestion</div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all"
              style={{ width: `${digestionProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stomach activity indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-8">
        <svg className="w-full h-full" viewBox="0 0 100 30">
          <path
            d="M 0 15 Q 10 10, 20 15 Q 30 20, 40 15 Q 50 10, 60 15 Q 70 20, 80 15 Q 90 10, 100 15"
            fill="none"
            stroke={isDigesting ? '#fb923c' : '#6b7280'}
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
}

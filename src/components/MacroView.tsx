import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationState } from '../types';

// Simple orbit controls for macro view
function SimpleOrbitControls({ target }: { target: [number, number, number] }) {
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const spherical = useRef(new THREE.Spherical(7, Math.PI / 3, Math.PI / 4));

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
      spherical.current.phi = Math.max(0.2, Math.min(Math.PI - 0.2, spherical.current.phi));
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.current.radius += e.deltaY * 0.01;
      spherical.current.radius = Math.max(2, Math.min(12, spherical.current.radius));
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
    pos.add(new THREE.Vector3(...target));
    camera.position.copy(pos);
    camera.lookAt(new THREE.Vector3(...target));
  });

  return null;
}

function Character({ state }: { state: SimulationState }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (groupRef.current) {
      const t = Date.now() * 0.001;
      
      switch (state.aiState) {
        case 'walking':
          groupRef.current.position.x = Math.sin(t * 0.5) * 2;
          groupRef.current.position.z = Math.cos(t * 0.5) * 2;
          break;
        case 'pacing':
          groupRef.current.position.x = Math.sin(t * 1.5) * 1.5;
          break;
        case 'shifting_weight':
          groupRef.current.rotation.z = Math.sin(t * 2) * 0.05;
          break;
        case 'crossing_legs':
        case 'holding':
          groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.03;
          groupRef.current.position.y = Math.sin(t * 1.2) * 0.02;
          break;
        case 'sleeping':
          groupRef.current.rotation.x = -Math.PI / 2;
          groupRef.current.position.y = 0.2;
          break;
        case 'sitting':
        case 'in_meeting':
        case 'gaming':
        case 'commuting':
          groupRef.current.position.y = -0.3;
          break;
        default:
          groupRef.current.position.x = Math.sin(t * 0.2) * 0.5;
          groupRef.current.position.z = Math.cos(t * 0.2) * 0.5;
          groupRef.current.rotation.x = 0;
          groupRef.current.position.y = 0;
      }
    }

    if (bodyRef.current) {
      if (state.urgeSignal > 80) {
        const tremble = Math.sin(Date.now() * 0.01) * 0.02 * (state.urgeSignal / 100);
        bodyRef.current.position.x = tremble;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={bodyRef} position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
        <meshStandardMaterial color="#f4c2a1" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#f4c2a1" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.6, -0.05]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, 0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.5, 8, 8]} />
        <meshStandardMaterial color={state.wardrobe === 'skirt' || state.wardrobe === 'dress' ? '#f4c2a1' : '#2c3e50'} roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.5, 8, 8]} />
        <meshStandardMaterial color={state.wardrobe === 'skirt' || state.wardrobe === 'dress' ? '#f4c2a1' : '#2c3e50'} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.22, 0.4, 8, 16]} />
        <meshStandardMaterial 
          color={state.wardrobe === 'dress' ? '#8e44ad' : '#3498db'} 
          roughness={0.6} 
        />
      </mesh>
    </group>
  );
}

function Environment3D({ state }: { state: SimulationState }) {
  const floorColor = state.location === 'office' || state.location === 'meeting_room' ? '#4a4a4a' : 
                     state.location === 'bathroom' ? '#d4e6f1' :
                     state.location === 'car' ? '#2c2c2c' : '#8b7355';

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>
      
      {state.location !== 'car' && (
        <>
          <mesh position={[0, 2, -5]}>
            <planeGeometry args={[20, 5]} />
            <meshStandardMaterial color="#e8e0d4" roughness={0.9} />
          </mesh>
          <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[20, 5]} />
            <meshStandardMaterial color="#e0d8cc" roughness={0.9} />
          </mesh>
        </>
      )}

      {state.location === 'office' && (
        <group>
          <mesh position={[2, 0.4, -2]}>
            <boxGeometry args={[1.5, 0.8, 0.8]} />
            <meshStandardMaterial color="#5c4033" roughness={0.7} />
          </mesh>
          <mesh position={[2, 0.9, -2]}>
            <boxGeometry args={[1.6, 0.05, 0.9]} />
            <meshStandardMaterial color="#3d2b1f" roughness={0.6} />
          </mesh>
        </group>
      )}

      {state.location === 'meeting_room' && (
        <group>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[3, 0.8, 1.5]} />
            <meshStandardMaterial color="#5c4033" roughness={0.7} />
          </mesh>
        </group>
      )}

      {state.location === 'bathroom' && (
        <group position={[3, 0, -3]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 0.5, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.6, -0.2]}>
            <boxGeometry args={[0.5, 0.4, 0.1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      )}

      {state.location === 'car' && (
        <group>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.8, 0.4, 0.8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.7, -0.4]}>
            <boxGeometry args={[0.8, 0.8, 0.1]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.6, 0.5]} rotation={[0.5, 0, 0]}>
            <torusGeometry args={[0.15, 0.02, 8, 32]} />
            <meshStandardMaterial color="#333333" roughness={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function MacroScene({ state }: { state: SimulationState }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} />
      <pointLight position={[-3, 3, 3]} intensity={0.3} color="#ffe4b5" />
      
      <SimpleOrbitControls target={[0, 0.8, 0]} />
      <Environment3D state={state} />
      <Character state={state} />
    </>
  );
}

export default function MacroView({ state }: { state: SimulationState }) {
  const urgencyColor = state.urgeSignal > 100 ? 'rgba(255,0,0,0.08)' : state.urgeSignal > 70 ? 'rgba(255,170,0,0.05)' : 'transparent';

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 via-gray-850 to-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <Canvas camera={{ position: [3, 3, 5], fov: 45 }}>
        <MacroScene state={state} />
      </Canvas>
      
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: urgencyColor }}
      />
      
      <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        👁 MACRO VIEW — {state.location.replace('_', ' ').toUpperCase()}
      </div>
      
      <div className="absolute top-2 right-2 text-xs font-mono bg-black/60 px-2 py-1 rounded">
        <span className="text-gray-400">AI: </span>
        <span className={state.urgeSignal > 80 ? 'text-red-400' : 'text-gray-300'}>
          {state.aiState.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      
      <div className="absolute bottom-2 left-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        {state.posture.replace('_', ' ')} | {state.temperature}°F ({((state.temperature - 32) * 5/9).toFixed(0)}°C) | {state.wardrobe}
      </div>

      <div className="absolute bottom-2 right-2 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
        🧩 {state.distractionLevel.toFixed(0)}% distracted
      </div>

      <div className="absolute top-10 right-2 text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded">
        Undress: {state.wardrobe === 'skirt' || state.wardrobe === 'dress' || state.wardrobe === 'leggings' ? '2s' : state.wardrobe === 'jeans' ? '5s' : '15s'}
      </div>
    </div>
  );
}

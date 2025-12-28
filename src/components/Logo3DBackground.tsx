import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function GlowingSphere({ position, size, delay }: { position: [number, number, number]; size: number; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.5;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial color="#ff2d55" transparent opacity={0.05} />
    </mesh>
  );
}

function FlameGlow() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <GlowingSphere position={[0, 2, -15]} size={4} delay={0} />
        <GlowingSphere position={[-6, -1, -20]} size={3} delay={1} />
        <GlowingSphere position={[7, 0, -18]} size={2.5} delay={2} />
        <GlowingSphere position={[-3, 4, -25]} size={5} delay={0.5} />
        <GlowingSphere position={[5, -3, -22]} size={3.5} delay={1.5} />
      </Float>
    </group>
  );
}

export default function Logo3DBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'low-power'
        }}
        dpr={[1, 1.5]}
      >
        <FlameGlow />
      </Canvas>
    </div>
  );
}

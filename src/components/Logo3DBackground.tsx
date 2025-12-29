import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

function IgniteLogo3D({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const { scene } = useGLTF('/models/ignite-logo.glb');

  useEffect(() => {
    // Apply fire-colored material to all meshes in the scene
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#ff2d55'),
          emissive: new THREE.Color('#ff2d55'),
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.35,
          roughness: 0.15,
          metalness: 0.95,
          side: THREE.DoubleSide,
          envMapIntensity: 1.2,
        });
        child.material = material;
        materialRef.current = material;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (groupRef.current) {
      // Continuous gentle rotation
      const time = state.clock.elapsedTime;
      
      // Base floating animation
      groupRef.current.rotation.y = time * 0.15 + scrollProgress * Math.PI * 1.5;
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1 + scrollProgress * 0.3;
      groupRef.current.rotation.z = Math.cos(time * 0.2) * 0.05;
      
      // Scroll-based positioning
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.2 - scrollProgress * 1.5;
      groupRef.current.position.z = -3 - scrollProgress * 8;
      
      // Scale with scroll
      const scale = 1.2 - scrollProgress * 0.6;
      groupRef.current.scale.setScalar(Math.max(0.7, scale));
    }
    
    // Update material opacity based on scroll
    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0.15, 0.35 - scrollProgress * 0.15);
      materialRef.current.emissiveIntensity = Math.max(0.3, 0.6 - scrollProgress * 0.3);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.2} position={[0, 0, -3]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

function GlowingParticles({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const particleCount = 8;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.03 + scrollProgress * Math.PI * 0.5;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3 + i * 0.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * (radius * 0.7),
              -10 - i * 2,
            ]}
          >
            <sphereGeometry args={[0.4 + i * 0.15, 16, 16]} />
            <meshBasicMaterial 
              color="#ff2d55" 
              transparent 
              opacity={Math.max(0.02, 0.06 - scrollProgress * 0.04)} 
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[8, 5, 8]} intensity={2} color="#ff2d55" />
      <pointLight position={[-8, -5, 8]} intensity={1.2} color="#ff6b8a" />
      <pointLight position={[0, 0, 8]} intensity={1.5} color="#ffffff" />
      <spotLight 
        position={[0, 12, 6]} 
        angle={0.4} 
        penumbra={1} 
        intensity={1.2} 
        color="#ff2d55" 
      />
      <Suspense fallback={null}>
        <IgniteLogo3D scrollProgress={scrollProgress} />
      </Suspense>
      <GlowingParticles scrollProgress={scrollProgress} />
    </>
  );
}

export default function Logo3DBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/models/ignite-logo.glb');

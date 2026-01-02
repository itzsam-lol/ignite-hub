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
          emissiveIntensity: 0.8,
          transparent: true,
          opacity: 0.5, // Increased base opacity for better visibility
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
      const time = state.clock.elapsedTime;
      
      // Enhanced rotation - visible throughout scroll
      groupRef.current.rotation.y = time * 0.2 + scrollProgress * Math.PI * 2;
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.15 + scrollProgress * 0.4;
      groupRef.current.rotation.z = Math.cos(time * 0.2) * 0.08;
      
      // Improved scroll-based positioning - stays visible
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.3 - scrollProgress * 0.8;
      groupRef.current.position.z = -2 - scrollProgress * 3;
      
      // Dynamic scale that maintains visibility
      const scale = 1.3 - scrollProgress * 0.4;
      groupRef.current.scale.setScalar(Math.max(0.8, scale));
    }
    
    // Enhanced material properties - maintains visibility throughout
    if (materialRef.current) {
      // Opacity stays higher throughout scroll
      materialRef.current.opacity = Math.max(0.35, 0.5 - scrollProgress * 0.15);
      materialRef.current.emissiveIntensity = Math.max(0.5, 0.8 - scrollProgress * 0.3);
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} scale={1.3} position={[0, 0, -2]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

function GlowingParticles({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const particleCount = 12; // Increased particle count

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05 + scrollProgress * Math.PI * 0.8;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3 + i * 0.4;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * (radius * 0.6),
              -8 - i * 1.5,
            ]}
          >
            <sphereGeometry args={[0.35 + i * 0.12, 16, 16]} />
            <meshBasicMaterial 
              color="#ff2d55" 
              transparent 
              opacity={Math.max(0.04, 0.1 - scrollProgress * 0.05)} 
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
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={1.0} />
      <pointLight position={[10, 6, 10]} intensity={2.5} color="#ff2d55" />
      <pointLight position={[-10, -6, 10]} intensity={1.5} color="#ff6b8a" />
      <pointLight position={[0, 0, 10]} intensity={2} color="#ffffff" />
      <spotLight 
        position={[0, 15, 8]} 
        angle={0.5} 
        penumbra={1} 
        intensity={1.8} 
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

    // Use requestAnimationFrame for smoother scroll updates
    let rafId: number;
    const smoothScroll = () => {
      handleScroll();
      rafId = requestAnimationFrame(smoothScroll);
    };
    
    smoothScroll();
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      role="presentation"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
          // Performance optimizations
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]} // Responsive pixel ratio
        performance={{ min: 0.5 }} // Adaptive performance
        frameloop="always"
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

// Preload the model for instant loading
useGLTF.preload('/models/ignite-logo.glb');
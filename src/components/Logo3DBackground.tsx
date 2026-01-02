import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function IgniteLogo3D({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const { scene } = useGLTF('/models/ignite-logo.glb');

  useEffect(() => {
    // Apply metallic shiny material to all meshes
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#ff2d55'),
          emissive: new THREE.Color('#ff2d55'),
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.7, // Increased for better visibility
          roughness: 0.2, // Lower roughness for shinier surface
          metalness: 1.0, // Maximum metalness for metallic look
          side: THREE.DoubleSide,
          envMapIntensity: 2.0, // Increased for more reflections
        });
        child.material = material;
        materialRef.current = material;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Fixed orientation - no tilt, straight on
      // Only rotate on Y axis for gentle spin
      groupRef.current.rotation.y = time * 0.15 + scrollProgress * Math.PI * 1.5;
      groupRef.current.rotation.x = 0; // No X tilt
      groupRef.current.rotation.z = 0; // No Z tilt
      
      // Gentle vertical float
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.2 - scrollProgress * 0.5;
      groupRef.current.position.z = -4 - scrollProgress * 2;
      groupRef.current.position.x = 0;
      
      // Reduced scale - smaller logo
      const scale = 0.7 - scrollProgress * 0.2; // Much smaller base size
      groupRef.current.scale.setScalar(Math.max(0.5, scale));
    }
    
    // Maintain high opacity throughout
    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0.5, 0.7 - scrollProgress * 0.2);
      materialRef.current.emissiveIntensity = Math.max(0.4, 0.6 - scrollProgress * 0.2);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={0.7} position={[0, 0, -4]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

function GlowingParticles({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const particleCount = 10;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.04 + scrollProgress * Math.PI * 0.6;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 2.5 + i * 0.3;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * (radius * 0.5),
              -6 - i * 1.2,
            ]}
          >
            <sphereGeometry args={[0.25 + i * 0.08, 16, 16]} />
            <meshBasicMaterial 
              color="#ff2d55" 
              transparent 
              opacity={Math.max(0.08, 0.15 - scrollProgress * 0.07)} 
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
      {/* Enhanced lighting for metallic material */}
      <ambientLight intensity={1.2} />
      
      {/* Key lights for metallic reflections */}
      <pointLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={2} color="#ff6b8a" />
      <pointLight position={[0, 0, 15]} intensity={2.5} color="#ffffff" />
      
      {/* Rim lights for edge definition */}
      <spotLight 
        position={[0, 15, 8]} 
        angle={0.5} 
        penumbra={1} 
        intensity={2} 
        color="#ff2d55" 
      />
      <spotLight 
        position={[10, -5, 10]} 
        angle={0.4} 
        penumbra={1} 
        intensity={1.5} 
        color="#ffffff" 
      />
      
      {/* Environment map for realistic metallic reflections */}
      <Environment preset="city" />
      
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
    let rafId: number;
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };
    
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
      style={{ 
        zIndex: 1, // Increased z-index to be above section backgrounds
        mixBlendMode: 'screen' // Blend mode to show through dark backgrounds
      }}
      role="presentation"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop="always"
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/models/ignite-logo.glb');
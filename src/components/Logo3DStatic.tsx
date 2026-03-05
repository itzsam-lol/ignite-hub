import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

function IgniteLogo3D() {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const { scene } = useGLTF('/models/ignite-logo.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#ff2d55'),
                    emissive: new THREE.Color('#ff2d55'),
                    emissiveIntensity: 0.4,
                    transparent: true,
                    opacity: 0.22,
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
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime;
        // Gentle idle rotation — no scroll influence
        groupRef.current.rotation.y = time * 0.15;
        groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
        groupRef.current.rotation.z = Math.cos(time * 0.2) * 0.05;
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    });

    return (
        <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
            <group ref={groupRef} scale={0.55} position={[0, 0, -6]}>
                <primitive object={scene} />
            </group>
        </Float>
    );
}

function GlowingParticles() {
    const groupRef = useRef<THREE.Group>(null);
    const particleCount = 8;

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.z = state.clock.elapsedTime * 0.03;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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
                        <meshBasicMaterial color="#ff2d55" transparent opacity={0.06} />
                    </mesh>
                );
            })}
        </group>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.8} />
            <pointLight position={[8, 5, 8]} intensity={2} color="#ff2d55" />
            <pointLight position={[-8, -5, 8]} intensity={1.2} color="#ff6b8a" />
            <pointLight position={[0, 0, 8]} intensity={1.5} color="#ffffff" />
            <spotLight position={[0, 12, 6]} angle={0.4} penumbra={1} intensity={1.2} color="#ff2d55" />
            <Suspense fallback={null}>
                <IgniteLogo3D />
            </Suspense>
            <GlowingParticles />
        </>
    );
}

export default function Logo3DStatic() {
    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 55 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
            >
                <Scene />
            </Canvas>
        </div>
    );
}

useGLTF.preload('/models/ignite-logo.glb');

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed, distort, radius }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.005;
      meshRef.current.rotation.x += 0.002 * speed;
      meshRef.current.rotation.y += 0.003 * speed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[radius, 24, 24]} position={position}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={0.8}
        clearcoat={0.8}
        clearcoatRoughness={0}
        metalness={0.1}
        roughness={0.2}
        distort={distort}
        speed={speed * 2}
      />
    </Sphere>
  );
};

export const WebGLBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-multiply">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: false, alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#eaddd7" />
        
        {/* Soft elegant shapes representing the natural theme */}
        <FloatingShape position={[-4, 2, -2]} color="#eaddd7" speed={0.5} distort={0.4} radius={3} />
        <FloatingShape position={[5, -2, -4]} color="#bd6b58" speed={0.6} distort={0.5} radius={4} />
        <FloatingShape position={[0, -4, -6]} color="#a8b5a1" speed={0.4} distort={0.3} radius={3.5} />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default WebGLBackground;

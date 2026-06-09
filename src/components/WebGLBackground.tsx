import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  radius: number;
  segments: number;
}

const FloatingShape = ({ position, color, speed, distort, radius, segments }: FloatingShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.005;
      meshRef.current.rotation.x += 0.002 * speed;
      meshRef.current.rotation.y += 0.003 * speed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[radius, segments, segments]} position={position}>
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

/**
 * Samples frame rate inside the render loop. When the rolling average drops
 * below `threshold` FPS it calls `onLowFps` (at most once per cooldown) so the
 * parent can drop the canvas resolution. Calls `onGoodFps` when comfortably
 * above the threshold to allow scaling back up.
 */
const FpsSampler = ({
  threshold,
  onLowFps,
  onGoodFps,
}: {
  threshold: number;
  onLowFps: () => void;
  onGoodFps: () => void;
}) => {
  const frames = useRef(0);
  const elapsed = useRef(0);

  useFrame((_state, delta) => {
    frames.current += 1;
    elapsed.current += delta;
    // Evaluate roughly once per second.
    if (elapsed.current >= 1) {
      const fps = frames.current / elapsed.current;
      if (fps < threshold) {
        onLowFps();
      } else if (fps > threshold + 12) {
        onGoodFps();
      }
      frames.current = 0;
      elapsed.current = 0;
    }
  });

  return null;
};

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
}

export const WebGLBackground = () => {
  const mobile = isMobileViewport();

  // dpr (device pixel ratio) is the resolution knob. Mobile starts lower and
  // can be pushed down further when FPS drops below 50.
  const ceilingDpr = mobile ? 1.25 : 2;
  const floorDpr = mobile ? 0.6 : 1;
  const [dpr, setDpr] = useState<number>(mobile ? 1 : 1.5);
  const segments = mobile ? 16 : 24;

  // Threshold: target a smooth 60fps, intervene when sustained below 50.
  const fpsThreshold = 50;

  const handleLowFps = useCallback(() => {
    setDpr((prev) => Math.max(floorDpr, Math.round((prev - 0.25) * 100) / 100));
  }, [floorDpr]);

  const handleGoodFps = useCallback(() => {
    setDpr((prev) => Math.min(ceilingDpr, Math.round((prev + 0.25) * 100) / 100));
  }, [ceilingDpr]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-multiply">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <FpsSampler threshold={fpsThreshold} onLowFps={handleLowFps} onGoodFps={handleGoodFps} />

        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#eaddd7" />

        <FloatingShape position={[-4, 2, -2]} color="#eaddd7" speed={0.5} distort={0.4} radius={3} segments={segments} />
        <FloatingShape position={[5, -2, -4]} color="#bd6b58" speed={0.6} distort={0.5} radius={4} segments={segments} />
        <FloatingShape position={[0, -4, -6]} color="#a8b5a1" speed={0.4} distort={0.3} radius={3.5} segments={segments} />

        {!mobile && <Environment preset="sunset" />}
      </Canvas>
    </div>
  );
};

export default WebGLBackground;

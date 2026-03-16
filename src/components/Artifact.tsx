"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group } from "three";

interface ArtifactProps {
  position: [number, number, number];
  version: number;
  visible: boolean;
  flipping?: boolean;
  label?: string;
}

export default function Artifact({ position, version, visible, flipping, label }: ArtifactProps) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = performance.now() * 0.001;
    groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.06;
    if (flipping) {
      groupRef.current.rotation.y += 0.15;
    } else {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Main cartridge body - warm amber theme */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.45, 0.12]} />
        <meshStandardMaterial
          color="#2d1f0e"
          emissive="#d97706"
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Inner data panel */}
      <mesh position={[0, 0, 0.065]}>
        <boxGeometry args={[0.5, 0.3, 0.01]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#fbbf24"
          emissiveIntensity={1}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Edge accents */}
      {[-0.33, 0.33].map((x) => (
        <mesh key={x} position={[x, 0, 0.065]}>
          <boxGeometry args={[0.025, 0.4, 0.025]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.2} />
        </mesh>
      ))}

      {/* Glow */}
      <pointLight color="#f59e0b" intensity={3} distance={3} />

      {/* File name */}
      <Html position={[0, 0.4, 0]} center style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-700/40 backdrop-blur-sm">
          auth-refactor-review.md
        </div>
      </Html>

      {/* Event label only — no version badge (version shown on cabinet) */}
      {label && (
        <Html position={[0, -0.4, 0]} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded bg-black/70 px-2 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-600/30 backdrop-blur-sm">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

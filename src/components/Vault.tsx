"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh, MeshStandardMaterial, Group } from "three";
import { POSITIONS } from "@/lib/store";

interface VaultProps {
  slotGlowing: boolean;
  version: number;
  hasArtifact: boolean;
}

export default function Vault({ slotGlowing, version, hasArtifact }: VaultProps) {
  const pos = POSITIONS.vault;
  const glowRef = useRef<Mesh>(null);
  const slotRef = useRef<Mesh>(null);

  useFrame(() => {
    const t = performance.now() * 0.001;
    if (glowRef.current) {
      const mat = glowRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = slotGlowing ? 1.0 + Math.sin(t * 3) * 0.3 : 0.15;
    }
    if (slotRef.current) {
      const mat = slotRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = hasArtifact ? 0.6 + Math.sin(t * 2) * 0.2 : 0.05;
    }
  });

  return (
    <group position={pos}>
      {/* Base platform */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.16, 6]} />
        <meshStandardMaterial color="#5a4228" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.04, 6]} />
        <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.4} />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2, 2, 1.2]} />
        <meshStandardMaterial color="#7a5838" metalness={0.2} roughness={0.7} />
      </mesh>

      {/* 3 Drawers — each one lights up as versions are stored */}
      <DrawerWithVersion y={0.45} drawerIndex={0} version={version} label="v1" />
      <DrawerWithVersion y={0.9} drawerIndex={1} version={version} label="v2" />
      <DrawerWithVersion y={1.35} drawerIndex={2} version={version} label="v3" />

      {/* Front panel — top section */}
      <mesh position={[0, 1.75, 0.61]}>
        <boxGeometry args={[1.6, 0.5, 0.02]} />
        <meshStandardMaterial color="#7a6040" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Top accent */}
      <mesh position={[0, 2.22, 0]}>
        <boxGeometry args={[2.1, 0.06, 1.3]} />
        <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.5} />
      </mesh>

      {/* Vertical accent strips */}
      {[-0.85, 0.85].map((x) => (
        <mesh key={`v-${x}`} position={[x, 1.2, 0.62]}>
          <boxGeometry args={[0.04, 1.8, 0.04]} />
          <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Slot opening */}
      <mesh ref={slotRef} position={[0, 1.95, 0.5]}>
        <boxGeometry args={[1, 0.3, 0.25]} />
        <meshStandardMaterial
          color={hasArtifact ? "#8b6848" : "#4a3820"}
          emissive={hasArtifact ? "#f59e0b" : "#92400e"}
          emissiveIntensity={0.05}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Glow frame */}
      <mesh ref={glowRef} position={[0, 1.95, 0.63]}>
        <boxGeometry args={[1.15, 0.45, 0.02]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.15} transparent opacity={0.5} />
      </mesh>

      {/* Label */}
      <Html position={[0, 2.7, 0]} center style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-lg bg-gray-900/90 px-4 py-1.5 text-sm font-bold tracking-[0.15em] text-amber-400 backdrop-blur-sm border border-amber-600/30 shadow-lg">
          AgentFiles.io
        </div>
      </Html>

      <pointLight position={[0, 2.5, 1.5]} color="#f59e0b" intensity={2} distance={6} />
    </group>
  );
}

// Individual drawer that lights up when its version is stored
function DrawerWithVersion({
  y,
  drawerIndex,
  version,
  label,
}: {
  y: number;
  drawerIndex: number;
  version: number;
  label: string;
}) {
  const drawerRef = useRef<Group>(null);
  const lightRef = useRef<Mesh>(null);
  const active = version > drawerIndex;
  const justActivated = version === drawerIndex + 1;

  useFrame(() => {
    if (!drawerRef.current) return;
    const t = performance.now() * 0.001;

    // Drawer slides out slightly when just activated
    if (justActivated) {
      const slide = Math.sin(t * 4) * 0.02 + 0.04;
      drawerRef.current.position.z = slide;
    } else {
      drawerRef.current.position.z = 0;
    }

    // Light pulse when active
    if (lightRef.current) {
      const mat = lightRef.current.material as MeshStandardMaterial;
      if (active) {
        mat.emissiveIntensity = 1.5 + Math.sin(t * 2 + drawerIndex) * 0.5;
      } else {
        mat.emissiveIntensity = 0;
      }
    }
  });

  return (
    <group ref={drawerRef}>
      {/* Drawer line */}
      <mesh position={[0, y, 0.62]}>
        <boxGeometry args={[1.5, 0.02, 0.02]} />
        <meshStandardMaterial color="#8b6848" />
      </mesh>

      {/* Drawer handle */}
      <mesh position={[0, y + 0.12, 0.66]} castShadow>
        <boxGeometry args={[0.3, 0.06, 0.06]} />
        <meshStandardMaterial color="#d97706" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Status light — amber when version stored */}
      <mesh ref={lightRef} position={[0.6, y + 0.12, 0.67]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial
          color={active ? "#f59e0b" : "#6b7280"}
          emissive={active ? "#f59e0b" : "#000"}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Version label on drawer */}
      {active && (
        <Html position={[-0.55, y + 0.12, 0.68]} center style={{ pointerEvents: "none" }}>
          <div className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[8px] font-bold text-black shadow">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

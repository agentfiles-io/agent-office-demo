"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial } from "three";
import type { AgentId } from "@/lib/store";

// Minecraft / voxel-style blocky characters
import { MACHINE_LABELS } from "@/lib/store";

const AGENT_COLORS: Record<AgentId, { skin: string; shirt: string; pants: string; accent: string; dot: string }> = {
  claude: {
    skin: "#f5d0a9",
    shirt: "#7c3aed",
    pants: "#4c1d95",
    accent: "#a78bfa",
    dot: "#a855f7",
  },
  codex: {
    skin: "#c68642",
    shirt: "#2563eb",
    pants: "#1e3a5f",
    accent: "#60a5fa",
    dot: "#3b82f6",
  },
  chatgpt: {
    skin: "#8d5524",
    shirt: "#ea580c",
    pants: "#7c2d12",
    accent: "#fb923c",
    dot: "#f97316",
  },
  openclaw: {
    skin: "#e8c9a0",
    shirt: "#16a34a",
    pants: "#14532d",
    accent: "#4ade80",
    dot: "#22c55e",
  },
};

const AGENT_LABELS: Record<AgentId, string> = {
  claude: "Claude Code",
  codex: "Codex",
  chatgpt: "ChatGPT",
  openclaw: "OpenClaw",
};

interface AgentProps {
  id: AgentId;
  position: [number, number, number];
  thinking: boolean;
  thinkingLabel: string;
  notified: boolean;
}

export default function Agent({ id, position, thinking, thinkingLabel, notified }: AgentProps) {
  const groupRef = useRef<Group>(null);
  const colors = AGENT_COLORS[id];

  useFrame(() => {
    if (!groupRef.current) return;
    const t = performance.now() * 0.001;
    // Subtle idle bob
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.03;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Agent desk */}
      <AgentDesk color="#6b5030" accent={colors.accent} />

      {/* Cute blocky character — behind desk, big head, big eyes */}
      <group position={[0, 0, -0.6]}>
        {/* Legs — short and stubby */}
        <mesh position={[-0.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.16, 0.4, 0.18]} />
          <meshStandardMaterial color={colors.pants} />
        </mesh>
        <mesh position={[0.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.16, 0.4, 0.18]} />
          <meshStandardMaterial color={colors.pants} />
        </mesh>
        {/* Shoes */}
        <mesh position={[-0.1, 0.04, 0.04]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.24]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <mesh position={[0.1, 0.04, 0.04]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.24]} />
          <meshStandardMaterial color="#374151" />
        </mesh>

        {/* Body / shirt — rounded feel */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.42, 0.45, 0.24]} />
          <meshStandardMaterial color={colors.shirt} />
        </mesh>

        {/* Arms */}
        <ThinkingArm side={-1} thinking={thinking} color={colors.shirt} skinColor={colors.skin} />
        <ThinkingArm side={1} thinking={thinking} color={colors.shirt} skinColor={colors.skin} />

        {/* Head — BIG and cute (oversized relative to body) */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.45, 0.42, 0.42]} />
          <meshStandardMaterial color={colors.skin} />
        </mesh>

        {/* Eyes — big and cute */}
        <mesh position={[-0.1, 1.12, 0.211]}>
          <boxGeometry args={[0.1, 0.1, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.1, 1.12, 0.211]}>
          <boxGeometry args={[0.1, 0.1, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.1, 1.11, 0.22]}>
          <boxGeometry args={[0.06, 0.06, 0.01]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.1, 1.11, 0.22]}>
          <boxGeometry args={[0.06, 0.06, 0.01]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Eye shine / highlight */}
        <mesh position={[-0.08, 1.14, 0.225]}>
          <boxGeometry args={[0.025, 0.025, 0.005]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.12, 1.14, 0.225]}>
          <boxGeometry args={[0.025, 0.025, 0.005]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>

        {/* Tiny smile */}
        <mesh position={[0, 1.04, 0.215]}>
          <boxGeometry args={[0.1, 0.02, 0.01]} />
          <meshStandardMaterial color="#a0522d" />
        </mesh>

        {/* Hair — color coded per agent */}
        <mesh position={[0, 1.33, -0.02]} castShadow>
          <boxGeometry args={[0.47, 0.06, 0.45]} />
          <meshStandardMaterial color={id === "claude" ? "#4a3728" : id === "codex" ? "#1a1a1a" : id === "openclaw" ? "#8b4513" : "#2d1f0e"} />
        </mesh>
        {/* Hair front fringe */}
        <mesh position={[0, 1.28, 0.18]} castShadow>
          <boxGeometry args={[0.35, 0.06, 0.06]} />
          <meshStandardMaterial color={id === "claude" ? "#4a3728" : id === "codex" ? "#1a1a1a" : id === "openclaw" ? "#8b4513" : "#2d1f0e"} />
        </mesh>
      </group>

      {/* Notification ring */}
      {notified && <NotificationRing color={colors.dot} />}

      {/* Name tag + machine label */}
      <Html position={[0, 2.2, -0.6]} center style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-gray-900/90 px-2.5 py-1 backdrop-blur-sm border border-gray-700/50 shadow-lg">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: colors.dot,
                boxShadow: `0 0 6px ${colors.dot}`,
              }}
            />
            <span className="text-[11px] font-semibold text-white">{AGENT_LABELS[id]}</span>
          </div>
          {MACHINE_LABELS[id] && (
            <div className="whitespace-nowrap rounded bg-gray-800/70 px-2 py-0.5 text-[9px] text-gray-400 border border-gray-700/30">
              📍 {MACHINE_LABELS[id]}
            </div>
          )}
        </div>
      </Html>

      {/* Thinking label */}
      {thinking && thinkingLabel && (
        <Html position={[0, 2.6, -0.6]} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-md bg-black/80 px-2 py-0.5 text-[10px] text-amber-300 backdrop-blur-sm animate-pulse border border-amber-700/30">
            {thinkingLabel}
          </div>
        </Html>
      )}

      {/* Thinking particles */}
      {thinking && <ThinkingParticles color={colors.accent} />}
    </group>
  );
}

function AgentDesk({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      {/* Desktop surface */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.08, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-0.85, -0.35], [0.85, -0.35], [-0.85, 0.35], [0.85, 0.35]].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.22, dz]} castShadow>
          <boxGeometry args={[0.06, 0.44, 0.06]} />
          <meshStandardMaterial color="#5a4228" />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0, 0.78, -0.25]} castShadow>
        <boxGeometry args={[0.55, 0.38, 0.04]} />
        <meshStandardMaterial color="#111" emissive={accent} emissiveIntensity={0.15} />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, 0.55, -0.22]} castShadow>
        <boxGeometry args={[0.06, 0.14, 0.06]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, 0.5, 0.1]} castShadow>
        <boxGeometry args={[0.4, 0.02, 0.15]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Coffee mug */}
      <mesh position={[0.7, 0.55, 0.15]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 8]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
    </group>
  );
}

function ThinkingArm({ side, thinking, color, skinColor }: { side: number; thinking: boolean; color: string; skinColor: string }) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const t = performance.now() * 0.001;
    if (thinking) {
      ref.current.rotation.x = Math.sin(t * 3 + side) * 0.25 - 0.3;
    } else {
      ref.current.rotation.x = 0;
    }
  });

  return (
    <group ref={ref} position={[side * 0.32, 0.7, 0]}>
      {/* Upper arm */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.18]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Hand */}
      <mesh position={[0, -0.28, 0]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.14]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  );
}

function ThinkingParticles({ color }: { color: string }) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const t = performance.now() * 0.001;
    ref.current.children.forEach((child, i) => {
      const mesh = child as Mesh;
      mesh.position.y = 1.7 + Math.sin(t * 3 + i * 2) * 0.3;
      mesh.position.x = Math.cos(t * 2 + i * 2.5) * 0.35;
      mesh.position.z = -0.6 + Math.sin(t * 2.5 + i * 1.5) * 0.3;
    });
  });

  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <mesh key={i}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function NotificationRing({ color }: { color: string }) {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    const t = (performance.now() * 0.001) % 1;
    ref.current.scale.setScalar(1 + t * 2);
    (ref.current.material as MeshStandardMaterial).opacity = 1 - t;
  });

  return (
    <mesh ref={ref} position={[0, 1.5, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.35, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={1} side={2} />
    </mesh>
  );
}

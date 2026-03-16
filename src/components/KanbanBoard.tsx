"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import { useSceneStore } from "@/lib/store";

// Freestanding easel kanban board to the LEFT of OpenClaw, clearly visible.
// Cards animate (move columns) when OpenClaw is "Updating Linear board…"
export default function KanbanBoard() {
  const openclawThinking = useSceneStore((s) => s.agents.openclaw.thinking);

  // Positioned well to the left and slightly behind OpenClaw (at [-6, 0, -5])
  // so it doesn't overlap with agent name/VPS labels
  return (
    <group position={[-10, 0, -7]} rotation={[0, 0.6, 0]}>
      {/* Easel legs */}
      <mesh position={[-0.7, 1.1, -0.15]} rotation={[0.08, 0, 0.05]} castShadow>
        <boxGeometry args={[0.06, 2.2, 0.06]} />
        <meshStandardMaterial color="#8b6848" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 1.1, -0.15]} rotation={[0.08, 0, -0.05]} castShadow>
        <boxGeometry args={[0.06, 2.2, 0.06]} />
        <meshStandardMaterial color="#8b6848" roughness={0.8} />
      </mesh>
      {/* Back leg */}
      <mesh position={[0, 0.9, -0.4]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 1.8, 0.05]} />
        <meshStandardMaterial color="#8b6848" roughness={0.8} />
      </mesh>

      {/* Board on easel */}
      <group position={[0, 2.0, 0]}>
        {/* Board backing */}
        <mesh castShadow>
          <boxGeometry args={[2.6, 1.7, 0.06]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.4} />
        </mesh>
        {/* Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[2.7, 1.8, 0.03]} />
          <meshStandardMaterial color="#8b6848" roughness={0.7} />
        </mesh>

        {/* Column header bars — colored 3D bars instead of Html text */}
        {/* "To Do" header — gray */}
        <mesh position={[-0.8, 0.65, 0.04]}>
          <boxGeometry args={[0.7, 0.14, 0.02]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.5} />
        </mesh>
        {/* "In Progress" header — blue */}
        <mesh position={[0, 0.65, 0.04]}>
          <boxGeometry args={[0.7, 0.14, 0.02]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.5} />
        </mesh>
        {/* "Done" header — green */}
        <mesh position={[0.8, 0.65, 0.04]}>
          <boxGeometry args={[0.7, 0.14, 0.02]} />
          <meshStandardMaterial color="#4ade80" roughness={0.5} />
        </mesh>

        {/* Column dividers */}
        {[-0.4, 0.4].map((x) => (
          <mesh key={x} position={[x, -0.05, 0.04]}>
            <boxGeometry args={[0.02, 1.3, 0.01]} />
            <meshStandardMaterial color="#d1c8b8" />
          </mesh>
        ))}

        {/* Kanban cards */}
        <KanbanCard
          color="#a855f7"
          restX={-0.8}
          activeX={0.8}
          y={0.35}
          isMoving={openclawThinking}
        />
        <KanbanCard
          color="#3b82f6"
          restX={0}
          activeX={0}
          y={0.35}
          isMoving={false}
        />
        <KanbanCard
          color="#f97316"
          restX={-0.8}
          activeX={0}
          y={0.1}
          isMoving={openclawThinking}
        />
        <KanbanCard
          color="#22c55e"
          restX={0.8}
          activeX={0.8}
          y={0.1}
          isMoving={false}
        />
        <KanbanCard
          color="#ef4444"
          restX={-0.8}
          activeX={-0.8}
          y={-0.15}
          isMoving={false}
        />
        <KanbanCard
          color="#eab308"
          restX={0}
          activeX={0.8}
          y={-0.15}
          isMoving={openclawThinking}
        />
      </group>

      {/* "Linear" label — small clean badge */}
      <Html position={[0, 3.0, 0.04]} center style={{ pointerEvents: "none" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "#ede9fe",
          borderRadius: "4px",
          padding: "2px 8px",
          border: "1px solid #c4b5fd",
          whiteSpace: "nowrap",
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <span style={{ fontSize: "8px", fontWeight: 700, color: "#6d28d9" }}>Linear</span>
        </div>
      </Html>
    </group>
  );
}

function KanbanCard({
  color,
  restX,
  activeX,
  y,
  isMoving,
}: {
  color: string;
  restX: number;
  activeX: number;
  y: number;
  isMoving: boolean;
}) {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);
  const hasAnimated = useRef(false);
  const moveStart = useRef(0);

  useFrame(() => {
    if (!ref.current) return;

    // Start animation when isMoving becomes true (and hasn't animated yet)
    if (isMoving && !hasAnimated.current) {
      hasAnimated.current = true;
      moveStart.current = performance.now();
    }

    if (hasAnimated.current) {
      const elapsed = (performance.now() - moveStart.current) / 1000;
      const t = Math.min(elapsed / 1.0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      ref.current.position.x = restX + (activeX - restX) * eased;
      // Pop forward while sliding, settle when done
      ref.current.position.z = 0.04 + (t < 1 ? Math.sin(t * Math.PI) * 0.08 : 0);
      if (matRef.current) {
        matRef.current.emissiveIntensity = t < 1 ? 2 * Math.sin(t * Math.PI) : 0;
      }
    }

    // Reset only when scene fully resets (isMoving false AND we already animated)
    if (!isMoving && hasAnimated.current) {
      // Check if enough time passed that this is a real reset (not just stop_thinking)
      const elapsed = (performance.now() - moveStart.current) / 1000;
      if (elapsed > 5) {
        hasAnimated.current = false;
        ref.current.position.x = restX;
        ref.current.position.z = 0.04;
        if (matRef.current) {
          matRef.current.emissiveIntensity = 0;
        }
      }
    }
  });

  return (
    <mesh ref={ref} position={[restX, y, 0.04]}>
      <boxGeometry args={[0.6, 0.18, 0.025]} />
      <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0} roughness={0.7} />
    </mesh>
  );
}

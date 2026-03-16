"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { POSITIONS } from "@/lib/store";
import { Mesh, MeshStandardMaterial, Vector3, CatmullRomCurve3 } from "three";

// ChatGPT → AgentFiles → Codex → AgentFiles → Claude → AgentFiles → OpenClaw
const LINEAGE_POINTS = [
  POSITIONS.chatgpt_above,
  POSITIONS.vault_slot,
  POSITIONS.codex_above,
  POSITIONS.vault_slot,
  POSITIONS.claude_above,
  POSITIONS.vault_slot,
  POSITIONS.openclaw_above,
].map((p) => new Vector3(...p));

const LINEAGE_COLORS = [
  "#f97316", "#f59e0b", "#3b82f6", "#f59e0b", "#a855f7", "#f59e0b", "#22c55e",
];

export default function LineageTrails({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <group>
      {LINEAGE_POINTS.slice(0, -1).map((_, i) => (
        <TrailSegment key={i} from={LINEAGE_POINTS[i]} to={LINEAGE_POINTS[i + 1]} color={LINEAGE_COLORS[i]} delay={i * 0.25} />
      ))}
      {LINEAGE_POINTS.map((pos, i) => (
        <LineageNode key={i} position={pos} color={LINEAGE_COLORS[i]} delay={i * 0.25} />
      ))}
    </group>
  );
}

function TrailSegment({ from, to, color, delay }: { from: Vector3; to: Vector3; color: string; delay: number }) {
  const mid = new Vector3().lerpVectors(from, to, 0.5);
  mid.y += 1.5;
  const curve = new CatmullRomCurve3([from, mid, to]);
  const points = curve.getPoints(16);
  return (
    <group>
      {points.map((point, i) => (
        <TrailBead key={i} position={[point.x, point.y, point.z]} color={color} delay={delay + (i / points.length) * 0.4} />
      ))}
    </group>
  );
}

function TrailBead({ position, color, delay }: { position: [number, number, number]; color: string; delay: number }) {
  const ref = useRef<Mesh>(null);
  const startTime = useRef(Date.now());
  useFrame(() => {
    if (!ref.current) return;
    const t = Math.max(0, (Date.now() - startTime.current) / 1000 - delay);
    ref.current.scale.setScalar(Math.min(t * 2, 1));
    (ref.current.material as MeshStandardMaterial).opacity = Math.min(t * 3, 0.7);
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.07, 0.07, 0.07]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0} />
    </mesh>
  );
}

function LineageNode({ position, color, delay }: { position: Vector3; color: string; delay: number }) {
  const ref = useRef<Mesh>(null);
  const startTime = useRef(Date.now());
  useFrame(() => {
    if (!ref.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    const t = Math.max(0, elapsed - delay);
    ref.current.scale.setScalar(Math.min(t * 4, 1));
    (ref.current.material as MeshStandardMaterial).emissiveIntensity = 1.5 + Math.sin(elapsed * 3) * 0.5;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.9} />
    </mesh>
  );
}

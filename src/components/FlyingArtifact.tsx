"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, MeshStandardMaterial, Vector3, QuadraticBezierCurve3 } from "three";
import type { FlyingArtifact as FlyingArtifactType } from "@/lib/store";

interface FlyingArtifactProps {
  artifact: FlyingArtifactType;
}

export default function FlyingArtifact({ artifact }: FlyingArtifactProps) {
  const groupRef = useRef<Group>(null);

  const from = new Vector3(...artifact.from);
  const to = new Vector3(...artifact.to);
  const mid = new Vector3().lerpVectors(from, to, 0.5);
  mid.y += 3;
  const curve = new QuadraticBezierCurve3(from, mid, to);

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = Date.now() - artifact.startTime;
    const t = Math.min(elapsed / artifact.duration, 1);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const pos = curve.getPoint(eased);
    groupRef.current.position.copy(pos);
    groupRef.current.rotation.y += 0.08;
    groupRef.current.rotation.z = Math.sin(t * Math.PI) * 0.2;
  });

  return (
    <>
      <TrailLine curve={curve} startTime={artifact.startTime} duration={artifact.duration} />
      <group ref={groupRef}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.35, 0.1]} />
          <meshStandardMaterial color="#2d1f0e" emissive="#d97706" emissiveIntensity={1} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <boxGeometry args={[0.35, 0.22, 0.01]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} transparent opacity={0.85} />
        </mesh>
        <pointLight color="#f59e0b" intensity={5} distance={6} />
      </group>
    </>
  );
}

function TrailLine({ curve, startTime, duration }: { curve: QuadraticBezierCurve3; startTime: number; duration: number }) {
  const points = curve.getPoints(24);
  return (
    <group>
      {points.map((point, i) => (
        <TrailDot key={i} position={[point.x, point.y, point.z]} index={i} total={points.length} startTime={startTime} duration={duration} />
      ))}
    </group>
  );
}

function TrailDot({ position, index, total, startTime, duration }: {
  position: [number, number, number]; index: number; total: number; startTime: number; duration: number;
}) {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const dotProgress = index / total;
    const visible = progress >= dotProgress;
    const fade = visible ? Math.max(0, 1 - (progress - dotProgress) * 3) : 0;
    ref.current.visible = visible;
    (ref.current.material as MeshStandardMaterial).opacity = fade * 0.6;
    ref.current.scale.setScalar(fade * 0.8 + 0.2);
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} transparent opacity={0.5} />
    </mesh>
  );
}

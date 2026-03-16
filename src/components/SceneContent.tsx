"use client";

import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Room from "./Room";
import Agent from "./Agent";
import Vault from "./Vault";
import Artifact from "./Artifact";
import FlyingArtifact from "./FlyingArtifact";
import LineageTrails from "./LineageTrails";
import KanbanBoard from "./KanbanBoard";
import { useSceneStore, POSITIONS } from "@/lib/store";
import type { AgentId } from "@/lib/store";

const AGENT_IDS: AgentId[] = ["claude", "codex", "chatgpt", "openclaw"];

export default function SceneContent() {
  const agents = useSceneStore((s) => s.agents);
  const vaultSlotGlowing = useSceneStore((s) => s.vaultSlotGlowing);
  const vaultVersion = useSceneStore((s) => s.vaultVersion);
  const artifactAtVault = useSceneStore((s) => s.artifactAtVault);
  const artifactVersion = useSceneStore((s) => s.artifactVersion);
  const artifactAtAgent = useSceneStore((s) => s.artifactAtAgent);
  const artifactFlipping = useSceneStore((s) => s.artifactFlipping);
  const flyingArtifacts = useSceneStore((s) => s.flyingArtifacts);
  const showLineage = useSceneStore((s) => s.showLineage);
  const eventLabel = useSceneStore((s) => s.eventLabel);

  const { camera } = useThree();
  camera.lookAt(0, 0.5, 1);

  return (
    <>
      {/* BRIGHT ambient — daylight office */}
      <ambientLight intensity={1.2} color="#fff8f0" />

      {/* Strong sun-like directional — the main "daylight" */}
      <directionalLight
        position={[15, 25, 12]}
        intensity={2.0}
        color="#fffbf0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Secondary directional from opposite side */}
      <directionalLight
        position={[-10, 18, -8]}
        intensity={0.8}
        color="#fef3c7"
      />

      {/* Hemisphere light for even fill */}
      <hemisphereLight
        color="#fef9ef"
        groundColor="#d4a574"
        intensity={0.8}
      />

      {/* Fill point lights */}
      <pointLight position={[-8, 10, 8]} intensity={1.0} color="#fef3c7" distance={30} />
      <pointLight position={[10, 10, -5]} intensity={0.8} color="#fef3c7" distance={28} />
      <pointLight position={[0, 12, 0]} intensity={0.6} color="#ffffff" distance={25} />
      <pointLight position={[0, 5, 12]} intensity={0.5} color="#fde68a" distance={20} />

      {/* No fog — bright and clear */}

      <Room />

      {AGENT_IDS.map((id) => (
        <Agent
          key={id}
          id={id}
          position={POSITIONS[id] as [number, number, number]}
          thinking={agents[id].thinking}
          thinkingLabel={agents[id].thinkingLabel}
          notified={agents[id].notified}
        />
      ))}

      <Vault
        slotGlowing={vaultSlotGlowing}
        version={vaultVersion}
        hasArtifact={artifactAtVault}
      />

      {artifactAtAgent && (
        <Artifact
          position={POSITIONS[`${artifactAtAgent}_above`] as [number, number, number]}
          version={artifactVersion}
          visible={true}
          flipping={artifactFlipping}
          label={eventLabel}
        />
      )}

      {flyingArtifacts.map((fa) => (
        <FlyingArtifact key={fa.id} artifact={fa} />
      ))}

      <KanbanBoard />
      <LineageTrails visible={showLineage} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} intensity={0.3} />
        <Vignette offset={0.5} darkness={0.3} />
      </EffectComposer>
    </>
  );
}

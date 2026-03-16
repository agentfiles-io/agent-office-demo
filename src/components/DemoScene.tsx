"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SceneContent from "./SceneContent";
import Captions from "./Captions";
import { useDemoRunner } from "@/lib/useDemoRunner";
import { useSceneStore } from "@/lib/store";
import { DEMO_DURATION } from "@/lib/demoScript";

export default function DemoScene() {
  useDemoRunner();

  const elapsed = useSceneStore((s) => s.elapsed);
  const progress = Math.min(elapsed / DEMO_DURATION, 1);

  return (
    <div className="relative h-screen w-screen bg-[#e8ddd0]">
      <Canvas
        shadows
        camera={{
          position: [20, 16, 20],
          fov: 38,
          near: 0.1,
          far: 120,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#e8ddd0" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      <Captions />

      <div className="absolute bottom-0 left-0 h-1 w-full bg-[#c4b5a0]">
        <div
          className="h-full bg-amber-500 transition-all duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="absolute bottom-3 right-4 text-[10px] font-medium text-amber-800/50 tracking-wider">
        agentfiles.io
      </div>
    </div>
  );
}

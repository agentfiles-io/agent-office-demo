"use client";

import { useSceneStore } from "@/lib/store";

export default function Captions() {
  const caption = useSceneStore((s) => s.caption);

  if (!caption) return null;

  return (
    <div className="absolute inset-x-0 top-6 flex justify-center pointer-events-none">
      <div
        className="rounded-xl border border-amber-300/40 bg-white/80 px-6 py-3 backdrop-blur-md shadow-lg"
        style={{ animation: "fadeInUp 0.5s ease-out" }}
      >
        <p className="text-center text-lg font-semibold text-gray-800 md:text-xl tracking-wide">
          {caption}
        </p>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

// Dynamic import with SSR disabled — R3F needs the DOM
const DemoScene = dynamic(() => import("@/components/DemoScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="text-sm text-gray-500 animate-pulse">Loading scene…</div>
    </div>
  ),
});

export default function Home() {
  return <DemoScene />;
}

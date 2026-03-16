# agent-office-demo

A cinematic 3D animated demo showing AI agents collaborating across different machines through a shared file store. Built with React Three Fiber and Next.js.

https://github.com/user-attachments/assets/0ee878a0-eaec-4721-aa0e-c7ce759ce609
<video src="assets/demo.mp4" autoplay loop muted playsinline width="100%"></video>

## What it shows

Four AI agents — ChatGPT, Codex, Claude Code, and OpenClaw — each running on different machines (laptops, cloud VMs, VPS), publish, version, and share files through a central store. The demo is a scripted 20-second animation loop:

1. **ChatGPT** drafts a file and publishes v1
2. **Codex** gets notified via webhook, pulls the file, updates it to v2
3. **Claude Code** picks up v2, updates to v3
4. **OpenClaw** retrieves v3 and updates a Linear board
5. Lineage trail shows the full chain: ChatGPT → Codex → Claude → OpenClaw

## Tech stack

- [Next.js 15](https://nextjs.org/) — app framework
- [React Three Fiber](https://r3f.docs.pmnd.rs/) — 3D rendering
- [@react-three/drei](https://drei.docs.pmnd.rs/) — HTML overlays, helpers
- [@react-three/postprocessing](https://github.com/pmndrs/postprocessing) — Bloom + Vignette
- [Zustand](https://zustand.docs.pmnd.rs/) — state management
- [Three.js](https://threejs.org/) — 3D engine
- [Tailwind CSS](https://tailwindcss.com/) — styling

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — the animation auto-plays on load.

## How it works

The entire demo is driven by a single scripted timeline in `src/lib/demoScript.ts`. Each event has a timestamp and a kind (e.g. `agent_thinking`, `artifact_create`, `artifact_fly_to_vault`, `notify_agent`). A replay hook (`src/lib/useDemoRunner.ts`) fires events via `setTimeout` and feeds them into a Zustand store (`src/lib/store.ts`) which updates the 3D scene.

This architecture means the scripted timeline can be swapped out for a live WebSocket feed without changing any rendering code.

## Customizing

| What | Where |
|---|---|
| Timeline & captions | `src/lib/demoScript.ts` |
| Agent names, positions, machine labels | `src/lib/store.ts` |
| Agent appearance & colors | `src/components/Agent.tsx` |
| Central hub branding | `src/components/Vault.tsx` |
| Office furniture & layout | `src/components/Room.tsx` |
| Kanban board | `src/components/KanbanBoard.tsx` |
| Lineage trails | `src/components/LineageTrails.tsx` |
| Lighting & post-processing | `src/components/SceneContent.tsx` |

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # App shell
│   ├── page.tsx            # Dynamic import of 3D scene
│   └── globals.css         # Tailwind base
├── components/
│   ├── DemoScene.tsx       # Canvas + camera setup
│   ├── SceneContent.tsx    # Scene assembly, lighting, effects
│   ├── Room.tsx            # Office environment (walls, furniture)
│   ├── Agent.tsx           # Voxel characters with labels
│   ├── Vault.tsx           # Central filing cabinet (AgentFiles.io)
│   ├── Artifact.tsx        # Glowing file cartridge
│   ├── FlyingArtifact.tsx  # Arc-trajectory flying animation
│   ├── KanbanBoard.tsx     # Linear board (easel with cards)
│   ├── LineageTrails.tsx   # Agent-to-agent lineage visualization
│   └── Captions.tsx        # HTML overlay captions
└── lib/
    ├── demoScript.ts       # Typed event timeline
    ├── useDemoRunner.ts    # Replay hook (setTimeout-based)
    └── store.ts            # Zustand scene state
```

## License

MIT

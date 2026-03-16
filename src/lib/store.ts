import { create } from "zustand";
import type { DemoEvent } from "./demoScript";

export type AgentId = "claude" | "codex" | "chatgpt" | "openclaw";

export interface AgentState {
  thinking: boolean;
  thinkingLabel: string;
  hasArtifact: boolean;
  showPreview: boolean;
  notified: boolean;
}

export interface FlyingArtifact {
  id: string;
  from: [number, number, number];
  to: [number, number, number];
  version: number;
  startTime: number;
  duration: number;
}

export interface SceneStore {
  caption: string;
  eventLabel: string;
  elapsed: number;
  agents: Record<AgentId, AgentState>;
  vaultSlotGlowing: boolean;
  vaultVersion: number;
  artifactVersion: number;
  artifactAtAgent: AgentId | null;
  artifactAtVault: boolean;
  artifactFlipping: boolean;
  flyingArtifacts: FlyingArtifact[];
  showLineage: boolean;
  applyEvent: (event: DemoEvent) => void;
  setElapsed: (t: number) => void;
  reset: () => void;
}

const defaultAgentState = (): AgentState => ({
  thinking: false,
  thinkingLabel: "",
  hasArtifact: false,
  showPreview: false,
  notified: false,
});

// 4 agents around the center, spread out to show "different machines"
export const POSITIONS: Record<string, [number, number, number]> = {
  claude:   [9, 0, -2],
  codex:    [4, 0, 7],
  chatgpt:  [-8, 0, 4],
  openclaw: [-6, 0, -5],
  vault:    [0, 0, 0],
  claude_above:   [9, 2.8, -2],
  codex_above:    [4, 2.8, 7],
  chatgpt_above:  [-8, 2.8, 4],
  openclaw_above: [-6, 2.8, -5],
  vault_slot:     [0, 2.2, 0],
};

// Machine labels per agent
export const MACHINE_LABELS: Record<AgentId, string> = {
  claude: "MacBook Pro",
  codex: "Cloud VM",
  chatgpt: "",
  openclaw: "VPS",
};

const initialState = {
  caption: "",
  eventLabel: "",
  elapsed: 0,
  agents: {
    claude: defaultAgentState(),
    codex: defaultAgentState(),
    chatgpt: defaultAgentState(),
    openclaw: defaultAgentState(),
  },
  vaultSlotGlowing: false,
  vaultVersion: 0,
  artifactVersion: 1,
  artifactAtAgent: null as AgentId | null,
  artifactAtVault: false,
  artifactFlipping: false,
  flyingArtifacts: [] as FlyingArtifact[],
  showLineage: false,
};

export const useSceneStore = create<SceneStore>((set) => ({
  ...initialState,

  applyEvent: (event: DemoEvent) =>
    set((state) => {
      const next = { ...state };
      const agents = {
        claude: { ...state.agents.claude },
        codex: { ...state.agents.codex },
        chatgpt: { ...state.agents.chatgpt },
        openclaw: { ...state.agents.openclaw },
      };

      switch (event.kind) {
        case "caption":
          next.caption = event.caption || "";
          break;

        case "agent_thinking":
          if (event.agent) {
            agents[event.agent].thinking = true;
            agents[event.agent].thinkingLabel = event.caption || "";
          }
          next.eventLabel = event.caption || "";
          break;

        case "agent_stop_thinking":
          if (event.agent) {
            agents[event.agent].thinking = false;
            agents[event.agent].thinkingLabel = "";
          }
          next.eventLabel = "";
          break;

        case "artifact_create":
          if (event.agent) {
            agents[event.agent].thinking = false;
            agents[event.agent].hasArtifact = true;
            next.artifactAtAgent = event.agent;
            next.artifactVersion = event.version || 1;
          }
          next.eventLabel = event.caption || "";
          break;

        case "artifact_fly_to_vault":
          if (event.agent) {
            agents[event.agent].hasArtifact = false;
            next.artifactAtAgent = null;
            next.flyingArtifacts = [
              ...state.flyingArtifacts,
              {
                id: `fly-${Date.now()}`,
                from: POSITIONS[`${event.agent}_above`],
                to: POSITIONS.vault_slot,
                version: state.artifactVersion,
                startTime: Date.now(),
                duration: 1500,
              },
            ];
          }
          break;

        case "vault_receive":
          next.vaultSlotGlowing = true;
          next.vaultVersion = event.version || 1;
          next.artifactAtVault = true;
          next.flyingArtifacts = [];
          next.eventLabel = "";
          break;

        case "notify_agent":
          if (event.target) {
            agents[event.target].notified = true;
          }
          next.eventLabel = event.caption || "";
          break;

        case "vault_eject":
          next.artifactAtVault = false;
          break;

        case "artifact_fly_to_agent":
          if (event.target) {
            next.flyingArtifacts = [
              ...state.flyingArtifacts,
              {
                id: `fly-${Date.now()}`,
                from: POSITIONS.vault_slot,
                to: POSITIONS[`${event.target}_above`],
                version: event.version || state.artifactVersion,
                startTime: Date.now(),
                duration: 1200,
              },
            ];
          }
          break;

        case "artifact_preview":
          if (event.agent) {
            agents[event.agent].hasArtifact = true;
            agents[event.agent].showPreview = true;
            agents[event.agent].notified = false;
            next.artifactAtAgent = event.agent;
          }
          next.flyingArtifacts = [];
          next.eventLabel = event.caption || "";
          break;

        case "artifact_update":
          next.artifactFlipping = true;
          next.artifactVersion = event.version || 2;
          next.vaultVersion = event.version || 2;
          if (event.agent) {
            agents[event.agent].showPreview = false;
          }
          next.eventLabel = event.caption || "";
          setTimeout(() => {
            useSceneStore.setState({ artifactFlipping: false });
          }, 800);
          break;

        case "artifact_fly_to_vault_v2":
          if (event.agent) {
            agents[event.agent].hasArtifact = false;
            next.artifactAtAgent = null;
            next.flyingArtifacts = [
              {
                id: `fly-v2-${Date.now()}`,
                from: POSITIONS[`${event.agent}_above`],
                to: POSITIONS.vault_slot,
                version: 2,
                startTime: Date.now(),
                duration: 1000,
              },
            ];
          }
          break;

        case "vault_receive_v2":
          next.vaultVersion = event.version || 2;
          next.artifactAtVault = true;
          next.flyingArtifacts = [];
          break;

        case "vault_eject_v2":
          next.artifactAtVault = false;
          break;

        case "artifact_latest":
          if (event.target) {
            agents[event.target].hasArtifact = true;
            agents[event.target].notified = false;
            next.artifactAtAgent = event.target;
            next.artifactVersion = event.version || 2;
            next.flyingArtifacts = [
              {
                id: `fly-latest-${Date.now()}`,
                from: POSITIONS.vault_slot,
                to: POSITIONS[`${event.target}_above`],
                version: event.version || 2,
                startTime: Date.now(),
                duration: 1500,
              },
            ];
          }
          next.eventLabel = event.caption || "";
          break;

        case "lineage":
          next.showLineage = true;
          next.flyingArtifacts = [];
          break;

        case "lineage_hide":
          next.showLineage = false;
          break;

        case "final_caption":
          next.caption = event.caption || "";
          break;

        case "reset":
          return {
            ...initialState,
            applyEvent: state.applyEvent,
            setElapsed: state.setElapsed,
            reset: state.reset,
          };
      }

      next.agents = agents;
      return next;
    }),

  setElapsed: (t: number) => set({ elapsed: t }),

  reset: () =>
    set((state) => ({
      ...initialState,
      applyEvent: state.applyEvent,
      setElapsed: state.setElapsed,
      reset: state.reset,
    })),
}));

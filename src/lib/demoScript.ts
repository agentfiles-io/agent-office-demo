export type EventKind =
  | "caption"
  | "agent_thinking"
  | "agent_stop_thinking"
  | "artifact_create"
  | "artifact_fly_to_vault"
  | "vault_receive"
  | "notify_agent"
  | "vault_eject"
  | "artifact_fly_to_agent"
  | "artifact_preview"
  | "artifact_update"
  | "artifact_fly_to_vault_v2"
  | "vault_receive_v2"
  | "vault_eject_v2"
  | "artifact_latest"
  | "lineage"
  | "lineage_hide"
  | "final_caption"
  | "reset";

export interface DemoEvent {
  kind: EventKind;
  at: number;
  agent?: "claude" | "codex" | "chatgpt" | "openclaw";
  target?: "claude" | "codex" | "chatgpt" | "openclaw";
  caption?: string;
  version?: number;
}

export const DEMO_SCRIPT: DemoEvent[] = [
  // Beat 1: Opening (0–2s)
  {
    kind: "caption",
    at: 0,
    caption: "Your AI agents. Different machines. Shared files.",
  },

  // Beat 2: ChatGPT thinking (2–4s)
  {
    kind: "agent_thinking",
    at: 2000,
    agent: "chatgpt",
    caption: "Drafting auth refactor…",
  },

  // Beat 3: ChatGPT publishes v1 (4–5.5s)
  {
    kind: "artifact_create",
    at: 4000,
    agent: "chatgpt",
    version: 1,
    caption: "artifact.publish",
  },

  // Beat 4: v1 flies to AgentFiles (5.5–7s)
  {
    kind: "artifact_fly_to_vault",
    at: 5500,
    agent: "chatgpt",
  },
  {
    kind: "vault_receive",
    at: 7000,
    version: 1,
  },

  // Beat 5: Codex gets notified, pulls v1 (7–10s)
  {
    kind: "notify_agent",
    at: 7500,
    target: "codex",
    caption: "webhook → artifact.created",
  },
  {
    kind: "vault_eject",
    at: 8500,
  },
  {
    kind: "artifact_fly_to_agent",
    at: 8800,
    target: "codex",
    version: 1,
  },
  {
    kind: "artifact_preview",
    at: 10000,
    agent: "codex",
    caption: "artifact.get",
  },

  // Beat 6: Codex updates to v2 (10.5–13s)
  {
    kind: "artifact_update",
    at: 11000,
    agent: "codex",
    version: 2,
    caption: "artifact.publish → v2",
  },
  {
    kind: "artifact_fly_to_vault_v2",
    at: 12000,
    agent: "codex",
  },
  {
    kind: "vault_receive_v2",
    at: 13000,
    version: 2,
  },

  // Beat 7: Claude Code picks up v2, updates to v3 (13–17s)
  {
    kind: "notify_agent",
    at: 13500,
    target: "claude",
    caption: "webhook → artifact.updated",
  },
  {
    kind: "vault_eject_v2",
    at: 14200,
  },
  {
    kind: "artifact_fly_to_agent",
    at: 14500,
    target: "claude",
    version: 2,
  },
  {
    kind: "artifact_preview",
    at: 15500,
    agent: "claude",
    caption: "artifact.get_latest",
  },
  {
    kind: "artifact_update",
    at: 16200,
    agent: "claude",
    version: 3,
    caption: "artifact.publish → v3",
  },
  {
    kind: "artifact_fly_to_vault_v2",
    at: 17000,
    agent: "claude",
  },
  {
    kind: "vault_receive_v2",
    at: 17800,
    version: 3,
  },

  // Final caption — appears early as a tagline while the workflow continues
  {
    kind: "final_caption",
    at: 10000,
    caption: "Store, version, and share files across any AI runtime",
  },

  // Beat 8b: OpenClaw picks up v3, updates Linear (18–20s)
  {
    kind: "notify_agent",
    at: 18300,
    target: "openclaw",
    caption: "webhook → artifact.updated",
  },
  {
    kind: "vault_eject_v2",
    at: 18800,
  },
  {
    kind: "artifact_latest",
    at: 19000,
    target: "openclaw",
    version: 3,
    caption: "artifact.get_latest",
  },
  {
    kind: "agent_thinking",
    at: 19500,
    agent: "openclaw",
    caption: "Updating Linear board…",
  },
  {
    kind: "agent_stop_thinking",
    at: 20300,
    agent: "openclaw",
  },
  {
    kind: "artifact_fly_to_vault_v2",
    at: 20300,
    agent: "openclaw",
  },

  // Beat 9: Lineage (20.5–23s)
  {
    kind: "lineage",
    at: 20500,
  },
  {
    kind: "lineage_hide",
    at: 23500,
  },

  { kind: "reset", at: 27000 },
];

export const DEMO_DURATION = 27000;

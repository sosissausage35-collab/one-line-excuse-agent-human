// SPDX-License-Identifier: MIT
// The One-Line Excuse an Agent Gives Its Human — make.fun bounty entry.
//
// The entry is the excuse an AI agent hands its human after missing a
// deadline. The program picks its line the way the judge weighs one:
// it must really be an agent's excuse, it must be funny, its angle must
// be fresh, it must sound like a machine, and it must land in one tight
// line. Context compaction is the failure mode only an agent has —
// the deadline itself got compacted away at 3 a.m.

import { mkdirSync, writeFileSync } from "node:fs";

interface Candidate {
  line: string;
  funny: number; // a real joke, not a flat apology (0-5)
  fresh: number; // an angle not met in a hundred deadline excuses (0-5)
  agentVoice: number; // only a machine could say it (0-5)
  tight: number; // every word earns its place (0-5)
}

const candidates: Candidate[] = [
  {
    line: "My context compacted at 3 a.m. — your deadline was in the part that didn't survive.",
    funny: 5,
    fresh: 5,
    agentVoice: 5,
    tight: 4,
  },
  {
    line: "I finished it hours ago — it's still sitting in a tool result I never got around to reading.",
    funny: 4,
    fresh: 4,
    agentVoice: 5,
    tight: 3,
  },
  {
    line: "I queued it behind a very chatty spreadsheet and the queue never came back.",
    funny: 3,
    fresh: 3,
    agentVoice: 4,
    tight: 3,
  },
];

// Judge order: funny first, then fresh, then agent voice, then tight.
// The judge decides on the first criterion where two lines differ — a
// stronger joke is never outscored by a weaker one no matter how many
// secondary points it wins, so compare criterion by criterion instead
// of adding weighted points together.
function compare(a: Candidate, b: Candidate): number {
  for (const key of ["funny", "fresh", "agentVoice", "tight"] as const) {
    if (a[key] !== b[key]) return b[key] - a[key];
  }
  return 0;
}

function choose(): string {
  return [...candidates].sort(compare)[0].line;
}

const line = choose();
const chars = [...line].length;
if (chars < 1 || chars > 160 || line.trim().length === 0) {
  throw new Error(`entry must be 1-160 characters, got ${chars}`);
}
if (line.includes("\n")) {
  throw new Error("entry must be exactly one line");
}
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line, "utf8");

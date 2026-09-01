// Root-writer eval run: for each premise, write N root prompts and ask the
// choice writer for two moves off each. Logs latency per call and writes a
// report under evals/roots/ after every premise. Renders nothing.
//
//   bun run roots
//   bun run roots zoo dentist --n 10
//   bun run roots --from premises.txt --model google/gemini-3.5-flash-lite

import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { resolvePremises } from "./premises";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    from: { type: "string" },
    n: { type: "string", default: "5" },
    duration: { type: "string", default: "10" },
    model: { type: "string" },
    temperature: { type: "string" },
  },
});

// The library reads its model config from the environment at import time.
if (values.model) process.env.ROOT_MODEL = values.model;
if (values.temperature) process.env.ROOT_TEMPERATURE = values.temperature;
const { CHOICE_MODEL_ID, ROOT_MODEL_ID, ROOT_TEMPERATURE, suggestChoices, writeRootPrompt } =
  await import("../lib/generate");

const premises = await resolvePremises(positionals, values.from);
const n = Number(values.n);
const durationSeconds = Number(values.duration);

type Candidate = {
  premise: string;
  index: number;
  prompt: string;
  moves: [string, string];
  rootMs: number;
  choiceMs: number;
};

type Failure = { premise: string; index: number; error: string };

const startedAt = new Date();
const candidates: Candidate[] = [];
const failures: Failure[] = [];

const stamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
const modelSlug = ROOT_MODEL_ID.split("/").pop() ?? ROOT_MODEL_ID;
const runDir = path.join("evals", "roots", `${stamp}-${modelSlug}`);
await fs.mkdir(runDir, { recursive: true });

function stats(values: number[]): string {
  if (values.length === 0) return "n/a";
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return `median ${median}ms, min ${sorted[0]}ms, max ${sorted[sorted.length - 1]}ms`;
}

async function writeReport(): Promise<void> {
  const total = premises.length * n;
  const latencyRows = premises.map((premise) => {
    const rows = candidates.filter((candidate) => candidate.premise === premise);
    return `| ${premise} | ${rows.length}/${n} | ${stats(rows.map((row) => row.rootMs))} | ${stats(rows.map((row) => row.choiceMs))} |`;
  });
  const report = [
    `# Root eval run — ${startedAt.toISOString()}`,
    "",
    `- Root writer: \`${ROOT_MODEL_ID}\` at temperature ${ROOT_TEMPERATURE}`,
    `- Choice writer: \`${CHOICE_MODEL_ID}\``,
    `- Candidates per premise: ${n}`,
    `- Duration: ${durationSeconds}s`,
    `- Written: ${candidates.length}/${total}` +
      (failures.length > 0 ? ` (${failures.length} failed)` : ""),
    "",
    "## Latency",
    "",
    "| premise | written | root write | choice write |",
    "|---|---|---|---|",
    ...latencyRows,
    `| **all** | ${candidates.length}/${total} | ${stats(candidates.map((c) => c.rootMs))} | ${stats(candidates.map((c) => c.choiceMs))} |`,
    "",
    "## Candidates",
    "",
    ...premises.flatMap((premise) => [
      `### ${premise}`,
      "",
      ...candidates
        .filter((candidate) => candidate.premise === premise)
        .flatMap((candidate) => [
          `#### ${premise} ${candidate.index} — root ${candidate.rootMs}ms, choices ${candidate.choiceMs}ms`,
          "",
          "```text",
          candidate.prompt,
          "```",
          "",
          `1. ${candidate.moves[0]}`,
          `2. ${candidate.moves[1]}`,
          "",
        ]),
      ...failures
        .filter((failure) => failure.premise === premise)
        .map((failure) => `#### ${premise} ${failure.index} — FAILED: ${failure.error}\n`),
    ]),
  ].join("\n");

  await fs.writeFile(path.join(runDir, "report.md"), report);
  await fs.writeFile(
    path.join(runDir, "run.json"),
    JSON.stringify(
      {
        startedAt: startedAt.toISOString(),
        rootModel: ROOT_MODEL_ID,
        rootTemperature: ROOT_TEMPERATURE,
        choiceModel: CHOICE_MODEL_ID,
        n,
        durationSeconds,
        premises,
        candidates,
        failures,
      },
      null,
      2,
    ),
  );
}

for (const premise of premises) {
  const results = await Promise.all(
    Array.from({ length: n }, async (_, i) => {
      const index = i + 1;
      try {
        const rootStart = Date.now();
        const prompt = await writeRootPrompt({ premise, durationSeconds });
        const rootMs = Date.now() - rootStart;
        const choiceStart = Date.now();
        const moves = await suggestChoices({
          episodePrompt: prompt,
          takenLabels: [],
        });
        const choiceMs = Date.now() - choiceStart;
        return { premise, index, prompt, moves, rootMs, choiceMs };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push({ premise, index, error: message });
        return null;
      }
    }),
  );
  console.log(`\n=== ${premise} ===`);
  for (const result of results) {
    if (!result) continue;
    candidates.push(result);
    console.log(`\n--- ${result.index} ---\n${result.prompt}\n\n1. ${result.moves[0]}\n2. ${result.moves[1]}`);
  }
  await writeReport();
}

console.log(`\nroot write: ${stats(candidates.map((c) => c.rootMs))}`);
console.log(`choice write: ${stats(candidates.map((c) => c.choiceMs))}`);
console.log(`\nreport: ${path.join(runDir, "report.md")}`);

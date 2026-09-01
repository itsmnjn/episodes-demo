// Root-writer eval run: for each premise, write N root prompts and ask the
// choice writer for two moves off each. Logs latency per call and writes a
// report under evals/roots/ after every premise. Renders nothing.
//
//   npm run roots
//   PREMISES="zoo,dentist" N=10 npm run roots
//   ROOT_MODEL=google/gemini-3.5-flash-lite npm run roots

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  FAST_MODEL_ID,
  ROOT_MODEL_ID,
  ROOT_TEMPERATURE,
  suggestChoices,
  writeRootPrompt,
} from "../lib/generate";

// PREMISES is comma-separated; PREMISES_FILE is one premise per line, for
// premises that contain commas.
const premiseSource = process.env.PREMISES_FILE
  ? (await fs.readFile(process.env.PREMISES_FILE, "utf8")).split("\n")
  : (
      process.env.PREMISES ??
      "zoo,dentist,first day at hogwarts,my roommate is a ghost,blind date,airport security"
    ).split(",");
const premises = premiseSource
  .map((premise) => premise.trim())
  .filter((premise) => premise.length > 0);
const n = Number(process.env.N ?? 5);
const durationSeconds = Number(process.env.DURATION ?? 10);

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
    `- Choice writer: \`${FAST_MODEL_ID}\``,
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
        choiceModel: FAST_MODEL_ID,
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
  for (const result of results) {
    if (result) candidates.push(result);
  }
  console.log(`${premise}: ${results.filter(Boolean).length}/${n} written`);
  await writeReport();
}

console.log(`\nroot write: ${stats(candidates.map((c) => c.rootMs))}`);
console.log(`choice write: ${stats(candidates.map((c) => c.choiceMs))}`);
console.log(`\nreport: ${path.join(runDir, "report.md")}`);

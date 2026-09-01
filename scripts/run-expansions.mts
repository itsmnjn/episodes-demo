// Premise-expander eval run: for each premise, one call expands it into N
// scenes, then each scene is written as a root prompt with two moves. Logs
// latency and writes a report under evals/expansions/ after every premise.
//
//   npm run expansions
//   PREMISES="zoo,dentist" N=5 npm run expansions
//   PREMISES_FILE=premises.txt npm run expansions

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  FAST_MODEL_ID,
  ROOT_MODEL_ID,
  ROOT_TEMPERATURE,
  expandPremise,
  suggestChoices,
  writeRootPrompt,
} from "../lib/generate";

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

type Filmed = {
  scene: string;
  prompt: string;
  moves: [string, string];
  rootMs: number;
  choiceMs: number;
};

type Expansion = {
  premise: string;
  scenes: string[];
  expandMs: number;
  filmed: Filmed[];
  failures: string[];
};

const startedAt = new Date();
const expansions: Expansion[] = [];
const expandFailures: { premise: string; error: string }[] = [];

const stamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
const modelSlug = ROOT_MODEL_ID.split("/").pop() ?? ROOT_MODEL_ID;
const runDir = path.join("evals", "expansions", `${stamp}-${modelSlug}`);
await fs.mkdir(runDir, { recursive: true });

function stats(values: number[]): string {
  if (values.length === 0) return "n/a";
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return `median ${median}ms, min ${sorted[0]}ms, max ${sorted[sorted.length - 1]}ms`;
}

async function writeReport(): Promise<void> {
  const filmed = expansions.flatMap((expansion) => expansion.filmed);
  const report = [
    `# Premise expansion run — ${startedAt.toISOString()}`,
    "",
    `- Expander and root writer: \`${ROOT_MODEL_ID}\` at temperature ${ROOT_TEMPERATURE}`,
    `- Choice writer: \`${FAST_MODEL_ID}\``,
    `- Scenes per premise: ${n}`,
    `- Duration: ${durationSeconds}s`,
    `- Expanded: ${expansions.length}/${premises.length}` +
      (expandFailures.length > 0 ? ` (${expandFailures.length} failed)` : ""),
    "",
    "## Latency",
    "",
    "| premise | expand | root write | choice write |",
    "|---|---|---|---|",
    ...expansions.map(
      (expansion) =>
        `| ${expansion.premise} | ${expansion.expandMs}ms | ${stats(expansion.filmed.map((f) => f.rootMs))} | ${stats(expansion.filmed.map((f) => f.choiceMs))} |`,
    ),
    `| **all** | ${stats(expansions.map((e) => e.expandMs))} | ${stats(filmed.map((f) => f.rootMs))} | ${stats(filmed.map((f) => f.choiceMs))} |`,
    "",
    "## Expansions",
    "",
    ...expansions.flatMap((expansion) => [
      `### ${expansion.premise}`,
      "",
      ...expansion.scenes.map((scene, i) => `${i + 1}. ${scene}`),
      "",
      ...expansion.filmed.flatMap((f, i) => [
        `#### ${expansion.premise} ${i + 1} — root ${f.rootMs}ms, choices ${f.choiceMs}ms`,
        "",
        `> ${f.scene}`,
        "",
        "```text",
        f.prompt,
        "```",
        "",
        `1. ${f.moves[0]}`,
        `2. ${f.moves[1]}`,
        "",
      ]),
      ...expansion.failures.map((error) => `#### ${expansion.premise} — FAILED: ${error}\n`),
    ]),
    ...expandFailures.map((failure) => `### ${failure.premise} — EXPAND FAILED: ${failure.error}\n`),
  ].join("\n");

  await fs.writeFile(path.join(runDir, "report.md"), report);
  await fs.writeFile(
    path.join(runDir, "run.json"),
    JSON.stringify(
      {
        startedAt: startedAt.toISOString(),
        model: ROOT_MODEL_ID,
        temperature: ROOT_TEMPERATURE,
        choiceModel: FAST_MODEL_ID,
        n,
        durationSeconds,
        premises,
        expansions,
        expandFailures,
      },
      null,
      2,
    ),
  );
}

for (const premise of premises) {
  let scenes: string[];
  const expandStart = Date.now();
  try {
    scenes = await expandPremise({ premise, count: n });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    expandFailures.push({ premise, error: message });
    console.log(`${premise}: expand FAILED (${message})`);
    await writeReport();
    continue;
  }
  const expandMs = Date.now() - expandStart;

  const failures: string[] = [];
  const results = await Promise.all(
    scenes.map(async (scene) => {
      try {
        const rootStart = Date.now();
        const prompt = await writeRootPrompt({ premise: scene, durationSeconds });
        const rootMs = Date.now() - rootStart;
        const choiceStart = Date.now();
        const moves = await suggestChoices({ episodePrompt: prompt, takenLabels: [] });
        const choiceMs = Date.now() - choiceStart;
        return { scene, prompt, moves, rootMs, choiceMs };
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
        return null;
      }
    }),
  );
  expansions.push({
    premise,
    scenes,
    expandMs,
    filmed: results.filter((result): result is Filmed => result !== null),
    failures,
  });
  console.log(`${premise}: ${scenes.length} scenes, ${results.filter(Boolean).length} filmed`);
  await writeReport();
}

console.log(`\nexpand: ${stats(expansions.map((e) => e.expandMs))}`);
console.log(`root write: ${stats(expansions.flatMap((e) => e.filmed.map((f) => f.rootMs)))}`);
console.log(`\nreport: ${path.join(runDir, "report.md")}`);

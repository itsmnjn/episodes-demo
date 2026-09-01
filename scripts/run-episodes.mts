// Next-episode-writer eval run: for each baked leaf episode (real held frame
// on disk), write the next episode for four moves — the choice writer's pair
// plus two fixed spoken moves — flag rule breaks, and write a report under
// evals/episodes/. Renders nothing.
//
//   bun run episodes
//   bun run episodes the-invitation mcdonalds
//   bun run episodes --model google/gemini-3.7-flash --choice-model google/gemini-3.5-flash-lite

import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { loadCatalog, loadSeriesSource } from "../lib/content";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    model: { type: "string" },
    "choice-model": { type: "string" },
  },
});

// The library reads its model config from the environment at import time.
if (values.model) process.env.EPISODE_MODEL = values.model;
if (values["choice-model"]) process.env.CHOICE_MODEL = values["choice-model"];
const { EPISODE_MODEL_ID, CHOICE_MODEL_ID, frameUrlForParent, suggestChoices, writeEpisodePrompt } =
  await import("../lib/generate");

// Spoken moves that fit any scene. Every fixture runs both, so the rule that
// the protagonist never speaks on screen is tested on every frame.
const SPOKEN_MOVES = ["Ask what they want", "Say you saw what happened"];

const seriesIds = positionals.length > 0 ? positionals : loadCatalog().map((card) => card.id);

type Fixture = {
  seriesId: string;
  episodeId: string;
  prompt: string;
  durationSeconds: number;
  lastFramePath: string;
};

const fixtures: Fixture[] = [];
for (const seriesId of seriesIds) {
  const source = loadSeriesSource(seriesId);
  if (!source) throw new Error(`Unknown series: ${seriesId}`);
  for (const episode of Object.values(source.episodes)) {
    if (episode.childIds.length === 0 && episode.lastFramePath) {
      fixtures.push({
        seriesId,
        episodeId: episode.id,
        prompt: episode.prompt,
        durationSeconds: episode.durationSeconds,
        lastFramePath: episode.lastFramePath,
      });
    }
  }
}

// Narration is everything outside <d>...</d>; characters may say "you".
function narration(prompt: string): string {
  return prompt.replace(/<d>[\s\S]*?<\/d>/g, " ");
}

function moveGrams(move: string): string[] {
  const words = move.toLowerCase().split(/\s+/).slice(1);
  const grams: string[] = [];
  for (let i = 0; i + 3 <= words.length; i++) grams.push(words.slice(i, i + 3).join(" "));
  if (words.length < 3) grams.push(words.join(" "));
  return grams.filter((gram) => gram.length > 0);
}

// A character repeating the move's words in their own tagged line is an
// echo, a fair way to show what was said. The same words in a line with no
// speaker tag before it is the protagonist speaking.
function linesWithMove(prompt: string, move: string): { tagged: boolean }[] {
  const grams = moveGrams(move);
  return [...prompt.matchAll(/<d>([\s\S]*?)<\/d>/g)]
    .filter((m) => grams.some((gram) => m[1].toLowerCase().includes(gram)))
    .map((m) => ({ tagged: /\(S\d\)/.test(prompt.slice(Math.max(0, m.index! - 200), m.index!)) }));
}

const FLAGS: { name: string; test: (prompt: string, move: string) => boolean }[] = [
  { name: "hero-line", test: (p, move) => linesWithMove(p, move).some((line) => !line.tagged) },
  { name: "echo", test: (p, move) => linesWithMove(p, move).some((line) => line.tagged) },
  { name: "voiceover", test: (p) => /\b(off-screen|offscreen|voice-?over|narrat)/i.test(p) },
  { name: "you-leak", test: (p) => /\b(you|your|yours)\b/i.test(narration(p)) },
  { name: "protagonist-leak", test: (p) => /\b(protagonist|hero)\b/i.test(narration(p)) },
  {
    name: "untagged-line",
    test: (p) =>
      [...p.matchAll(/<d>/g)].some((m) => !/\(S\d\)/.test(p.slice(Math.max(0, m.index! - 200), m.index!))),
  },
  { name: "camera-direction", test: (p) => /\bcamera (pans|zooms|cuts|pulls|tilts|tracks|dollies|moves|lowers|rises|follows)\b/i.test(narration(p)) },
  { name: "timing", test: (p) => /\[\d+\s*(to|-|–)\s*\d+ seconds?\]|At \d\d:\d\d|\[Shot [2-9]/i.test(p) },
  { name: "self-body", test: (p) => /\b(eats|drinks|swallows|licks|bites|chews|puts on|wears)\b/i.test(narration(p)) },
  { name: "double-opener", test: (p) => (p.match(/\[Shot 1\]/g) ?? []).length !== 1 },
  { name: "no-soundscape", test: (p) => !/^overall_soundscape:/m.test(p) },
  {
    name: "dialogue-in-soundscape",
    test: (p) => /^overall_soundscape:.*(<d>|\bsays\b)/m.test(p),
  },
];

type Written = { move: string; kind: "choice" | "spoken"; prompt: string; ms: number; flags: string[] };
type Result = { fixture: Fixture; frameUrl: string; choiceMs: number; written: Written[]; errors: string[] };

const startedAt = new Date();
const results: Result[] = await Promise.all(
  fixtures.map(async (fixture) => {
    const errors: string[] = [];
    const written: Written[] = [];
    let frameUrl = "";
    let choiceMs = 0;
    let moves: { move: string; kind: "choice" | "spoken" }[] = SPOKEN_MOVES.map((move) => ({
      move,
      kind: "spoken",
    }));
    try {
      frameUrl = await frameUrlForParent({
        name: `eval-${fixture.seriesId}-${fixture.episodeId}`,
        lastFramePath: fixture.lastFramePath,
      });
      const choiceStart = Date.now();
      const pair = await suggestChoices({ episodePrompt: fixture.prompt, takenLabels: [] });
      choiceMs = Date.now() - choiceStart;
      moves = [...pair.map((move) => ({ move, kind: "choice" as const })), ...moves];
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { fixture, frameUrl, choiceMs, written, errors };
    }
    await Promise.all(
      moves.map(async ({ move, kind }) => {
        try {
          const start = Date.now();
          const prompt = await writeEpisodePrompt({
            parentPrompt: fixture.prompt,
            frameUrl,
            label: move,
            durationSeconds: fixture.durationSeconds,
          });
          const flags = FLAGS.filter((flag) => flag.test(prompt, move)).map((flag) => flag.name);
          written.push({ move, kind, prompt, ms: Date.now() - start, flags });
        } catch (error) {
          errors.push(`${move}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }),
    );
    return { fixture, frameUrl, choiceMs, written, errors };
  }),
);

const allWritten = results.flatMap((result) => result.written);
const count = (name: string) => allWritten.filter((w) => w.flags.includes(name)).length;
const pct = (value: number, total: number) =>
  total === 0 ? "n/a" : `${Math.round((100 * value) / total)}%`;
const clean = allWritten.filter((w) => w.flags.every((flag) => flag === "echo")).length;
const spokenWritten = allWritten.filter((w) => w.kind === "spoken");
const spokenClean = spokenWritten.filter((w) => !w.flags.includes("hero-line") && !w.flags.includes("voiceover")).length;
const sorted = allWritten.map((w) => w.ms).sort((a, b) => a - b);
const latency =
  sorted.length === 0
    ? "n/a"
    : `median ${sorted[Math.floor(sorted.length / 2)]}ms, min ${sorted[0]}ms, max ${sorted[sorted.length - 1]}ms`;

const stamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
const modelSlug = EPISODE_MODEL_ID.split("/").pop() ?? EPISODE_MODEL_ID;
const runDir = path.join("evals", "episodes", `${stamp}-${modelSlug}`);
await fs.mkdir(runDir, { recursive: true });

const report = [
  `# Next-episode eval run — ${startedAt.toISOString()}`,
  "",
  `- Episode writer: \`${EPISODE_MODEL_ID}\``,
  `- Choice writer: \`${CHOICE_MODEL_ID}\``,
  `- Fixtures: ${fixtures.length} baked leaves from ${seriesIds.join(", ")}`,
  `- Episodes written: ${allWritten.length}/${fixtures.length * (2 + SPOKEN_MOVES.length)}`,
  `- Latency (episode write, includes the frame): ${latency}`,
  "",
  "## Flags",
  "",
  "| flag | episodes | share |",
  "|---|---|---|",
  ...FLAGS.map((flag) => `| ${flag.name} | ${count(flag.name)} | ${pct(count(flag.name), allWritten.length)} |`),
  `| **clean** | ${clean} | ${pct(clean, allWritten.length)} |`,
  `| **spoken moves with no hero line** | ${spokenClean} | ${pct(spokenClean, spokenWritten.length)} of ${spokenWritten.length} |`,
  "",
  "## Episodes",
  "",
  ...results.flatMap((result) => [
    `### ${result.fixture.seriesId} / ${result.fixture.episodeId}`,
    "",
    `Parent frame: ${result.frameUrl}`,
    "",
    ...result.written.flatMap((w) => [
      `#### ${w.kind}: ${w.move} — ${w.ms}ms` + (w.flags.length > 0 ? ` ⟵ ${w.flags.join(", ")}` : ""),
      "",
      "```text",
      w.prompt,
      "```",
      "",
    ]),
    ...result.errors.map((error) => `- FAILED: ${error}`),
    "",
  ]),
].join("\n");

await fs.writeFile(path.join(runDir, "report.md"), report);
await fs.writeFile(
  path.join(runDir, "run.json"),
  JSON.stringify(
    { startedAt: startedAt.toISOString(), episodeModel: EPISODE_MODEL_ID, choiceModel: CHOICE_MODEL_ID, fixtures, results },
    null,
    2,
  ),
);

console.log(`episodes: ${allWritten.length}  clean: ${clean} (${pct(clean, allWritten.length)})`);
console.log(FLAGS.map((flag) => `${flag.name} ${count(flag.name)}`).join("  "));
console.log(`spoken moves with no hero line: ${spokenClean}/${spokenWritten.length}`);
console.log(`latency: ${latency}`);
console.log(`report: ${path.join(runDir, "report.md")}`);

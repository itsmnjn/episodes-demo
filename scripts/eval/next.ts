// next: for each leaf episode in the database (a landed episode with no
// children), write the next episode for four moves — the choice writer's
// pair plus two fixed spoken moves — and flag rule breaks. Renders nothing.

import path from "node:path";
import { inArray } from "drizzle-orm";
import { db } from "../../lib/db";
import { episodes, series } from "../../lib/db/schema";
import { CHOICE_MODEL_ID, EPISODE_MODEL_ID, suggestChoices, writeEpisodePrompt } from "../../lib/generate";
import { type EvalArgs, pct, runDir, writeRun } from "./shared";

// Spoken moves that fit any scene. Every fixture runs both, so the rule that
// the protagonist never speaks on screen is tested on every frame.
const SPOKEN_MOVES = ["Ask what they want", "Say you saw what happened"];

type Fixture = {
  seriesId: string;
  premise: string;
  episodeId: string;
  prompt: string;
  durationSeconds: number;
  lastFrameUrl: string;
};

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
  {
    name: "camera-direction",
    test: (p) => /\bcamera (pans|zooms|cuts|pulls|tilts|tracks|dollies|moves|lowers|rises|follows)\b/i.test(narration(p)),
  },
  { name: "timing", test: (p) => /\[\d+\s*(to|-|–)\s*\d+ seconds?\]|At \d\d:\d\d|\[Shot [2-9]/i.test(p) },
  { name: "self-body", test: (p) => /\b(eats|drinks|swallows|licks|bites|chews|puts on|wears)\b/i.test(narration(p)) },
  { name: "double-opener", test: (p) => (p.match(/\[Shot 1\]/g) ?? []).length !== 1 },
  {
    name: "no-pov-opener",
    test: (p) => !/\[Shot 1\] [^.\n]*first-person POV[^.\n]*one continuous shot/i.test(p),
  },
  { name: "no-soundscape", test: (p) => !/^overall_soundscape:/m.test(p) },
  { name: "dialogue-in-soundscape", test: (p) => /^overall_soundscape:.*(<d>|\bsays\b)/m.test(p) },
];

type Written = { move: string; kind: "choice" | "spoken"; prompt: string; ms: number; flags: string[] };
type Result = { fixture: Fixture; frameUrl: string; choiceMs: number; written: Written[]; errors: string[] };

export async function runNext(args: EvalArgs): Promise<void> {
  const stories = await db.select({ id: series.id, premise: series.premise }).from(series);
  const seriesIds = args.positionals.length > 0 ? args.positionals : stories.map((row) => row.id);
  const premiseOf = new Map(stories.map((row) => [row.id, row.premise]));
  const rows = await db.select().from(episodes).where(inArray(episodes.seriesId, seriesIds));
  const parents = new Set(rows.map((row) => `${row.seriesId}/${row.parentId}`));
  const fixtures: Fixture[] = rows
    .filter((row) => row.status === "ready" && row.lastFrameUrl && !parents.has(`${row.seriesId}/${row.id}`))
    .map((row) => ({
      seriesId: row.seriesId,
      premise: premiseOf.get(row.seriesId)!,
      episodeId: row.id,
      prompt: row.prompt,
      durationSeconds: row.durationSeconds,
      lastFrameUrl: row.lastFrameUrl!,
    }));

  const startedAt = new Date();
  const results: Result[] = await Promise.all(
    fixtures.map(async (fixture) => {
      const errors: string[] = [];
      const written: Written[] = [];
      const frameUrl = fixture.lastFrameUrl;
      let choiceMs = 0;
      let moves: { move: string; kind: "choice" | "spoken" }[] = SPOKEN_MOVES.map((move) => ({ move, kind: "spoken" }));
      try {
        const choiceStart = Date.now();
        const pair = await suggestChoices({ episodePrompt: fixture.prompt });
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
              premise: fixture.premise,
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
  const clean = allWritten.filter((w) => w.flags.every((flag) => flag === "echo")).length;
  const spoken = allWritten.filter((w) => w.kind === "spoken");
  const spokenClean = spoken.filter((w) => !w.flags.includes("hero-line") && !w.flags.includes("voiceover")).length;
  const sorted = allWritten.map((w) => w.ms).sort((a, b) => a - b);
  const latency =
    sorted.length === 0
      ? "n/a"
      : `median ${sorted[Math.floor(sorted.length / 2)]}ms, min ${sorted[0]}ms, max ${sorted[sorted.length - 1]}ms`;

  for (const result of results) {
    console.log(`\n### ${result.fixture.seriesId} / ${result.fixture.episodeId}`);
    for (const w of result.written) {
      console.log(`\n#### ${w.kind}: ${w.move}` + (w.flags.length > 0 ? ` ⟵ ${w.flags.join(", ")}` : ""));
      console.log(w.prompt);
    }
    for (const error of result.errors) console.log(`- FAILED: ${error}`);
  }

  const dir = await runDir("next", startedAt, EPISODE_MODEL_ID);
  const report = [
    `# next eval run — ${startedAt.toISOString()}`,
    "",
    `- Episode writer: \`${EPISODE_MODEL_ID}\``,
    `- Choice writer: \`${CHOICE_MODEL_ID}\``,
    `- Fixtures: ${fixtures.length} leaves from ${seriesIds.join(", ")}`,
    `- Episodes written: ${allWritten.length}/${fixtures.length * (2 + SPOKEN_MOVES.length)}`,
    `- Latency (episode write, includes the frame): ${latency}`,
    "",
    "## Flags",
    "",
    "| flag | episodes | share |",
    "|---|---|---|",
    ...FLAGS.map((flag) => `| ${flag.name} | ${count(flag.name)} | ${pct(count(flag.name), allWritten.length)} |`),
    `| **clean** | ${clean} | ${pct(clean, allWritten.length)} |`,
    `| **spoken moves with no hero line** | ${spokenClean} | ${pct(spokenClean, spoken.length)} of ${spoken.length} |`,
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
  await writeRun(dir, report, {
    piece: "next",
    startedAt: startedAt.toISOString(),
    episodeModel: EPISODE_MODEL_ID,
    choiceModel: CHOICE_MODEL_ID,
    fixtures,
    results,
  });

  console.log(`\nepisodes: ${allWritten.length}  clean: ${clean} (${pct(clean, allWritten.length)})`);
  console.log(FLAGS.map((flag) => `${flag.name} ${count(flag.name)}`).join("  "));
  console.log(`spoken moves with no hero line: ${spokenClean}/${spoken.length}`);
  console.log(`latency: ${latency}`);
  console.log(`report: ${path.join(dir, "report.md")}`);
  process.exit(0);
}

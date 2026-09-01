// Choice-writer eval run: for each filmed episode in a fixture set, ask the
// choice writer for N pairs of moves, flag mechanical failures, and write a
// report under evals/choices/.
//
//   npm run choices                       # latest evals/expansions run as fixtures
//   FIXTURES=evals/expansions/<run>/run.json N=3 npm run choices

import { promises as fs } from "node:fs";
import path from "node:path";
import { CHOICE_MODEL_ID, CHOICE_SYSTEM, suggestChoices } from "../lib/generate";

type Fixture = { premise: string; scene: string; prompt: string };

async function latestExpansionRun(): Promise<string> {
  const dir = path.join("evals", "expansions");
  const runs = (await fs.readdir(dir)).sort();
  if (runs.length === 0) throw new Error("No expansion runs to use as fixtures.");
  return path.join(dir, runs[runs.length - 1], "run.json");
}

const fixturePath = process.env.FIXTURES ?? (await latestExpansionRun());
const fixtureRun = JSON.parse(await fs.readFile(fixturePath, "utf8")) as {
  expansions: { premise: string; filmed: { scene: string; prompt: string }[] }[];
};
const fixtures: Fixture[] = fixtureRun.expansions.flatMap((expansion) =>
  expansion.filmed.map((filmed) => ({
    premise: expansion.premise,
    scene: filmed.scene,
    prompt: filmed.prompt,
  })),
);
const n = Number(process.env.N ?? 2);

// Mechanical flags. Each is a failure the choice doctrine names outright.
const FLAGS: { name: string; test: (move: string) => boolean }[] = [
  {
    name: "self-body",
    test: (move) =>
      /\b(lick|eat|swallow|bite|chew|drink|sip|taste|nibble|gulp|wear|put on|hide|duck|crouch|kneel|sit|lie down|sniff|inhale|drop trou)\b/i.test(
        move,
      ),
  },
  {
    name: "null-move",
    test: (move) =>
      /^(wait|stay|remain|watch|look|listen|stare|freeze|leave)\b/i.test(move) ||
      /\b(step back|back away|walk away|run away|do nothing|hold still|keep still|raise (your|my|both) hands)\b/i.test(
        move,
      ),
  },
  {
    name: "noise",
    test: (move) =>
      /^(sing|bark|meow|howl|whistle|hum|growl|moo|quack|cluck|roar|purr|hiss)\b/i.test(move),
  },
  {
    name: "form",
    test: (move) => {
      const words = move.split(/\s+/).length;
      return words < 2 || words > 6 || /[.!?,]$/.test(move) || /"/.test(move) || /^(i|you)\b/i.test(move);
    },
  },
];

type Pair = {
  moves: [string, string];
  ms: number;
  flags: string[];
};

type Result = { fixture: Fixture; pairs: Pair[]; error?: string };

function flagPair(moves: [string, string]): string[] {
  const flags: string[] = [];
  for (const [i, move] of moves.entries()) {
    for (const flag of FLAGS) {
      if (flag.test(move)) flags.push(`${flag.name}:${i + 1}`);
    }
  }
  const verb = (move: string) => move.split(/\s+/)[0].toLowerCase();
  if (verb(moves[0]) === verb(moves[1])) flags.push("same-verb");
  return flags;
}

const startedAt = new Date();
const results: Result[] = await Promise.all(
  fixtures.map(async (fixture) => {
    const pairs: Pair[] = [];
    try {
      for (let i = 0; i < n; i++) {
        const start = Date.now();
        const moves = await suggestChoices({
          episodePrompt: fixture.prompt,
          takenLabels: [],
        });
        pairs.push({ moves, ms: Date.now() - start, flags: flagPair(moves) });
      }
      return { fixture, pairs };
    } catch (error) {
      return {
        fixture,
        pairs,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }),
);

const allPairs = results.flatMap((result) => result.pairs);
const allMoves = allPairs.flatMap((pair) => pair.moves);
const count = (name: string) =>
  allPairs.flatMap((pair) => pair.flags).filter((flag) => flag.startsWith(name)).length;
const pct = (value: number, total: number) =>
  total === 0 ? "n/a" : `${Math.round((100 * value) / total)}%`;
const cleanPairs = allPairs.filter((pair) => pair.flags.length === 0).length;
const sorted = allPairs.map((pair) => pair.ms).sort((a, b) => a - b);
const latency =
  sorted.length === 0
    ? "n/a"
    : `median ${sorted[Math.floor(sorted.length / 2)]}ms, min ${sorted[0]}ms, max ${sorted[sorted.length - 1]}ms`;

const verbCounts = new Map<string, number>();
for (const move of allMoves) {
  const verb = move.split(/\s+/)[0].toLowerCase();
  verbCounts.set(verb, (verbCounts.get(verb) ?? 0) + 1);
}
const topVerbs = [...verbCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([verb, total]) => `${verb} ${total} (${pct(total, allMoves.length)})`)
  .join(", ");

const stamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
const modelSlug = CHOICE_MODEL_ID.split("/").pop() ?? CHOICE_MODEL_ID;
const runDir = path.join("evals", "choices", `${stamp}-${modelSlug}`);
await fs.mkdir(runDir, { recursive: true });

const report = [
  `# Choice eval run — ${startedAt.toISOString()}`,
  "",
  `- Choice writer: \`${CHOICE_MODEL_ID}\``,
  `- Fixtures: \`${fixturePath}\` (${fixtures.length} episodes)`,
  `- Pairs per episode: ${n}`,
  `- Pairs written: ${allPairs.length}/${fixtures.length * n}`,
  `- Latency: ${latency}`,
  "",
  "## Flags",
  "",
  "| flag | moves | share of moves |",
  "|---|---|---|",
  `| self-body | ${count("self-body")} | ${pct(count("self-body"), allMoves.length)} |`,
  `| null-move | ${count("null-move")} | ${pct(count("null-move"), allMoves.length)} |`,
  `| noise | ${count("noise")} | ${pct(count("noise"), allMoves.length)} |`,
  `| form | ${count("form")} | ${pct(count("form"), allMoves.length)} |`,
  `| same-verb pair | ${count("same-verb")} | ${pct(count("same-verb"), allPairs.length)} of pairs |`,
  `| **clean pairs** | ${cleanPairs} | ${pct(cleanPairs, allPairs.length)} of pairs |`,
  "",
  `Top verbs: ${topVerbs}`,
  "",
  "## System prompt",
  "",
  "```text",
  CHOICE_SYSTEM,
  "```",
  "",
  "## Pairs",
  "",
  ...results.flatMap((result) => [
    `### ${result.fixture.premise} — ${result.fixture.scene}`,
    "",
    ...result.pairs.map(
      (pair) =>
        `- ${pair.moves[0]} / ${pair.moves[1]}` +
        (pair.flags.length > 0 ? `  ⟵ ${pair.flags.join(", ")}` : ""),
    ),
    ...(result.error ? [`- FAILED: ${result.error}`] : []),
    "",
  ]),
].join("\n");

await fs.writeFile(path.join(runDir, "report.md"), report);
await fs.writeFile(
  path.join(runDir, "run.json"),
  JSON.stringify(
    { startedAt: startedAt.toISOString(), choiceModel: CHOICE_MODEL_ID, fixturePath, n, system: CHOICE_SYSTEM, results },
    null,
    2,
  ),
);

console.log(`pairs: ${allPairs.length}  clean: ${cleanPairs} (${pct(cleanPairs, allPairs.length)})`);
console.log(
  `self-body ${count("self-body")}  null ${count("null-move")}  noise ${count("noise")}  form ${count("form")}  same-verb ${count("same-verb")}`,
);
console.log(`top verbs: ${topVerbs}`);
console.log(`latency: ${latency}`);
console.log(`report: ${path.join(runDir, "report.md")}`);

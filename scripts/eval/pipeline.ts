// expander: expand each premise into N scenes.
// episode:  expander, then write an opening episode for each scene.
// pipeline: episode, then two moves for each episode.

import path from "node:path";
import { CHOICE_MODEL_ID, ROOT_MODEL_ID, ROOT_TEMPERATURE, expandPremise, suggestChoices, writeRootPrompt } from "../../lib/generate";
import { type EvalArgs, resolvePremises, runDir, stats, writeRun } from "./shared";

export type Piece = "expander" | "episode" | "pipeline";

type Episode = {
  scene: string;
  prompt: string;
  episodeMs: number;
  moves?: [string, string];
  choiceMs?: number;
};

type PremiseResult = {
  premise: string;
  scenes: string[];
  expandMs: number;
  episodes: Episode[];
  failures: string[];
};

export async function runPipeline(piece: Piece, args: EvalArgs): Promise<void> {
  const premises = await resolvePremises(args);
  const n = args.n ?? 5;
  const durationSeconds = args.durationSeconds;
  const writeEpisodes = piece !== "expander";
  const writeChoices = piece === "pipeline";

  const startedAt = new Date();
  const results: PremiseResult[] = [];
  const expandFailures: { premise: string; error: string }[] = [];
  const dir = await runDir(piece, startedAt, ROOT_MODEL_ID);

  async function report(): Promise<void> {
    const episodes = results.flatMap((result) => result.episodes);
    const lines = [
      `# ${piece} eval run — ${startedAt.toISOString()}`,
      "",
      `- Expander and episode writer: \`${ROOT_MODEL_ID}\` at temperature ${ROOT_TEMPERATURE}`,
      ...(writeChoices ? [`- Choice writer: \`${CHOICE_MODEL_ID}\``] : []),
      `- Scenes per premise: ${n}`,
      `- Duration: ${durationSeconds}s`,
      `- Expanded: ${results.length}/${premises.length}` +
        (expandFailures.length > 0 ? ` (${expandFailures.length} failed)` : ""),
      "",
      "## Latency",
      "",
      "| premise | expand | episode write | choice write |",
      "|---|---|---|---|",
      ...results.map(
        (result) =>
          `| ${result.premise} | ${result.expandMs}ms | ${stats(result.episodes.map((e) => e.episodeMs))} | ${stats(result.episodes.flatMap((e) => (e.choiceMs === undefined ? [] : [e.choiceMs])))} |`,
      ),
      `| **all** | ${stats(results.map((r) => r.expandMs))} | ${stats(episodes.map((e) => e.episodeMs))} | ${stats(episodes.flatMap((e) => (e.choiceMs === undefined ? [] : [e.choiceMs])))} |`,
      "",
      "## Premises",
      "",
      ...results.flatMap((result) => [
        `### ${result.premise}`,
        "",
        ...result.scenes.map((scene, i) => `${i + 1}. ${scene}`),
        "",
        ...result.episodes.flatMap((episode, i) => [
          `#### ${result.premise} ${i + 1} — episode ${episode.episodeMs}ms` +
            (episode.choiceMs === undefined ? "" : `, choices ${episode.choiceMs}ms`),
          "",
          `> ${episode.scene}`,
          "",
          "```text",
          episode.prompt,
          "```",
          "",
          ...(episode.moves ? [`1. ${episode.moves[0]}`, `2. ${episode.moves[1]}`, ""] : []),
        ]),
        ...result.failures.map((error) => `#### ${result.premise} — FAILED: ${error}\n`),
      ]),
      ...expandFailures.map((failure) => `### ${failure.premise} — EXPAND FAILED: ${failure.error}\n`),
    ];
    await writeRun(dir, lines.join("\n"), {
      piece,
      startedAt: startedAt.toISOString(),
      model: ROOT_MODEL_ID,
      temperature: ROOT_TEMPERATURE,
      choiceModel: writeChoices ? CHOICE_MODEL_ID : null,
      n,
      durationSeconds,
      premises,
      results,
      expandFailures,
    });
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
      await report();
      continue;
    }
    const expandMs = Date.now() - expandStart;
    console.log(`\n=== ${premise} ===\n`);
    console.log(scenes.map((scene, i) => `${i + 1}. ${scene}`).join("\n"));

    const failures: string[] = [];
    const episodes: Episode[] = [];
    if (writeEpisodes) {
      const written = await Promise.all(
        scenes.map(async (scene): Promise<Episode | null> => {
          try {
            const episodeStart = Date.now();
            const prompt = await writeRootPrompt({ premise: scene, durationSeconds });
            const episode: Episode = { scene, prompt, episodeMs: Date.now() - episodeStart };
            if (writeChoices) {
              const choiceStart = Date.now();
              episode.moves = await suggestChoices({ episodePrompt: prompt, takenLabels: [] });
              episode.choiceMs = Date.now() - choiceStart;
            }
            return episode;
          } catch (error) {
            failures.push(error instanceof Error ? error.message : String(error));
            return null;
          }
        }),
      );
      for (const episode of written) {
        if (episode) episodes.push(episode);
      }
      for (const [i, episode] of episodes.entries()) {
        console.log(`\n--- ${i + 1} ---\n${episode.prompt}`);
        if (episode.moves) console.log(`\n1. ${episode.moves[0]}\n2. ${episode.moves[1]}`);
      }
      for (const error of failures) console.log(`\nFAILED: ${error}`);
    }
    results.push({ premise, scenes, expandMs, episodes, failures });
    await report();
  }

  console.log(`\nexpand: ${stats(results.map((r) => r.expandMs))}`);
  if (writeEpisodes) {
    console.log(`episode write: ${stats(results.flatMap((r) => r.episodes.map((e) => e.episodeMs)))}`);
  }
  console.log(`\nreport: ${path.join(dir, "report.md")}`);
}

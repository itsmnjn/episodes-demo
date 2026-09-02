// Turn a premise into opening episodes. By default: expand the premise into
// N scenes, write each as a prompt, print everything, render nothing. With
// --render, one scene becomes a series on the shelf.
//
//   bun run root "zoo"                      # 3 scenes, 3 prompts, no video
//   bun run root "zoo" --n 5
//   bun run root "zoo" --render             # film scene 1 as a new series
//   bun run root "zoo" --render --pick 2 --title "Capybara"
//   bun run root --from premise.txt --direct   # film the premise as written, no expander
//   bun run root "zoo" --duration 12

import { promises as fs } from "node:fs";
import { parseArgs } from "node:util";
import { expandPremise, writeRootPrompt } from "../lib/generate";
import { awaitEpisode, createSeries } from "../lib/series";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    from: { type: "string" },
    n: { type: "string", default: "3" },
    direct: { type: "boolean", default: false },
    render: { type: "boolean", default: false },
    pick: { type: "string", default: "1" },
    duration: { type: "string", default: "10" },
    title: { type: "string" },
  },
});

const premise = values.from
  ? (await fs.readFile(values.from, "utf8")).trim()
  : positionals.join(" ").trim();
if (!premise) {
  throw new Error(
    'usage: bun run root "premise" [--n 3] [--direct] [--render] [--pick 1] [--duration 10] [--title "..."]',
  );
}
const durationSeconds = Number(values.duration);

const scenes = values.direct
  ? [premise]
  : await expandPremise({ premise, count: Number(values.n) });

if (!values.direct) {
  console.log(scenes.map((scene, i) => `${i + 1}. ${scene}`).join("\n"));
}

const prompts = await Promise.all(
  scenes.map((scene) => writeRootPrompt({ premise: scene, durationSeconds })),
);
for (const [i, prompt] of prompts.entries()) {
  console.log(`\n--- ${i + 1} ---\n${prompt}`);
}

if (!values.render) {
  console.log("\n(no video: pass --render to film one as a series)");
  process.exit(0);
}

const pick = Number(values.pick);
if (!Number.isInteger(pick) || pick < 1 || pick > prompts.length) {
  throw new Error(`--pick must be between 1 and ${prompts.length}.`);
}
const series = await createSeries({
  title: values.title ?? premise,
  premise,
  logline: scenes[pick - 1],
  prompt: prompts[pick - 1],
  durationSeconds,
});
console.log(`\nfilming scene ${pick} as series ${series.id}...`);
const root = await awaitEpisode(series.id, "0");
console.log(`clip: ${root.videoUrl}\nchoices: ${root.choices?.join(" / ")}\nwatch: /watch/${series.id}`);
process.exit(0);

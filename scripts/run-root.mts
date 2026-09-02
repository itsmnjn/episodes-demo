// Turn a premise into opening episodes. By default: expand the premise into
// N scenes, write each as a prompt, print everything, render nothing. With
// --render, one scene is rendered to disk. Nothing here touches the
// database; series are created in the app.
//
//   bun run root "zoo"                      # 3 scenes, 3 prompts, no video
//   bun run root "zoo" --n 5
//   bun run root "zoo" --render             # also render scene 1 to out/root.mp4
//   bun run root "zoo" --render --pick 2    # render scene 2 instead
//   bun run root --from premise.txt --direct   # film the premise as written, no expander
//   bun run root "zoo" --duration 12 --out out

import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  checkEpisodeJob,
  expandPremise,
  submitRootJob,
  writeRootPrompt,
} from "../lib/generate";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    from: { type: "string" },
    n: { type: "string", default: "3" },
    direct: { type: "boolean", default: false },
    render: { type: "boolean", default: false },
    pick: { type: "string", default: "1" },
    duration: { type: "string", default: "10" },
    out: { type: "string", default: "out" },
  },
});

const premise = values.from
  ? (await fs.readFile(values.from, "utf8")).trim()
  : positionals.join(" ").trim();
if (!premise) {
  throw new Error(
    'usage: bun run root "premise" [--n 3] [--direct] [--render] [--pick 1] [--duration 10] [--out out]',
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
  console.log("\n(no video: pass --render to render one)");
  process.exit(0);
}

const pick = Number(values.pick);
if (!Number.isInteger(pick) || pick < 1 || pick > prompts.length) {
  throw new Error(`--pick must be between 1 and ${prompts.length}.`);
}
const requestId = await submitRootJob({ prompt: prompts[pick - 1], durationSeconds });
console.log(`\nrendering scene ${pick} (request ${requestId})...`);

let videoUrl: string | null = null;
while (!videoUrl) {
  await new Promise((resolve) => setTimeout(resolve, 15000));
  const job = await checkEpisodeJob(requestId);
  if (job.status === "ready") {
    videoUrl = job.videoUrl;
  } else if (job.status === "failed") {
    throw new Error(`The render failed: ${job.error}`);
  }
}

await fs.mkdir(values.out, { recursive: true });
const outPath = path.join(values.out, "root.mp4");
const clip = await fetch(videoUrl);
await fs.writeFile(outPath, new Uint8Array(await clip.arrayBuffer()));
console.log(`clip: ${outPath}`);

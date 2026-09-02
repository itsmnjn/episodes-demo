// Turn a premise into opening episodes. By default: expand the premise into
// N scenes, write each as a prompt, print everything, render nothing. With
// --render, every scene is rendered in parallel to disk. Nothing here
// touches the database; series are created in the app.
//
//   bun run root "zoo"                      # 3 scenes, 3 prompts, no video
//   bun run root "zoo" --n 5
//   bun run root "zoo" --render             # also render all 3
//
// A run lands in out/root/<premise>-<stamp>/ as scene-N.mp4 with the
// scenes and every prompt beside it.
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
import { slug, stamp } from "./out";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    from: { type: "string" },
    n: { type: "string", default: "3" },
    direct: { type: "boolean", default: false },
    render: { type: "boolean", default: false },
    duration: { type: "string", default: "10" },
    out: { type: "string", default: "out" },
  },
});

const premise = values.from
  ? (await fs.readFile(values.from, "utf8")).trim()
  : positionals.join(" ").trim();
if (!premise) {
  throw new Error(
    'usage: bun run root "premise" [--n 3] [--direct] [--render] [--duration 10] [--out out]',
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
  console.log("\n(no video: pass --render to render them)");
  process.exit(0);
}

const dir = path.join(values.out, "root", `${slug(premise)}-${stamp}`);
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(path.join(dir, "scenes.txt"), scenes.map((scene, i) => `${i + 1}. ${scene}`).join("\n") + "\n");
for (const [i, prompt] of prompts.entries()) {
  await fs.writeFile(path.join(dir, `scene-${i + 1}.txt`), prompt + "\n");
}

console.log(`\nrendering ${prompts.length} scenes into ${dir}...`);
await Promise.all(
  prompts.map(async (prompt, i) => {
    const requestId = await submitRootJob({ prompt, durationSeconds });
    let videoUrl: string | null = null;
    while (!videoUrl) {
      await new Promise((resolve) => setTimeout(resolve, 15000));
      const job = await checkEpisodeJob(requestId);
      if (job.status === "ready") {
        videoUrl = job.videoUrl;
      } else if (job.status === "failed") {
        console.log(`scene ${i + 1} failed: ${job.error}`);
        return;
      }
    }
    const outPath = path.join(dir, `scene-${i + 1}.mp4`);
    const clip = await fetch(videoUrl);
    await fs.writeFile(outPath, new Uint8Array(await clip.arrayBuffer()));
    console.log(`clip: ${outPath}`);
  }),
);

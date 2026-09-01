// Write and render a root episode from a bare premise: the root writer
// invents the opening shot, then text-to-video renders it at 9:16.
//
//   PREMISE="hero is at zoo" bun run root
//   PREMISE="..." DURATION=12 bun run root
//
// Prints the finished prompt as soon as it lands, then the video's local path.

import { promises as fs } from "node:fs";
import path from "node:path";
import { checkEpisodeJob, submitRootJob, writeRootPrompt } from "../lib/generate";

let premise = process.env.PREMISE;
if (!premise && process.env.PREMISE_FILE) {
  premise = await fs.readFile(process.env.PREMISE_FILE, "utf8");
}
if (!premise) throw new Error("Set PREMISE (or PREMISE_FILE) to the story premise.");
const durationSeconds = Number(process.env.DURATION ?? 10);

const prompt = await writeRootPrompt({ premise, durationSeconds });
console.log(`prompt:\n\n${prompt}\n`);

const requestId = await submitRootJob({ prompt, durationSeconds });
console.log(`rendering (request ${requestId})...`);

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

const outDir = process.env.OUT ?? "out";
await fs.mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, "root.mp4");
const clip = await fetch(videoUrl);
await fs.writeFile(outPath, new Uint8Array(await clip.arrayBuffer()));
console.log(`\nclip: ${outPath}`);

// Run one live creation hop from a baked leaf: suggest two moves, pick one,
// write the child prompt off the real held frame, render it on fal.
//
//   npm run hop                              # the-invitation 0aa, first suggestion
//   SERIES=mcdonalds EPISODE=0bb npm run hop
//   LABEL="Summon a dragon" npm run hop      # skip suggestions, force a move
//
// Prints the suggestions and the finished prompt as they land, then the
// rendered video's local path.

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  checkEpisodeJob,
  frameUrlForParent,
  submitEpisodeJob,
  suggestChoices,
  writeEpisodePrompt,
} from "../lib/generate";
import { loadSeriesSource } from "../lib/content";

const seriesId = process.env.SERIES ?? "the-invitation";
const episodeId = process.env.EPISODE ?? "0aa";

const source = loadSeriesSource(seriesId);
if (!source) throw new Error(`Unknown series: ${seriesId}`);
const parent = source.episodes[episodeId];
if (!parent) throw new Error(`Unknown episode: ${seriesId}/${episodeId}`);
if (parent.childIds.length > 0) {
  throw new Error(`${episodeId} is not a leaf; pick an episode with no branches.`);
}
if (!parent.lastFramePath) {
  throw new Error(`${episodeId} has no last frame on disk.`);
}

let label = process.env.LABEL;
if (!label) {
  const choices = await suggestChoices({
    episodePrompt: parent.prompt,
    takenLabels: [],
  });
  console.log(`suggested:\n  1. ${choices[0]}\n  2. ${choices[1]}`);
  label = choices[0];
}
console.log(`\nmove: ${label}\n`);

const frameUrl = await frameUrlForParent({
  name: `${seriesId}-${episodeId}`,
  lastFramePath: parent.lastFramePath,
});
console.log(`held frame: ${frameUrl}\n`);

const prompt = await writeEpisodePrompt({
  parentPrompt: parent.prompt,
  frameUrl,
  label,
  durationSeconds: parent.durationSeconds,
});
console.log(`prompt:\n\n${prompt}\n`);

const requestId = await submitEpisodeJob({
  prompt,
  imageUrl: frameUrl,
  durationSeconds: parent.durationSeconds,
});
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
const outPath = path.join(outDir, `${seriesId}-${episodeId}-hop.mp4`);
const clip = await fetch(videoUrl);
await fs.writeFile(outPath, new Uint8Array(await clip.arrayBuffer()));
console.log(`\nclip: ${outPath}`);

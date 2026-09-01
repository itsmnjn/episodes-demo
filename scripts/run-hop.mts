// Extend a baked leaf by one episode: suggest two moves, pick one, write the
// next episode off the real held frame, render it.
//
//   bun run hop the-invitation 0aa
//   bun run hop mcdonalds 0bb --move "Summon a dragon" --out out

import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  checkEpisodeJob,
  frameUrlForParent,
  submitEpisodeJob,
  suggestChoices,
  writeEpisodePrompt,
} from "../lib/generate";
import { loadSeriesSource } from "../lib/content";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    move: { type: "string" },
    out: { type: "string", default: "out" },
  },
});

const [seriesId, episodeId] = positionals;
if (!seriesId || !episodeId) {
  throw new Error('usage: bun run hop <series> <episode> [--move "..."] [--out out]');
}

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

let label = values.move;
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

await fs.mkdir(values.out, { recursive: true });
const outPath = path.join(values.out, `${seriesId}-${episodeId}-hop.mp4`);
const clip = await fetch(videoUrl);
await fs.writeFile(outPath, new Uint8Array(await clip.arrayBuffer()));
console.log(`\nclip: ${outPath}`);

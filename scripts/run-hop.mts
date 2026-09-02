// Extend an episode by one, to disk: take a move (or the episode's first
// written choice), write the next episode off its held frame, render it to
// out/. Reads the episode from the database; writes nothing back.
//
//   bun run hop the-invitation 0aa
//   bun run hop mcdonalds 0bb --move "Summon a dragon" --out out
//
// The render lands in out/hop/<series>-<episode>-<stamp>/ as hop.mp4 with
// the move and the prompt beside it.

import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { checkEpisodeJob, submitEpisodeJob, writeEpisodePrompt } from "../lib/generate";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { series } from "../lib/db/schema";
import { getEpisodeRow } from "../lib/series";
import { stamp } from "./out";

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

const story = await db.query.series.findFirst({ where: eq(series.id, seriesId) });
if (!story) throw new Error(`Unknown series: ${seriesId}`);
const parent = await getEpisodeRow(seriesId, episodeId);
if (!parent) throw new Error(`Unknown episode: ${seriesId}/${episodeId}`);
if (parent.status !== "ready" || !parent.lastFrameUrl) {
  throw new Error(`${episodeId} has not landed yet.`);
}
const label = values.move ?? parent.choices?.[0];
if (!label) throw new Error(`${episodeId} has no written choices; pass --move.`);
console.log(`move: ${label}\n`);

const prompt = await writeEpisodePrompt({
  premise: story.premise,
  parentPrompt: parent.prompt,
  frameUrl: parent.lastFrameUrl,
  label,
  durationSeconds: parent.durationSeconds,
});
console.log(`prompt:\n\n${prompt}\n`);

const requestId = await submitEpisodeJob({
  prompt,
  imageUrl: parent.lastFrameUrl,
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

const dir = path.join(values.out, "hop", `${seriesId}-${episodeId}-${stamp}`);
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(path.join(dir, "prompt.txt"), `move: ${label}\n\n${prompt}\n`);
const outPath = path.join(dir, "hop.mp4");
const clip = await fetch(videoUrl);
await fs.writeFile(outPath, new Uint8Array(await clip.arrayBuffer()));
console.log(`\nclip: ${outPath}`);
process.exit(0);

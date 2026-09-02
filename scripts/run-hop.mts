// Extend an episode by one: take a move (or the first written choice), write
// the next episode off its held frame, render it into the series.
//
//   bun run hop the-invitation 0aa
//   bun run hop mcdonalds 0bb --move "Summon a dragon"

import { parseArgs } from "node:util";
import { awaitEpisode, getEpisodeRow, startBranch } from "../lib/series";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { move: { type: "string" } },
});

const [seriesId, episodeId] = positionals;
if (!seriesId || !episodeId) {
  throw new Error('usage: bun run hop <series> <episode> [--move "..."]');
}

const parent = await getEpisodeRow(seriesId, episodeId);
if (!parent) throw new Error(`Unknown episode: ${seriesId}/${episodeId}`);
const label = values.move ?? parent.choices?.[0];
if (!label) throw new Error(`${episodeId} has no written choices; pass --move.`);
console.log(`move: ${label}\n`);

const child = await startBranch({ seriesId, parentId: episodeId, label });
console.log(`prompt:\n\n${child.prompt}\n`);
console.log(`filming ${child.id}...`);
const landed = await awaitEpisode(seriesId, child.id);
console.log(`clip: ${landed.videoUrl}\nchoices: ${landed.choices?.join(" / ")}`);
process.exit(0);

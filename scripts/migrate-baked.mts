// One-off: move the baked series under content/ into the database and Blob.
// Leaves get their two choices written, since every landed episode has them.
//
//   bun scripts/migrate-baked.mts            # all series in content/catalog.json
//   bun scripts/migrate-baked.mts mcdonalds

import { promises as fs } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { db } from "../lib/db";
import { episodes, series } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { suggestChoices } from "../lib/generate";

type Baked = {
  id: string;
  title: string;
  logline: string;
  episodes: Record<
    string,
    {
      id: string;
      durationSeconds?: number;
      prompt: string;
      video?: string;
      lastFrame?: string;
      branches?: { label: string; to: string }[];
    }
  >;
};

const root = path.join(process.cwd(), "content");
const catalog = JSON.parse(await fs.readFile(path.join(root, "catalog.json"), "utf8")) as {
  series: { id: string }[];
};
const ids = process.argv.slice(2).length > 0 ? process.argv.slice(2) : catalog.series.map((row) => row.id);

async function upload(seriesId: string, relative: string, name: string, contentType: string) {
  const bytes = await fs.readFile(path.join(root, "series", seriesId, relative));
  const blob = await put(`series/${seriesId}/${name}`, bytes, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
  });
  return blob.url;
}

for (const id of ids) {
  const baked = JSON.parse(
    await fs.readFile(path.join(root, "series", id, "series.json"), "utf8"),
  ) as Baked;
  console.log(`\n${id}: ${Object.keys(baked.episodes).length} episodes`);

  const labelOf = new Map<string, string>();
  for (const episode of Object.values(baked.episodes)) {
    for (const branch of episode.branches ?? []) labelOf.set(branch.to, branch.label);
  }

  const rows = await Promise.all(
    Object.values(baked.episodes).map(async (episode) => {
      if (!episode.video || !episode.lastFrame) throw new Error(`${id}/${episode.id} has no media`);
      const [videoUrl, lastFrameUrl] = await Promise.all([
        upload(id, episode.video, `${episode.id}.mp4`, "video/mp4"),
        upload(id, episode.lastFrame, `${episode.id}.last.jpg`, "image/jpeg"),
      ]);
      const branches = episode.branches ?? [];
      const choices =
        branches.length === 2
          ? branches.map((branch) => branch.label)
          : await suggestChoices({ episodePrompt: episode.prompt });
      console.log(`  ${episode.id}: ${choices.join(" / ")}`);
      return {
        seriesId: id,
        id: episode.id,
        parentId: episode.id === "0" ? null : episode.id.slice(0, -1),
        label: labelOf.get(episode.id) ?? null,
        durationSeconds: episode.durationSeconds ?? 10,
        prompt: episode.prompt,
        status: "ready" as const,
        videoUrl,
        lastFrameUrl,
        choices,
      };
    }),
  );

  await db.transaction(async (tx) => {
    await tx.delete(series).where(eq(series.id, id));
    await tx.insert(series).values({ id, title: baked.title, premise: baked.logline, logline: baked.logline });
    await tx.insert(episodes).values(rows);
  });
  console.log(`  saved`);
}
process.exit(0);

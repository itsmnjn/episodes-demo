// Everything that reads or writes a series. Episodes live in Postgres, clips
// and frames in Blob. A row is inserted the moment its render is submitted;
// `settleEpisode` finishes it once the clip lands.

import { put } from "@vercel/blob";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { episodes, series, type EpisodeRow, type SeriesRow } from "./db/schema";
import {
  checkEpisodeJob,
  extractLastFrame,
  submitEpisodeJob,
  submitRootJob,
  suggestChoices,
  writeEpisodePrompt,
} from "./generate";

export type EpisodeStatus = EpisodeRow["status"];

// What the player gets. No prompt: the viewer never sees it.
export type Episode = {
  id: string;
  parentId: string | null;
  label: string | null;
  durationSeconds: number;
  status: EpisodeStatus;
  videoUrl: string | null;
  lastFrameUrl: string | null;
  choices: string[];
  error: string | null;
};

export type Series = {
  id: string;
  title: string;
  logline: string;
  episodes: Record<string, Episode>;
};

export type SeriesCard = {
  id: string;
  title: string;
  logline: string;
  posterUrl: string | null;
  rootStatus: EpisodeStatus;
};

export function toEpisode(row: EpisodeRow): Episode {
  return {
    id: row.id,
    parentId: row.parentId,
    label: row.label,
    durationSeconds: row.durationSeconds,
    status: row.status,
    videoUrl: row.videoUrl,
    lastFrameUrl: row.lastFrameUrl,
    choices: row.choices ?? [],
    error: row.error,
  };
}

export async function listSeries(): Promise<SeriesCard[]> {
  const rows = await db
    .select({
      id: series.id,
      title: series.title,
      logline: series.logline,
      posterUrl: episodes.lastFrameUrl,
      rootStatus: episodes.status,
    })
    .from(series)
    .innerJoin(episodes, and(eq(episodes.seriesId, series.id), eq(episodes.id, "0")))
    .orderBy(desc(series.createdAt));
  return rows;
}

export async function getSeries(id: string): Promise<Series | null> {
  const row = await db.query.series.findFirst({ where: eq(series.id, id) });
  if (!row) return null;
  const rows = await db.select().from(episodes).where(eq(episodes.seriesId, id)).orderBy(asc(episodes.createdAt));
  const byId: Record<string, Episode> = {};
  for (const episode of rows) byId[episode.id] = toEpisode(episode);
  return { id: row.id, title: row.title, logline: row.logline, episodes: byId };
}

export async function getEpisodeRow(seriesId: string, episodeId: string): Promise<EpisodeRow | null> {
  const row = await db.query.episodes.findFirst({
    where: and(eq(episodes.seriesId, seriesId), eq(episodes.id, episodeId)),
  });
  return row ?? null;
}

async function mintSeriesId(title: string): Promise<string> {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "series";
  const taken = new Set(
    (await db.select({ id: series.id }).from(series)).map((row) => row.id),
  );
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
  }
}

export async function createSeries(input: {
  title: string;
  premise: string;
  logline: string;
  prompt: string;
  durationSeconds: number;
}): Promise<SeriesRow> {
  const id = await mintSeriesId(input.title);
  const requestId = await submitRootJob({ prompt: input.prompt, durationSeconds: input.durationSeconds });
  const [row] = await db
    .insert(series)
    .values({ id, title: input.title, premise: input.premise, logline: input.logline })
    .returning();
  await db.insert(episodes).values({
    seriesId: id,
    id: "0",
    parentId: null,
    label: null,
    durationSeconds: input.durationSeconds,
    prompt: input.prompt,
    status: "generating",
    requestId,
  });
  return row;
}

// The next episode after `parentId` for the move `label`. The same move from
// the same episode is the same episode: a second viewer joins the first
// one's render instead of starting another.
export async function startBranch(input: {
  seriesId: string;
  parentId: string;
  label: string;
}): Promise<EpisodeRow> {
  const parent = await getEpisodeRow(input.seriesId, input.parentId);
  if (!parent) throw new Error("Unknown episode.");
  if (parent.status !== "ready" || !parent.lastFrameUrl) {
    throw new Error("This episode has not landed yet.");
  }
  const siblings = await db
    .select()
    .from(episodes)
    .where(and(eq(episodes.seriesId, input.seriesId), eq(episodes.parentId, input.parentId)));
  const existing = siblings.find((row) => row.label === input.label && row.status !== "failed");
  if (existing) return existing;

  const takenIds = new Set(siblings.map((row) => row.id));
  let childId: string | null = null;
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!takenIds.has(`${input.parentId}${letter}`)) {
      childId = `${input.parentId}${letter}`;
      break;
    }
  }
  if (!childId) throw new Error("This episode has no room for more paths.");

  const prompt = await writeEpisodePrompt({
    parentPrompt: parent.prompt,
    frameUrl: parent.lastFrameUrl,
    label: input.label,
    durationSeconds: parent.durationSeconds,
  });
  const requestId = await submitEpisodeJob({
    prompt,
    imageUrl: parent.lastFrameUrl,
    durationSeconds: parent.durationSeconds,
  });
  const [row] = await db
    .insert(episodes)
    .values({
      seriesId: input.seriesId,
      id: childId,
      parentId: input.parentId,
      label: input.label,
      durationSeconds: parent.durationSeconds,
      prompt,
      status: "generating",
      requestId,
    })
    .returning();
  return row;
}

export async function storeClip(seriesId: string, episodeId: string, falVideoUrl: string) {
  const clip = await fetch(falVideoUrl);
  if (!clip.ok) throw new Error(`Could not fetch the clip (${clip.status}).`);
  const [video, frame] = await Promise.all([
    put(`series/${seriesId}/${episodeId}.mp4`, await clip.arrayBuffer(), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "video/mp4",
    }),
    extractLastFrame(falVideoUrl).then((bytes) =>
      put(`series/${seriesId}/${episodeId}.last.jpg`, Buffer.from(bytes), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "image/jpeg",
      }),
    ),
  ]);
  return { videoUrl: video.url, lastFrameUrl: frame.url };
}

// Called by whoever is polling. If the render has landed, move the clip and
// its last frame to Blob, write the two choices, and mark the row ready.
// Two pollers settling at once both upload the same files; the guarded
// update makes the row change once.
export async function settleEpisode(seriesId: string, episodeId: string): Promise<EpisodeRow> {
  const row = await getEpisodeRow(seriesId, episodeId);
  if (!row) throw new Error("Unknown episode.");
  if (row.status !== "generating" || !row.requestId) return row;

  const job = await checkEpisodeJob(row.requestId);
  if (job.status === "generating") return row;
  if (job.status === "failed") {
    const [updated] = await db
      .update(episodes)
      .set({ status: "failed", error: job.error })
      .where(and(eq(episodes.seriesId, seriesId), eq(episodes.id, episodeId), eq(episodes.status, "generating")))
      .returning();
    return updated ?? row;
  }

  const [media, choices] = await Promise.all([
    storeClip(seriesId, episodeId, job.videoUrl),
    suggestChoices({ episodePrompt: row.prompt }),
  ]);
  const [updated] = await db
    .update(episodes)
    .set({ status: "ready", videoUrl: media.videoUrl, lastFrameUrl: media.lastFrameUrl, choices })
    .where(and(eq(episodes.seriesId, seriesId), eq(episodes.id, episodeId), eq(episodes.status, "generating")))
    .returning();
  return updated ?? (await getEpisodeRow(seriesId, episodeId))!;
}

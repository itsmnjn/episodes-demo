// Everything that reads or writes a series. Episodes live in Postgres, clips
// and frames in Blob. A row is inserted the moment its render is submitted;
// `settleEpisode` finishes it once the clip lands.

import { put } from "@vercel/blob";
import { and, asc, desc, eq, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "./db";
import { episodes, series, type EpisodeRow, type SeriesRow } from "./db/schema";
import {
  CHOICE_MODEL_ID,
  EPISODE_MODEL_ID,
  FAST_MODEL_ID,
  checkEpisodeJob,
  extractLastFrame,
  submitEpisodeJob,
  submitRootJob,
  suggestChoices,
  writeEpisodePrompt,
  writeTitle,
} from "./generate";
import { logTiming, timed } from "./timing";

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
  createdAt: string;
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
    createdAt: row.createdAt.toISOString(),
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

// The title is written here, not typed: the id is minted from it, and the
// render is submitted while it is being written.
export async function createSeries(input: {
  premise: string;
  logline: string;
  prompt: string;
  durationSeconds: number;
}): Promise<SeriesRow> {
  const premise = input.premise.slice(0, 40);
  const [title, requestId] = await Promise.all([
    timed("title", { premise, model: FAST_MODEL_ID }, () =>
      writeTitle({ premise: input.premise, scene: input.logline, prompt: input.prompt }),
    ),
    timed("submitRoot", { premise }, () =>
      submitRootJob({ prompt: input.prompt, durationSeconds: input.durationSeconds }),
    ),
  ]);
  const id = await mintSeriesId(title);
  const [row] = await db
    .insert(series)
    .values({ id, title, premise: input.premise, logline: input.logline })
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
  const story = await db.query.series.findFirst({ where: eq(series.id, input.seriesId) });
  if (!story) throw new Error("Unknown series.");
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

  const tags = { series: input.seriesId, episode: childId, move: input.label };
  const prompt = await timed("episodePrompt", { ...tags, model: EPISODE_MODEL_ID }, () =>
    writeEpisodePrompt({
      premise: story.premise,
      parentPrompt: parent.prompt,
      frameUrl: parent.lastFrameUrl!,
      label: input.label,
      durationSeconds: parent.durationSeconds,
    }),
  );
  const requestId = await timed("submitEpisode", tags, () =>
    submitEpisodeJob({
      prompt,
      imageUrl: parent.lastFrameUrl!,
      durationSeconds: parent.durationSeconds,
    }),
  );
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
  const tags = { series: seriesId, episode: episodeId };
  const bytes = await timed("clipDownload", tags, async () => {
    const clip = await fetch(falVideoUrl);
    if (!clip.ok) throw new Error(`Could not fetch the clip (${clip.status}).`);
    return clip.arrayBuffer();
  });
  const [video, frame] = await Promise.all([
    timed("clipUpload", { ...tags, bytes: bytes.byteLength }, () =>
      put(`series/${seriesId}/${episodeId}.mp4`, bytes, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "video/mp4",
      }),
    ),
    timed("lastFrame", tags, () =>
      extractLastFrame(falVideoUrl).then((bytes) =>
        put(`series/${seriesId}/${episodeId}.last.jpg`, Buffer.from(bytes), {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: "image/jpeg",
        }),
      ),
    ),
  ]);
  return { videoUrl: video.url, lastFrameUrl: frame.url };
}

// Called by whoever is polling. If the render has landed, claim the settle,
// move the clip and its last frame to Blob, write the two choices, and mark
// the row ready. The claim is a guarded update: one settle per episode at a
// time, and a settle that failed is not retried inside the lock window.
// After SETTLE_ATTEMPTS failures the episode fails with the storage error.
const SETTLE_LOCK_MS = 60_000;
const SETTLE_ATTEMPTS = 3;

export async function settleEpisode(seriesId: string, episodeId: string): Promise<EpisodeRow> {
  const row = await getEpisodeRow(seriesId, episodeId);
  if (!row) throw new Error("Unknown episode.");
  if (row.status !== "generating" || !row.requestId) return row;

  const job = await checkEpisodeJob(row.requestId);
  if (job.status === "generating") return row;
  const thisRow = and(eq(episodes.seriesId, seriesId), eq(episodes.id, episodeId), eq(episodes.status, "generating"));
  if (job.status === "failed") {
    const [updated] = await db.update(episodes).set({ status: "failed", error: job.error }).where(thisRow).returning();
    return updated ?? row;
  }

  const [claimed] = await db
    .update(episodes)
    .set({ settleAttempts: sql`${episodes.settleAttempts} + 1`, settleStartedAt: new Date() })
    .where(
      and(
        thisRow,
        or(isNull(episodes.settleStartedAt), lt(episodes.settleStartedAt, new Date(Date.now() - SETTLE_LOCK_MS))),
      ),
    )
    .returning();
  if (!claimed) return row;
  // Wall time from the row's insert, which follows the submit by milliseconds,
  // to the poll that found it done, so it carries up to one poll interval.
  logTiming("render", Date.now() - row.createdAt.getTime(), job.status, { series: seriesId, episode: episodeId });

  try {
    const [media, choices] = await Promise.all([
      timed("storeClip", { series: seriesId, episode: episodeId }, () => storeClip(seriesId, episodeId, job.videoUrl)),
      timed("choices", { series: seriesId, episode: episodeId, model: CHOICE_MODEL_ID }, () =>
        suggestChoices({ episodePrompt: row.prompt }),
      ),
    ]);
    const [updated] = await db
      .update(episodes)
      .set({ status: "ready", videoUrl: media.videoUrl, lastFrameUrl: media.lastFrameUrl, choices, error: null })
      .where(thisRow)
      .returning();
    return updated ?? row;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not store the clip.";
    const giveUp = claimed.settleAttempts >= SETTLE_ATTEMPTS;
    const [updated] = await db
      .update(episodes)
      .set(giveUp ? { status: "failed", error: message } : { error: message })
      .where(thisRow)
      .returning();
    return updated ?? row;
  }
}

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type SeriesId = string;
export type EpisodeId = string;

export type Branch = {
  label: string;
  to: EpisodeId;
};

export type Episode = {
  id: EpisodeId;
  videoSrc: string | null;
  branches: readonly [Branch, Branch] | readonly [];
};

export type Series = {
  id: SeriesId;
  title: string;
  episodes: Record<EpisodeId, Episode>;
};

export type CatalogCard = {
  id: SeriesId;
  title: string;
  ip: string;
  logline: string;
  posterSrc: string | null;
};

const contentRoot = path.join(process.cwd(), "content");

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function contentUrl(relativeFromContent: string): string {
  return `/content/${relativeFromContent.split(path.sep).join("/")}`;
}

function fileUrl(relativeFromContent: string): string | null {
  const abs = path.join(contentRoot, relativeFromContent);
  if (!existsSync(abs)) return null;
  return contentUrl(relativeFromContent);
}

function parseBranches(value: unknown): Episode["branches"] {
  if (!Array.isArray(value) || value.length === 0) return [];
  if (value.length !== 2) return [];
  const parsed: Branch[] = [];
  for (const item of value) {
    const rec = asRecord(item);
    if (!rec || typeof rec.label !== "string" || typeof rec.to !== "string") {
      return [];
    }
    parsed.push({ label: rec.label, to: rec.to });
  }
  return [parsed[0], parsed[1]];
}

function parseEpisode(
  seriesId: SeriesId,
  value: unknown,
): Episode | null {
  const rec = asRecord(value);
  if (!rec || typeof rec.id !== "string") return null;
  const video =
    typeof rec.video === "string" && rec.video.length > 0
      ? fileUrl(path.join("series", seriesId, rec.video))
      : null;
  return {
    id: rec.id,
    videoSrc: video,
    branches: parseBranches(rec.branches),
  };
}

export function loadCatalog(): CatalogCard[] {
  const raw = JSON.parse(
    readFileSync(path.join(contentRoot, "catalog.json"), "utf8"),
  ) as unknown;
  const root = asRecord(raw);
  if (!root || !Array.isArray(root.series)) return [];
  const cards: CatalogCard[] = [];
  for (const item of root.series) {
    const rec = asRecord(item);
    if (
      !rec ||
      typeof rec.id !== "string" ||
      typeof rec.title !== "string" ||
      typeof rec.ip !== "string" ||
      typeof rec.logline !== "string" ||
      typeof rec.poster !== "string"
    ) {
      continue;
    }
    cards.push({
      id: rec.id,
      title: rec.title,
      ip: rec.ip,
      logline: rec.logline,
      posterSrc: fileUrl(rec.poster),
    });
  }
  return cards;
}

export function loadSeries(id: SeriesId): Series | null {
  const file = path.join(contentRoot, "series", id, "series.json");
  if (!existsSync(file)) return null;
  const raw = JSON.parse(readFileSync(file, "utf8")) as unknown;
  const rec = asRecord(raw);
  if (!rec || typeof rec.title !== "string" || !asRecord(rec.episodes)) {
    return null;
  }
  const episodes: Record<EpisodeId, Episode> = {};
  for (const [key, value] of Object.entries(asRecord(rec.episodes)!)) {
    const episode = parseEpisode(id, value);
    if (episode) episodes[key] = episode;
  }
  return { id, title: rec.title, episodes };
}

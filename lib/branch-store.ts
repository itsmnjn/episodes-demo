import { create } from "zustand";
import type { EpisodeId, SeriesId } from "./content";

// Viewer-made branches live in client memory. The module survives in-app
// navigation, so paths keep through restarts and shelf round-trips; a
// refresh starts clean. The server stays stateless.

export type UserEpisodeStatus = "generating" | "ready" | "failed";

export type UserEpisode = {
  id: EpisodeId;
  seriesId: SeriesId;
  parentId: EpisodeId;
  label: string;
  prompt: string;
  durationSeconds: number;
  requestId: string;
  status: UserEpisodeStatus;
  videoUrl: string | null;
  error: string | null;
};

type BranchState = {
  episodes: Record<string, UserEpisode>;
  frameUrls: Record<string, string>;
  upsertEpisode: (episode: UserEpisode) => void;
  setFrameUrl: (seriesId: SeriesId, episodeId: EpisodeId, url: string) => void;
};

function episodeKey(seriesId: SeriesId, episodeId: EpisodeId): string {
  return `${seriesId}/${episodeId}`;
}

export const useBranchStore = create<BranchState>((set) => ({
  episodes: {},
  frameUrls: {},
  upsertEpisode: (episode) =>
    set((state) => ({
      episodes: {
        ...state.episodes,
        [episodeKey(episode.seriesId, episode.id)]: episode,
      },
    })),
  setFrameUrl: (seriesId, episodeId, url) =>
    set((state) => ({
      frameUrls: { ...state.frameUrls, [episodeKey(seriesId, episodeId)]: url },
    })),
}));

export function seriesEpisodes(
  episodes: Record<string, UserEpisode>,
  seriesId: SeriesId,
): UserEpisode[] {
  return Object.values(episodes).filter(
    (episode) => episode.seriesId === seriesId,
  );
}

export function getEpisode(
  seriesId: SeriesId,
  episodeId: EpisodeId,
): UserEpisode | undefined {
  return useBranchStore.getState().episodes[episodeKey(seriesId, episodeId)];
}

export function getFrameUrl(
  seriesId: SeriesId,
  episodeId: EpisodeId,
): string | undefined {
  return useBranchStore.getState().frameUrls[episodeKey(seriesId, episodeId)];
}

export function nextChildId(
  parentId: EpisodeId,
  takenChildIds: Iterable<EpisodeId>,
): EpisodeId | null {
  const taken = new Set(takenChildIds);
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    const id = `${parentId}${letter}`;
    if (!taken.has(id)) return id;
  }
  return null;
}

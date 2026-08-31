import type { Branch, EpisodeId, Series } from "./content";

export type PlayerPhase =
  | { kind: "playing" }
  | { kind: "choose"; branches: readonly [Branch, Branch] }
  | { kind: "ended" }
  | { kind: "dead" };

export type PlayerState = {
  episodeId: EpisodeId;
  history: EpisodeId[];
  phase: PlayerPhase;
};

function enter(
  series: Series,
  episodeId: EpisodeId,
  history: EpisodeId[],
): PlayerState {
  const episode = series.episodes[episodeId];
  if (!episode?.videoSrc) {
    return { episodeId, history, phase: { kind: "dead" } };
  }
  return { episodeId, history, phase: { kind: "playing" } };
}

export function startSeries(series: Series): PlayerState {
  return enter(series, "0", []);
}

export function finishEpisode(series: Series, state: PlayerState): PlayerState {
  const episode = series.episodes[state.episodeId];
  if (!episode) return { ...state, phase: { kind: "dead" } };
  if (episode.branches.length === 2) {
    return { ...state, phase: { kind: "choose", branches: episode.branches } };
  }
  return { ...state, phase: { kind: "ended" } };
}

export function chooseBranch(
  series: Series,
  state: PlayerState,
  to: EpisodeId,
): PlayerState {
  return enter(series, to, [...state.history, state.episodeId]);
}

export function restartSeries(series: Series): PlayerState {
  return startSeries(series);
}

export function goBack(series: Series, state: PlayerState): PlayerState | null {
  const previous = state.history.at(-1);
  if (!previous) return null;
  return enter(series, previous, state.history.slice(0, -1));
}

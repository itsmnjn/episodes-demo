"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getFrameUrl,
  nextChildId,
  seriesEpisodes,
  useBranchStore,
  type UserEpisode,
} from "@/lib/branch-store";
import type { EpisodeId, Series } from "@/lib/content";
import {
  chooseBranch,
  finishEpisode,
  goBack,
  restartSeries,
  startSeries,
  type PlayerState,
} from "@/lib/player";

function clipSrc(series: Series, id: EpisodeId): string | null {
  return series.episodes[id]?.videoSrc ?? null;
}

function mountedIds(
  series: Series,
  episodeId: EpisodeId,
  heldId: EpisodeId,
  extra: EpisodeId[],
): EpisodeId[] {
  const ids: EpisodeId[] = [];
  const seen = new Set<EpisodeId>();
  const add = (id: EpisodeId) => {
    if (seen.has(id) || !clipSrc(series, id)) return;
    seen.add(id);
    ids.push(id);
  };
  add(episodeId);
  add(heldId);
  const episode = series.episodes[episodeId];
  if (episode) {
    for (const branch of episode.branches) add(branch.to);
  }
  for (const id of extra) add(id);
  return ids;
}

function mergeEpisodes(series: Series, made: UserEpisode[]): Series {
  const episodes = { ...series.episodes };
  for (const item of made) {
    if (item.status === "ready" && item.videoUrl) {
      episodes[item.id] = { id: item.id, videoSrc: item.videoUrl, branches: [] };
    }
  }
  return { ...series, episodes };
}

export function Player({ series }: { series: Series }) {
  const [state, setState] = useState<PlayerState>(() => startSeries(series));
  const [heldId, setHeldId] = useState<EpisodeId>(state.episodeId);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const storeEpisodes = useBranchStore((store) => store.episodes);
  const [suggestions, setSuggestions] = useState<[string, string] | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [pendingId, setPendingId] = useState<EpisodeId | null>(null);
  const [branchError, setBranchError] = useState<string | null>(null);
  const nodes = useRef(new Map<EpisodeId, HTMLVideoElement>());
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const userEpisodes = useMemo(
    () => seriesEpisodes(storeEpisodes, series.id),
    [storeEpisodes, series.id],
  );
  const mergedSeries = useMemo(
    () => mergeEpisodes(series, userEpisodes),
    [series, userEpisodes],
  );

  const episode = mergedSeries.episodes[state.episodeId];
  const holding = state.phase.kind !== "playing";
  const branchesHere = userEpisodes.filter(
    (made) => made.parentId === state.episodeId,
  );
  const pendingEpisode = pendingId
    ? userEpisodes.find((made) => made.id === pendingId)
    : undefined;
  const clips = useMemo(() => {
    const extras = userEpisodes
      .filter(
        (made) =>
          made.parentId === state.episodeId && made.status === "ready",
      )
      .map((made) => made.id);
    return mountedIds(mergedSeries, state.episodeId, heldId, extras);
  }, [heldId, mergedSeries, state.episodeId, userEpisodes]);

  // Poll in-flight renders. When the render the viewer is waiting on lands,
  // play it.
  const polling =
    pendingId !== null ||
    userEpisodes.some((made) => made.status === "generating");
  useEffect(() => {
    if (!polling) return;
    let cancelled = false;
    const tick = async () => {
      const { episodes, upsertEpisode } = useBranchStore.getState();
      const generating = seriesEpisodes(episodes, series.id).filter(
        (made) => made.status === "generating",
      );
      await Promise.all(
        generating.map(async (made) => {
          try {
            const response = await fetch(`/api/generation/${made.requestId}`, {
              cache: "no-store",
            });
            if (!response.ok) return;
            const job = (await response.json()) as
              | { status: "generating" }
              | { status: "ready"; videoUrl: string }
              | { status: "failed"; error: string };
            if (job.status === "ready") {
              upsertEpisode({
                ...made,
                status: "ready",
                videoUrl: job.videoUrl,
              });
            } else if (job.status === "failed") {
              upsertEpisode({ ...made, status: "failed", error: job.error });
            }
          } catch {
            // Poll again on the next tick.
          }
        }),
      );
      if (cancelled || !pendingId) return;
      const fresh = seriesEpisodes(
        useBranchStore.getState().episodes,
        series.id,
      );
      const awaited = fresh.find((item) => item.id === pendingId);
      if (!awaited) return;
      if (awaited.status === "ready" && awaited.videoUrl) {
        setPendingId(null);
        setPaused(false);
        setNeedsTap(false);
        setState((current) =>
          chooseBranch(mergeEpisodes(series, fresh), current, awaited.id),
        );
      } else if (awaited.status === "failed") {
        setPendingId(null);
        setBranchError(awaited.error ?? "The render failed.");
      }
    };
    const timer = setInterval(() => void tick(), 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [polling, pendingId, series]);

  function node(id: EpisodeId): HTMLVideoElement | undefined {
    return nodes.current.get(id);
  }

  useEffect(() => {
    const video = node(state.episodeId);
    if (video) video.muted = muted;
  }, [muted, state.episodeId]);

  useEffect(() => {
    for (const id of clips) {
      const video = node(id);
      if (video && id !== state.episodeId && video.readyState < 2) {
        video.load();
      }
    }
  }, [clips, state.episodeId]);

  useEffect(() => {
    const video = node(state.episodeId);
    if (!video || !episode?.videoSrc || state.phase.kind !== "playing") return;

    let cancelled = false;
    const revealAndPlay = () => {
      if (cancelled) return;
      video.muted = mutedRef.current;
      setHeldId(state.episodeId);
      video.currentTime = 0;
      const attempt = video.play();
      if (attempt) {
        void attempt.then(
          () => {
            if (cancelled) return;
            setNeedsTap(false);
            setPaused(false);
          },
          () => {
            if (!cancelled) setNeedsTap(true);
          },
        );
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      revealAndPlay();
    } else {
      video.addEventListener("loadeddata", revealAndPlay);
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", revealAndPlay);
    };
  }, [episode?.videoSrc, state.episodeId, state.phase.kind]);

  function apply(next: PlayerState) {
    setPaused(false);
    setNeedsTap(false);
    setPendingId(null);
    setSuggestions(null);
    setCustomLabel("");
    setBranchError(null);
    setState(next);
  }

  async function suggest() {
    const madeParent = userEpisodes.find(
      (item) => item.id === state.episodeId,
    );
    setSuggesting(true);
    setBranchError(null);
    try {
      const response = await fetch(
        `/api/series/${series.id}/episodes/${state.episodeId}/suggest`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parent: madeParent ? { prompt: madeParent.prompt } : undefined,
            takenLabels: branchesHere.map((item) => item.label),
          }),
        },
      );
      const data = (await response.json()) as {
        choices?: [string, string];
        error?: string;
      };
      if (!response.ok || !data.choices) {
        throw new Error(data.error ?? "Suggestions failed.");
      }
      setSuggestions(data.choices);
    } catch (error) {
      setBranchError(
        error instanceof Error ? error.message : "Suggestions failed.",
      );
    } finally {
      setSuggesting(false);
    }
  }

  async function createBranch(label: string) {
    const parentId = state.episodeId;
    const madeParent = userEpisodes.find((item) => item.id === parentId);
    const bakedChildIds =
      series.episodes[parentId]?.branches.map((branch) => branch.to) ?? [];
    const childId = nextChildId(parentId, [
      ...bakedChildIds,
      ...branchesHere.map((item) => item.id),
    ]);
    if (!childId) {
      setBranchError("This episode has no room for more paths.");
      return;
    }
    setCreating(true);
    setBranchError(null);
    try {
      const store = useBranchStore.getState();
      const response = await fetch(
        `/api/series/${series.id}/episodes/${parentId}/branch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label,
            parent: {
              frameUrl: getFrameUrl(series.id, parentId),
              ...(madeParent
                ? {
                    prompt: madeParent.prompt,
                    durationSeconds: madeParent.durationSeconds,
                    videoUrl: madeParent.videoUrl ?? undefined,
                  }
                : {}),
            },
          }),
        },
      );
      const data = (await response.json()) as {
        prompt?: string;
        requestId?: string;
        frameUrl?: string;
        durationSeconds?: number;
        error?: string;
      };
      if (
        !response.ok ||
        !data.prompt ||
        !data.requestId ||
        !data.frameUrl ||
        typeof data.durationSeconds !== "number"
      ) {
        throw new Error(data.error ?? "Could not start the episode.");
      }
      store.setFrameUrl(series.id, parentId, data.frameUrl);
      store.upsertEpisode({
        id: childId,
        seriesId: series.id,
        parentId,
        label,
        prompt: data.prompt,
        durationSeconds: data.durationSeconds,
        requestId: data.requestId,
        status: "generating",
        videoUrl: null,
        error: null,
      });
      setPendingId(childId);
      setSuggestions(null);
      setCustomLabel("");
    } catch (error) {
      setBranchError(
        error instanceof Error ? error.message : "Could not start the episode.",
      );
    } finally {
      setCreating(false);
    }
  }

  function onEnded() {
    const video = node(state.episodeId);
    if (video && Number.isFinite(video.duration)) {
      video.currentTime = video.duration;
      video.pause();
    }
    setState((current) => finishEpisode(mergedSeries, current));
  }

  function togglePlayback() {
    const video = node(state.episodeId);
    if (!video || holding) return;
    if (needsTap) {
      void video.play().then(
        () => {
          setNeedsTap(false);
          setPaused(false);
        },
        () => undefined,
      );
      return;
    }
    if (video.paused) {
      void video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  const parent = goBack(mergedSeries, state);
  const readyBranches = branchesHere.filter(
    (made) => made.status === "ready" && made.videoUrl,
  );
  const generatingBranches = branchesHere.filter(
    (made) => made.status === "generating" && made.id !== pendingId,
  );

  return (
    <main className="grid min-h-dvh place-items-center bg-black">
      <div className="relative h-dvh w-full max-w-[min(100vw,calc(100dvh*9/16))] overflow-hidden bg-black">
        {state.phase.kind !== "dead" ? (
          clips.map((id) => {
            const src = clipSrc(mergedSeries, id);
            if (!src) return null;
            const visible = id === heldId;
            return (
              <video
                key={id}
                ref={(el) => {
                  if (el) nodes.current.set(id, el);
                  else nodes.current.delete(id);
                }}
                src={src}
                preload="auto"
                playsInline
                className={
                  visible
                    ? "absolute inset-0 h-full w-full object-cover"
                    : "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
                }
                onEnded={id === state.episodeId ? onEnded : undefined}
                onClick={visible ? togglePlayback : undefined}
              />
            );
          })
        ) : (
          <div className="absolute inset-0 bg-[#0c0b0a]" />
        )}

        {state.phase.kind === "playing" && (needsTap || paused) ? (
          <button
            type="button"
            onClick={togglePlayback}
            className="absolute inset-0"
            aria-label={needsTap ? "Start" : "Play"}
          />
        ) : null}

        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
          <Link
            href="/"
            className="text-[13px] text-white/80 drop-shadow-md"
          >
            {series.title}
          </Link>
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            className="text-[13px] text-white/80 drop-shadow-md"
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
        </div>

        {holding ? (
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 bg-linear-to-t from-black/80 to-transparent px-5 pt-24 pb-10">
            {state.phase.kind === "choose" ? (
              state.phase.branches.map((branch) => (
                <button
                  key={branch.to}
                  type="button"
                  onClick={() =>
                    apply(chooseBranch(mergedSeries, state, branch.to))
                  }
                  className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm transition hover:bg-white/18"
                >
                  {branch.label}
                </button>
              ))
            ) : state.phase.kind === "ended" ? (
              <>
                {readyBranches.map((made) => (
                  <button
                    key={made.id}
                    type="button"
                    onClick={() =>
                      apply(chooseBranch(mergedSeries, state, made.id))
                    }
                    className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm transition hover:bg-white/18"
                  >
                    {made.label}
                  </button>
                ))}
                {pendingEpisode ? (
                  <div className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm">
                    <span className="animate-pulse">
                      Filming &ldquo;{pendingEpisode.label}&rdquo;&hellip; a few
                      minutes.
                    </span>
                  </div>
                ) : creating ? (
                  <div className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm">
                    <span className="animate-pulse">
                      Writing the next episode&hellip;
                    </span>
                  </div>
                ) : (
                  <>
                    {generatingBranches.map((made) => (
                      <div
                        key={made.id}
                        className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-left text-[15px] text-white/60 backdrop-blur-sm"
                      >
                        <span className="animate-pulse">
                          {made.label} &mdash; filming&hellip;
                        </span>
                      </div>
                    ))}
                    {suggestions ? (
                      suggestions.map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => void createBranch(label)}
                          className="w-full rounded-full border border-dashed border-white/40 bg-white/10 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm transition hover:bg-white/18"
                        >
                          {label}
                        </button>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => void suggest()}
                        disabled={suggesting}
                        className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm transition hover:bg-white/18 disabled:text-white/60"
                      >
                        {suggesting ? (
                          <span className="animate-pulse">
                            Finding two moves&hellip;
                          </span>
                        ) : (
                          "Suggest two moves"
                        )}
                      </button>
                    )}
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const label = customLabel.trim();
                        if (label) void createBranch(label);
                      }}
                    >
                      <input
                        value={customLabel}
                        onChange={(event) => setCustomLabel(event.target.value)}
                        placeholder="Or write your own move&hellip;"
                        maxLength={120}
                        className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-[15px] text-paper placeholder:text-white/45 outline-none backdrop-blur-sm focus:border-white/45"
                      />
                    </form>
                  </>
                )}
                {branchError ? (
                  <p className="px-1 text-[13px] text-ember">{branchError}</p>
                ) : null}
              </>
            ) : (
              <>
                <p className="mb-1 font-[family-name:var(--font-display)] text-2xl">
                  This path isn&apos;t here.
                </p>
                <Link
                  href="/"
                  className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-center text-[15px] backdrop-blur-sm"
                >
                  Back to shelf
                </Link>
              </>
            )}

            <div className="mt-1 flex justify-between text-[13px] text-white/55">
              {parent ? (
                <button type="button" onClick={() => apply(parent)}>
                  Back
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-4">
                {state.phase.kind === "ended" ? (
                  <Link href="/">Back to shelf</Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => apply(restartSeries(mergedSeries))}
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

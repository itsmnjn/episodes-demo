"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Episode, Series } from "@/lib/series";

type Phase = "playing" | "holding";

const buttonClass =
  "w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm transition hover:bg-white/18 disabled:text-white/60";
const quietClass =
  "w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-left text-[15px] text-white/60 backdrop-blur-sm";
// A move a viewer wrote, as opposed to one the story wrote.
const viewerClass =
  "flex w-full items-baseline justify-between gap-3 rounded-full border border-dashed border-white/30 bg-white/5 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm transition hover:bg-white/12";

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Every episode in the tree, with the tree growing as viewers walk it. The
// server holds the truth; this component keeps a copy and refreshes the
// rows it is waiting on.
export function Player({ series }: { series: Series }) {
  const [episodes, setEpisodes] = useState(series.episodes);
  const [currentId, setCurrentId] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>(
    series.episodes["0"].status === "ready" ? "playing" : "holding",
  );
  const [heldId, setHeldId] = useState("0");
  const [pendingId, setPendingId] = useState<string | null>(
    series.episodes["0"].status === "ready" ? null : "0",
  );
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [creating, setCreating] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const nodes = useRef(new Map<string, HTMLVideoElement>());
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const current = episodes[currentId];
  const children = useMemo(
    () => Object.values(episodes).filter((episode) => episode.parentId === currentId),
    [episodes, currentId],
  );
  const pending = pendingId ? episodes[pendingId] : undefined;

  // Clips kept mounted: the one playing, the one held on screen, and every
  // landed child, so the next tap starts on a loaded video.
  const clips = useMemo(() => {
    const ids: string[] = [];
    for (const id of [currentId, heldId, ...children.map((child) => child.id)]) {
      if (!ids.includes(id) && episodes[id]?.videoUrl) ids.push(id);
    }
    return ids;
  }, [children, currentId, episodes, heldId]);

  // Poll the rows in flight: the one the viewer is waiting on and any
  // sibling renders, so a path someone else started shows up when it lands.
  const waitingOn = useMemo(() => {
    const ids = children.filter((child) => child.status === "generating").map((child) => child.id);
    if (pendingId && !ids.includes(pendingId)) ids.push(pendingId);
    return ids;
  }, [children, pendingId]);
  useEffect(() => {
    if (waitingOn.length === 0) return;
    let cancelled = false;
    const tick = async () => {
      const fresh = await Promise.all(
        waitingOn.map(async (id) => {
          try {
            const response = await fetch(`/api/series/${series.id}/episodes/${id}`, { cache: "no-store" });
            if (!response.ok) return null;
            const data = (await response.json()) as { episode?: Episode };
            return data.episode ?? null;
          } catch {
            return null;
          }
        }),
      );
      if (cancelled) return;
      const landed = fresh.filter((episode): episode is Episode => episode !== null);
      if (landed.length === 0) return;
      setEpisodes((state) => {
        const next = { ...state };
        for (const episode of landed) next[episode.id] = episode;
        return next;
      });
      // The awaited render landed: play it. Or failed: say so.
      const awaited = landed.find((episode) => episode.id === pendingId);
      if (awaited?.status === "ready" && awaited.videoUrl) {
        go(awaited.id, awaited.id === currentId ? history : [...history, currentId]);
      } else if (awaited?.status === "failed") {
        setPendingId(null);
        setError(awaited.error ?? "The render failed.");
      }
    };
    void tick();
    const timer = setInterval(() => void tick(), 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [series.id, waitingOn, pendingId, currentId, history]);

  function node(id: string): HTMLVideoElement | undefined {
    return nodes.current.get(id);
  }

  useEffect(() => {
    const video = node(currentId);
    if (video) video.muted = muted;
  }, [muted, currentId]);

  useEffect(() => {
    for (const id of clips) {
      const video = node(id);
      if (video && id !== currentId && video.readyState < 2) video.load();
    }
  }, [clips, currentId]);

  useEffect(() => {
    const video = node(currentId);
    if (!video || !current?.videoUrl || phase !== "playing") return;

    let cancelled = false;
    const revealAndPlay = () => {
      if (cancelled) return;
      video.muted = mutedRef.current;
      setHeldId(currentId);
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
  }, [current?.videoUrl, currentId, phase]);

  function go(id: string, nextHistory: string[]) {
    setPaused(false);
    setNeedsTap(false);
    setPendingId(null);
    setCustomLabel("");
    setError(null);
    setHistory(nextHistory);
    setCurrentId(id);
    setPhase("playing");
  }

  async function choose(label: string) {
    const child = children.find((item) => item.label === label && item.status !== "failed");
    if (child?.status === "ready" && child.videoUrl) {
      go(child.id, [...history, currentId]);
      return;
    }
    if (child) {
      setPendingId(child.id);
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const response = await fetch(`/api/series/${series.id}/episodes/${currentId}/branch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const data = (await response.json()) as { episode?: Episode; error?: string };
      if (!response.ok || !data.episode) throw new Error(data.error ?? "Could not start the episode.");
      const episode = data.episode;
      setEpisodes((state) => ({ ...state, [episode.id]: episode }));
      setPendingId(episode.id);
      setCustomLabel("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start the episode.");
    } finally {
      setCreating(false);
    }
  }

  function onEnded() {
    const video = node(currentId);
    if (video && Number.isFinite(video.duration)) {
      video.currentTime = video.duration;
      video.pause();
    }
    setPhase("holding");
  }

  function togglePlayback() {
    const video = node(currentId);
    if (!video || phase !== "playing") return;
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

  // The two written choices, then every move a viewer has taken from here,
  // newest first.
  const childByLabel = new Map(children.map((child) => [child.label, child]));
  const written = current.choices.map((label) => ({ label, child: childByLabel.get(label), viewer: undefined }));
  const viewerMade = children
    .filter((child) => child.label && child.status !== "failed" && !current.choices.includes(child.label))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((child) => ({ label: child.label!, child, viewer: child }));
  const moves = [...written, ...viewerMade];
  const parentId = history.at(-1);

  return (
    <main className="grid min-h-dvh place-items-center bg-black">
      <div className="relative h-dvh w-full max-w-[min(100vw,calc(100dvh*9/16))] overflow-hidden bg-black">
        {clips.map((id) => {
          const src = episodes[id].videoUrl!;
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
              onEnded={id === currentId ? onEnded : undefined}
              onClick={visible ? togglePlayback : undefined}
            />
          );
        })}

        {phase === "playing" && (needsTap || paused) ? (
          <button
            type="button"
            onClick={togglePlayback}
            className="absolute inset-0"
            aria-label={needsTap ? "Start" : "Play"}
          />
        ) : null}

        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
          <Link href="/" className="text-[13px] text-white/80 drop-shadow-md">
            &lsaquo; Episodes
          </Link>
          <span className="text-[13px] text-white/55 drop-shadow-md">{series.title}</span>
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            className="text-[13px] text-white/80 drop-shadow-md"
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
        </div>

        {phase === "holding" ? (
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 bg-linear-to-t from-black/80 to-transparent px-5 pt-24 pb-10">
            {pending ? (
              <div className={buttonClass}>
                <span className="animate-pulse">
                  {pending.label ? `Filming “${pending.label}”… a few minutes.` : "Filming the opening… a few minutes."}
                </span>
              </div>
            ) : creating ? (
              <div className={buttonClass}>
                <span className="animate-pulse">Writing the next episode&hellip;</span>
              </div>
            ) : (
              <>
                <div className="flex max-h-[38dvh] flex-col gap-3 overflow-y-auto py-4 [mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]">
                  {moves.map(({ label, child, viewer }) => {
                    if (child?.status === "generating") {
                      return (
                        <button key={label} type="button" onClick={() => void choose(label)} className={quietClass}>
                          <span className="animate-pulse">{label} &mdash; filming&hellip;</span>
                        </button>
                      );
                    }
                    if (viewer) {
                      return (
                        <button key={label} type="button" onClick={() => void choose(label)} className={viewerClass}>
                          <span>{label}</span>
                          <span className="shrink-0 text-[12px] text-white/50">{timeAgo(viewer.createdAt)}</span>
                        </button>
                      );
                    }
                    return (
                      <button key={label} type="button" onClick={() => void choose(label)} className={buttonClass}>
                        {label}
                      </button>
                    );
                  })}
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const label = customLabel.trim();
                    if (label) void choose(label);
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
            {error ? <p className="px-1 text-[13px] text-ember">{error}</p> : null}

            {parentId !== undefined ? (
              <div className="mt-1 flex justify-between text-[13px] text-white/55">
                <button type="button" onClick={() => go(parentId, history.slice(0, -1))}>
                  Previous
                </button>
                <button type="button" onClick={() => go("0", [])}>
                  Start over
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}

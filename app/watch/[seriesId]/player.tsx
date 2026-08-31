"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Series } from "@/lib/content";
import {
  chooseBranch,
  finishEpisode,
  goBack,
  restartSeries,
  startSeries,
  type PlayerState,
} from "@/lib/player";

export function Player({ series }: { series: Series }) {
  const [state, setState] = useState<PlayerState>(() => startSeries(series));
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const episode = series.episodes[state.episodeId];
  const holding = state.phase.kind !== "playing";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !episode?.videoSrc || state.phase.kind !== "playing") return;
    video.muted = muted;
    const attempt = video.play();
    if (attempt) {
      void attempt.then(
        () => {
          setNeedsTap(false);
          setPaused(false);
        },
        () => setNeedsTap(true),
      );
    }
  }, [episode?.videoSrc, muted, state.episodeId, state.phase.kind]);

  function apply(next: PlayerState) {
    setPaused(false);
    setNeedsTap(false);
    setState(next);
  }

  function onEnded() {
    const video = videoRef.current;
    if (video && Number.isFinite(video.duration)) {
      video.currentTime = video.duration;
      video.pause();
    }
    setState((current) => finishEpisode(series, current));
  }

  function togglePlayback() {
    const video = videoRef.current;
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

  const parent = goBack(series, state);

  return (
    <main className="grid min-h-dvh place-items-center bg-black">
      <div className="relative h-dvh w-full max-w-[min(100vw,calc(100dvh*9/16))] overflow-hidden bg-black">
        {episode?.videoSrc && state.phase.kind !== "dead" ? (
          <video
            key={state.episodeId}
            ref={videoRef}
            src={episode.videoSrc}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            autoPlay
            onEnded={onEnded}
            onClick={togglePlayback}
          />
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
                  onClick={() => apply(chooseBranch(series, state, branch.to))}
                  className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-left text-[15px] text-paper backdrop-blur-sm transition hover:bg-white/18"
                >
                  {branch.label}
                </button>
              ))
            ) : state.phase.kind === "ended" ? (
              <>
                <button
                  type="button"
                  onClick={() => apply(restartSeries(series))}
                  className="w-full rounded-full border border-white/25 bg-white/10 px-4 py-3 text-[15px] backdrop-blur-sm"
                >
                  Restart
                </button>
                <Link
                  href="/"
                  className="w-full rounded-full px-4 py-3 text-center text-[15px] text-white/80"
                >
                  Back to shelf
                </Link>
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
              {state.phase.kind !== "ended" ? (
                <button
                  type="button"
                  onClick={() => apply(restartSeries(series))}
                >
                  Restart
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

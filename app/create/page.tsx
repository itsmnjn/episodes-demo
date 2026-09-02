"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fieldClass =
  "w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-paper placeholder:text-white/35 outline-none focus:border-white/40";
const buttonClass =
  "rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[15px] text-paper transition hover:bg-white/18 disabled:text-white/50";

// Premise, three scenes, one prompt, film it. The prompt is the creator's
// to edit before it renders.
export default function CreatePage() {
  const router = useRouter();
  const [premise, setPremise] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(10);
  const [scenes, setScenes] = useState<string[]>([]);
  const [scene, setScene] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState<"scenes" | "prompt" | "film" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as T & { error?: string };
    if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
    return data;
  }

  async function expand() {
    setBusy("scenes");
    setError(null);
    setScenes([]);
    setScene(null);
    setPrompt("");
    try {
      const data = await call<{ scenes: string[] }>("/api/create/scenes", { premise });
      setScenes(data.scenes);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not expand the premise.");
    } finally {
      setBusy(null);
    }
  }

  async function pick(chosen: string) {
    setScene(chosen);
    setPrompt("");
    setBusy("prompt");
    setError(null);
    try {
      const data = await call<{ prompt: string }>("/api/create/prompt", { premise, scene: chosen, durationSeconds });
      setPrompt(data.prompt);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not write the prompt.");
    } finally {
      setBusy(null);
    }
  }

  async function film() {
    setBusy("film");
    setError(null);
    try {
      const data = await call<{ seriesId: string }>("/api/series", {
        title,
        premise,
        logline: scene,
        prompt,
        durationSeconds,
      });
      router.push(`/watch/${data.seriesId}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start the series.");
      setBusy(null);
    }
  }

  return (
    <main className="relative min-h-dvh bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#2a1d14_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-2xl px-6 pt-8 pb-24 sm:px-10">
        <header className="flex items-baseline justify-between">
          <Link href="/" className="text-sm text-mute transition hover:text-paper">
            &lsaquo; Episodes
          </Link>
        </header>

        <section className="mt-12">
          <p className="mb-3 text-xs font-medium tracking-[0.22em] text-mute uppercase">Premise</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (premise.trim()) void expand();
            }}
            className="flex flex-col gap-3"
          >
            <textarea
              value={premise}
              onChange={(event) => setPremise(event.target.value)}
              placeholder="zoo"
              rows={2}
              className={fieldClass}
            />
            <div className="flex items-center gap-4">
              <button type="submit" disabled={busy !== null || !premise.trim()} className={buttonClass}>
                {busy === "scenes" ? <span className="animate-pulse">Expanding&hellip;</span> : "Expand"}
              </button>
              <label className="flex items-center gap-2 text-sm text-mute">
                <input
                  type="number"
                  min={5}
                  max={15}
                  value={durationSeconds}
                  onChange={(event) => setDurationSeconds(Number(event.target.value))}
                  className="w-16 rounded-sm border border-white/15 bg-white/5 px-2 py-1 text-paper outline-none"
                />
                seconds
              </label>
            </div>
          </form>
        </section>

        {scenes.length > 0 ? (
          <section className="mt-12">
            <p className="mb-3 text-xs font-medium tracking-[0.22em] text-mute uppercase">Scenes</p>
            <div className="flex flex-col gap-3">
              {scenes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => void pick(item)}
                  disabled={busy !== null}
                  className={
                    item === scene
                      ? "rounded-sm border border-ember/70 bg-white/10 px-4 py-3 text-left text-[15px] leading-relaxed text-paper"
                      : "rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-left text-[15px] leading-relaxed text-paper transition hover:bg-white/10"
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {scene && (busy === "prompt" || prompt) ? (
          <section className="mt-12">
            <p className="mb-3 text-xs font-medium tracking-[0.22em] text-mute uppercase">Prompt</p>
            {busy === "prompt" ? (
              <p className="animate-pulse text-sm text-mute">Writing the prompt&hellip;</p>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (title.trim() && prompt.trim()) void film();
                }}
                className="flex flex-col gap-3"
              >
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={14}
                  className={`${fieldClass} font-mono text-[13px] leading-relaxed`}
                />
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Title"
                  maxLength={80}
                  className={fieldClass}
                />
                <div>
                  <button type="submit" disabled={busy !== null || !title.trim() || !prompt.trim()} className={buttonClass}>
                    {busy === "film" ? <span className="animate-pulse">Starting the render&hellip;</span> : "Film it"}
                  </button>
                </div>
              </form>
            )}
          </section>
        ) : null}

        {error ? <p className="mt-6 text-sm text-ember">{error}</p> : null}
      </div>
    </main>
  );
}

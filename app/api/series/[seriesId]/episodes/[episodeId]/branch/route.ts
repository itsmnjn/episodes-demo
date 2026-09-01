import { NextResponse } from "next/server";
import { loadSeriesSource } from "@/lib/content";
import {
  frameUrlForParent,
  submitEpisodeJob,
  writeEpisodePrompt,
} from "@/lib/generate";

// The prompt write dominates this route and its latency can swing by minutes.
export const maxDuration = 300;

export async function POST(
  request: Request,
  context: { params: Promise<{ seriesId: string; episodeId: string }> },
) {
  const { seriesId, episodeId } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    label?: unknown;
    parent?: {
      prompt?: unknown;
      durationSeconds?: unknown;
      videoUrl?: unknown;
      frameUrl?: unknown;
    };
  } | null;
  const label = typeof body?.label === "string" ? body.label.trim() : "";
  if (!label || label.length > 120) {
    return NextResponse.json(
      { error: "A choice is a short move, a few words." },
      { status: 400 },
    );
  }
  const source = loadSeriesSource(seriesId);
  if (!source) {
    return NextResponse.json({ error: "Unknown series." }, { status: 404 });
  }

  const baked = source.episodes[episodeId];
  const cachedFrameUrl =
    typeof body?.parent?.frameUrl === "string"
      ? body.parent.frameUrl
      : undefined;
  let parentPrompt: string;
  let durationSeconds: number;
  let lastFramePath: string | undefined;
  let videoUrl: string | undefined;
  if (baked) {
    if (baked.childIds.length > 0) {
      return NextResponse.json(
        { error: "This episode cannot branch." },
        { status: 409 },
      );
    }
    parentPrompt = baked.prompt;
    durationSeconds = baked.durationSeconds;
    lastFramePath = baked.lastFramePath ?? undefined;
  } else {
    const parent = body?.parent;
    if (
      typeof parent?.prompt !== "string" ||
      typeof parent.durationSeconds !== "number"
    ) {
      return NextResponse.json({ error: "Unknown episode." }, { status: 404 });
    }
    parentPrompt = parent.prompt;
    durationSeconds = Math.max(5, Math.round(parent.durationSeconds));
    videoUrl = typeof parent.videoUrl === "string" ? parent.videoUrl : undefined;
  }

  try {
    const frameUrl =
      cachedFrameUrl ??
      (await frameUrlForParent({
        name: `${seriesId}-${episodeId}`,
        lastFramePath,
        videoUrl,
      }));
    const prompt = await writeEpisodePrompt({
      parentPrompt,
      frameUrl,
      label,
      durationSeconds,
    });
    const requestId = await submitEpisodeJob({
      prompt,
      imageUrl: frameUrl,
      durationSeconds,
    });
    return NextResponse.json({ prompt, requestId, frameUrl, durationSeconds });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start the episode.",
      },
      { status: 502 },
    );
  }
}

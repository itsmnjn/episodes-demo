import { NextResponse } from "next/server";
import { startBranch, toEpisode } from "@/lib/series";

// The prompt write dominates this route and its latency can swing by minutes.
export const maxDuration = 300;

export async function POST(
  request: Request,
  context: { params: Promise<{ seriesId: string; episodeId: string }> },
) {
  const { seriesId, episodeId } = await context.params;
  const body = (await request.json().catch(() => null)) as { label?: unknown } | null;
  const label = typeof body?.label === "string" ? body.label.trim() : "";
  if (!label || label.length > 120) {
    return NextResponse.json({ error: "A choice is a short move, a few words." }, { status: 400 });
  }
  try {
    const row = await startBranch({ seriesId, parentId: episodeId, label });
    return NextResponse.json({ episode: toEpisode(row) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start the episode." },
      { status: 502 },
    );
  }
}

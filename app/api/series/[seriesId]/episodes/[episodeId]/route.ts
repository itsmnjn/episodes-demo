import { NextResponse } from "next/server";
import { settleEpisode, toEpisode } from "@/lib/series";

export const dynamic = "force-dynamic";
// Settling downloads the clip and extracts its last frame.
export const maxDuration = 60;

export async function GET(
  _request: Request,
  context: { params: Promise<{ seriesId: string; episodeId: string }> },
) {
  const { seriesId, episodeId } = await context.params;
  try {
    const row = await settleEpisode(seriesId, episodeId);
    return NextResponse.json({ episode: toEpisode(row) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not read the episode." },
      { status: 502 },
    );
  }
}

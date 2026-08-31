import { NextResponse } from "next/server";
import { loadSeriesSource } from "@/lib/content";
import { suggestChoices } from "@/lib/generate";

export const maxDuration = 60;

export async function POST(
  request: Request,
  context: { params: Promise<{ seriesId: string; episodeId: string }> },
) {
  const { seriesId, episodeId } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    parent?: { prompt?: unknown };
    takenLabels?: unknown;
  } | null;
  const source = loadSeriesSource(seriesId);
  if (!source) {
    return NextResponse.json({ error: "Unknown series." }, { status: 404 });
  }

  const baked = source.episodes[episodeId];
  let prompt: string;
  if (baked) {
    if (baked.childIds.length > 0) {
      return NextResponse.json(
        { error: "This episode cannot branch." },
        { status: 409 },
      );
    }
    prompt = baked.prompt;
  } else if (typeof body?.parent?.prompt === "string") {
    prompt = body.parent.prompt;
  } else {
    return NextResponse.json({ error: "Unknown episode." }, { status: 404 });
  }

  const takenLabels = Array.isArray(body?.takenLabels)
    ? body.takenLabels.filter((label): label is string => typeof label === "string")
    : [];

  try {
    const choices = await suggestChoices({
      seriesTitle: source.title,
      ip: source.ip,
      episodePrompt: prompt,
      takenLabels,
    });
    return NextResponse.json({ choices });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Suggestions failed.",
      },
      { status: 502 },
    );
  }
}

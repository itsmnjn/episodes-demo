import { NextResponse } from "next/server";
import { createSeries } from "@/lib/series";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    premise?: unknown;
    logline?: unknown;
    prompt?: unknown;
    durationSeconds?: unknown;
  } | null;
  const premise = typeof body?.premise === "string" ? body.premise.trim() : "";
  const logline = typeof body?.logline === "string" ? body.logline.trim() : "";
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const durationSeconds = typeof body?.durationSeconds === "number" ? body.durationSeconds : 10;
  if (!premise || !logline || !prompt) {
    return NextResponse.json({ error: "The series needs a premise, a scene, and a prompt." }, { status: 400 });
  }
  if (durationSeconds < 5 || durationSeconds > 15) {
    return NextResponse.json({ error: "Duration is 5 to 15 seconds." }, { status: 400 });
  }
  try {
    const row = await createSeries({ premise, logline, prompt, durationSeconds });
    return NextResponse.json({ seriesId: row.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start the series." },
      { status: 502 },
    );
  }
}

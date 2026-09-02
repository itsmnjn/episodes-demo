import { NextResponse } from "next/server";
import { writeRootPrompt } from "@/lib/generate";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    scene?: unknown;
    durationSeconds?: unknown;
  } | null;
  const scene = typeof body?.scene === "string" ? body.scene.trim() : "";
  const durationSeconds = typeof body?.durationSeconds === "number" ? body.durationSeconds : 10;
  if (!scene) {
    return NextResponse.json({ error: "Pick a scene first." }, { status: 400 });
  }
  try {
    const prompt = await writeRootPrompt({ premise: scene, durationSeconds });
    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not write the prompt." },
      { status: 502 },
    );
  }
}

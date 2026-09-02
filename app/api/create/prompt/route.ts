import { NextResponse } from "next/server";
import { ROOT_MODEL_ID, writeRootPrompt } from "@/lib/generate";
import { timed } from "@/lib/timing";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    premise?: unknown;
    scene?: unknown;
    durationSeconds?: unknown;
  } | null;
  const premise = typeof body?.premise === "string" ? body.premise.trim() : "";
  const scene = typeof body?.scene === "string" ? body.scene.trim() : "";
  const durationSeconds = typeof body?.durationSeconds === "number" ? body.durationSeconds : 10;
  if (!premise || !scene) {
    return NextResponse.json({ error: "Pick a scene first." }, { status: 400 });
  }
  try {
    const prompt = await timed("rootPrompt", { premise: premise.slice(0, 40), model: ROOT_MODEL_ID }, () =>
      writeRootPrompt({ premise, scene, durationSeconds }),
    );
    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not write the prompt." },
      { status: 502 },
    );
  }
}

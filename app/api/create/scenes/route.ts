import { NextResponse } from "next/server";
import { expandPremise } from "@/lib/generate";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { premise?: unknown } | null;
  const premise = typeof body?.premise === "string" ? body.premise.trim() : "";
  if (!premise || premise.length > 2000) {
    return NextResponse.json({ error: "Write a premise first." }, { status: 400 });
  }
  try {
    const scenes = await expandPremise({ premise, count: 3 });
    return NextResponse.json({ scenes });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not expand the premise." },
      { status: 502 },
    );
  }
}

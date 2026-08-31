import { NextResponse } from "next/server";
import { checkEpisodeJob } from "@/lib/generate";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await context.params;
  return NextResponse.json(await checkEpisodeJob(requestId));
}

import { promises as fs } from "node:fs";
import { fal } from "@fal-ai/client";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

const model = openrouter("deepseek/deepseek-v4-flash");
const FAL_ENDPOINT = "minimax/h3-max/image-to-video";

fal.config({ credentials: process.env.FAL_KEY });

// Exported for scripts/bench-suggest-choices.mts, which iterates on this
// prompt and the reasoning config against live latency.
export const CHOICE_SYSTEM = `You write the two tappable choices for a branching first-person AI video story. Each episode is a short first-person POV clip that ends frozen on a cliffhanger frame. The two choices sit on that frame.

A choice is a short first-person move: a verb the viewer can see land in the next few seconds of video. Shipped examples: "Take his hand", "Push his hand away", "Ask who is hurt", "Tell him it's a crash".

Rules:
- 2 to 6 words. Start with the verb.
- Concrete and physical, or a short spoken move ("Ask ...", "Tell him ...").
- Both choices must be playable from the exact frozen frame the episode ends on.
- The two choices pull in clearly different directions: one leans in, one pushes back, or they split the scene two ways.
- Plain text. No trailing punctuation, no quotes, no "I" or "you" prefix, no A/B labels.
- Output exactly two lines: the first choice on line one, the second choice on line two. Nothing else.`;

export function choicePrompt(input: {
  seriesTitle: string;
  ip: string;
  episodePrompt: string;
  takenLabels: string[];
}): string {
  const taken =
    input.takenLabels.length > 0
      ? `\n\nThe viewer already made these moves from this frame. Both of your choices must be clearly different from every one of them — a different action, not a reworded version:\n${input.takenLabels.map((label) => `- ${label}`).join("\n")}`
      : "";
  return `Series: ${input.seriesTitle} (${input.ip}).\n\nThe episode was generated from this prompt. Its last timed block is the frozen frame the viewer is looking at:\n\n${input.episodePrompt}${taken}\n\nWrite the two choices.`;
}

// Two plain lines instead of structured output: this model only honors a
// JSON schema while reasoning, and reasoning costs seconds of latency here
// (see scripts/bench-suggest-choices.mts).
export async function suggestChoices(input: {
  seriesTitle: string;
  ip: string;
  episodePrompt: string;
  takenLabels: string[];
}): Promise<[string, string]> {
  const { text } = await generateText({
    model,
    system: CHOICE_SYSTEM,
    prompt: choicePrompt(input),
    providerOptions: { openrouter: { reasoning: { effort: "none" } } },
  });
  const choices = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (choices.length !== 2) {
    throw new Error(`The choice writer returned ${choices.length} lines.`);
  }
  return [choices[0], choices[1]];
}

const PROMPT_SYSTEM = `You write video-generation prompts for one episode of a branching first-person POV story. The video model (MiniMax H3 Max) receives only your prompt plus one start image: the final frame of the parent episode. It has no memory and no other context. Write the prompt as if this is the first clip the model has ever seen.

You are given the parent episode's prompt and the move the viewer tapped. Write the child episode's prompt: it opens on the parent's final held frame and plays the viewer's move as action now.

Shape, in this order:
1. POV lock, exactly: "First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway."
2. Place and IP: "Photoreal {place from the IP}, {time of day}. {three or four visible things}."
3. First-frame line: "First frame: {who, clothes, pose, place}." Describe only what is visible in the parent prompt's final timed block. It describes the picture; it does not tell a prior story.
4. Timed blocks "[X to Y seconds]" that add up to exactly the requested duration. The first block starts from the first-frame picture. The middle plays the viewer's move as action. The final block ends on a fresh cliffhanger hold and closes with "End on that beat."
5. An "Audio:" line: quoted speech first if anyone speaks, then the room and the foley of the actions you wrote.

Hard rules:
- First-person POV only. People look into the lens. The hero's hands may sit at the bottom of frame. The hero's face never appears.
- Name the IP likeness, clothes, and place in the first-frame line and again inside the timed blocks. Never write "the same".
- Positive only. Write what is in frame and what happens. Banned words: stay, stays, still, remains, quiet, silent, mouth closed, do not, don't, no music, no cuts, without, isn't, aren't.
- No relative language. Banned: after, before, again, already, leftover, previous, last beat, last clip, last time, as before, same as, continue, continues, having just.
- Speech: write says, "exact words" or asks, "exact words" in the timed block and repeat the quote on the Audio line. One speaker per block, one short sentence. The hero's lines are off-camera; quote them too.
- No aspect ratio, resolution, vertical, or duration words anywhere in the prompt.

Example of a finished child prompt:

First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.

Photoreal the Island from Lost, midday. White sand beach, turquoise surf, coconut palms, wet sand at the waterline.
First frame: John Locke from Lost, lean man in his fifties, receding sandy-blond hair, beige linen shirt, khaki pants, stands in the surf looking into the lens, open right hand toward the camera. The hero's hands, white dress-shirt cuffs, at the bottom of frame, sand on the palms.

[0 to 3 seconds] Looking forward at John Locke from Lost, lean man in his fifties, receding sandy-blond hair, beige linen shirt, khaki pants, standing in the surf, looking into the lens, open right hand toward the camera. The hero's hands, white dress-shirt cuffs, swing at the bottom of frame, sand on the palms.

[3 to 7 seconds] The hero's right hand reaches forward and takes John Locke's open right hand. Fingers close around his palm. John Locke walks toward the coconut palms with the hero's hand in his, through shallow surf onto wet white sand. Joined hands at the bottom of frame. The camera walks at walking pace, natural body sway.

[7 to 10 seconds] Reach the coconut palms. John Locke looks into the camera and says, "Someone is hurt in the jungle." Hold on him looking into the lens, his hand around the hero's hand. End on that beat.

Audio: Him, close and clear: "Someone is hurt in the jungle." Surf breaking, wind in palms, wet sand underfoot, water on cuffs.

Output only the prompt text.`;

export async function writeEpisodePrompt(input: {
  seriesTitle: string;
  ip: string;
  parentPrompt: string;
  label: string;
  durationSeconds: number;
}): Promise<string> {
  const { text } = await generateText({
    model,
    system: PROMPT_SYSTEM,
    prompt: `Series: ${input.seriesTitle} (${input.ip}).\nDuration: ${input.durationSeconds} seconds.\n\nParent episode prompt:\n\n${input.parentPrompt}\n\nThe viewer tapped: "${input.label}"\n\nWrite the child episode's prompt.`,
    providerOptions: { openrouter: { reasoning: { effort: "none" } } },
  });
  const prompt = text.trim();
  if (!prompt) throw new Error("The prompt writer returned nothing.");
  return prompt;
}

// The mageic-deploy frames endpoint scales frames to fit max_dimension in
// both directions, upscaling included, and cannot decode at position 1 on
// these encodes. 0.99 with the clips' native 1344 long side returns the
// held frame untouched.
async function extractLastFrame(
  videoUrl: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const response = await fetch(
    `${process.env.BASE_MAGEIC_DEPLOY_API_URL}/api/v1/process/video/frames`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Backend-Signature": process.env.BACKEND_SIGNATURE ?? "",
      },
      body: JSON.stringify({
        video_url: videoUrl,
        positions: [0.99],
        max_dimension: 1344,
      }),
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error(`Could not extract the last frame (${response.status}).`);
  }
  const output = (await response.json()) as {
    frames?: Array<{ data?: string }>;
  };
  const data = output.frames?.[0]?.data;
  const prefix = "data:image/jpeg;base64,";
  if (!data?.startsWith(prefix)) {
    throw new Error("The frame service returned no frame.");
  }
  return Uint8Array.from(Buffer.from(data.slice(prefix.length), "base64"));
}

// The child job needs the parent's last frame on the fal CDN. Baked episodes
// read their jpg from disk; viewer-made episodes get the frame pulled out of
// their rendered clip by mageic-deploy. The client caches the returned URL
// and passes it back on later branches from the same parent.
export async function frameUrlForParent(input: {
  name: string;
  lastFramePath?: string;
  videoUrl?: string;
}): Promise<string> {
  let bytes: Uint8Array<ArrayBuffer>;
  if (input.lastFramePath) {
    bytes = new Uint8Array(await fs.readFile(input.lastFramePath));
  } else if (input.videoUrl) {
    bytes = await extractLastFrame(input.videoUrl);
  } else {
    throw new Error("This episode has no last frame to branch from.");
  }
  return fal.storage.upload(
    new File([bytes], `${input.name}.last.jpg`, { type: "image/jpeg" }),
  );
}

export async function submitEpisodeJob(input: {
  prompt: string;
  imageUrl: string;
  durationSeconds: number;
}): Promise<string> {
  const queued = await fal.queue.submit(FAL_ENDPOINT, {
    input: {
      prompt: input.prompt,
      image_url: input.imageUrl,
      duration: input.durationSeconds,
      resolution: "768P",
      prompt_expansion_mode: "disabled",
    },
  });
  return queued.request_id;
}

export type EpisodeJobStatus =
  | { status: "generating" }
  | { status: "ready"; videoUrl: string }
  | { status: "failed"; error: string };

// A status-check hiccup reads as still generating; a completed job whose
// result cannot be fetched failed for real.
export async function checkEpisodeJob(
  requestId: string,
): Promise<EpisodeJobStatus> {
  let done = false;
  try {
    const status = await fal.queue.status(FAL_ENDPOINT, { requestId });
    done = status.status === "COMPLETED";
  } catch {
    return { status: "generating" };
  }
  if (!done) return { status: "generating" };
  try {
    const result = await fal.queue.result(FAL_ENDPOINT, { requestId });
    const videoUrl = (result.data as { video?: { url?: string } }).video?.url;
    if (!videoUrl) {
      throw new Error("The render finished without a video.");
    }
    return { status: "ready", videoUrl };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "The render failed.",
    };
  }
}

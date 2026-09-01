import { promises as fs } from "node:fs";
import { fal } from "@fal-ai/client";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

// Flash Lite is the default for calls a viewer waits on: choices and the
// next episode. The root writer runs once per series and gets a stronger
// model at a high temperature so rerolls differ; ROOT_MODEL and
// ROOT_TEMPERATURE override them for eval runs.
export const FAST_MODEL_ID = "google/gemini-3.5-flash-lite";
export const CHOICE_MODEL_ID = process.env.CHOICE_MODEL ?? FAST_MODEL_ID;
export const EPISODE_MODEL_ID = process.env.EPISODE_MODEL ?? FAST_MODEL_ID;
export const ROOT_MODEL_ID = process.env.ROOT_MODEL ?? "google/gemini-3.7-flash";
export const ROOT_TEMPERATURE = Number(process.env.ROOT_TEMPERATURE ?? 1.5);
// OpenRouter routes to the cheapest provider by default and only fails over
// on errors, so a slow provider stalls the call. Sort by throughput instead.
const routing = { extraBody: { provider: { sort: "throughput" } } };
const choiceModel = openrouter(CHOICE_MODEL_ID, routing);
const episodeModel = openrouter(EPISODE_MODEL_ID, routing);
const rootModel = openrouter(ROOT_MODEL_ID, routing);
const FAL_ENDPOINT = "minimax/h3-max/image-to-video";
const FAL_ROOT_ENDPOINT = "minimax/h3-max/text-to-video";

// H3 reads a structured three-field document (integrated_multimodal_description /
// overall_soundscape / non_diegetic_music). Two lines of it are product
// invariants and owned by code, not writers: the Shot 1 opener that locks
// first-person POV in one uncut shot, and the no-score declaration that keeps
// the audio diegetic. Writers produce everything between them.
export const PREAMBLE =
  "integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts.";

function assemblePrompt(body: string): string {
  return `${PREAMBLE} ${body}\n\nnon_diegetic_music: None.`;
}

fal.config({ credentials: process.env.FAL_KEY });

// Exported for scripts/bench-suggest-choices.mts, which iterates on this
// prompt and the reasoning config against live latency.
export const CHOICE_SYSTEM = `You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

The two moves take the story in different directions, and they are different kinds of move: not two grabs, and not a grab and a question every time. Offers, bargains, jokes, dares, gifts, accusations, and small acts of sabotage all count.

Each move is one action in 2 to 5 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.`;

export function choicePrompt(input: {
  episodePrompt: string;
  takenLabels: string[];
}): string {
  const taken =
    input.takenLabels.length > 0
      ? `\n\nThese moves were already made from this moment. Both of your moves must be clearly different from every one of them — a different action, not a reworded version:\n${input.takenLabels.map((label) => `- ${label}`).join("\n")}`
      : "";
  return `The scene that just played:\n\n${input.episodePrompt}${taken}\n\nWrite the two moves.`;
}

// Two plain lines at minimal reasoning keeps this call fast; the model
// rejects reasoning "none" outright (see scripts/bench-suggest-choices.mts).
export async function suggestChoices(input: {
  episodePrompt: string;
  takenLabels: string[];
}): Promise<[string, string]> {
  const { text } = await generateText({
    model: choiceModel,
    system: CHOICE_SYSTEM,
    prompt: choicePrompt(input),
    providerOptions: { openrouter: { reasoning: { effort: "minimal" } } },
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

// Shared by both prompt writers: the H3 document format, the invariants,
// and one example.
const SHOT_RULES = `- One continuous shot. No cuts, timestamps, or camera directions.
- The camera is the protagonist's eyes. Only their hands can appear, from the bottom of the frame. Never name them or write "you". They never speak.
- The protagonist acts on people, objects, and the room, never on their own body.
- Only visible characters speak, about ten words per line.
- Write only what can be seen and heard. No feelings or mood words.

Output format:

[the scene as prose. Speakers are tagged at their first line, and spoken words are wrapped: (S1), a low weathered male voice, says <d>[English] line</d>. Quotation marks only for text visible in the scene.]

overall_soundscape: [room tone and the sounds of the actions]

Example:

Looking across wet white sand at John Locke from Lost, a lean man in his fifties with receding sandy-blond hair, a beige linen shirt, and khaki pants, standing in the surf and looking into the camera, his open right hand reaching toward the lens. A right hand in a white dress-shirt cuff enters from the bottom of the frame and takes his hand. He grips it, turns, and walks toward the coconut palms, pulling the camera with him through shallow surf, joined hands at the bottom of the frame. At the treeline he stops, turns back to the camera, and (S1), a low weathered male voice, says <d>[English] Someone is hurt in the jungle.</d> His grip tightens, his eyes locked on the lens.

overall_soundscape: Surf breaking, wind moving through palms, wet sand underfoot, fabric shifting close to the microphone.`;

const PROMPT_SYSTEM = `You write the next scene of a first-person story. You are given the previous scene, the exact frame it ended on, and the protagonist's move.

Open the scene on exactly what the frame shows; if the frame and the previous scene's text differ, the frame is right. The move happens in the first seconds of the scene, as given. If the move is something the protagonist said, treat it as said just before this scene starts: do not write the words, and show the characters reacting to them instead. Then let the world respond to the move, and end the scene at a new point where the protagonist has to act.

${SHOT_RULES}`;

const ROOT_SYSTEM = `You write the opening scene of a first-person video story. The user gives you a premise and a duration. The scene must fit in the duration. The protagonist can move and handle things, but makes no big decision in this scene. End on a cliffhanger. The view is never covered or dark.

Take the tone from the premise. "zoo" is an ordinary day at a zoo, not a horror film; "my roommate is a ghost" is a comedy unless the premise says otherwise. A cliffhanger can be funny, awkward, or strange; it does not have to be dangerous.

${SHOT_RULES}`;
export async function writeEpisodePrompt(input: {
  parentPrompt: string;
  frameUrl: string;
  label: string;
  durationSeconds: number;
}): Promise<string> {
  const { text } = await generateText({
    model: episodeModel,
    system: PROMPT_SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Duration: ${input.durationSeconds} seconds.\n\nPrevious shot's prompt:\n\n${input.parentPrompt}\n\nThe start image is attached. The protagonist's move: "${input.label}"\n\nWrite the shot.`,
          },
          { type: "file", mediaType: "image/jpeg", data: new URL(input.frameUrl) },
        ],
      },
    ],
    providerOptions: { openrouter: { reasoning: { effort: "minimal" } } },
  });
  const body = text.trim();
  if (!body) throw new Error("The prompt writer returned nothing.");
  return assemblePrompt(body);
}

const EXPAND_SYSTEM = `You expand a premise for a first-person video story into several different opening scenes. The user gives you a premise and how many scenes to write.

Each scene is two sentences: what is happening around the protagonist, then the cliffhanger it stops on. Keep everything the premise says; invent the rest. Make the scenes different from each other in what happens, not just in wording. The tone follows the premise: a zoo is a day at the zoo, not a horror film, unless the premise says so. A cliffhanger can be funny, awkward, strange, or dangerous.

The protagonist is never seen and never speaks. Things can be said to them, handed to them, or happen in front of them, but the scene ends before they do anything about it.

Output one scene per line, no numbering, nothing else.

Example, for the premise "zoo":
A capybara has figured out the new lock on its enclosure gate and steps out onto the public path. A keeper in a green polo runs up with both hands raised and asks you not to move.`;

export async function expandPremise(input: {
  premise: string;
  count: number;
}): Promise<string[]> {
  const { text } = await generateText({
    model: rootModel,
    system: EXPAND_SYSTEM,
    prompt: `<premise>${input.premise}</premise>\n<count>${input.count}</count>`,
    temperature: ROOT_TEMPERATURE,
    providerOptions: { openrouter: { reasoning: { effort: "minimal" } } },
  });
  const scenes = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (scenes.length !== input.count) {
    throw new Error(`The expander returned ${scenes.length} scenes, not ${input.count}.`);
  }
  return scenes;
}

export async function writeRootPrompt(input: {
  premise: string;
  durationSeconds: number;
}): Promise<string> {
  const { text } = await generateText({
    model: rootModel,
    system: ROOT_SYSTEM,
    prompt: `<premise>${input.premise}</premise>\n<duration>${input.durationSeconds} seconds</duration>`,
    temperature: ROOT_TEMPERATURE,
    providerOptions: { openrouter: { reasoning: { effort: "minimal" } } },
  });
  const body = text.trim();
  if (!body) throw new Error("The root writer returned nothing.");
  return assemblePrompt(body);
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

export async function submitRootJob(input: {
  prompt: string;
  durationSeconds: number;
}): Promise<string> {
  const queued = await fal.queue.submit(FAL_ROOT_ENDPOINT, {
    input: {
      prompt: input.prompt,
      aspect_ratio: "9:16",
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

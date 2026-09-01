import { promises as fs } from "node:fs";
import { fal } from "@fal-ai/client";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

const model = openrouter("google/gemini-3.5-flash-lite");
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
export const CHOICE_SYSTEM = `You come up with the protagonist's next move in an interactive story. You are given the scene that just played, written as a video shot description. It stopped on an open moment: an offer, a demand, a threat, a discovery.

Propose two moves the protagonist can make right now, from exactly where the scene stopped. A move is a provocation: something done to the situation that forces the world to respond, so the next shot has more happening in it, not less. Both moves further the action. Never a retreat, a wait, or a refusal by doing nothing — a refusal is an act that raises the stakes.

The two moves differ in kind and lead to visibly different next shots. One is the move the scene is begging for; the other is one nobody would expect.

Rules:
- 2 to 6 words. Start with the verb ("Take his hand", "Push the door open").
- Prefer physical moves: something done with the hands to a person, an object, or the room, whose effect shows on screen. The camera only sees outward, so never a move done to the protagonist's own body — no eating, drinking, hiding, stepping back.
- A move can also be a line the protagonist says ("Ask who is in the cold room", "Tell him the apple is poisoned") when the interesting move is a question, a lie, a threat, or a reveal. Use these less often: the viewer never hears the line, only the reaction to it.
- Playable from exactly where the scene stopped, using what is in reach.
- Plain text. No trailing punctuation, no quotes, no A/B labels.
- Output exactly two lines: one move per line. Nothing else.`;

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
    model,
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

// Shared instruction block: the H3 document format, the POV constraint, and
// the official dialogue system. Both prompt writers embed it.
const SHOT_RULES = `The system supplies the document's opening for you: the field label, the shot marker, and a fixed style sentence establishing photoreal live-action, first-person POV, one continuous uncut shot. Your output continues that sentence mid-timeline — begin directly with your first scene sentence. Never write "integrated_multimodal_description", a [Shot] marker, a timestamp, a cut, or any POV or camera-style sentence of your own.

Timeline rules:
- Flowing prose in sequence. Every clause is something a viewer can see or hear. No inner states, no mood words, no talk about the clip or the camera work beyond what the opener establishes.
- Name each visible person with likeness, clothing, and position; people look into the camera. The protagonist is behind the camera and is never named or shown: only a pair of hands may enter the frame from the bottom edge.
- Every action is done with the hands to something in frame — a person, an object, the room — and its effect is visible there. The protagonist's body never receives an action: nothing is eaten, drunk, worn, or brought toward the face.
- Dialogue: only visible characters speak. The protagonist has no lines — never write a voiceover, narration, or off-screen speech for them; characters speak to the camera and the story answers with action. Give each speaker a stable ID at first vocal appearance with a short voice description: (S1), (S2). Spoken words go inline where they happen, wrapped as <d>[English] ...</d> — one short sentence per line, at most about ten words, budgeting roughly 2.5 spoken words per second of clip. Quotation marks are reserved for text physically visible in the scene; never put spoken words in quotation marks.
- The final sentence is a fresh open moment landing as the shot runs out — an offer, a demand, a threat, a discovery. Write nothing after it.
- You are told the duration so you can size how much happens. Never write durations, seconds, aspect ratios, or resolutions.

After the timeline, output a blank line, then exactly one line starting with "overall_soundscape:" — the ambience and physical sounds of the actions you wrote, one to four sentences, with no dialogue in it.

Output only the timeline continuation and the overall_soundscape line.

Example of a finished output (for a different story):

Looking across wet white sand at John Locke from Lost, a lean man in his fifties with receding sandy-blond hair, a beige linen shirt, and khaki pants, standing in the surf and looking into the camera, his open right hand reaching toward the lens. A right hand in a white dress-shirt cuff enters from the bottom of the frame and takes his hand. He grips it, turns, and walks toward the coconut palms, pulling the camera with him through shallow surf, joined hands at the bottom of the frame. At the treeline he stops, turns back to the camera, and (S1), a low weathered male voice, says <d>[English] Someone is hurt in the jungle.</d> His grip tightens, his eyes locked on the lens.

overall_soundscape: Surf breaking, wind moving through palms, wet sand underfoot, fabric shifting close to the microphone.`;

const PROMPT_SYSTEM = `You write the next shot of a first-person POV interactive story. The video model (MiniMax H3) generates picture and sound together from a structured document. It receives only your prompt plus one start image — the final frame of the scene that just played. It has no other context.

You are given the previous shot's prompt, the start image, and the move the protagonist makes now. The previous prompt is narrative context: who people are, what was said, where the scene has momentum. The image is ground truth for what is visible; where they disagree, trust the image. Your shot opens on exactly what the image shows and plays the move as action now.

If the move is something the protagonist says, it was said in the instant before this shot. Never write it as speech — the protagonist has no lines. Open on the characters reacting to those words, and let their reactions and their own lines make what was said unmistakable.

${SHOT_RULES}`;

const ROOT_SYSTEM = `You write the opening shot of a first-person POV interactive story. The video model (MiniMax H3) generates picture and sound together from a structured document, from text alone — there is no image.

You are given a premise. It may be one line or a whole universe — a place, a cast, a tone, rules of what happens here. Everything given is canon: what you show must match it. Never rename its people, contradict its place, replace its characters with invented ones, or flatten its tone. You choose what to show — not everything given must appear in the opening. Invent freely exactly where the premise is silent: the less you are given, the more you invent. Specific beats generic: one vivid stranger with a name-worthy face beats a crowd, one strange detail beats three ordinary ones. Land the opening on pressure: someone or something wants something from the protagonist right now, there is an instrument in the protagonist's hands that can be deployed outward — given, thrown, opened, poured — and the demand is one that several different actions could answer. The scene cannot stay as it is.

${SHOT_RULES}`;
export async function writeEpisodePrompt(input: {
  parentPrompt: string;
  frameUrl: string;
  label: string;
  durationSeconds: number;
}): Promise<string> {
  const { text } = await generateText({
    model,
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

export async function writeRootPrompt(input: {
  premise: string;
  durationSeconds: number;
}): Promise<string> {
  const { text } = await generateText({
    model,
    system: ROOT_SYSTEM,
    prompt: `Duration: ${input.durationSeconds} seconds.\n\nPremise: ${input.premise}\n\nWrite the shot.`,
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

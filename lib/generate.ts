import { fal } from "@fal-ai/client";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

// Flash Lite writes the next episode, the call a viewer waits longest on.
// Choices and roots get Gemini 3.8 Flash: it writes clearly better moves
// for ~1.2s more, and roots run once per series. Each is overridable by
// env for eval runs.
export const FAST_MODEL_ID = "google/gemini-3.5-flash-lite";
export const CHOICE_MODEL_ID = process.env.CHOICE_MODEL ?? "google/gemini-3.8-flash";
export const EPISODE_MODEL_ID = process.env.EPISODE_MODEL ?? FAST_MODEL_ID;
export const ROOT_MODEL_ID = process.env.ROOT_MODEL ?? "google/gemini-3.8-flash";
export const ROOT_TEMPERATURE = Number(process.env.ROOT_TEMPERATURE ?? 1.5);
// OpenRouter routes to the cheapest provider by default and only fails over
// on errors, so a slow provider stalls the call. Sort by throughput instead.
const routing = { extraBody: { provider: { sort: "throughput" } } };
const choiceModel = openrouter(CHOICE_MODEL_ID, routing);
const episodeModel = openrouter(EPISODE_MODEL_ID, routing);
const rootModel = openrouter(ROOT_MODEL_ID, routing);
const titleModel = openrouter(FAST_MODEL_ID, routing);
const FAL_ENDPOINT = "minimax/h3-max-turbo/image-to-video";
const FAL_ROOT_ENDPOINT = "minimax/h3-max-turbo/text-to-video";

// H3 reads a structured three-field document (integrated_multimodal_description /
// overall_soundscape / non_diegetic_music). Code owns the field label and
// shot marker at the front and the no-score declaration at the back; the
// writer opens with the style and the first-person one-shot facts, because
// style follows the premise (photoreal unless it says anime, claymation...).
export const PREAMBLE = "integrated_multimodal_description: [Shot 1]";

function assemblePrompt(body: string): string {
  return `${PREAMBLE} ${body}\n\nnon_diegetic_music: None.`;
}

fal.config({ credentials: process.env.FAL_KEY });

// Exported so the choice eval can record the prompt beside its results.
export const CHOICE_SYSTEM = `You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

The two moves take the story in different directions, and they are different kinds of move: not two grabs, and not a grab and a question every time. Offers, bargains, jokes, dares, gifts, accusations, and small acts of sabotage all count.

Each move is one action in 2 to 5 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.`;

export function choicePrompt(input: { episodePrompt: string }): string {
  return `The scene that just played:\n\n${input.episodePrompt}\n\nWrite the two moves.`;
}

// Two plain lines at minimal reasoning keeps this call fast; Gemini rejects
// reasoning "none" outright.
export async function suggestChoices(input: {
  episodePrompt: string;
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
const SHOT_RULES = `- The first sentence states the style and the shot: "{style}, first-person POV at eye level, one continuous shot, natural head sway, no cuts." The style is photoreal live-action unless the premise or the previous scene says otherwise (anime, claymation, watercolor); a story keeps the style it started with. If the premise makes the protagonist anything other than a person, the first sentence says what they are and where their eyes sit instead of "at eye level": "first-person POV of a house cat, low to the floor".
- One continuous shot. No cuts, timestamps, or camera directions.
- The camera is the protagonist's eyes. Only what they reach with can appear, from the bottom of the frame: hands, or paws if they are an animal. Never name them or write "you". They never speak.
- The protagonist acts on people, objects, and the room, never on their own body.
- Only visible characters speak, about ten words per line.
- Write only what can be seen and heard. No feelings or mood words.

Output format:

[Style], first-person POV [at eye level, or of what the protagonist is and where their eyes sit], one continuous shot, natural head sway, no cuts. [the scene as prose. Speakers are tagged at their first line, and spoken words are wrapped: (S1), a low weathered male voice, says <d>[English] line</d>. Quotation marks only for text visible in the scene.]

overall_soundscape: [room tone and the sounds of the actions]

Example:

Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across wet white sand at John Locke from Lost, a lean man in his fifties with receding sandy-blond hair, a beige linen shirt, and khaki pants, standing in the surf and looking into the camera, his open right hand reaching toward the lens. A right hand in a white dress-shirt cuff enters from the bottom of the frame and takes his hand. He grips it, turns, and walks toward the coconut palms, pulling the camera with him through shallow surf, joined hands at the bottom of the frame. At the treeline he stops, turns back to the camera, and (S1), a low weathered male voice, says <d>[English] Someone is hurt in the jungle.</d> His grip tightens, his eyes locked on the lens.

overall_soundscape: Surf breaking, wind moving through palms, wet sand underfoot, fabric shifting close to the microphone.`;

// One episode writer, two input shapes: a premise for the opening scene, or
// the previous scene plus its held frame and the protagonist's move.
const EPISODE_SYSTEM = `You write one scene of a first-person video story. The user gives you the story's premise, and either an opening scene written from it, or the previous scene, the frame it ended on, and the protagonist's move. Everything the premise says holds in every scene. The scene must fit in the duration. End on a cliffhanger. The view is never covered or dark.

If you are given a frame, the scene opens on exactly what it shows; if the frame and the previous scene's text differ, the frame is right. The move happens in the first seconds, as given. If the move is something the protagonist said, it was said just before this scene starts: do not write the words; show the characters reacting to them.

${SHOT_RULES}`;
export async function writeEpisodePrompt(input: {
  premise: string;
  parentPrompt: string;
  frameUrl: string;
  label: string;
  durationSeconds: number;
}): Promise<string> {
  const { text } = await generateText({
    model: episodeModel,
    system: EPISODE_SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `<premise>${input.premise}</premise>\n<previous_scene>\n${input.parentPrompt}\n</previous_scene>\n<move>${input.label}</move>\n<duration>${input.durationSeconds} seconds</duration>`,
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

Each scene is two sentences: what is happening around the protagonist, then the cliffhanger it stops on. Keep everything the premise says; invent the rest. If the premise names a style, such as anime or claymation, every scene says so. Make the scenes different from each other in what happens, not just in wording. The tone follows the premise: a zoo is a day at the zoo, not a horror film, unless the premise says so. A cliffhanger can be funny, awkward, strange, or dangerous.

The protagonist is never seen and never speaks. Things can be said to them, handed to them, or happen in front of them, but the scene ends before they do anything about it. Do not end a scene with a character telling the protagonist what to do.

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

// The scene is one the expander wrote from the premise. Filming the premise
// as written passes the same text as both.
export async function writeRootPrompt(input: {
  premise: string;
  scene: string;
  durationSeconds: number;
}): Promise<string> {
  const scene = input.scene === input.premise ? "" : `\n<scene>${input.scene}</scene>`;
  const { text } = await generateText({
    model: rootModel,
    system: EPISODE_SYSTEM,
    prompt: `<premise>${input.premise}</premise>${scene}\n<duration>${input.durationSeconds} seconds</duration>`,
    temperature: ROOT_TEMPERATURE,
    providerOptions: { openrouter: { reasoning: { effort: "minimal" } } },
  });
  const body = text.trim();
  if (!body) throw new Error("The root writer returned nothing.");
  return assemblePrompt(body);
}

const TITLE_SYSTEM = `You title a first-person video story. The user gives you the premise, the opening scene in two sentences, and the first episode in full. Write the title.

The title says what happens in the episode, in three to six plain words: "Waiter Drops the Soup", "Dog Loose on the Ferry". It is literal, in the words the scene uses, and never says you, I, or me. No wordplay, no metaphor, nothing that reads like the name of a show. Title case, plain text, no quotation marks, no punctuation at the end. Output the title and nothing else.`;

// Written once per series when it is filmed, from what the creator approved:
// the premise, the scene they picked, and the prompt as they left it.
export async function writeTitle(input: {
  premise: string;
  scene: string;
  prompt: string;
}): Promise<string> {
  const { text } = await generateText({
    model: titleModel,
    system: TITLE_SYSTEM,
    prompt: `<premise>${input.premise}</premise>\n<scene>${input.scene}</scene>\n<episode>\n${input.prompt}\n</episode>`,
    providerOptions: { openrouter: { reasoning: { effort: "minimal" } } },
  });
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length !== 1) {
    throw new Error(`The title writer returned ${lines.length} lines.`);
  }
  return lines[0];
}

// The mageic-deploy frames endpoint scales frames to fit max_dimension in
// both directions, upscaling included, and cannot decode at position 1 on
// these encodes. 0.99 with the clips' native 1344 long side returns the
// held frame untouched.
export async function extractLastFrame(
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
    const { video, ...meta } = result.data as { video?: { url?: string }; [key: string]: unknown };
    console.log(`fal result request=${requestId} ${JSON.stringify(meta)}`);
    const videoUrl = video?.url;
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

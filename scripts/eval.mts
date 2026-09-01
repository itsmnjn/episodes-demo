// Eval runs for the whole pipeline or one piece of it. Every run prints as
// it goes and writes report.md + run.json under evals/<piece>/<stamp>-<model>/,
// rewritten after every premise.
//
//   bun run eval pipeline                        # expand → episode → choices, on the battery
//   bun run eval pipeline zoo dentist --n 5
//   bun run eval expander "japanese game show"   # scenes only
//   bun run eval episode zoo                     # expand, then write an episode per scene
//   bun run eval choices --n 3                   # move pairs on the latest pipeline/episode run
//   bun run eval next the-invitation             # next episodes on baked leaves, spoken moves included
//
//   flags: --from premises.txt  --n  --duration  --fixtures run.json
//          --model  --choice-model  --episode-model  --temperature

import { parseArgs } from "node:util";
import type { EvalArgs } from "./eval/shared";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    from: { type: "string" },
    n: { type: "string" },
    duration: { type: "string", default: "10" },
    fixtures: { type: "string" },
    model: { type: "string" },
    "choice-model": { type: "string" },
    "episode-model": { type: "string" },
    temperature: { type: "string" },
  },
});

// The library reads its model config from the environment at import time,
// so set it before any eval module imports the library.
if (values.model) process.env.ROOT_MODEL = values.model;
if (values["choice-model"]) process.env.CHOICE_MODEL = values["choice-model"];
if (values["episode-model"]) process.env.EPISODE_MODEL = values["episode-model"];
if (values.temperature) process.env.ROOT_TEMPERATURE = values.temperature;

const [piece, ...rest] = positionals;
const args: EvalArgs = {
  positionals: rest,
  from: values.from,
  n: values.n ? Number(values.n) : undefined,
  durationSeconds: Number(values.duration),
  fixtures: values.fixtures,
};

switch (piece) {
  case "pipeline":
  case "expander":
  case "episode": {
    const { runPipeline } = await import("./eval/pipeline");
    await runPipeline(piece, args);
    break;
  }
  case "choices": {
    const { runChoices } = await import("./eval/choices");
    await runChoices(args);
    break;
  }
  case "next": {
    const { runNext } = await import("./eval/next");
    await runNext(args);
    break;
  }
  default:
    throw new Error("usage: bun run eval <pipeline|expander|episode|choices|next> [premises...] [flags]");
}

// Expand a premise into different opening scenes.
//
//   bun run expansions "japanese game show"
//   bun run expansions "zoo" --n 8

import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    n: { type: "string", default: "5" },
    model: { type: "string" },
    temperature: { type: "string" },
  },
});

// The library reads its model config from the environment at import time.
if (values.model) process.env.ROOT_MODEL = values.model;
if (values.temperature) process.env.ROOT_TEMPERATURE = values.temperature;
const { expandPremise } = await import("../lib/generate");

const premise = positionals.join(" ").trim();
if (!premise) throw new Error('usage: bun run expansions "premise" [--n 5] [--model ...]');

const scenes = await expandPremise({ premise, count: Number(values.n) });
console.log(scenes.map((scene, i) => `${i + 1}. ${scene}`).join("\n"));

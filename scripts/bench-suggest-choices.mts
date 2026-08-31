// Latency and reliability benchmark for the suggest-choices call.
//
//   npm run bench:choices
//   TRIALS=6 VARIANT=text/none npm run bench:choices
//
// Each variant pairs a reasoning effort with an output strategy and runs
// every fixture TRIALS times against the live model. Edit CHOICE_SYSTEM in
// lib/generate.ts or add a variant below, rerun, and compare the tables.

import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText, Output } from "ai";
import { z } from "zod";
import { CHOICE_SYSTEM, choicePrompt } from "../lib/generate";

const MODEL_ID = "deepseek/deepseek-v4-flash";
const TRIALS = Number(process.env.TRIALS ?? 3);

const FIXTURES = [
  {
    name: "shore-1-taken",
    seriesTitle: "The Shore",
    ip: "Lost",
    takenLabels: ["Take his hand"],
    episodePrompt:
      "First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.\n\nPhotoreal the Island from Lost, midday. White sand beach, turquoise surf, coconut palms, wet sand at the waterline.\n\n[0 to 10 seconds] John Locke from Lost, lean man in his fifties, receding sandy-blond hair, beige linen shirt, khaki pants, stands in the surf looking into the lens, open right hand toward the camera. Hold on him looking into the lens. End on that beat.",
  },
  {
    name: "office-2-taken",
    seriesTitle: "Closing Time",
    ip: "The Office",
    takenLabels: ["Open the envelope", "Hand it back to her"],
    episodePrompt:
      "First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.\n\nPhotoreal Dunder Mifflin office from The Office, evening. Beige cubicles, glowing monitors, drop ceiling, dark windows.\n\n[0 to 10 seconds] Pam Beesly from The Office, fair skin, brown hair pulled back, grey cardigan, stands at reception holding out a sealed manila envelope toward the camera, eyes wide. Hold on her holding out the envelope. End on that beat.",
  },
];

const choiceSchema = z.object({ choices: z.array(z.string().min(1)).length(2) });

type Effort = "none" | "minimal" | "low";

type Trial = {
  ok: boolean;
  ms: number;
  choices: string[];
  reasoningTokens: number;
  error?: string;
  violations: string[];
};

function ruleViolations(choices: string[], takenLabels: string[]): string[] {
  const violations: string[] = [];
  for (const choice of choices) {
    const words = choice.split(/\s+/).length;
    if (words < 2 || words > 6) violations.push(`"${choice}": ${words} words`);
    if (/[.!?"]$/.test(choice)) violations.push(`"${choice}": trailing punctuation`);
    for (const taken of takenLabels) {
      if (choice.toLowerCase() === taken.toLowerCase()) {
        violations.push(`"${choice}": repeats taken label`);
      }
    }
  }
  if (choices.length === 2 && choices[0].toLowerCase() === choices[1].toLowerCase()) {
    violations.push("both choices identical");
  }
  return violations;
}

type Variant = {
  name: string;
  run: (fixture: (typeof FIXTURES)[number]) => Promise<Trial>;
};

function objectVariant(input: {
  name: string;
  effort: Effort;
  requireParameters?: boolean;
}): Variant {
  const model = input.requireParameters
    ? openrouter(MODEL_ID, {
        extraBody: { provider: { require_parameters: true } },
      })
    : openrouter(MODEL_ID);
  return {
    name: input.name,
    run: async (fixture) => {
      const start = Date.now();
      try {
        const result = await generateText({
          model,
          output: Output.object({ schema: choiceSchema }),
          system: CHOICE_SYSTEM,
          prompt: choicePrompt(fixture),
          providerOptions: {
            openrouter: { reasoning: { effort: input.effort } },
          },
        });
        const choices = result.output.choices.map((choice) => choice.trim());
        return {
          ok: true,
          ms: Date.now() - start,
          choices,
          reasoningTokens: result.usage.outputTokenDetails?.reasoningTokens ?? 0,
          violations: ruleViolations(choices, fixture.takenLabels),
        };
      } catch (error) {
        return {
          ok: false,
          ms: Date.now() - start,
          choices: [],
          reasoningTokens: 0,
          error: error instanceof Error ? error.name : String(error),
          violations: [],
        };
      }
    },
  };
}

function textVariant(input: { name: string; effort: Effort }): Variant {
  return {
    name: input.name,
    run: async (fixture) => {
      const start = Date.now();
      try {
        const result = await generateText({
          model: openrouter(MODEL_ID),
          system: CHOICE_SYSTEM,
          prompt: choicePrompt(fixture),
          providerOptions: {
            openrouter: { reasoning: { effort: input.effort } },
          },
        });
        const choices = result.text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        const ok = choices.length === 2;
        return {
          ok,
          ms: Date.now() - start,
          choices,
          reasoningTokens: result.usage.outputTokenDetails?.reasoningTokens ?? 0,
          error: ok ? undefined : `${choices.length} lines`,
          violations: ok ? ruleViolations(choices, fixture.takenLabels) : [],
        };
      } catch (error) {
        return {
          ok: false,
          ms: Date.now() - start,
          choices: [],
          reasoningTokens: 0,
          error: error instanceof Error ? error.name : String(error),
          violations: [],
        };
      }
    },
  };
}

const ALL_VARIANTS: Variant[] = [
  objectVariant({ name: "object/low", effort: "low" }),
  objectVariant({ name: "object/minimal", effort: "minimal" }),
  objectVariant({ name: "object/none", effort: "none" }),
  objectVariant({ name: "object/none+rp", effort: "none", requireParameters: true }),
  textVariant({ name: "text/none (prod)", effort: "none" }),
];

const VARIANTS = process.env.VARIANT
  ? ALL_VARIANTS.filter((variant) => variant.name.startsWith(process.env.VARIANT!))
  : ALL_VARIANTS;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

for (const variant of VARIANTS) {
  const trials: Trial[] = [];
  for (const fixture of FIXTURES) {
    for (let i = 0; i < TRIALS; i++) {
      trials.push(await variant.run(fixture));
    }
  }
  const okTrials = trials.filter((trial) => trial.ok);
  const latencies = okTrials.map((trial) => trial.ms);
  const violations = okTrials.flatMap((trial) => trial.violations);
  const errors = trials
    .filter((trial) => !trial.ok)
    .map((trial) => trial.error);
  console.log(`\n${variant.name}`);
  console.log(
    `  ok ${okTrials.length}/${trials.length}` +
      (latencies.length > 0
        ? `  median ${median(latencies)}ms  min ${Math.min(...latencies)}ms  max ${Math.max(...latencies)}ms` +
          `  reasoning tokens ${Math.round(okTrials.reduce((sum, trial) => sum + trial.reasoningTokens, 0) / okTrials.length)}`
        : ""),
  );
  if (errors.length > 0) console.log(`  errors: ${errors.join(", ")}`);
  if (violations.length > 0) console.log(`  rule violations: ${violations.join("; ")}`);
  const sample = okTrials[0];
  if (sample) console.log(`  sample: ${sample.choices.join(" | ")}`);
}

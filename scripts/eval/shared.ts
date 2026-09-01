import { promises as fs } from "node:fs";
import path from "node:path";

export type EvalArgs = {
  positionals: string[];
  from?: string;
  n?: number;
  durationSeconds: number;
  fixtures?: string;
};

// The battery: short premises the way a creator would type them.
export const DEFAULT_PREMISES = [
  "zoo",
  "dentist",
  "first day at hogwarts",
  "my roommate is a ghost",
  "blind date",
  "airport security",
];

// Premises come from positionals, or one per line from --from, or the battery.
export async function resolvePremises(args: EvalArgs): Promise<string[]> {
  const source = args.from
    ? (await fs.readFile(args.from, "utf8")).split("\n")
    : args.positionals.length > 0
      ? args.positionals
      : DEFAULT_PREMISES;
  return source.map((premise) => premise.trim()).filter((premise) => premise.length > 0);
}

export function stats(values: number[]): string {
  if (values.length === 0) return "n/a";
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return `median ${median}ms, min ${sorted[0]}ms, max ${sorted[sorted.length - 1]}ms`;
}

export function pct(value: number, total: number): string {
  return total === 0 ? "n/a" : `${Math.round((100 * value) / total)}%`;
}

export async function runDir(piece: string, startedAt: Date, modelId: string): Promise<string> {
  const stamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const slug = modelId.split("/").pop() ?? modelId;
  const dir = path.join("evals", piece, `${stamp}-${slug}`);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function writeRun(dir: string, report: string, data: unknown): Promise<void> {
  await fs.writeFile(path.join(dir, "report.md"), report);
  await fs.writeFile(path.join(dir, "run.json"), JSON.stringify(data, null, 2));
}

// Newest run.json across the given eval pieces, by directory name (timestamped).
export async function latestRun(pieces: string[]): Promise<string> {
  const runs: string[] = [];
  for (const piece of pieces) {
    const dir = path.join("evals", piece);
    try {
      for (const name of await fs.readdir(dir)) runs.push(path.join(dir, name));
    } catch {
      // No runs for this piece yet.
    }
  }
  runs.sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
  if (runs.length === 0) throw new Error(`No runs under evals/{${pieces.join(",")}} to use as fixtures.`);
  return path.join(runs[runs.length - 1], "run.json");
}

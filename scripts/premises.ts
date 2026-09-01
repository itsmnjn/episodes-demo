import { promises as fs } from "node:fs";

// The eval battery: short premises the way a creator would type them.
export const DEFAULT_PREMISES = [
  "zoo",
  "dentist",
  "first day at hogwarts",
  "my roommate is a ghost",
  "blind date",
  "airport security",
];

// Premises come from positional args, or one per line from --from, or the
// battery when neither is given.
export async function resolvePremises(
  positionals: string[],
  from: string | undefined,
): Promise<string[]> {
  const source = from
    ? (await fs.readFile(from, "utf8")).split("\n")
    : positionals.length > 0
      ? positionals
      : DEFAULT_PREMISES;
  return source.map((premise) => premise.trim()).filter((premise) => premise.length > 0);
}

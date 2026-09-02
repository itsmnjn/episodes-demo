// Where script renders land: out/<piece>/<name>-<stamp>/.

export const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

export function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "premise";
}

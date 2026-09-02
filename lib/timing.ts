// One line per pipeline step on the server log, so latency can be read off
// it: `timing step=episodePrompt ms=1834 outcome=ok series="zoo" episode="0a"`.
// Values are JSON-quoted so a line splits on spaces.
type Tags = Record<string, string | number | undefined>;

export function logTiming(step: string, ms: number, outcome: string, tags: Tags) {
  const rest = Object.entries(tags)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${JSON.stringify(String(value))}`)
    .join(" ");
  console.log(`timing step=${step} ms=${ms} outcome=${outcome} ${rest}`.trimEnd());
}

export async function timed<T>(step: string, tags: Tags, work: () => Promise<T>): Promise<T> {
  const started = Date.now();
  let outcome = "ok";
  try {
    return await work();
  } catch (error) {
    outcome = "failed";
    throw error;
  } finally {
    logTiming(step, Date.now() - started, outcome, tags);
  }
}

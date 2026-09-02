// Blob store usage, total and per series. Read-only.
//
//   bun run blob:usage
import { list } from "@vercel/blob";

let cursor: string | undefined;
let total = 0;
let count = 0;
const perSeries: Record<string, number> = {};
do {
  const page = await list({ cursor, limit: 1000 });
  for (const blob of page.blobs) {
    total += blob.size;
    count++;
    const seriesId = blob.pathname.split("/")[1] ?? blob.pathname;
    perSeries[seriesId] = (perSeries[seriesId] ?? 0) + blob.size;
  }
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

console.log(`${count} blobs, ${(total / 1e6).toFixed(1)} MB`);
for (const [seriesId, bytes] of Object.entries(perSeries).sort((a, b) => b[1] - a[1])) {
  console.log(`${(bytes / 1e6).toFixed(1).padStart(8)} MB  ${seriesId}`);
}
process.exit(0);

import Link from "next/link";
import { loadCatalog, loadSeries } from "@/lib/content";
import { Player } from "./player";

export function generateStaticParams() {
  return loadCatalog().map((card) => ({ seriesId: card.id }));
}

export default async function WatchPage({
  params,
}: PageProps<"/watch/[seriesId]">) {
  const { seriesId } = await params;
  const series = loadSeries(seriesId);

  if (!series) {
    return (
      <main className="grid min-h-dvh place-items-center bg-black px-6 text-center">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl">
            This path isn&apos;t here.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm text-mute">
            Back to shelf
          </Link>
        </div>
      </main>
    );
  }

  return <Player series={series} />;
}

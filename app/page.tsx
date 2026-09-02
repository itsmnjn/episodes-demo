import Link from "next/link";
import { listSeries } from "@/lib/series";

export const dynamic = "force-dynamic";

export default async function ShelfPage() {
  const cards = await listSeries();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#2a1d14_0%,transparent_55%)]" />
      <div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />

      <header className="relative flex items-baseline justify-between px-6 pt-8 pb-4 sm:px-10">
        <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
          Episodes
        </p>
        <Link href="/create" className="text-sm text-mute transition hover:text-paper">
          Create a series
        </Link>
      </header>

      <section className="relative px-6 pb-16 sm:px-10">
        <p className="mb-5 text-xs font-medium tracking-[0.22em] text-mute uppercase">
          Series
        </p>
        {cards.length === 0 ? (
          <p className="text-sm text-mute">
            Nothing on the shelf yet.{" "}
            <Link href="/create" className="text-paper underline">
              Create the first series.
            </Link>
          </p>
        ) : null}
        <div className="flex gap-5 overflow-x-auto pb-4">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/watch/${card.id}`}
              className="group w-[44vw] max-w-56 min-w-40 shrink-0 sm:w-52"
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-sm bg-card shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
                {card.posterUrl ? (
                  <img
                    src={card.posterUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-b from-[#2c2118] to-[#0c0b0a]" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  {card.rootStatus !== "ready" ? (
                    <p className="animate-pulse text-[10px] tracking-[0.18em] text-ember uppercase">
                      {card.rootStatus === "failed" ? "Render failed" : "Filming"}
                    </p>
                  ) : null}
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl leading-tight">
                    {card.title}
                  </h2>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mute">
                {card.logline}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

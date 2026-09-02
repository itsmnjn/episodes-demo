# Episodes

Branching first-person AI video stories. Watch a ten-second POV clip, tap one of two moves on its frozen last frame, watch the next one. Anyone can create a series from a one-line premise, and the tree grows where viewers walk.

The app is Next.js on Vercel: `bun run dev`. Series live in Postgres (Neon) and clips in Vercel Blob; `lib/series.ts` reads and writes them. The pipeline is in `lib/generate.ts`: a premise expander, one episode writer, and a choice writer on OpenRouter, rendered on fal MiniMax H3 Max (text-to-video for the opening, image-to-video from the held frame for everything after). [CLAUDE.md](CLAUDE.md) describes the pipeline; [docs/product.md](docs/product.md) is the product spec.

Env comes from Vercel: `vercel env pull` writes `.env.local` with `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `OPENROUTER_API_KEY`, and `FAL_KEY`. `bun run db:push` creates or updates the tables.

- `/create` is the creation surface: premise, three openings, one editable prompt, film it.
- `bun run expansions "zoo"` expands a premise into five different opening scenes.
- `bun run root "zoo"` expands the premise into three scenes and writes a prompt for each. `--render` renders one into a stamped folder under `out/root/` (`--pick 2` to choose), `--direct` films the premise as written.
- `bun run hop the-invitation 0aa` renders one more episode off a landed one into a stamped folder under `out/hop/` (`--move "..."` to choose the move). Scripts never write to the database.
- `bun run eval <pipeline|expander|episode|choices|next>` runs an eval on the whole pipeline or one piece; reports land under `evals/`. Flags are in `scripts/eval.mts`.

# Episodes

Branching first-person AI video stories. Watch a ten-second POV clip, tap one of two moves on its frozen last frame, watch the next one.

The watch surface is the Next.js app: `bun run dev`. The creation pipeline is in `lib/generate.ts`: a premise expander, one episode writer, and a choice writer on OpenRouter, rendered on fal MiniMax H3 Max (text-to-video for the opening, image-to-video from the held frame for everything after). [CLAUDE.md](CLAUDE.md) describes the pipeline; [docs/product.md](docs/product.md) is the watch spec.

Needs `.env.local` with `OPENROUTER_API_KEY` and `FAL_KEY`.

- `bun run expansions "zoo"` expands a premise into five different opening scenes.
- `bun run root "zoo"` expands the premise into three scenes and writes a prompt for each. `--render` renders one (`--pick 2` to choose), `--direct` films the premise as written.
- `bun run hop the-invitation 0aa` extends a baked leaf by one episode (`--move "..."` to choose the move).
- `bun run eval <pipeline|expander|episode|choices|next>` runs an eval on the whole pipeline or one piece; reports land under `evals/`. Flags are in `scripts/eval.mts`.

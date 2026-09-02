# Episodes demo

Branching first-person AI video stories. Two surfaces, specced in [docs/product.md](docs/product.md): the watch surface and the create page. Everything that writes or renders an episode is in `lib/generate.ts`; everything that reads or saves a series is in `lib/series.ts`.

## Product

- Episode: one continuous first-person clip that ends on a cliffhanger, with two choices on the frozen last frame. Length is per episode, minimum 5s, default 10s.
- Series: a tree of episodes rooted at `0`; children append a letter in the order they were made. Creators author only the opening. Every landed episode has two written moves; a move whose child does not exist yet generates it on demand, so the tree grows where viewers walk. The same move from the same episode is the same child.
- The protagonist is the camera: never seen, never named, never speaks on screen. A choice can be a line the protagonist says; it is treated as said between clips, and the next episode opens on the reaction.

## Pipeline (`lib/generate.ts`)

- `expandPremise`: one call turns a short premise into N different opening scenes, two sentences each, ending on a cliffhanger. Variety lives here; resampling the episode writer collapses to one scene per premise.
- `writeRootPrompt` / `writeEpisodePrompt`: one episode writer (`EPISODE_SYSTEM`) that always gets the series premise, plus either the expanded scene or the previous scene with its held frame as an image and the move. The premise is where facts about the protagonist live (a cat, a ghost); the expander describes what happens around them. Output is the H3 document; code prepends the field label and `[Shot 1]` and appends `non_diegetic_music: None.`. The writer's first sentence states the style and the first-person one-shot facts. Style is photoreal unless the premise says otherwise (anime, claymation); it propagates down the tree through the previous scene's prompt and its frame.
- `suggestChoices`: two moves of different kinds, one action each in 2 to 5 words starting with a verb, physical or spoken.
- Rendering: root on `minimax/h3-max/text-to-video` at 9:16; children on `minimax/h3-max/image-to-video` from the parent's last frame; `prompt_expansion_mode: "disabled"`. Reference-to-video is not used for children: a reference frame is a soft attractor and broke both POV and the seam when tested.
- Models on OpenRouter, routed by throughput: `google/gemini-3.8-flash` for roots, the expander, and choices; `google/gemini-3.5-flash-lite` for next episodes. Override with `ROOT_MODEL`, `CHOICE_MODEL`, `EPISODE_MODEL`, `ROOT_TEMPERATURE`.

## Data (`lib/series.ts`)

- Postgres on Neon via Drizzle (`lib/db/schema.ts`): `series` and `episodes`, keyed by (series, id). Clips and last frames in Vercel Blob at `series/{seriesId}/{episodeId}.mp4` and `.last.jpg`. Both are provisioned from the Vercel project; `vercel env pull` gets the keys.
- An episode row is inserted when its render is submitted (`createSeries`, `startBranch`) and finished by `settleEpisode` when whoever is polling finds the clip landed: the clip and its last frame move to Blob, the two choices are written, status goes to ready.
- Schema changes go through `bun run db:push`, which is the user's to run.

## Prompts

- A writer prompt is a short brief plus a list of invariants, with the output format shown as a template and one example. No product mechanics reach a model. The user message is the creator's inputs, tagged (`<premise>`, `<scene>`, `<duration>`, `<previous_scene>`, `<move>`), and nothing else.
- A video prompt is prose for one shot: no timestamps, no camera directions, no "you", dialogue inline as `(S1), a voice, says <d>[English] ...</d>`, quotation marks only for text visible in the scene, then one `overall_soundscape:` line with no dialogue in it.
- Do not hand-write video prompts. Change a writer and run its eval.

## Scripts and evals

- `bun run expansions "zoo"` expands a premise into scenes and prints them. `bun run root "zoo"` expands and writes a prompt for each scene; `--render` renders all of them in parallel to `out/root/<premise>-<stamp>/`, `--direct` skips the expander. `bun run hop <series> <episode>` extends an episode by one, to `out/hop/<series>-<episode>-<stamp>/`. Each run folder has the clip and the prompts beside it. The scripts are the test bench: they read the database and never write it. Series are created in the app. Arguments are positionals and `--flags`, never env vars; model overrides are `--model` flags, which set the env the library reads at import.
- Evals are separate from the pipeline commands: `bun run eval pipeline` (expand → episode → choices), `eval expander`, `eval episode`, `eval choices` (pairs on the latest pipeline or episode run), `eval next` (next episodes on the database's leaves, with two fixed spoken moves per leaf). Each writes `report.md` and `run.json` under `evals/<piece>/<stamp>-<model>/`, rewritten after every premise. The flags catch rule breaks; they reward blandness, so read the reports.
- The four original series were migrated from `content/` by `scripts/migrate-baked.mts`. Their prompts predate the current format; they are data, not examples.

## Rules

- `AGENTS.md` is a symlink to this file.
- Keep prompts short and plain. When a rule keeps needing exceptions, find the one thing the exceptions are instances of instead of patching the sentence.

# Episodes demo

Branching first-person AI video stories. Two surfaces: the watch surface (spec: [docs/product.md](docs/product.md)) and the creation surface, in progress. Everything that writes or renders an episode is in `lib/generate.ts`.

## Product

- Episode: one continuous first-person clip that ends on a cliffhanger, with two choices on the frozen last frame. Length is per episode, minimum 5s, default 10s.
- Series: a tree of episodes rooted at `0`; children append `a` or `b`. Baked series ship whole. At a leaf, the viewer's move generates the next episode on demand, so creators author the opening and the tree grows where viewers walk.
- The protagonist is the camera: never seen, never named, never speaks on screen. A choice can be a line the protagonist says; it is treated as said between clips, and the next episode opens on the reaction.

## Pipeline (`lib/generate.ts`)

- `expandPremise`: one call turns a short premise into N different opening scenes, two sentences each, ending on a cliffhanger. Variety lives here; resampling the episode writer collapses to one scene per premise.
- `writeRootPrompt` / `writeEpisodePrompt`: one episode writer (`EPISODE_SYSTEM`) with two inputs, a premise or the previous scene plus its held frame as an image and the move. Output is the H3 document; code prepends the `[Shot 1]` POV opener and appends `non_diegetic_music: None.`.
- `suggestChoices`: two moves of different kinds, one action each in 2 to 5 words starting with a verb, physical or spoken.
- Rendering: root on `minimax/h3-max/text-to-video` at 9:16; children on `minimax/h3-max/image-to-video` from the parent's last frame; `prompt_expansion_mode: "disabled"`. Reference-to-video is not used for children: a reference frame is a soft attractor and broke both POV and the seam when tested.
- Models on OpenRouter, routed by throughput: `google/gemini-3.7-flash` for roots, the expander, and choices; `google/gemini-3.5-flash-lite` for next episodes. Override with `ROOT_MODEL`, `CHOICE_MODEL`, `EPISODE_MODEL`, `ROOT_TEMPERATURE`.

## Prompts

- A writer prompt is a short brief plus a list of invariants, with the output format shown as a template and one example. No product mechanics reach a model. The user message is the creator's inputs, tagged (`<premise>`, `<duration>`, `<previous_scene>`, `<move>`), and nothing else.
- A video prompt is prose for one shot: no timestamps, no camera directions, no "you", dialogue inline as `(S1), a voice, says <d>[English] ...</d>`, quotation marks only for text visible in the scene, then one `overall_soundscape:` line with no dialogue in it.
- Do not hand-write video prompts. Change a writer and run its eval.

## Scripts and evals

- `bun run root` writes and renders an opening episode from `PREMISE` (or `PREMISE_FILE`). `bun run hop` extends a baked leaf by one episode. Both print every prompt as it lands.
- `bun run roots`, `bun run expansions`, `bun run choices`, `bun run episodes` are eval runs. Each writes `report.md` and `run.json` under `evals/<kind>/<stamp>-<model>/`, rewritten after every premise. The flags catch rule breaks; they reward blandness, so read the reports.
- Content: `content/catalog.json` is the shelf; `content/series/{id}/series.json` plus `media/` is a series. The baked series predate the current prompt format; their prompts are data, not examples.

## Rules

- `AGENTS.md` is a symlink to this file.
- Keep prompts short and plain. When a rule keeps needing exceptions, find the one thing the exceptions are instances of instead of patching the sentence.

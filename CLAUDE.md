# Episodes demo

Branching first-person AI video stories. Watch surface is the product. Series creation is an agent skill, not UI. User-facing spec: [docs/product.md](docs/product.md).

## Product

- Episode: first-person POV clip, cliffhanger, two tappable branches. Length is per episode, minimum 5s, default TBD.
- Series: full binary tree, default depth 3 (15 episodes). Path ids: `0`, `0a`, `0b`, `0aa`, …
- Style lock is loose. POV is the only hard lock. Use popular IP for likeness. No reference images.
- Prompts: timed blocks that add to that episode's `durationSeconds`, directed audio, what is in frame. No negatives. No aspect ratio, vertical, or duration in the prompt. `9:16` and `duration` are API params.

## Layout

- `.cursor/skills/write-series-draft/` — story tree only (scenes, choices). Approve before generating.
- `.cursor/skills/create-series/` — prompt, render, validate a series
- `content/catalog.json` — Netflix shelf (create when the first series exists)
- `content/series/{id}/` — `series.json` + `media/`

## Rules

- Read `.cursor/skills/create-series/SKILL.md` before creating or extending a series.
- Generate with fal MCP, model `minimax/h3-max` only. Root: `text-to-video`. Children: `image-to-video` from the parent last frame.
- Write all prompts first. Render wave by depth. Siblings in a wave can run in parallel.
- Do not build a create-series form, style locker, or character uploader.
- `AGENTS.md` is a symlink to this file.

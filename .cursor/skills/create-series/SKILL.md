---
name: create-series
description: >-
  Plans and generates a branching episode series for this demo using fal H3 Max.
  Writes catalog + series.json, prompts the full tree, then renders wave by depth
  (text-to-video root, then image-to-video from each parent's last frame).
  Use when creating a series, generating episodes, baking a tree, seeding the
  catalog, or extending a series past an existing leaf.
---

# Create series

Agent-only. There is no create-series UI. You write the tree and render it into `content/`.

Default tree is a full binary tree to depth 3: 15 episodes (`1 + 2 + 4 + 8`). Two branches on every non-leaf. Leaves have empty `branches`.

## Output

```
content/catalog.json
content/series/{id}/
  series.json
  media/{episodeId}.mp4
  media/{episodeId}.last.jpg
```

`{id}` is a kebab slug (`naruto-chunin`). Episode ids are path strings: root `0`, left appends `a`, right appends `b` (`0`, `0a`, `0b`, `0aa`, … `0bbb`).

Update `catalog.json` when the series is playable (root video exists). Poster is `media/0.last.jpg`.

## Hard locks

- First-person POV. The camera is the hero's eyes. Describe what is in front of the lens (hands at the bottom of frame, people looking into the camera). Do not write negatives like "do not show the hero's face."
- Popular IP named in the prompt for likeness. H3 Max has no reference images.
- Style is otherwise loose. No style-lock object.
- Clip length is per episode (`durationSeconds` on that episode). Minimum 5 seconds. Default is TBD. Set duration on the API, not in the prompt.
- 9:16 on the root request only. Children inherit it from the parent's last frame. Do not mention aspect ratio or vertical in the prompt.

## Workflow

Copy and check off:

```
- [ ] Premise: IP, title, logline, who the hero is
- [ ] Plan: all 15 episode beats, durations, and branch labels
- [ ] Write series.json (prompts filled, media paths set, videos empty until rendered)
- [ ] Wave 0: text-to-video `0`
- [ ] Save `0.mp4`, extract + upload `0.last.jpg`
- [ ] Wave 1: image-to-video `0a`, `0b` in parallel
- [ ] Wave 2: `0aa` `0ab` `0ba` `0bb` in parallel
- [ ] Wave 3: eight leaves in parallel
- [ ] Validate: python .cursor/skills/create-series/scripts/validate-series.py content/series/{id}
- [ ] Add or update the catalog entry
```

Resume if `series.json` already exists: start at the first depth that is missing a video. Never regenerate a finished parent just to continue.

Prompts for the whole tree are written before any render. Videos are not. A child cannot start until its parent's last frame exists. Siblings in one wave can run in parallel.

## Plan the tree

Each episode is one beat that ends on a cliffhanger. Each branch `label` is short tappable copy and the story seed for the child.

Write every episode's `prompt` and both `label`s first. Then render.

Depth 3 leaves still get a full clip of their own length. They just have `"branches": []`.

## Prompting

Read [prompting.md](prompting.md) before writing prompts. Use that shape for every episode.

Child prompts start from the parent's last-frame situation and play out the chosen `label`. Keep IP, POV, and the room continuous.

## Render

Use fal MCP (`user-fal-ai`). Do not pick another model. Inspect schema with `get_model_schema` if anything is unclear.

Shared input:

- `duration`: that episode's `durationSeconds` (integer, minimum 5)
- `resolution`: `"768P"`
- `prompt_expansion_mode`: `"disabled"`

Root (`minimax/h3-max/text-to-video`):

- `aspect_ratio`: `"9:16"`
- `prompt`: episode `0` prompt

Children (`minimax/h3-max/image-to-video`):

- `image_url`: parent last-frame CDN URL
- `prompt`: that child's prompt
- No `aspect_ratio`. Output follows `image_url`.
- Do not set `end_image_url`.

Submit with `submit_job`. Poll `check_job`, then `get_job_result`. Download `result.video.url` to `media/{id}.mp4`. One job per episode. If a job is still processing, keep polling that `request_id`. Do not submit a second job for the same episode.

### Last frame

```bash
.cursor/skills/create-series/scripts/extract-last-frame.sh \
  content/series/{id}/media/{episodeId}.mp4 \
  content/series/{id}/media/{episodeId}.last.jpg
```

Upload the jpg to fal so the next wave can use it as `image_url`. Last frames are small. Base64 the file and call `upload_file` with `data` + `file_name`. Do not pass `file_path` (hosted MCP rejects it). Keep the local jpg. Set `startFrame` on each child to the parent's local last-frame path, and keep the CDN URL only for the request.

Write `video` and `lastFrame` into `series.json` as you finish each episode.

## Schema

Exact field list and a filled example: [schema.md](schema.md).

## Validate

```bash
python .cursor/skills/create-series/scripts/validate-series.py content/series/{id}
```

Fix whatever it prints. Do not ship a series that fails.

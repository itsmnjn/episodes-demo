---
name: create-series
description: >-
  Writes series artifacts for this demo: series.json first, then media
  wave by depth on fal H3 Max. Root is text-to-video. Children are
  image-to-video from the parent last frame. Use when writing series.json,
  rendering a depth wave, or seeding the catalog. Growing the tree is
  iterate-series.
---

# Create series

Agent-only. There is no create-series UI. Artifacts are split. JSON is the tree: prompts, labels, branches. Media is the clips. Settle the whole JSON tree before any fal job. Then render one depth at a time, every episode at that depth in parallel.

Growing the tree is [iterate-series](../iterate-series/SKILL.md). This skill is how to write the files and how to run a media wave.

Default tree is a full binary tree to depth 3: 15 episodes (`1 + 2 + 4 + 8`). Two branches on every non-leaf. Leaves have empty `branches`. A series may ship shallower.

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
- IP is optional. When the concept uses popular IP, name it in the prompt for likeness. Original concepts rely on concrete visual descriptions. H3 Max has no reference images.
- Style is otherwise loose. No style-lock object.
- Clip length is per episode (`durationSeconds` on that episode). Minimum 5 seconds. Default 10. Set duration on the API, not in the prompt.
- 9:16 on the root request only. Children inherit it from the parent's last frame. Do not mention aspect ratio or vertical in the prompt.

## JSON

Write `series.json` as episodes are approved. Do not render. `video` and `lastFrame` stay `""` until that episode's media wave finishes.

On each approved episode:

- Create `content/series/{id}/` if needed.
- Write that episode's `id`, `depth`, `durationSeconds`, `prompt`, empty `video` / `lastFrame`, and `"branches": []`.
- Root has no `startFrame`. Every other episode has `startFrame` set to `media/{parentId}.last.jpg` even before that file exists.
- If this is a child, append one `{ "label", "to" }` on the parent. Do not invent the other fork.
- Leaves at series depth keep empty `branches`.

Exact field list: [schema.md](schema.md). Prompt shape: [prompting.md](prompting.md).

Do not start media until every expected episode has a prompt and every non-leaf has two branches.

Validate the JSON tree before the first wave:

```
python .cursor/skills/create-series/scripts/validate-series.py content/series/{id}
```

Empty media paths are fine. Missing prompts or missing branches are not.

## Media

Do not start until the JSON tree is settled. Never regenerate a finished episode.

Copy and check off:

```
- [ ] Wave 0: text-to-video `0`
- [ ] Save `0.mp4`, extract + upload `0.last.jpg`, write video + lastFrame
- [ ] Wave 1: image-to-video every depth-1 episode in parallel
- [ ] Extract + upload last frames for that wave
- [ ] Wave 2: every depth-2 episode in parallel
- [ ] Wave 3: every remaining leaf in parallel
- [ ] Add or update the catalog entry
```

A wave is every episode whose `depth` equals the wave index and whose `video` is still empty. Submit every job in that wave in the same turn. Poll them together. Do not wait for one sibling before submitting the next.

A child cannot start until its parent's last frame exists on disk and on the fal CDN. That is why waves are by depth, not by episode.

Resume at the first wave that still has an empty `video`. Skip any episode that already has a file.

### fal

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

Extract locally, then upload with the REST script. Do not send the jpg through MCP.

```bash
.cursor/skills/create-series/scripts/extract-last-frame.sh \
  content/series/{id}/media/{episodeId}.mp4 \
  content/series/{id}/media/{episodeId}.last.jpg

.cursor/skills/create-series/scripts/upload-to-fal.sh \
  content/series/{id}/media/{episodeId}.last.jpg
```

The script prints a fal CDN `file_url`. That is the child's `image_url`. Keep the local jpg. `startFrame` already points at the parent path on disk.

Hosted fal MCP cannot read `file_path`. Passing the jpg as `upload_file` `data` also fails: a last frame is ~150KB and the base64 blows the tool-call limit. Do not recompress to squeeze it through MCP. REST initiate + PUT is the path that worked for The Invitation.

`FAL_KEY` must be available. The script uses `$FAL_KEY` if set, otherwise the fal-ai Bearer in `~/.cursor/mcp.json`. Do not print the key.

After a wave, extract and upload every new last frame before the next wave. Write `video` and `lastFrame` into `series.json` as each episode in the wave finishes.

## Episodes

Each episode is one beat that ends on a cliffhanger. Each branch `label` is short tappable copy and the story seed for the child.

Depth 3 leaves still get a full clip of their own length. They just have `"branches": []`.

Child prompts are written as if this is the first clip the model has ever seen. Restate POV, place, who is in frame, and the IP when the concept uses one. Positive only: write what happens. Quote a line only if someone speaks. Do not refer to a previous video. The model only gets this prompt and the last-frame image. Play out the chosen `label` as action now.

## Validate

```bash
python .cursor/skills/create-series/scripts/validate-series.py content/series/{id}
```

Fix whatever it prints. Do not ship a series that fails.

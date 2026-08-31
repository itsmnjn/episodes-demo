# Series schema

One file: `content/series/{id}/series.json`.

## series.json

```json
{
  "id": "naruto-chunin",
  "title": "Chunin Exam",
  "ip": "Naruto",
  "logline": "You are in the Forest of Death. The scroll is still out of reach.",
  "poster": "media/0.last.jpg",
  "model": "minimax/h3-max",
  "durationSeconds": 8,
  "root": "0",
  "episodes": {
    "0": {
      "id": "0",
      "depth": 0,
      "prompt": "…",
      "video": "media/0.mp4",
      "lastFrame": "media/0.last.jpg",
      "branches": [
        { "label": "Chase Sasuke into the trees", "to": "0a" },
        { "label": "Hold the clearing with Sakura", "to": "0b" }
      ]
    },
    "0a": {
      "id": "0a",
      "depth": 1,
      "prompt": "…",
      "startFrame": "media/0.last.jpg",
      "video": "media/0a.mp4",
      "lastFrame": "media/0a.last.jpg",
      "branches": [
        { "label": "Draw the Rasengan", "to": "0aa" },
        { "label": "Call for Kakashi", "to": "0ab" }
      ]
    }
  }
}
```

## Rules

- `durationSeconds` is an integer, minimum 5. No default yet. Pick a length for that series and use it on every episode. H3 Max tops out at 15.
- `id` is the folder name.
- `episodes` is an object keyed by episode id.
- Root id is always `0`. Child ids are parent + `a` or `b`.
- `depth` is `len(id) - 1` (`0` is 0, `0a` is 1, `0aaa` is 3).
- Non-leaves have exactly two branches, `a` then `b`, `to` matching the child id.
- Leaves (`depth === 3` on a default series) have `"branches": []`.
- Root has no `startFrame`. Every other episode has `startFrame` equal to the parent's `lastFrame`.
- `video` / `lastFrame` are repo-relative paths under that series folder. Empty string until the file exists.
- `prompt` is the exact string sent to H3 Max.
- `label` is the player copy and the child's story seed. First person, short.

## catalog.json

```json
{
  "series": [
    {
      "id": "naruto-chunin",
      "title": "Chunin Exam",
      "ip": "Naruto",
      "logline": "You are in the Forest of Death. The scroll is still out of reach.",
      "poster": "series/naruto-chunin/media/0.last.jpg"
    }
  ]
}
```

Paths in the catalog are relative to `content/`.

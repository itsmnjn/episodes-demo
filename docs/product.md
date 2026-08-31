# Watch app

The product is a phone-shaped player for branching first-person stories. You pick a series, watch a clip, tap one of two moves, watch the next clip. That is the whole app.

Series are baked by agents. This spec is the thing a person opens. Do not add a create form, a prompt box, a style locker, or a character uploader.

This demo later sits inside Mage. Chrome can look like it belongs there. The stage itself should still look like a phone.

## What an episode is

One short first-person clip. The camera is the hero's eyes. People look into the lens. Hands can sit at the bottom of the frame. The hero's face does not.

The clip ends on a hold, not a fade. Two choices sit on that frozen last frame. Each choice is a verb you can see land in the next second. Tapping one plays the child clip, which was generated from that same last frame, so the cut should feel like the room kept going.

Length is per episode, at least 5 seconds, default 10. The player uses whatever `durationSeconds` is on that episode. Do not show a duration badge.

## What a series is

A full binary tree of those clips. Root is `0`. Left appends `a`, right appends `b`. Default depth is 3 (15 clips). A series may ship shallower. The Invitation is depth 2 (7 clips).

Every node in a shipped series already has a video. Baked forks never wait on fal. At a leaf the viewer can keep going: the app suggests two new moves or takes one the viewer types, writes the child prompt from the parent prompt, renders that episode from the held frame, and plays it. Viewer-made paths live in client memory for the demo. They survive restarts and shelf round-trips in the same tab; a refresh starts clean.

The only hard lock across a series is first-person POV. Likeness comes from naming popular IP in the prompt. Style is otherwise loose. The player never says any of that.

## Screens

Two.

**Shelf.** Netflix-style row of series. Poster, title, IP, logline. Tap a poster and the player opens that series at episode `0`. No hover synopsis page. No "play" confirmation.

**Player.** Full-bleed 9:16. Sound on. Episode `0` starts immediately. While the clip plays, do not cover the picture with chrome. At the end, freeze on the last frame and fade the two branch labels onto it. Tap a label, the next clip starts. Same gesture every time.

On a laptop the player is a 9:16 column on black, like a phone standing on the desk. Do not letterbox a landscape stage and put the video in the corner.

## Playback rules

- Autoplay the current episode when you enter it. Sound on. A mute control is fine. Do not start muted.
- The last frame stays up until the viewer taps. Do not auto-advance.
- The next clip should start on the same picture the last one ended on. If the seam pops, that is a content bug, not a reason to add a dissolve.
- A leaf has no baked choices. Hold the last frame. Offer any paths the viewer already made, a two-move suggestion, and a typed move, plus Restart and Back to shelf. Tapping a suggested or typed move renders the child episode and plays it when it lands. The wait is one quiet line on the held frame, not a progress bar.
- Restart is allowed from any episode.
- Back one episode is allowed. Replay the parent from the start, do not scrub to the last frame.
- Do not persist the path across a refresh for v1. Opening the series always starts at `0`.
- Do not show episode ids, depth, prompts, or file names.

Branch labels come from `series.json` as written. They are first person and short. Do not rewrite them in the UI. Do not prefix them with A/B or left/right.

## Shelf data

Read `content/catalog.json`. Each row is:

- `id`
- `title`
- `ip`
- `logline`
- `poster` (path relative to `content/`)

Tap uses `id` to load `content/series/{id}/series.json` and play `episodes["0"].video`.

The shelf is a list, not a search product. One row is enough while there is one series. When there are more, keep one row. Do not add rows-by-genre.

## What the player reads from a series

Only what it needs to play and branch:

- `title` for a small exit label, not an opening title card
- `episodes[id].video`
- `episodes[id].branches[].label` and `.to`

Ignore `prompt`, `startFrame`, `model`, and `lastFrame` in the UI. Last-frame jpgs are for generation, not for the player. The player freezes the video element.

If a video path is missing or the file is gone, do not show a generate button. Show a dead end and a way back to the shelf. An incomplete series is an agent problem.

## Out of scope

- Creating a series
- Job progress, percentages, or retries. The wait is a single line.
- A map or tree peek. The story is the tree. The viewer should feel it by tapping, not by reading a graph.
- Accounts, history, likes, comments, share sheets
- Landscape, captions, or a theater mode

Mage can add the untraveled-path wait later without changing the shelf or the choice chrome. The hook is an empty `video` on a node that already has labels. Do not build that hook now.

## Seed

The Invitation is the first series on the shelf. Harry Potter, Cho Chang and Hermione Granger, Gryffindor dorm, depth 2. Use it to judge the player. If the tap-to-next-clip cut feels like a jump cut, fix the player seam or remake the child, do not add UI around the problem.

## Open

- Pause on tap during playback. Fine if it stays out of the way. Do not add a scrubber.

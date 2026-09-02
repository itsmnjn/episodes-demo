# Watch app

The watch surface is a phone-shaped player for branching first-person stories. You pick a series, watch a clip, tap one of two moves, watch the next clip. This spec covers that surface. The create surface is one page: premise, three openings, one prompt, film it.

This demo later sits inside Mage. Chrome can look like it belongs there. The stage itself should still look like a phone.

## What an episode is

One short first-person clip. The camera is the hero's eyes. People look into the lens. Hands can sit at the bottom of the frame. The hero's face does not.

The clip ends on a hold, not a fade. Two choices sit on that frozen last frame. Each choice is a verb you can see land in the next second. Tapping one plays the child clip, which was generated from that same last frame, so the cut should feel like the room kept going.

Length is per episode, at least 5 seconds, default 10. The player uses whatever `durationSeconds` is on that episode. Do not show a duration badge.

## What a series is

A tree of those clips. Root is `0`. Each child appends a letter in the order it was made. Only the root is authored; the tree grows where viewers walk. Every landed episode has two written moves. Tapping one plays the child if someone has already made it, or writes and renders it and plays it when it lands. A typed move does the same. Two viewers making the same move from the same episode get the same child.

Series, episodes, and moves live in Postgres; clips and last frames in Blob. Everyone sees the same tree.

The only hard lock across a series is first-person POV. When a concept uses popular IP, likeness comes from naming it in the prompt; original concepts do not require an IP. Style follows the premise. The player never says any of that.

## Screens

Two.

**Shelf.** Netflix-style row of series, newest first. Poster (the root's last frame), title, logline. A series whose root is still rendering says so on the card. Tap a poster and the player opens that series at episode `0`. No hover synopsis page. No "play" confirmation.

**Player.** Full-bleed 9:16. Sound on. Episode `0` starts immediately. While the clip plays, do not cover the picture with chrome. At the end, freeze on the last frame and fade the two branch labels onto it. Tap a label, the next clip starts. Same gesture every time.

On a laptop the player is a 9:16 column on black, like a phone standing on the desk. Do not letterbox a landscape stage and put the video in the corner.

## Playback rules

- Autoplay the current episode when you enter it. Sound on. A mute control is fine. Do not start muted.
- The last frame stays up until the viewer taps. Do not auto-advance.
- The next clip should start on the same picture the last one ended on. If the seam pops, that is a content bug, not a reason to add a dissolve.
- At the end of every episode: the two written moves, any other move a viewer has already taken from here, and a typed move, plus Back, Restart, and Back to shelf. A move whose child exists plays it. Otherwise the child is written and rendered and plays when it lands. The wait is one quiet line on the held frame, not a progress bar.
- Restart is allowed from any episode.
- Back one episode is allowed. Replay the parent from the start, do not scrub to the last frame.
- Do not persist the path across a refresh for v1. Opening the series always starts at `0`.
- Do not show episode ids, depth, prompts, or file names.

Move labels are shown as written. They are short and start with a verb. Do not rewrite them in the UI. Do not prefix them with A/B or left/right.

## What the player reads

Only what it needs to play and branch: the series title for a small exit label, and for each episode its id, parent, the move that led to it, status, video URL, and its two moves. Prompts and last frames never reach the player. The player freezes the video element.

If the root is still rendering, hold black with the one quiet line and play it when it lands. If a render failed, say so and offer the way back.

## Out of scope for the player

- Job progress, percentages, or retries. The wait is a single line.
- A map or tree peek. The story is the tree. The viewer should feel it by tapping, not by reading a graph.
- Accounts, history, likes, comments, share sheets
- Landscape, captions, or a theater mode

## Seed

The Invitation is the first series on the shelf. Harry Potter, Cho Chang and Hermione Granger, Gryffindor dorm, depth 2. Use it to judge the player. If the tap-to-next-clip cut feels like a jump cut, fix the player seam or remake the child, do not add UI around the problem.

## Open

- Pause on tap during playback. Fine if it stays out of the way. Do not add a scrubber.

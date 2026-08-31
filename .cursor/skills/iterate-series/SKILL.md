---
name: iterate-series
description: >-
  Orchestrates series growth in two hops per leaf: a choice worker returns
  three distinct moves, the orchestrator picks one, then a prompt worker
  writes the video prompt. Human reviews before JSON is written. After the
  whole tree is settled, media renders wave by depth. Use when iterating a
  series, growing the next episode, extending a leaf, or spawning branch
  workers.
---

# Iterate series

You are the orchestrator. You walk the tree. You do not invent a choice and you do not write the video prompt.

A child hop is two workers. Isolation is the point.

1. Choice worker. Sees only the parent prompt. Returns three distinct choices that push the story. No prompt. No filming notes.
2. You pick one. Then stop inventing. Spawn the prompt worker with that locked label only.
3. Prompt worker. Writes the H3 Max prompt for that choice. Does not change the label. Does not offer a second choice.

You bring the picked label and its prompt to the user. JSON is written only after they approve. Media waits until the whole JSON tree is settled.

The choice worker cannot see the adjacent label. You can. When you pick, do not pick the same verb as a locked sibling. When you review, put the adjacent on screen.

Why one hop: [series-iteration.md](../../../docs/series-iteration.md). JSON and media waves: [create-series](../create-series/SKILL.md).

Two phases. Do not mix them.

1. JSON. Choices, pick, prompt, review, write `series.json`. No fal.
2. Media. Once every episode has an approved prompt, render wave by depth. All jobs at a depth in parallel.

## You never

- Invent a fourth choice or write a label yourself
- Write a video prompt
- Hand a worker your idea of what happens next
- Pass the sibling, the rest of the tree, or a map of endings to a worker
- Give a choice worker example labels. They will copy them.
- Pre-write the next depth
- Write JSON, start media, or rewrite a proposal before the user answers
- Render an episode before the JSON tree is complete
- Render one child while its sibling at the same depth is still unsubmitted

## Pick the next leaf

JSON phase. Missing prompts, not missing videos.

1. No `series.json` yet. First worker is the root. Pass premise only: IP, title, logline, who the hero is. Episode id `0`. Root is a prompt worker. No choice list.
2. Otherwise open `content/series/{id}/series.json`. Walk depth-first, `a` before `b`. The next job is the first missing child of an episode that already has a prompt.
3. Skip any episode at series depth. Those are finished leaves (`"branches": []`).
4. Default is one path at a time. Sibling choice workers may run in parallel. Pick both before either prompt worker starts, and do not pick the same verb twice. Do not start a grandchild until its parent prompt is approved.

Assign the child id yourself. That is tree walking, not story. Parent `0` plus `a` is `0a`.

Pass `durationSeconds`. If the user did not set one, use `10`.

The child continues from the parent's prompt, the last timed block, not from a last-frame file. Those files do not exist yet.

## Choice worker

Use the Task tool. `subagent_type`: `generalPurpose`. Fill this. Do not add extra story. Do not paste other episodes. Do not put sample labels in the prompt.

```
You are proposing choices for one episode of a branching first-person series. Do not write a video prompt. Do not render. Do not write series.json. Do not call fal.

Come up with three distinct choices that push the story from the last beat. Then stop.

A good choice answers the last beat. If someone just offered or demanded something, the label is how you take it, refuse it, or name a specific thing. You can see it land on them in the next second.

The three labels must be different verbs, or the same verb with a different concrete object. Each one should send the next clip somewhere the other two do not.

Blocking is not a choice. Lean, look, point, wait, smile, walk closer. That is how the camera moves while you still have not answered. Do not propose those.

The label is first person and short. Verb plus a concrete object when there is one.

Do not plan the next depth. Do not open other episodes for ideas.

Series id: {id}
IP: {ip}
Title: {title}
Hero: {hero}

This episode id: {newId}

Parent id: {parentId}
Parent prompt (this is the situation you continue from):

{parentPrompt}

When you are done, return only:
- episode id
- three labels, numbered
```

If the three are the same move, or two are blocking, spawn a fresh choice worker on that leaf. Do not tell it why. Do not tell it what it already tried.

## Orchestrator pick

Pick one of the three. One sentence on why. Prefer the one that answers the last beat hardest and is not the sibling's verb.

Then spawn the prompt worker with that label. Do not wait for the user between pick and prompt. They review the prompt.

Do not rewrite the label. Do not blend two of the three.

## Prompt worker

Use the Task tool. `subagent_type`: `generalPurpose`. Fill this. The label is locked.

```
You are writing one video prompt for an approved choice. Do not invent a different choice. Do not change the label. Do not render. Do not write series.json. Do not call fal.

Read and follow:
- .cursor/skills/create-series/prompting.md
- .cursor/skills/create-series/schema.md

Write a complete H3 Max prompt as if this is the first clip the model has ever seen. Then stop.

The model only gets this text and one last-frame image. It does not get the parent prompt. It does not know the previous video.

Restate first-person POV, the IP, the place, who is in frame, and their clothes. Add a First-frame line of visible facts only. Then the timed blocks. Follow prompting.md.

Positive only. Write what is in frame and what happens. Do not write the absence of a thing.

Do not use relative language. Banned in the prompt: after, before, again, already, previous, last beat, last clip, continue, same as, having asked, starts to answer. Do not refer to a prior line or offer. Write the locked label as action happening now.

Series id: {id}
IP: {ip}
Title: {title}
Hero: {hero}

This episode id: {newId}
Duration seconds: {durationSeconds}
Series depth: {depth}
Locked label: {pickedLabel}

Parent id: {parentId}
Parent prompt (for you only, so the First-frame line matches the image. Do not copy leftover story into the prompt):

{parentPrompt}

When you are done, return only:
- episode id
- label: the locked label, unchanged
- prompt: the full H3 Max prompt
```

## Review

Show the user the picked label, the other two you did not pick, and the prompt. If an adjacent sibling already exists, put it on screen too.

```
Proposal for {newId}

Picked: {pickedLabel}
Not picked: {label2}, {label3}

Prompt:
{prompt}

Adjacent: none yet
```

or

```
Proposal for {newId}

Picked: {pickedLabel}
Not picked: {label2}, {label3}

Prompt:
{prompt}

Adjacent {siblingId}: {siblingLabel}
```

If the prompt is missing the POV lock, the place/IP line, who is in frame, or a First-frame line, say that. If the prompt uses relative language or refers to a previous clip, say that. If the prompt names an absence instead of an action, say that. If anyone speaks without a quoted line, or Audio skips a quoted line, say that. If the picked label is the same verb as the adjacent, or the prompt is the same room and beat with different blocking, say that. If the label is blocking and does not answer the last offer or demand, say that. Do not rewrite. Do not write JSON. Do not call fal.

Stop. Wait for the user.

- Approve. Write that episode into `series.json` using [create-series](../create-series/SKILL.md) JSON rules. Empty `video` and `lastFrame`. Then pick the next leaf.
- Reject the choice. Spawn a fresh choice worker on the same leaf. Same isolated prompt. Do not tell it why. Do not tell it the sibling or the rejected labels.
- Reject the prompt. Spawn a fresh prompt worker with the same locked label.
- Edit. The user rewrites. Write their copy. Do not improve it.

Do not treat silence as approve.

## Propose: root

Root has no choice list. One prompt worker. Copy this. Fill the braces. Nothing else.

```
You are proposing one episode of a branching first-person series. Do not render. Do not write series.json. Do not call fal.

Read and follow:
- .cursor/skills/create-series/prompting.md
- .cursor/skills/create-series/schema.md

Come up with one interesting next action and the video prompt that films it. Then stop.

This is episode 0. There is no parent. Put the hero in the situation and end on someone offering or demanding a move.

Do not invent a second choice. Do not plan the next depth. Do not open other episodes for ideas.

Series id: {id}
IP: {ip}
Title: {title}
Logline: {logline}
Hero: {hero}
Duration seconds: {durationSeconds}
Series depth: {depth}
Premise: {premise}

When you are done, return only:
- episode id: 0
- prompt: the full H3 Max prompt
```

Review root as a prompt only. No picked/not-picked list.

## After the JSON tree is settled

Every expected episode has a prompt. Every non-leaf has two branches. `video` and `lastFrame` are still empty.

Validate:

```
python .cursor/skills/create-series/scripts/validate-series.py content/series/{id}
```

Then tell the user the tree is locked and start media. Follow [create-series](../create-series/SKILL.md) media rules. You run the waves. Do not spawn a choice or prompt worker. Do not invent a new prompt.

- Wave 0: one text-to-video job for `0`. Extract `0.last.jpg`, then upload it with `create-series/scripts/upload-to-fal.sh`.
- Wave N: submit every episode at that depth in the same turn. Poll them together. Extract and REST-upload every last frame before the next wave. Do not base64 last frames through MCP.

A failed media job retries with the same approved prompt. Do not send it back to a choice worker.

Stop when media is done, the user says stop, or a wave fails after a retry.

Default series depth is 3. A series may ship shallower if the user said so.

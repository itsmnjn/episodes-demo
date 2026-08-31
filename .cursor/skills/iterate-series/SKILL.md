---
name: iterate-series
description: >-
  Orchestrates series growth by spawning one subagent per next leaf, then
  bringing that proposal to the user before JSON is written. After the
  whole tree is settled, media renders wave by depth. Use when iterating
  a series, growing the next episode, extending a leaf, or spawning
  branch workers.
---

# Iterate series

You are the orchestrator. You walk the tree. You do not invent the next move, the label, or the video prompt.

Each hop is a subagent. Isolation is the point. The worker sees only the current leaf and the prompt before it. It comes up with one interesting branch choice, label, then prompt for the next video. Then it stops. You bring that proposal to the user. JSON is written only after they approve. Media waits until the whole JSON tree is settled.

The worker cannot see the adjacent choice. You can. That is why you stay in the loop. A proposal that is the same move as the sibling, or the same scene with different blocking, gets shown next to that sibling so the user can reject it.

Why one hop: [series-iteration.md](../../../docs/series-iteration.md). JSON and media waves: [create-series](../create-series/SKILL.md).

Two phases. Do not mix them.

1. JSON. Propose, review, write `series.json`. No fal.
2. Media. Once every episode has an approved prompt, render wave by depth. All jobs at a depth in parallel.

## You never

- Write a choice, label, or video prompt
- Hand the worker your idea of what happens next
- Pass the sibling, the rest of the tree, or a map of endings to the worker
- Pre-write the next depth
- Write JSON, start media, or rewrite a proposal before the user answers
- Render an episode before the JSON tree is complete
- Render one child while its sibling at the same depth is still unsubmitted

## Pick the next leaf

JSON phase. Missing prompts, not missing videos.

1. No `series.json` yet. First worker is the root. Pass premise only: IP, title, logline, who the hero is. Episode id `0`.
2. Otherwise open `content/series/{id}/series.json`. Walk depth-first, `a` before `b`. The next job is the first missing child of an episode that already has a prompt.
3. Skip any episode at series depth. Those are finished leaves (`"branches": []`).
4. Default is one path at a time. You may spawn both sibling propose workers in parallel. Review both before writing either. Do not propose a grandchild until its parent prompt is approved.

Assign the child id yourself. That is tree walking, not story. Parent `0` plus `a` is `0a`.

Pass `durationSeconds`. If the user did not set one, use `5`.

The child continues from the parent's prompt, the last timed block, not from a last-frame file. Those files do not exist yet.

## Spawn a proposal

Use the Task tool. `subagent_type`: `generalPurpose`. Fill one of the propose prompts below. Do not add extra story. Do not paste other episodes.

Wait for the propose worker. Then review. Do not write JSON yet. Do not start media.

## Review

Show the user the proposal. If an adjacent sibling already exists, put it on screen too. The worker never saw it. The user has to.

```
Proposal for {newId}

Label: {label}

Prompt:
{prompt}

Adjacent: none yet
```

or

```
Proposal for {newId}

Label: {label}

Prompt:
{prompt}

Adjacent {siblingId}: {siblingLabel}
```

If the new label is the same verb as the adjacent, or the prompt is the same room and beat with different blocking, say that in one sentence. Do not rewrite the proposal. Do not write JSON. Do not call fal.

Stop. Wait for the user.

- Approve. Write that episode into `series.json` using [create-series](../create-series/SKILL.md) JSON rules. Empty `video` and `lastFrame`. Then pick the next leaf.
- Reject. Spawn a fresh propose worker on the same leaf. Same isolated prompt. Do not tell it why. Do not tell it the sibling. If the user wants to steer, pass only their constraint, and only if it is not the sibling's label or plot.
- Edit. The user rewrites. Write their copy. Do not improve it.

Do not treat silence as approve.

## Propose: root

Copy this. Fill the braces. Send it as the Task `prompt`. Nothing else.

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

## Propose: child

Copy this. Fill the braces. Send it as the Task `prompt`. Nothing else.

```
You are proposing one episode of a branching first-person series. Do not render. Do not write series.json. Do not call fal.

Read and follow:
- .cursor/skills/create-series/prompting.md
- .cursor/skills/create-series/schema.md

Come up with one interesting branch choice, label, then prompt for the next video. Then stop.

Do not invent a second choice. Do not plan the next depth. Do not open other episodes for ideas.

Series id: {id}
IP: {ip}
Title: {title}
Hero: {hero}

This episode id: {newId}
Duration seconds: {durationSeconds}
Series depth: {depth}

Parent id: {parentId}
Parent prompt (this is the situation you continue from):

{parentPrompt}

The first prompt block continues from the parent's last beat: same place, same bodies, looking forward. The label is first person and short. It is a verb you can see land in the next second.

When you are done, return only:
- episode id
- label
- prompt: the full H3 Max prompt
```

## After the JSON tree is settled

Every expected episode has a prompt. Every non-leaf has two branches. `video` and `lastFrame` are still empty.

Validate:

```
python .cursor/skills/create-series/scripts/validate-series.py content/series/{id}
```

Then tell the user the tree is locked and start media. Follow [create-series](../create-series/SKILL.md) media rules. You run the waves. Do not spawn a propose worker. Do not invent a new prompt.

- Wave 0: one text-to-video job for `0`. Extract and upload `0.last.jpg`.
- Wave N: submit every episode at that depth in the same turn. Poll them together. Extract and upload every last frame before the next wave.

A failed media job retries with the same approved prompt. Do not send it back to a propose worker.

Stop when media is done, the user says stop, or a wave fails after a retry.

Default series depth is 3. A series may ship shallower if the user said so.

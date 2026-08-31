# Series iteration

The first series we generated and previewed is okay. Just okay. The miss is how we wrote it.

Drafting both choices and a stack of prompts in one pass forces mode collapse. Everything averages out. Beats get generic. Choices feel like a menu. Prompts repeat the same room with different blocking.

Do it as a loop instead. Walk one branch at a time. At each step the only decision is the next action and the prompt that films it.

## Why one at a time

The useful context is the current clip and the one before it. Not the sibling you have not lived through. Not a map of fifteen endings.

When that is all you can see, the question is small: what interesting thing can happen next from this frame. The action answers the last beat. If she just asked what you want, you name a thing. You can see it land. The room keeps going. The prompt stays specific.

Leaning in is not a choice. That is blocking. She asked what you want. Answer her.

## The loop

1. A choice worker returns three distinct moves from the last beat. It does not write a prompt. It does not see the sibling.
2. The orchestrator picks one. Then a new worker writes the video prompt for that locked label only.
3. You see the pick, the two leftovers, and the prompt. Approve, reject, or edit. On approve, write that episode into `series.json`. No video yet.
4. Repeat down the same branch, then take the other fork from a real parent prompt, not from a plan.
5. When the whole JSON tree is settled, render media wave by depth. Every episode at a depth launches in parallel. A child waits on its parent's last frame, so depths stay in order.

Do not pre-write the sibling. Do not pre-write the next depth. Those wait until you are standing on that parent prompt.

Choice and prompt are different jobs. One brain doing both writes a pose that is easy to film. A choice worker only has to name three ways the story actually moves. The prompt worker only has to film the one you locked.

The orchestrator stays in the loop because isolation can also roll a choice that is too close to the adjacent. That is a pick and a human call, not a rewrite.

JSON and media are different artifacts. Lock the tree first. Then spend the fal jobs.

## The skills

[iterate-series](../.cursor/skills/iterate-series/SKILL.md) is the loop. An orchestrator walks the tree, a choice worker returns three moves, the orchestrator picks one, a prompt worker films it, and you review before JSON.

[create-series](../.cursor/skills/create-series/SKILL.md) is the artifacts. JSON as you approve. Media later, one depth at a time, siblings in parallel.

# Series iteration

The first series we generated and previewed is okay. Just okay. The miss is how we wrote it.

Drafting both choices and a stack of prompts in one pass forces mode collapse. Everything averages out. Beats get generic. Choices feel like a menu. Prompts repeat the same room with different blocking.

Do it as a loop instead. Walk one branch at a time. At each step the only decision is the next action and the prompt that films it.

## Why one at a time

The useful context is the current clip and the one before it. Not the sibling you have not lived through. Not a map of fifteen endings.

When that is all you can see, the question is small: what interesting thing can happen next from this frame. The action is something you can see land. The room keeps going. The prompt stays specific.

## The loop

1. A worker proposes one next action, label, and prompt. It does not see the sibling. It continues from the parent prompt, not from a rendered frame.
2. The orchestrator puts that proposal next to the adjacent choice, if one exists, and waits.
3. You approve, reject, or edit. On approve, write that episode into `series.json`. No video yet.
4. Repeat down the same branch, then take the other fork from a real parent prompt, not from a plan.
5. When the whole JSON tree is settled, render media wave by depth. Every episode at a depth launches in parallel. A child waits on its parent's last frame, so depths stay in order.

Do not pre-write the sibling. Do not pre-write the next depth. Those wait until you are standing on that parent prompt.

The worker invents in isolation so the beat stays specific. The orchestrator stays in the loop because isolation can also roll a choice that is too close to the adjacent. That is a human call, not a rewrite.

JSON and media are different artifacts. Lock the tree first. Then spend the fal jobs.

## The skills

[iterate-series](../.cursor/skills/iterate-series/SKILL.md) is the loop. An orchestrator walks the tree, spawns one propose worker per next leaf, and brings the proposal up for review. It does not write story.

[create-series](../.cursor/skills/create-series/SKILL.md) is the artifacts. JSON as you approve. Media later, one depth at a time, siblings in parallel.

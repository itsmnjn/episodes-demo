# Episodes

Demo of branching AI video stories for a later Mage integration.

An episode is a short first-person clip that ends on a cliffhanger with two choices. Each choice is another episode, started from the last frame of the one you just watched. A series is that tree. The series look is loose; the only hard lock is first-person POV. Likeness comes from popular IP in the prompt. H3 Max has no reference images.

This repo is the watch surface plus the agent skill that bakes series. There is no create-series UI.

User-facing spec: [docs/product.md](docs/product.md).

## Status

The series skill, The Invitation, and the watch app are in. Run `npm run dev`.

## Create a series

Agents: grow a series with `.cursor/skills/iterate-series/SKILL.md`. Write artifacts with `.cursor/skills/create-series/SKILL.md`.

`create-series` writes `content/series/{id}/series.json` first, then renders media wave by depth on fal MiniMax H3 Max. Root is text-to-video at 9:16. Every child is image-to-video from the parent's last frame. Why one hop at a time: [docs/series-iteration.md](docs/series-iteration.md).

fal MCP must be connected (`https://mcp.fal.ai/mcp`).

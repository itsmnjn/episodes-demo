# Episodes

Demo of branching AI video stories for a later Mage integration.

An episode is a short first-person clip that ends on a cliffhanger with two choices. Each choice is another episode, started from the last frame of the one you just watched. A series is that tree. The series look is loose; the only hard lock is first-person POV. Likeness comes from popular IP in the prompt. H3 Max has no reference images.

This repo is the watch surface plus the agent skill that bakes series. There is no create-series UI.

## Status

The series creator skill is in. The Netflix-style player is not.

## Create a series

Agents: read `.cursor/skills/create-series/SKILL.md`.

That skill plans a full binary tree to depth 3 (15 episodes), writes `content/series/{id}/series.json`, then renders wave by depth on fal MiniMax H3 Max. Root is text-to-video at 9:16. Every child is image-to-video from the parent's last frame.

fal MCP must be connected (`https://mcp.fal.ai/mcp`).

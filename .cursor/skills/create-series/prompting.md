# H3 Max episode prompts

The model receives this prompt and, for children, one last-frame image. It does not receive the parent prompt. It does not know what was said or done in any previous clip.

Write every prompt as if this is the first clip the model has ever seen.

Direction, not description. Timed blocks for pacing. Audio as its own track. From fal's MiniMax H3 guide.

## Positive only

Write what is in frame and what happens. If someone speaks, write `says, "exact words"`. If someone acts, write the action.

Do not write the absence of a thing. Do not write that someone stays, remains, holds still, is quiet, or does not do something. The model treats those as a cue and invents the missing action.

Banned: stay, stays, still (continuation or motionless), remains, quiet, silent, mouth closed, do not, don't, no music, no cuts, without, isn't, aren't.

Name clothes, bodies, and the room again. Do not write "the same."

## Must restate

Every episode, in this order:

1. POV lock: `First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.`
2. Place and optional IP: `Photoreal {place}, {time of day}. {three or four visible things}.` If the concept uses a popular IP, name it here for likeness. Original concepts do not need an IP name.
3. Who is in frame: name or likeness, clothes, where they stand, looking into the lens. Name them in the First-frame line and again in the timed blocks.
4. Timed blocks that add to that episode's `durationSeconds` (minimum 5).
5. Audio.

Children add one First-frame line after the place line. Visible facts from the image only:

`First frame: {who, clothes, pose, room}.`

That line describes the picture. It does not tell a prior story.

Do not put aspect ratio, vertical, resolution, or duration in the prompt.

## No relative language

The prompt text must not refer to a previous video, prompt, beat, or line.

Banned in the prompt: after, before, again, already, leftover, previous, last beat, last clip, last time, as before, same as, continue, continues, continue from, having just, having asked, starts to answer, begins to speak, as she replies, after asking.

Do not write a delta. The parent prompt is for you so the First-frame line matches the image. None of that language goes into the prompt.

## Speech

If anyone speaks, the exact words appear in quotes in that timed block and again on the Audio line. Write `says, "exact words"` or `asks, "exact words"`. One speaker per timed block. One short sentence.

If there is no speech, do not mention speech. Audio is the room and the foley of the actions you wrote.

Hero lines are off-camera (POV). Quote them. Do not put the hero's line in the other character's mouth.

## Template

Root:

```
First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.

Photoreal {place from the IP}, {time of day}. {three or four visible things}.

[0 to {early} seconds] Looking forward as {action}. {hero's hands if they touch something}.

[{early} to {mid} seconds] {the beat develops}. {other character looks into the lens}. The hero's hands swing at the bottom of frame.

[{mid} to {durationSeconds} seconds] {quoted line or the hold you can see}. {person or object held in the lens}. End on that beat.

Audio: {quoted lines if any, then room}.
```

Child:

```
First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.

Photoreal {place from the IP}, {time of day}. {three or four visible things}.
First frame: {who, clothes, pose, room}.

[0 to {early} seconds] Looking forward at {who, clothes, where they stand}. {hero's hands}.

[{early} to {mid} seconds] {the locked label, written as action now}. {quoted speech if they speak}.

[{mid} to {durationSeconds} seconds] {quoted line or the hold you can see}. End on that beat.

Audio: {quoted lines if any, then room}.
```

The locked label is what happens in this clip. Write it as action in this clip. Do not write that it answers a previous offer.

## Example (locked)

This 10s root worked. Match this density and POV, not the length or the plot. Scale the timestamps to that episode's duration.

```
First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.

Photoreal McDonald's, daytime. Front counter, menu boards, drink machine, fryer haze.

[0 to 3 seconds] Looking forward as the hero's hands push the glass entrance doors and step inside. Automatic door chime. Customers in line ahead, midground. Walk the entrance lane toward the front counter.

[3 to 7 seconds] Keep walking to an open register. A cute blonde crew member, early 20s, yellow visor, McDonald's crew shirt, stands behind the register and looks straight into the lens as the hero approaches. The hero's hands swing at the bottom of frame.

[7 to 10 seconds] Arrive at the counter. She smiles into the camera and says, "Hey, welcome in, what can I get started for you?" Hold on her looking into the lens. End on that beat.

Audio: Her, close and clear: "Hey, welcome in, what can I get started for you?" Door chime, lobby murmur, fryers and HVAC, sneakers on tile.
```

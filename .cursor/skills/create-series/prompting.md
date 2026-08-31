# H3 Max episode prompts

Direction, not description. Timed blocks for pacing. Audio as its own track. From fal's MiniMax H3 guide.

## Shape

1. POV lock, one line.
2. Place and IP, a few concrete nouns.
3. Timed blocks that add to the series `durationSeconds` (minimum 5).
4. Audio line.

Do not put aspect ratio, vertical, resolution, or duration in the prompt. Do not write negative instructions ("do not show X", "no music", "no cuts"). Say what is in frame instead.

## Template

```
First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.

Photoreal {place from the IP}, {time of day}. {three or four visible things}.

[0 to {early} seconds] Looking forward as {action}. {hero's hands if they touch something}.

[{early} to {mid} seconds] {the beat develops}. {other character looks into the lens}. The hero's hands swing at the bottom of frame.

[{mid} to {durationSeconds} seconds] {cliffhanger}. {person or object held in the lens}. End on that beat.

Audio: {room, foley, voice if anyone speaks}.
```

Branch `label`s are the child's middle and last blocks. The child's first block continues from the parent's last frame: same place, same bodies, looking forward out of that still.

## Example (locked)

This 10s clip worked. Match this density and POV, not the length or the McDonald's plot. Scale the timestamps to the series duration.

```
First-person POV. The camera is the hero's eyes. One continuous handheld take, walking pace, natural body sway.

Photoreal McDonald's, daytime. Front counter, menu boards, drink machine, fryer haze.

[0 to 3 seconds] Looking forward as the hero's hands push the glass entrance doors and step inside. Automatic door chime. Customers in line ahead, midground. Walk the entrance lane toward the front counter.

[3 to 7 seconds] Keep walking to an open register. A cute blonde crew member, early 20s, yellow visor, McDonald's crew shirt, stands behind the register and looks straight into the lens as the hero approaches. The hero's hands swing at the bottom of frame.

[7 to 10 seconds] Arrive at the counter. She smiles into the camera and says, "Hey, welcome in, what can I get started for you?" Hold on her looking into the lens. End on that beat.

Audio: door chime, lobby murmur, fryers and HVAC, sneakers on tile, her voice close and clear.
```

## Dialogue

A short spoken line is fine when someone is welcoming or challenging the hero. Keep it one sentence. The face looking into the lens matters more than the words landing clean.

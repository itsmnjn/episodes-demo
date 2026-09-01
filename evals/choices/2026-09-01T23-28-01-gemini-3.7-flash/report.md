# choices eval run — 2026-09-01T23:28:01.215Z

- Choice writer: `google/gemini-3.7-flash`
- Fixtures: `evals/pipeline/2026-09-01T23-26-58-gemini-3.7-flash/run.json` (30 episodes)
- Pairs per episode: 2
- Pairs written: 60/60
- Latency: median 1680ms, min 841ms, max 3078ms

## Flags

| flag | moves | share of moves |
|---|---|---|
| self-body | 3 | 3% |
| null-move | 0 | 0% |
| noise | 0 | 0% |
| form | 0 | 0% |
| same-verb pair | 0 | 0% of pairs |
| **clean pairs** | 57 | 95% of pairs |

Top verbs: ask 10 (8%), kick 9 (8%), snatch 9 (8%), slam 8 (7%), offer 6 (5%), claim 5 (4%)

## System prompt

```text
You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

The two moves take the story in different directions, and they are different kinds of move: not two grabs, and not a grab and a question every time. Offers, bargains, jokes, dares, gifts, accusations, and small acts of sabotage all count.

Each move is one action in 2 to 5 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.
```

## Pairs

### zoo — A group of toddlers presses against the glass at the penguin exhibit while a zookeeper tosses whole fish into the water. A dripping wet macaroni penguin waddles past the "Staff Only" gate, hops onto your shoe, and stares straight up at you.

- Scoop up the penguin / Yell to the zookeeper
- Scoop the penguin up / Shout to the zookeeper

### zoo — The sun beats down on the primate pavilion as a crowd laughs at two capuchins grooming each other near the edge of the moat. A sudden rustle overhead reveals a third monkey hanging by its tail, reaching its tiny hand directly toward your open backpack.

- Zip the backpack shut / Offer it a shiny coin
- Zip the backpack shut / Offer it a peanut

### zoo — Families line the elevated wooden deck with bundles of lettuce leaves, waiting their turn to feed the towering giraffes. An enormous adult male bypasses every outstretched leaf, leans its massive head right over the railing, and presses its purple tongue against the lens of your camera.

- Press lettuce against the glass / Hand the woman your lettuce
- Hold out your lettuce bundle / Tap on the glass pane

### zoo — The reptile house is dimly lit and humming with the low buzz of heat lamps over various terrarium displays. A breathless intern drops a heavy set of keys onto the floor in front of you and points with wide eyes at an empty, unlatched enclosure labeled *Inland Taipan*.

- Kick the keys to him / Hit the emergency alarm button
- Kick the keys away / Tell him not to move

### zoo — Shoppers bustle through the zoo gift shop, browsing through plush animals, sun hats, and frozen treats by the main exit. The person inside the six-foot-tall plush tiger costume quietly unzips the head and extends a trembling hand holding a walkie-talkie that is broadcasting frantic radio chatter about an uncontained tiger.

- Pick up the dropped radio / Barricade the glass exit doors
- Grab the dropped walkie-talkie / Pull the fire alarm lever

### dentist — The dental hygienist clips the paper bib around your neck while humming along to the soft rock playing overhead. She picks up the sharp metal probe, leans in toward your lower jaw, and suddenly drops the tool onto the metal tray with an audible gasp.

- Grab the small dental mirror / Demand to see the dentist
- Grab the tray mirror / Demand she cut it out

### dentist — The dentist adjusts the bright overhead light, squinting closely at the freshly developed panoramic X-ray glowing on the wall mount. He taps a strange, metallic silhouette lodged deep behind your molars and quietly asks his assistant whose chart this actually is.

- Ask what is in your jaw / Snatch the clipboard from her
- Snatch the clipboard from her / Ask what was planted inside

### dentist — The waiting room aquarium bubbles quietly in the corner as the receptionist sorts through a fresh stack of colorful insurance clipboards. The inner office door suddenly swings open, and a trembling man in a white lab coat backs out into the hallway with both hands raised.

- Slam the frosted door shut / Yell to trigger the alarm
- Slam the frosted door shut / Tell the receptionist to run

### dentist — You sit fully reclined in the examination chair while the sweet-smelling nitrous oxide mask hisses gently over your nose. The dentist reaches for the high-speed drill, but the building's power abruptly cuts out, plunging the operatory into pitch darkness.

- Shove the drill away / Ask what he hears
- Push the metal tray away / Ask what is out there

### dentist — An energetic toddler in dinosaur pajamas is running wild laps around the reception counter while their mother frantically apologizes to the staff. The child trips over the edge of your chair, launching an open cup of bright blue mouthwash straight toward your lap.

- Catch the tumbling toddler / Offer the mother a tissue
- Block splash with a magazine / Scoop up the fallen toddler

### first day at hogwarts — Hundreds of floating candles illuminate the Great Hall as the ancient Sorting Hat is lowered onto your head. The brim suddenly twists open in wide-eyed horror and loudly shrieks that it has never encountered a mind like yours before.

- Whisper a threat to it / Ask McGonagall if it broke
- Rip the hat off / Ask if it is afraid

### first day at hogwarts — The Hogwarts Express grinds to a halt in the pitch-black rain while a towering half-giant with an iron lantern gestures for the first-years to follow him down a slippery path toward the dark lake. Just as you reach the shore, a massive, glowing tentacle breaks the surface of the water and wraps tightly around the front of your rowboat.

- Pry the tentacle off / Shout to the bearded giant
- Strike the tentacle with an oar / Scream Hagrid's name for help

### first day at hogwarts — A row of heavy iron cauldrons bubbles violently along the dungeon walls as the Potions master sweeps down the aisle with a sneer. He stops directly over your workspace, his eyes fixing on the dense, purple vapor rapidly hissing out from under your desk.

- Kick the bubbling cauldron away / Claim it is an antidote
- Shove the desk into him / Claim it is an antidote

### first day at hogwarts — You step onto the magnificent grand staircase just as the heavy stone steps groan and swing violently away from the main corridor. The landing connects to a pitch-black doorway marked with glowing red runes, and the latch on the heavy wooden door slowly clicks open.

- Slam the timber door shut / Shout into the darkness
- Slam the door shut / Call out into the dark

### first day at hogwarts — The crowded common room is filled with students trying out joke wands and practicing basic sparks under the warm firelight. An older student accidentally drops a quivering, speckled egg onto the rug at your feet, and it instantly cracks open to reveal a pair of smoking, reptilian eyes.

- Extend your hand toward it / Throw your cloak over it
- Offer a pastry to it / Trap it under the footstool

### my roommate is a ghost — Your floating roommate is currently reorganizing the spice rack by levitating paprika jars through the air while humming a tune from the 1920s. A sudden knock at the front door sends a jar crashing onto the tile, and the doorknob slowly begins to turn from the outside.

- Throw a jar at the door / Yank her down to the floor
- Deadbolt the front door / Yank her to the floor

### my roommate is a ghost — A chilly breeze sweeps through the hallway as the translucent figure sitting on the sofa suddenly phases halfway into the living room floor to inspect the carpet. His pale, glowing hand reaches out from the floorboards, desperately clutching an unopened letter addressed to you from fifty years ago.

- Snatch the sinking envelope / Stomp the rippling floorboards
- Snatch the sealed envelope / Stomp on the rippling floorboards

### my roommate is a ghost — The morning light cuts through the kitchen steam, revealing a pair of floating yellow dish gloves scrubbing a frying pan entirely on their own. The spectral resident suddenly drops the pan, points toward the open bathroom door, and screams silently as dark water begins to pour over the threshold.

- Kick the bathroom door shut / Ask the gloves what happened
- Shut off the kitchen tap / Slam the bathroom door shut

### my roommate is a ghost — Your roommate’s ghostly cat is curled up asleep on the ceiling above your bed, perfectly defying gravity while batting at phantom dust motes. The feline's ears suddenly perk up, and it lets out a bloodcurdling hiss as the bedroom closet door slowly unlatches itself.

- Hurl the duvet at the closet / Call the glowing cat down
- Hurl the duvet at closet / Call the cat to you

### my roommate is a ghost — The kitchen cabinets are rattling in rhythm while your spectral housemate tries to flip pancakes with a wooden spoon he can barely solidify enough to hold. He accidentally drops the burning hot pan straight through his semi-transparent foot, and it is tumbling directly toward your bare toes.

- Kick the falling skillet aside / Blame him for the mess
- Kick the skillet sideways / Command him to freeze it

### blind date — The host leads the way through the crowded bistro to a corner booth where a smiling date waits with a red carnation on the table. As the chair is pulled out, the date looks up, the smile instantly vanishes, and they whisper the name of their ex-spouse.

- Whisper that she failed / Slide the carnation toward her
- Sit down across from her / Hand her the red carnation  ⟵ self-body:1

### blind date — Across the candlelit table, the date pulls a laminated binder from their bag and lines up three separate digital stopwatches on the tablecloth. They click a pen, tap the five-minute timer, and announce that phase one of the twenty-part compatibility assessment has officially begun.

- Slam the binder shut / Ask for a grading rubric
- Slam the binder shut / Demand to see question one

### blind date — The date waves excitedly from a patio table, seated between two stern-looking strangers in matching business suits who are already taking notes on clipboards. As the empty chair is reached, the date beams and explains that their personal life coaches will be observing the entire evening.

- Snatch the nearest clipboard / Ask for their grading criteria
- Snatch the nearest clipboard / Ask what the passing grade is

### blind date — The date slides into the booth wearing dark sunglasses in the dim lounge and repeatedly checks over both shoulders. Under the tablecloth, their foot shoves a heavy steel briefcase against yours, and they whisper that the drop is complete.

- Introduce her as your date / Kick the case toward them
- Kick the case toward her / Offer the strangers a drink  ⟵ self-body:2

### blind date — A person in a full suit of polished steel plate armor sits across the high-end restaurant table, awkwardly trying to guide a breadstick through the narrow visor of their helmet. The visor creaks open an inch, revealing a pair of nervous eyes and a muffled voice asking if the outfit feels too casual.

- Throw wine at maître d / Shout to warn the knight
- Throw wine at the maître d / Tell him to duck immediately  ⟵ self-body:2

### airport security — The TSA agent frowning at the X-ray monitor calls a supervisor over to point at an unidentifiable glowing mass inside the duffel bag on the conveyor belt. The supervisor taps a silent alarm button beneath the desk, and a heavy security gate immediately slams down over the exit corridor.

- Grab the duffel bag / Accuse the traveler behind you
- Snatch the duffel bag / Warn them it will explode

### airport security — The full-body scanner chimes with a harsh double-beep as the motorized glass panels finish their rotating sweep. An agent turns the external display around, showing an impossible yellow outline of a third human hand wrapped around the midsection.

- Smash the touch monitor / Claim it is an implant
- Push the monitor into her / Tell her it is spreading

### airport security — A beagle in a neon detector vest works its way down the queue of travelers, ignoring half-eaten pretzels and open duty-free bags. It stops abruptly at the shoelaces, sits down firmly on the floor, and lets out a single, piercing howl while staring straight up.

- Toss food across the floor / Blame the passenger beside you
- Kick the dropped pretzel away / Offer the handler your passport

### airport security — The gray plastic bins clatter down the metal rollers toward the bag retrieval area, crowded with laptops, belts, and loose coins. A gloved officer reaches into the nearest tray, lifts a hissing stainless-steel thermos, and drops it as thick neon-blue smoke billows across the table.

- Snatch the flashing canister / Hit the emergency stop button
- Slam the emergency stop button / Tackle the person in gray

### airport security — The document scanner at the checkpoint flashes red as the agent swipes the passport across the glass a third time. She glances up, mutters a code into her lapel microphone, and two armed federal marshals step out from behind a concrete pillar into the line of sight.

- Snatch the brass key / Claim full diplomatic immunity
- Topple the metal barrier / Claim the passport was planted

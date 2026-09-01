# Choice eval run — 2026-09-01T22:47:17.055Z

- Choice writer: `google/gemini-3.5-flash-lite`
- Fixtures: `evals/expansions/2026-09-01T22-42-20-gemini-3.7-flash/run.json` (30 episodes)
- Pairs per episode: 2
- Pairs written: 60/60
- Latency: median 628ms, min 362ms, max 1013ms

## Flags

| flag | moves | share of moves |
|---|---|---|
| self-body | 24 | 20% |
| null-move | 2 | 2% |
| noise | 9 | 8% |
| form | 3 | 3% |
| same-verb pair | 0 | 0% of pairs |
| **clean pairs** | 24 | 40% of pairs |

## System prompt

```text
You propose the protagonist's next move in a first-person story. You are given the scene so far, which ends at a point where the protagonist has to act next.

Write two moves. Each move does something to the world that the world has to respond to: it acts on a person, an object, or the room, or it is something the protagonist says. Do not write moves that only wait, back away, or refuse without doing anything, and do not write moves on the protagonist's own body. The two moves should lead to clearly different next scenes: one is the move the scene is asking for, and the other is one nobody in the scene expects. When the unexpected move could be cruel or absurd, prefer absurd.

Each move is 2 to 6 words and starts with a verb, like "Take his hand" or "Ask who is hurt". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, and nothing else.
```

## Pairs

### zoo — The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.

- Blow warm breath on its snout / Sing a lullaby to the snake  ⟵ noise:2
- Exhale heavily against the glass / Tap the glass with your knuckle

### zoo — A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.

- Drop the map over it / Pick up the penguin
- Pick up the penguin / Pet the bird gently

### zoo — The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.

- Unbuckle the chrome belt / Offer the bird your watch  ⟵ null-move:2
- Press the chrome buckle deeper / Offer the bird your wristwatch

### zoo — A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.

- Reach up and grab it / Meow loudly at the monkey  ⟵ noise:2
- Lift hands to catch it / Bite the monkey back  ⟵ self-body:2

### zoo — Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

- Pour water on the grass / Offer her the plastic bottle
- Pour water on the grass / Splash the ranger with water

### dentist — The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.

- Ask why you would ask / Swallow the heavy lead apron  ⟵ self-body:2
- Ask if it's Wi-Fi / Spit the metal out  ⟵ form:1

### dentist — The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.

- Bite the suction tube / Ask for the missing tip  ⟵ self-body:1
- Spit the drill bit out / Swallow the drill bit  ⟵ self-body:2

### dentist — You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.

- Grab the swinging metal tray / Bite his gloved finger hard  ⟵ self-body:2
- Grab his wrist / Sing happy birthday  ⟵ noise:2

### dentist — Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.

- Grab the dental mirror / Swallow the blinking cylinder  ⟵ self-body:2
- Catch the cylinder in your teeth / Compliment her lovely purple gloves

### dentist — The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

- Grab the desk edge / Bark like a dog  ⟵ noise:2
- Grab her silver glasses / Ask for a lollipop

### first day at hogwarts — The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.

- Snatch the hat away / Throw up on McGonagall
- Grab the hat / Salute the candles

### first day at hogwarts — The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.

- Grab the painted spear tip / Lick the cold marble banister  ⟵ self-body:2
- Grab the iron spearhead / Lick the painted knight  ⟵ self-body:2

### first day at hogwarts — Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.

- Hand him the glass vial / Drink the purple liquid  ⟵ self-body:2
- Hand him the violet vial / Lick the glowing purple liquid  ⟵ self-body:2

### first day at hogwarts — Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.

- Toss it into the fireplace / Stuff the screeching letter down his shirt  ⟵ form:2
- Throw it into the fire / Stuff it in his mouth

### first day at hogwarts — The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

- Grab the slimy tentacle / Slap Hagrid with a fish
- Grab the giant tentacle / Pry open a peanut butter jar

### my roommate is a ghost — The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.

- Take the dripping teacup / Lick the ghostly hand  ⟵ self-body:2
- Take the steaming teacup / Lick the ghostly fingers  ⟵ self-body:2

### my roommate is a ghost — Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.

- Pick up the coins / Lick the translucent figure  ⟵ self-body:2
- Ask if he accepts Venmo / Type a coin into Notepad

### my roommate is a ghost — The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."

- Wipe the mirror clean / Gulp the running water  ⟵ self-body:2
- Wipe the fog away / Drink from the faucet  ⟵ self-body:2

### my roommate is a ghost — The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.

- Pick up the remote / Lick the television screen  ⟵ self-body:2
- Pick up the remote / Lick the television screen  ⟵ self-body:2

### my roommate is a ghost — Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

- Pick up the glowing parchment / Lick the glowing parchment  ⟵ self-body:2
- Read the glowing parchment aloud / Kick the closet door open

### blind date — The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.

- Pour wine into his helmet / Ask what year it is
- Pour wine into his helmet / Ask for the wi-fi password

### blind date — Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.

- Point at the left man / Eat the red carnation  ⟵ self-body:2
- Smash the cup against the glass / Eat the red carnation raw  ⟵ self-body:2

### blind date — The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.

- Seize the coffee cups / Lick the runner's knee  ⟵ self-body:2, form:2
- Grab the iced coffee cups / Drop to bark at them  ⟵ noise:2

### blind date — Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.

- Flash the velvet pouch / Offer her my tie
- Step toward the approaching guards / Hand the pouch to the guards

### blind date — Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

- Flip the heavy binder open / Squeeze ketchup on his stopwatch
- Answer the question honestly / Eat the stopwatch  ⟵ self-body:2

### airport security — The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.

- Step out of the cylinder / Swat the radio from his hand
- Push open the glass cylinder / Swallow the security badge whole  ⟵ self-body:2

### airport security — The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.

- Open the duffel bag slowly / Bark like a frantic dog  ⟵ noise:2
- Open the duffel bag slowly / Bark like a frantic dog  ⟵ noise:2

### airport security — A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.

- Drop to pet the dog / Bark back at the officer  ⟵ noise:2
- Show him your boarding pass / Pet the golden retriever

### airport security — The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.

- Raise hands above my head / Swat the zip-ties away
- Raise your hands slowly / Sing the national anthem  ⟵ null-move:1, noise:2

### airport security — Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

- Shove the canister into his pocket / Swallow the duct-taped canister whole  ⟵ self-body:2
- Grab the heavy canister / Toss the bin backward

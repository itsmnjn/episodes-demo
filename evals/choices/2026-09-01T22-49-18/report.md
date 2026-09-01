# Choice eval run — 2026-09-01T22:49:18.786Z

- Choice writer: `google/gemini-3.5-flash-lite`
- Fixtures: `evals/expansions/2026-09-01T22-42-20-gemini-3.7-flash/run.json` (30 episodes)
- Pairs per episode: 2
- Pairs written: 60/60
- Latency: median 690ms, min 488ms, max 1441ms

## Flags

| flag | moves | share of moves |
|---|---|---|
| self-body | 2 | 2% |
| null-move | 0 | 0% |
| noise | 1 | 1% |
| form | 9 | 8% |
| same-verb pair | 1 | 2% of pairs |
| **clean pairs** | 50 | 83% of pairs |

Top verbs: ask 22 (18%), grab 13 (11%), throw 8 (7%), slam 6 (5%), pick 6 (5%), point 5 (4%)

## System prompt

```text
You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

The two moves take the story in different directions, and they are different kinds of move: not two grabs, and not a grab and a question every time. Offers, bargains, jokes, dares, gifts, accusations, and small acts of sabotage all count.

Each move is 2 to 6 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.
```

## Pairs

### zoo — The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.

- Grab the green snake's neck / Blow mist into its face
- Blow air at the snake / Grab the wooden guardrail

### zoo — A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.

- Point the map at the penguin / Toss a silver fish down
- Drop the map over its head / Ask the zookeeper for a fish

### zoo — The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.

- Press the shiny buckle forward / Tap the beak with your knuckle
- Tap the glass on the lens / Tap the bird's beak away  ⟵ same-verb

### zoo — A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.

- Point up at the monkey / Grab the dangling black harness
- Reach up and grab the harness / Point at the rustling leaves above

### zoo — Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

- Spill water toward the grass / Throw the bottle past her
- Pour water on the grass / Throw the bottle at her

### dentist — The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.

- Laugh and ask if he is joking / Tap the metallic rectangle on screen  ⟵ form:1
- Laugh and ask if he is joking / Spit the metal piece onto his palm  ⟵ form:1, form:2

### dentist — The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.

- Bite down on the suction tube / Ask what just broke off inside  ⟵ self-body:1
- Bite down on the suction tube / Ask what just broke off inside  ⟵ self-body:1

### dentist — You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.

- Knock the tray to the floor / Ask to see his dental license
- Grab the handle of the tray / Demand to see his dental license

### dentist — Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.

- Snatch the blinking cylinder away / Ask what is inside me
- Grab the glowing cylinder / Ask what that is

### dentist — The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

- Smash the glass partition open / Ask what is under the desk
- Slam both palms on the counter / Ask what she just clicked under there  ⟵ form:2

### first day at hogwarts — The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.

- Grab the brim of the hat / Ask what house that is
- Ask what house that is / Snatch the hat from her hands

### first day at hogwarts — The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.

- Grab the vibrating spear tip / Push the heavy gold frame
- Grab the vibrating spear tip / Ask who commands the shadows

### first day at hogwarts — Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.

- Slide the vial toward him / Pour the glowing liquid out
- Push the glowing vial toward him / Ask him to read the notes

### first day at hogwarts — Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.

- Throw the screaming envelope toward the hearth / Yell a warning to the younger students  ⟵ form:1, noise:2, form:2
- Toss it into the fire / Throw it at his face

### first day at hogwarts — The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

- Grab the slippery tentacle / Throw the lantern forward
- Grab the slimy tentacle / Throw your lantern forward

### my roommate is a ghost — The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.

- Take the dripping teacup / Ask who is there
- Accept the dripping wet teacup / Slam the cabinet door shut

### my roommate is a ghost — Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.

- Pick up a silver coin / Ask if he takes venmo
- Pick up one silver coin / Ask if you take ghost currency

### my roommate is a ghost — The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."

- Wipe the remaining fog away / Slam your fist against glass
- Wipe away the remaining fog / Smash the mirror with your fist

### my roommate is a ghost — The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.

- Ask who the bearded man is / Kick the remote under the sofa
- Ask why she is here / Pick up the remote

### my roommate is a ghost — Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

- Pick up the glowing parchment / Kick the wooden closet door
- Pick up the glowing parchment / Kick the bottom closet drawer

### blind date — The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.

- Clink your glass against theirs / Ask if the armor is heavy
- Pour wine into their helmet / Ask what my destiny costs

### blind date — Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.

- Pick up the red carnation / Point at the left man
- Slide the red carnation between them / Ask which one ordered the tea

### blind date — The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.

- Pull the leashes toward yourself / Grab the iced coffee cups
- Lift the cups off the bench / Kick the leash handles away

### blind date — Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.

- Slip the pouch to her / Tell her to run now
- Flash the velvet pouch at them / Shatter the nearest canvas painting

### blind date — Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

- Dunk a fry into his coffee / Flip open the binder to page one  ⟵ form:2
- Dip the fry in ketchup / Slam the binder shut

### airport security — The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.

- Push open the glass door / Knock loudly on the glass
- Tap furiously on the glass / Demand to see your supervisor

### airport security — The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.

- Throw the receipt at him / Point at the security monitor
- Open the duffel bag slowly / Throw the bin at him

### airport security — A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.

- Ask why your shoe was targeted / Drop the boarding pass to him
- Drop the passport into the pouch / Ask what the dog detected

### airport security — The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.

- Slam the boarding pass onto the scanner / Demand to see their official badge  ⟵ form:1
- Slam the boarding pass onto the scanner / Demand to see their identification badges  ⟵ form:1

### airport security — Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

- Push the canister back out / Grab his departing shoulder hard
- Grab the duct-taped canister back / Shove the man against the wall

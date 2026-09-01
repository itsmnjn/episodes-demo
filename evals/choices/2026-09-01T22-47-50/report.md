# Choice eval run — 2026-09-01T22:47:50.061Z

- Choice writer: `google/gemini-3.5-flash-lite`
- Fixtures: `evals/expansions/2026-09-01T22-42-20-gemini-3.7-flash/run.json` (30 episodes)
- Pairs per episode: 2
- Pairs written: 60/60
- Latency: median 679ms, min 466ms, max 956ms

## Flags

| flag | moves | share of moves |
|---|---|---|
| self-body | 2 | 2% |
| null-move | 0 | 0% |
| noise | 1 | 1% |
| form | 6 | 5% |
| same-verb pair | 0 | 0% of pairs |
| **clean pairs** | 53 | 88% of pairs |

## System prompt

```text
You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now, each one a different way the story could go next.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

Each move is 2 to 6 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.
```

## Pairs

### zoo — The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.

- Slam the glass shut / Blow air at its head
- Slam the glass shut / Blow air at its head

### zoo — A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.

- Drop the map on it / Kick the penguin back in
- Drop the map over it / Kick the penguin back in

### zoo — The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.

- Pull the safety bar down / Smack the beak away
- Grab the tall green bar / Shove the buckle toward it

### zoo — A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.

- Reach up and grab it / Point at the fleeing zookeeper
- Reach up to grab it / Point at the fleeing animal

### zoo — Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

- Drop the water bottle down / Ask what is down there
- Drop the water bottle down / Throw the bottle at her

### dentist — The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.

- Shake head side to side / Ask what that thing is
- Deny ever seeing that before / Ask how it got there

### dentist — The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.

- Bite down on the tube / Grab the dentist's wrist  ⟵ self-body:1, form:2
- Grip the dental chair armrests / Grab the suction tube away

### dentist — You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.

- Grab his wrist to stop him / Knock the metal tray away
- Grab the heavy forceps / Knock the silver tray away

### dentist — Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.

- Snatch the floss from her / Grab the blinking device now
- Grab the dental tool tray / Knock the floss from her fingers

### dentist — The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

- Slam your palm against the glass / Grab the edge of the desk
- Slam the clipboard onto her desk / Grab the edge of the counter

### first day at hogwarts — The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.

- Pull the stool back sharply / Gasp at the sudden announcement
- Grab the frayed leather brim / Ask why everyone is staring

### first day at hogwarts — The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.

- Grab the iron spear tip / Press your back against the wall
- Grab the vibrating iron spearhead / Push past the gold frame

### first day at hogwarts — Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.

- Hand him the glowing vial / Deny stealing any forbidden notes
- Push the glowing vial toward him / Hand him the stolen parchment notes

### first day at hogwarts — Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.

- Toss the screaming envelope away / Hurl it into the fireplace
- Toss it into the fire / Throw it at the floor

### first day at hogwarts — The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

- Grab Hagrid's nearby lantern / Strike the slimy tentacle  ⟵ form:1
- Grasp the heavy wooden oar / Scream at Hagrid for help  ⟵ noise:2

### my roommate is a ghost — The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.

- Grab the floating teacup / Push the cabinet door shut
- Grab the steaming teacup / Turn off the running faucet

### my roommate is a ghost — Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.

- Push the coins away / Ask how he died
- Pick up the silver coins / Push the laptop away slowly

### my roommate is a ghost — The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."

- Smash your fist into the mirror / Wipe the fog away with your palm  ⟵ form:2
- Wipe the fog away / Smash the mirror glass

### my roommate is a ghost — The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.

- Point at the television screen / Ask who she is
- Ask who the bearded man is / Pick up the dropped remote

### my roommate is a ghost — Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

- Pick up the glowing parchment / Kick the wooden closet door
- Step on the glowing parchment / Pull open the closet door

### blind date — The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.

- Raise your glass to toast / Grab the wine glass immediately
- Raise my glass to toast / Ask what destiny he means

### blind date — Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.

- Point at the left man / Lift the red carnation
- Point your finger at the left man / Push the carnation toward the right man  ⟵ form:1, form:2

### blind date — The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.

- Grab the sweating coffee cups / Pull the tangled leashes back
- Grab the iced coffee cups / Drop the tangled leash handles

### blind date — Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.

- Grab her arm and run / Throw the pouch at them
- Grab her hand and run / Pull the velvet pouch out

### blind date — Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

- Throw the fries at him / Slam the binder shut
- Slam the binder shut / Eat the entire fry  ⟵ self-body:2

### airport security — The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.

- Press the emergency glass release / Demand an explanation right now
- Tap sharply on the glass / Shove the exit panel open

### airport security — The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.

- Open the duffel bag slowly / Throw the passport at him
- Open the duffel bag slowly / Tell him it's a medical device  ⟵ form:2

### airport security — A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.

- Raise empty hands higher / Say I am unarmed
- Show him your empty hands / Ask why the dog sat

### airport security — The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.

- Slam the boarding pass down / Fling the scanner at him
- Slam the boarding pass down / Thrust both hands forward fast

### airport security — Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

- Grab the duct-taped canister / Run after the fleeing man
- Grab his navy blazer / Push the canister away

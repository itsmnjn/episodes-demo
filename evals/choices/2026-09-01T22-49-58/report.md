# Choice eval run — 2026-09-01T22:49:58.849Z

- Choice writer: `google/gemini-3.5-flash-lite`
- Fixtures: `evals/expansions/2026-09-01T22-42-20-gemini-3.7-flash/run.json` (30 episodes)
- Pairs per episode: 2
- Pairs written: 60/60
- Latency: median 651ms, min 439ms, max 943ms

## Flags

| flag | moves | share of moves |
|---|---|---|
| self-body | 3 | 3% |
| null-move | 1 | 1% |
| noise | 0 | 0% |
| form | 0 | 0% |
| same-verb pair | 0 | 0% of pairs |
| **clean pairs** | 56 | 93% of pairs |

Top verbs: grab 16 (13%), ask 11 (9%), slam 7 (6%), drop 6 (5%), point 6 (5%), pick 6 (5%)

## System prompt

```text
You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

The two moves take the story in different directions. One deals with the cliffhanger head-on; the other does something with whatever else is in the scene. They are different kinds of move: not two grabs, and not a grab and a question every time. Offers, bargains, jokes, dares, gifts, accusations, and small acts of sabotage all count.

Each move is one action in 2 to 5 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.
```

## Pairs

### zoo — The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.

- Blow a breath at it / Grab the wooden guardrail
- Blow smoke on the glass / Reach up and grab it

### zoo — A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.

- Drop the map over it / Poke the beak with fingers
- Drop the zoo map / Punt the sliding penguin

### zoo — The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.

- Press the release button / Pull the safety bar back
- Press the shiny buckle forward / Grab the long black neck

### zoo — A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.

- Point at the tree canopy / Offer your hand to it
- Grab the tiny monkey / Point at the trees

### zoo — Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

- Throw the water bottle there / Ask what is down there
- Splash water onto his boots / Toss the bottle toward him

### dentist — The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.

- Ask how that got there / Tap his glowing monitor
- Laugh and shake my head / Grab the dental tray tools

### dentist — The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.

- Bite down on the tube / Grab the dentist's wrist  ⟵ self-body:1
- Bite down on the tube / Slap the dentist's hand away  ⟵ self-body:1

### dentist — You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.

- Grab the heavy forceps / Knock the silver tray
- Grab the metal tray / Knock the lamp aside

### dentist — Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.

- Grab the blinking cylinder / Ask what that is
- Snatch the blinking cylinder / Ask what she just found

### dentist — The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

- Slam both hands down / Ask what's under there
- Slam hands onto the desk / Snatch the clipboard right back

### first day at hogwarts — The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.

- Tear off the hat / Ask if that's right
- Grab the wooden stool edge / Ask what house that is

### first day at hogwarts — The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.

- Grab the vibrating spear tip / Shove the heavy gold frame
- Grab the iron spearhead / Ask who sent you

### first day at hogwarts — Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.

- Push the glowing vial forward / Slide the stolen notes across
- Hand him the glowing vial / Slam the glass rod down

### first day at hogwarts — Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.

- Toss it into the fireplace / Throw it at the prefect
- Toss it toward the fireplace / Press it against his chest

### first day at hogwarts — The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

- Grab the glowing lantern / Stab the giant tentacle
- Grab the slimy tentacle / Throw the brass lantern forward

### my roommate is a ghost — The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.

- Grab the offered teacup / Turn off the faucet
- Take the dripping teacup / Turn off the running water

### my roommate is a ghost — Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.

- Pick up the coins / Push the laptop shut
- Pick up a coin / Type a sarcastic reply

### my roommate is a ghost — The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."

- Wipe the remaining fog away / Unscrew the leaking tap handle
- Wipe the entire mirror clean / Grab the still-running faucet handle

### my roommate is a ghost — The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.

- Point at the screen / Pick up the remote
- Point at the television screen / Kick the fallen remote aside

### my roommate is a ghost — Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

- Pick up the parchment / Open the closet door
- Pick up the parchment / Open the bottom drawer

### blind date — The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.

- Clink your glass against his / Ask to try the helmet on
- Clink your glass against his / Ask whose table this is

### blind date — Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.

- Point at the left man / Lift the red carnation
- Pick up the red carnation / Point at the left man

### blind date — The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.

- Grab the plastic cups / Drop the leash handles
- Lift the coffee cups / Drop the tangled leashes

### blind date — Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.

- Pull the velvet pouch out / Slip her your gallery badge
- Reach into the velvet pouch / Tap the nearest painting frame

### blind date — Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

- Slam the binder shut / Dip the fry in ketchup
- Eat the french fry / Slam the binder shut  ⟵ self-body:1

### airport security — The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.

- Slam both fists against glass / Slide the curved door open
- Tap on the glass / Reach for the emergency release

### airport security — The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.

- Unzip the duffel bag / Show him your fitness watch  ⟵ null-move:2
- Unzip the duffel bag / Smash the monitor screen

### airport security — A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.

- Wave open palms at him / Pach the dog's head
- Drop hands to pet him / Ask if he likes treats

### airport security — The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.

- Drop the boarding pass / Throw the scanner down
- Slam the boarding pass down / Throw the scanner at him

### airport security — Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

- Shove the canister back / Follow the panicked man
- Shove the canister back / Seize his running arm

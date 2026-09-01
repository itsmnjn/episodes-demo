# Choice eval run — 2026-09-01T22:48:39.817Z

- Choice writer: `google/gemini-3.5-flash-lite`
- Fixtures: `evals/expansions/2026-09-01T22-42-20-gemini-3.7-flash/run.json` (30 episodes)
- Pairs per episode: 2
- Pairs written: 60/60
- Latency: median 664ms, min 504ms, max 887ms

## Flags

| flag | moves | share of moves |
|---|---|---|
| self-body | 2 | 2% |
| null-move | 0 | 0% |
| noise | 1 | 1% |
| form | 6 | 5% |
| same-verb pair | 0 | 0% of pairs |
| **clean pairs** | 51 | 85% of pairs |

## System prompt

```text
You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

The two moves take the story in different directions. One goes along with what the scene is pushing toward; the other turns it into something else: a question, a joke, a gift, a bargain, a new problem. Grabbing and hitting are allowed, but not for both moves.

Each move is 2 to 6 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.
```

## Pairs

### zoo — The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.

- Reach up and grab it / Blow smoke into its face
- Blow softly at the snake / Grab the snake by the neck

### zoo — A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.

- Drop the map over its head / Offer the bird a silver fish
- Drop the map over its head / Ask the zookeeper for a fish

### zoo — The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.

- Press the silver release button / Offer the shiny buckle instead
- Unlatch the belt and toss it / Ask the bird what it wants

### zoo — A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.

- Point to the rustling tree above / Offer the monkey a loose coin
- Reach up and grab its tail / Point to the zookeeper and whistle  ⟵ noise:2

### zoo — Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

- Throw the bottle past her / Ask what is down there
- Splash water on his boots / Ask what is down there

### dentist — The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.

- Ask if he is serious / Spit the chip at him
- Grab the dentist's wrist / Ask if it transmits Wi-Fi

### dentist — The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.

- Grip the dental chair arms tight / Ask what the hell just broke
- Bite down on the tube / Ask what just broke off  ⟵ self-body:1

### dentist — You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.

- Bite down on the metal jaws / Ask if you offer loyalty discounts  ⟵ self-body:1
- Grab the incoming metal forceps / Ask him for the nitrous oxide first  ⟵ form:2

### dentist — Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.

- Grab the blinking cylinder from her / Ask what she just pulled out
- Grab the blinking capsule from her / Ask what she planted in me

### dentist — The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

- Slam the clipboard onto the desk / Ask what she keeps down there
- Slam the clipboard onto the desk / Ask if she needs a doctor

### first day at hogwarts — The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.

- Grab the brim and pull / Ask if it made a mistake
- Pull the hat down tighter / Ask what house that is

### first day at hogwarts — The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.

- Slam your palm against the canvas / Ask the knight about the shadows
- Grab the vibrating spear tip / Ask who sent the note

### first day at hogwarts — Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.

- Slide the glowing vial toward him / Hand him the stolen parchment roll
- Push the vial toward him / Hand him the stolen parchment

### first day at hogwarts — Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.

- Throw it into the roaring hearth / Ask why it hates me so
- Throw it into the hearth / Ask why it is screaming

### first day at hogwarts — The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

- Grab the slimy tentacle / Ask how to fight it
- Grab the glowing tentacle / Offer him a roasted chicken

### my roommate is a ghost — The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.

- Take the dripping teacup / Ask if it is earl grey
- Take the dripping wet teacup / Smash the floating cereal bowl

### my roommate is a ghost — Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.

- Pick up the silver coins / Ask how long ghosts use wifi
- Slide the silver coins toward him / Ask if wi-fi works in purgatory

### my roommate is a ghost — The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."

- Wipe the rest of the fog / Ask who is in the hall
- Wipe the remaining fog away / Ask who is in the living room  ⟵ form:2

### my roommate is a ghost — The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.

- Point at the television screen / Ask who the man is
- Pick up the fallen remote / Ask who the killer is

### my roommate is a ghost — Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

- Pick up the glowing parchment / Kick the closed closet door
- Pick up the glowing parchment / Ask what is inside the drawer

### blind date — The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.

- Lift your glass to him / Ask if he brought dessert
- Lift your wine glass to toast / Ask if dinner comes with armor

### blind date — Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.

- Point at the left man / Ask which one brought coffee
- Point to the left man / Smash the ceramic cup

### blind date — The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.

- Pull the leashes toward yourself / Ask to hold the baby
- Lift the coffee cups off the bench / Untangle the leashes from his shins  ⟵ form:1

### blind date — Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.

- Press the velvet pouch back into her hand / Ask the approaching guards for directions  ⟵ form:1
- Press a kiss to her cheek / Slip the pouch to her hand

### blind date — Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

- Flip open the binder and read / Slam the stopwatch onto the floor
- Flip the binder to the floor / Dunk the fry in ketchup

### airport security — The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.

- Step out of the glass cylinder / Offer the agent my open palm
- Slide open the heavy glass door / Ask if the machine needs glasses

### airport security — The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.

- Unzip the duffel bag slowly / Ask whose heart they mean
- Open the duffel bag slowly / Ask whose bag that actually is

### airport security — A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.

- Show him the boarding pass / Pet the golden retriever
- Drop to pet the dog / Ask what the dog detected

### airport security — The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.

- Drop the boarding pass on the counter / Ask which flight this is about  ⟵ form:1
- Smash the scanner into his face / Ask how much the bounty is

### airport security — Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

- Shove the canister back into his coat / Ask him whose bomb this is  ⟵ form:1
- Shove the canister back toward him / Ask what is inside the canister

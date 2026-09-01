# Choice eval run — 2026-09-01T22:50:34.580Z

- Choice writer: `google/gemini-3.5-flash-lite`
- Fixtures: `evals/expansions/2026-09-01T22-42-20-gemini-3.7-flash/run.json` (30 episodes)
- Pairs per episode: 2
- Pairs written: 60/60
- Latency: median 637ms, min 468ms, max 1021ms

## Flags

| flag | moves | share of moves |
|---|---|---|
| self-body | 0 | 0% |
| null-move | 0 | 0% |
| noise | 2 | 2% |
| form | 2 | 2% |
| same-verb pair | 0 | 0% of pairs |
| **clean pairs** | 57 | 95% of pairs |

Top verbs: ask 21 (18%), grab 14 (12%), push 8 (7%), slam 6 (5%), drop 6 (5%), point 6 (5%)

## System prompt

```text
You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

The two moves take the story in different directions, and they are different kinds of move: not two grabs, and not a grab and a question every time. Offers, bargains, jokes, dares, gifts, accusations, and small acts of sabotage all count.

Each move is one action in 2 to 5 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.
```

## Pairs

### zoo — The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.

- Blow on its nose / Tap the glass lightly
- Grab the hanging snake / Slam the maintenance hatch

### zoo — A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.

- Drop the map over it / Ask if it needs help
- Toss a fish down / Point at the zookeeper

### zoo — The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.

- Press the quick-release buckle / Punch the beak away
- Unclasp the belt buckle / Tap the bird's beak

### zoo — A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.

- Point at the furry thief / Grab the harness straps dangling
- Grab the harness strap / Say here is your monkey

### zoo — Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

- Drop the water bottle / Ask what's in the grass
- Throw the water bottle aside / Ask what is down there

### dentist — The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.

- Laugh and ask if he is serious / Knock the computer monitor off the wall  ⟵ form:1, form:2
- Laugh and shake your head / Ask how it got there

### dentist — The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.

- Push the assistant away / Grab the broken drill bit
- Grab the suction tube / Ask what just broke

### dentist — You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.

- Grab his gloved wrist / Ask if he is joking
- Push the metal tray away / Ask what he just said

### dentist — Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.

- Reach up and grab it / Ask what is inside me
- Point at the blinking light / Ask what she just found

### dentist — The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

- Grab the edge of the desk / Slam the clipboard down hard
- Slam the desk in anger / Drop a heavy coin down

### first day at hogwarts — The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.

- Gasp at the hat / Grab the wooden stool
- Pull the hat backward off / Ask why everyone is staring

### first day at hogwarts — The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.

- Grab the vibrating spear tip / Ask who commands the shadows
- Grab the vibrating spear tip / Ask who commands the shadows

### first day at hogwarts — Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.

- Push the glowing vial forward / Say I brewed it entirely alone
- Push the glowing vial forward / Say they are my own notes

### first day at hogwarts — Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.

- Throw it into the hearth / Toss it to the prefect
- Toss it into the fire / Throw it at the prefect

### first day at hogwarts — The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

- Grab the slimy tentacle / Shout at Hagrid for help  ⟵ noise:2
- Grab the giant tentacle / Shout at Hagrid for help  ⟵ noise:2

### my roommate is a ghost — The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.

- Take the dripping teacup / Turn off the running water
- Take the dripping teacup / Turn off the running water

### my roommate is a ghost — Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.

- Sweep the coins off / Push the laptop closed
- Sweep the coins off / Ask what month it is

### my roommate is a ghost — The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."

- Slam fist against the glass / Wipe the fog away completely
- Wipe the fog away / Smash the mirror glass

### my roommate is a ghost — The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.

- Ask who the killer is / Point at the mugshot
- Ask who she is murdering / Point toward the bedroom door

### my roommate is a ghost — Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

- Pick up the parchment / Open the bottom drawer
- Pick up the parchment / Open the bottom drawer

### blind date — The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.

- Push the wine glass forward / Ask whose war we are fighting
- Clink your glass against his / Ask to try the helmet

### blind date — Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.

- Slide the carnation between them / Point at the left one
- Pick up the carnation / Ask which one brought coffee

### blind date — The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.

- Drop the leashes immediately / Lift the coffee cups
- Drop the coffee cups / Pull the leashes back

### blind date — Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.

- Pass her the velvet pouch / Step in front of her
- Pull the velvet pouch out / Slip her your gallery pass

### blind date — Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

- Dip the fry in ketchup / Flip the binder closed
- Flip the binder shut / Smash the stopwatch flat

### airport security — The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.

- Push open the cylinder door / Show him your empty hands
- Push the frosted glass door / Ask what the alarm means

### airport security — The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.

- Throw the passport at him / Flip the bin over
- Throw the passport at him / Slam both hands down hard

### airport security — A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.

- Show him your boarding pass / Ask what the dog found
- Lower hands to pet dog / Ask if he's a good boy

### airport security — The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.

- Throw the boarding pass at them / Slam your hands on the counter
- Drop the boarding pass / Shove the barcode scanner

### airport security — Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

- Grab the duct-taped canister / Shove the bin past him
- Shove the canister toward him / Grab the fleeing man's arm

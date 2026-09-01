# Choice eval run — 2026-09-01T22:55:17.739Z

- Choice writer: `google/gemini-3.7-flash`
- Fixtures: `evals/expansions/2026-09-01T22-42-20-gemini-3.7-flash/run.json` (30 episodes)
- Pairs per episode: 2
- Pairs written: 60/60
- Latency: median 1828ms, min 865ms, max 5284ms

## Flags

| flag | moves | share of moves |
|---|---|---|
| self-body | 0 | 0% |
| null-move | 0 | 0% |
| noise | 7 | 6% |
| form | 1 | 1% |
| same-verb pair | 0 | 0% of pairs |
| **clean pairs** | 53 | 88% of pairs |

Top verbs: ask 18 (15%), slam 8 (7%), demand 7 (6%), shove 7 (6%), slide 7 (6%), push 5 (4%)

## System prompt

```text
You write the protagonist's next move in a first-person video story. You are given the scene so far; it ends on a cliffhanger. Write two moves the protagonist could make right now.

A move is something the protagonist does to a person, an object, or the room in front of them, or something they say. It has to be possible from exactly where the scene stopped, and it has to change what happens next. Nothing done to their own body, and no waiting, watching, or stepping back.

The two moves take the story in different directions, and they are different kinds of move: not two grabs, and not a grab and a question every time. Offers, bargains, jokes, dares, gifts, accusations, and small acts of sabotage all count.

Each move is one action in 2 to 5 words starting with a verb, like "Hand him the apple" or "Ask who sent the note". Plain text, no punctuation at the end, no quotation marks. Output exactly two lines, one move per line, nothing else.
```

## Pairs

### zoo — The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.

- Slam the metal hatch shut / Offer your arm to it
- Push the hatch door shut / Whistle softly at it  ⟵ noise:2

### zoo — A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.

- Scoop up the wet penguin / Call the zookeeper over
- Scoop up the penguin / Shout for the zookeeper  ⟵ noise:2

### zoo — The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.

- Unlatch the chrome belt buckle / Push the long neck away
- Push its beak away / Unfasten the shiny belt buckle

### zoo — A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.

- Tell the keeper he found you / Offer the monkey your finger
- Point to your left shoulder / Tell the keeper to freeze

### zoo — Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

- Pour water onto the grass / Ask what is down there
- Pour water onto the grass / Ask if it is venomous

### dentist — The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.

- Joke about government mind control / Demand he extract it immediately
- Throw off the lead apron / Ask who paid him

### dentist — The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.

- Grab the suction tube / Push the dentist away
- Spit into the metal tray / Knock away the suction tube

### dentist — You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.

- Shove the metal tray over / Yell that you only wanted a cleaning  ⟵ noise:2, form:2
- Knock over the metal tray / Demand to see the chart

### dentist — Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.

- Slap the floss away / Demand who planted it
- Knock the device away / Shout to drop it  ⟵ noise:2

### dentist — The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

- Slam the glass window shut / Ask what triggered the alarm
- Slam the sliding partition shut / Ask what button she pressed

### first day at hogwarts — The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.

- Demand an immediate resort / Rip off the Sorting Hat
- Pull off the Sorting Hat / Ask McGonagall what that means

### first day at hogwarts — The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.

- Bat the spearhead aside / Ask how to lose them
- Push the spear aside / Ask whose shadows they are

### first day at hogwarts — Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.

- Slide the vial toward him / Claim you invented the recipe
- Slide the potion toward him / Blame Malfoy for the recipe

### first day at hogwarts — Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.

- Toss it into the fireplace / Shove it down his robes
- Toss it into the fireplace / Stuff it down his robes

### first day at hogwarts — The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

- Strike the tentacle with an oar / Yell for Hagrid to help  ⟵ noise:2
- Strike it with an oar / Ask Hagrid what to do

### my roommate is a ghost — The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.

- Take the offered teacup / Ask if they want sugar
- Take the offered teacup / Slam the cabinet door shut

### my roommate is a ghost — Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.

- Slide the coins back across / Tell him the price doubled
- Slide the coins back / Demand the streaming fee too

### my roommate is a ghost — The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."

- Open the medicine cabinet / Say you came home alone
- Wipe the mirror clear / Ask who is talking

### my roommate is a ghost — The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.

- Ask how she died / Unplug the television set
- Unplug the television power cord / Ask if he killed her

### my roommate is a ghost — Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

- Kick the parchment back under / Yank the closet door open
- Tear the parchment in half / Yank the closet door open

### blind date — The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.

- Slide him the wine glass / Ask who sent him
- Clink your glass against his / Blow out the candle flame

### blind date — Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.

- Slide the carnation left / Demand the safe code
- Slide the carnation between them / Ask for the passphrase

### blind date — The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.

- Scoop up the iced coffees / Demand he take them back
- Drop the tangled leashes / Catch the tipping coffee cups

### blind date — Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.

- Pull her into a kiss / Knock over the nearest sculpture
- Pull her into an embrace / Knock over the pedestal sculpture

### blind date — Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

- Slam his binder shut / Ask who hired him
- Slam the binder shut / Ask who hired him

### airport security — The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.

- Shove open the exit panel / Claim it is a pacemaker
- Shove open the exit panel / Claim it is a pacemaker

### airport security — The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.

- Hand him a transplant permit / Slam the conveyor reverse switch
- Claim it is a transplant / Slam the conveyor emergency button

### airport security — A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.

- Blame the airport breakfast sandwich / Kick the heavy shoe free
- Ask if jerky is illegal / Kick off the trapped shoe

### airport security — The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.

- Shove the podium into him / Shout that Mercer is on board  ⟵ noise:2
- Shove the podium monitor over / Claim he has wrong identity

### airport security — Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

- Shove the canister under the belt / Point security toward the runner
- Toss canister into another bin / Yell to stop the runner  ⟵ noise:2

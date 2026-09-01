# Premise expansion run — 2026-09-01T22:42:20.194Z

- Expander and root writer: `google/gemini-3.7-flash` at temperature 1.5
- Choice writer: `google/gemini-3.5-flash-lite`
- Scenes per premise: 5
- Duration: 10s
- Expanded: 6/6

## Latency

| premise | expand | root write | choice write |
|---|---|---|---|
| zoo | 5080ms | median 1798ms, min 1298ms, max 4988ms | median 460ms, min 403ms, max 509ms |
| dentist | 6419ms | median 1557ms, min 1193ms, max 1869ms | median 382ms, min 372ms, max 544ms |
| first day at hogwarts | 4353ms | median 2032ms, min 1347ms, max 4349ms | median 409ms, min 382ms, max 489ms |
| my roommate is a ghost | 4657ms | median 1708ms, min 1237ms, max 3251ms | median 483ms, min 363ms, max 608ms |
| blind date | 4637ms | median 4129ms, min 1511ms, max 5145ms | median 417ms, min 378ms, max 430ms |
| airport security | 5469ms | median 1806ms, min 1469ms, max 4424ms | median 406ms, min 355ms, max 434ms |
| **all** | median 5080ms, min 4353ms, max 6419ms | median 1865ms, min 1193ms, max 5145ms | median 417ms, min 355ms, max 608ms |

## Expansions

### zoo

1. The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.
2. A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.
3. The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.
4. A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.
5. Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

#### zoo 1 — root 3681ms, choices 403ms

> The humid reptile house is quiet until a sudden scraping noise echoes from the ceiling above the terrariums. An overhead maintenance hatch swings open, and a green tree python slowly dangles down inches from your face.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking through the glass of an illuminated terrarium filled with wet ferns and mist. Two hands rest on a polished wooden guardrail at the bottom of the frame. A sharp metallic scraping sound echoes overhead, followed by a loud click. Looking straight up at the industrial ceiling, a square metal maintenance hatch drops open on its hinge with a metallic clatter. A vibrant emerald-green tree python lowers out of the opening, its body uncoiling downward in midair until its triangular head hangs stationary inches in front of the frame, its dark tongue flicking rapidly.

overall_soundscape: Low electric hum of terrarium heat lamps, periodic hissing of water mist systems, sharp metallic scraping and latch click, heavy creak and bang of the swinging metal hatch, faint dry rustle of scales sliding over metal.

non_diegetic_music: None.
```

1. Tap the glass sharply
2. Swallow the python whole

#### zoo 2 — root 1740ms, choices 460ms

> A crowd of children giggles around the glass of the penguin exhibit while a trainer tosses fish into the pool. A soaked penguin launches itself completely over the acrylic barrier, landing with a wet thud right on your sneakers.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A low acrylic barrier separates the tiled walkway from a brightly lit penguin enclosure, where a zookeeper in a blue polo tosses small silvery fish into churning turquoise water. A dozen small children crowd the railing to the left, pointing and jumping. Hands enter from the bottom of the frame holding a folded zoo map. In the pool, a gentoo penguin shoots straight up out of the water like a missile, clearing the top edge of the acrylic wall. It flies through the air and crashes down with a heavy, wet slap across the tops of the white sneakers at the bottom of the frame. The drenched bird sits upright on the shoes, shakes its head rapidly, spraying droplets, and tilts its beak directly up into the camera.

overall_soundscape: Splashing pool water, excited high-pitched giggling and chatter of children, a wet slapping thud on canvas shoes, rapid feather-shaking flapping sound, and background indoor zoo ambient echo.

non_diegetic_music: None.
```

1. Drop the map over it
2. Pick up the penguin

#### zoo 3 — root 4988ms, choices 509ms

> The open-air safari tram jerks to an unexpected halt on the dirt trail while the automated tour guide audio continues cheerfully playing. A massive adult ostrich strides directly to your side of the bench, tilts its head sideways, and pecks hard at your shiny belt buckle.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. The open metal bench shakes as the safari tram skids to a sudden halt, kicking up a puff of dry orange dust along the dirt track. Two hands grip the green padded safety bar directly ahead. Through the open side of the vehicle, a tall adult ostrich with ruffled black plumage and a long, bare neck strides swiftly up the dirt shoulder. It stops beside the row, towering over the rail, and cocks its head flat to the side, fixing a round black eye on the seat. The bird snaps its neck downward, thrusting its broad beak directly into the polished chrome belt buckle between the hands.

overall_soundscape: Brakes squealing, tram frame rattling, automated cheery tour guide narration over a tinny loudspeaker, rapid bird footsteps on gravel, and a loud metallic tap of a beak striking metal.

non_diegetic_music: None.
```

1. Strike the beak with your fist
2. Swab the metal with barbecue sauce

#### zoo 4 — root 1798ms, choices 473ms

> A keeper rushes down the boardwalk near the primate habitat, clutching an empty harness and looking around in a panic. A young capuchin monkey drops onto your shoulder from an overhead branch and wraps its tiny fingers tightly around your ear.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A wooden boardwalk stretches forward under a canopy of lush green leaves, bordered by a rope railing. A zoo keeper wearing a tan uniform, a young woman with a high ponytail, sprints toward the camera clutching an empty black nylon harness, scanning the trees frantically. (S1), an urgent, breathless female voice, says <d>[English] Please tell me you haven't seen a tiny monkey!</d> A sudden rustle shakes the foliage above, and a small brown capuchin monkey with a cream-colored face drops directly into the left side of the frame, landing on the left shoulder. Two pale hands enter from the bottom of the frame, rising open in surprise. The monkey's small, leathery fingers reach out and grip tightly around the left ear, its wide dark eyes staring straight into the camera as it bares its teeth in a silent grin.

overall_soundscape: Rapid footsteps pounding on wooden planks, rustling canopy leaves, distant squawks of tropical birds, a heavy thump of a small body landing, and light chirping from the capuchin close to the microphone.

non_diegetic_music: None.
```

1. Reach up and grab it
2. Imitate the monkey's grin

#### zoo 5 — root 1298ms, choices 431ms

> Dozens of visitors are relaxing on the lawn near the flamingo pond under the warm afternoon sun. A loud siren begins wailing over the park loudspeakers as a voice announces that all guests in your exact pavilion must remain completely still.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across a grassy lawn at a shallow pond where bright pink flamingos wade, visitors lounging on picnic blankets beneath the bright sun. A pair of hands in blue denim cuffs enters the bottom of the frame, unscrewing the cap of a plastic water bottle. A high-pitched, oscillating siren blares from a speaker mounted on a wooden pavilion post just three feet away, cutting off the chatter. A park ranger in a khaki uniform and wide-brimmed hat steps directly in front of the lens, raises both open hands, and (S1), a stern female voice amplified through a handheld megaphone, says <d>[English] Attention Pavilion C! Do not move a single muscle!</d> The ranger's gaze shifts intently toward the grass right between the protagonist's sneakers.

overall_soundscape: Distant bird squawks, a loud mechanical siren echoing, plastic bottle crackling, amplified megaphone feedback, and rustling grass.

non_diegetic_music: None.
```

1. Look down at the grass
2. Squirt water at her boots

### dentist

1. The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.
2. The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.
3. You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.
4. Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.
5. The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

#### dentist 1 — root 1193ms, choices 382ms

> The dentist taps the glowing digital X-ray on the monitor while adjusting the heavy lead apron over your chest. He squints at your upper jaw, lowers his glasses, and asks if you have ever had a microchip implanted beneath your gums.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Under the harsh glare of an overhead dental lamp, a dentist in blue scrubs and clear wire-rimmed glasses reaches down, smoothing a heavy grey lead apron across the bottom of the frame. He turns to a glowing computer monitor on the wall, pointing a gloved index finger at a high-contrast digital X-ray of an upper jaw. He taps the glass twice over a bright, metallic rectangle wedged between two upper molars, leans in close, and pulls his glasses down to the tip of his nose. Looking directly down into the lens, (S1), a mild, inquisitive male voice, says <d>[English] Have you ever had a microchip placed under your gums?</d>

overall_soundscape: Low hum of the dental light, soft crinkle and heavy thud of the lead apron settling, two sharp taps against a glass monitor screen, faint ventilation hiss.

non_diegetic_music: None.
```

1. Ask what he found
2. Bark like a dog

#### dentist 2 — root 1557ms, choices 466ms

> The high-pitched whine of the drill fills the small exam room as the assistant hovers with the suction tube near your cheek. The tip of the tool suddenly snaps off with a muffled pop, and the dentist freezes before urgently warning the assistant not to let you swallow.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking up past a bright circular overhead lamp into the faces of a male dentist and a female dental assistant wearing surgical masks and protective eyewear. The dentist holds an angled metallic drill emitting a shrill whine while the assistant extends a clear plastic suction tube hovering close to the lower edge of the view. The drill spins, then jerks with a sharp metallic snap, its spinning tip disappearing from the shaft. The dentist freezes in place, his eyes widening above his paper mask, and (S1), a sharp strained male voice, says <d>[English] Don't move. Keep the suction tight, do not let them swallow!</d> The assistant thrusts the suction tip deeper, her brow furrowed as both lean in closer.

overall_soundscape: High-pitched mechanical dental drill whining then cutting out, a sharp metallic snap, constant wet suction hissing, fluorescent hum.

non_diegetic_music: None.
```

1. Grab the suction tube
2. Swallow the drill bit

#### dentist 3 — root 1869ms, choices 544ms

> You sit tipped completely back in the padded chair while the oral surgeon cheerfully lays out heavy extraction forceps on a stainless steel tray. He pulls up his mask, winks, and loudly congratulates you on making the bold decision to pull out every single tooth at once.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking up at the bright circular overhead examination lamp and white acoustic ceiling tiles of a dental operatory. A silver metal tray swings into the upper edge of view, where a tall, broad-shouldered oral surgeon with silver-streaked hair and bright blue scrubs sets down three pairs of large, cross-hatched metal extraction forceps, each clinking against the tray. He reaches up with gloved hands, pulls a pleated blue surgical mask over his nose, leans down directly over the chair, and winks. (S1), an upbeat, resonant male voice, says <d>[English] Love this bold choice, pulling every single tooth today!</d> He raises a heavy pair of forceps in his right fist and brings the cross-hatched metal jaws down toward the lens.

overall_soundscape: Low hum of the overhead lamp, ventilation airflow, metallic clanking of heavy forceps on a stainless steel tray, elastic snapping of a surgical mask.

non_diegetic_music: None.
```

1. Bite his gloved finger
2. Sing a show tune

#### dentist 4 — root 1865ms, choices 382ms

> Soft jazz plays through the ceiling speakers as the hygienist carefully flosses between your back molars with mint-flavored string. Her hands suddenly halt as the thread snags, pulling free a tiny plastic cylinder that immediately begins beeping with a steady red pulse.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking up from a reclined dental chair at a bright circular examination light and the face of a hygienist in blue scrubs, protective clear glasses, and a blue surgical mask. Her purple-gloved hands work near the lower edge of the view, pulling taut white dental floss between teeth. Both of her hands abruptly stop moving. She slowly lifts the floss out into the center of the light, revealing a black plastic cylinder the size of a grain of rice caught in the looped thread, blinking with a bright red LED light at rapid, regular intervals. The hygienist tilts her head down, her eyebrows furrowing above her mask, and (S1), a muffled calm female voice, says <d>[English] Keep your mouth completely still for a moment, please.</d> The blinking red light speeds up, its pitch rising.

overall_soundscape: Soft smooth jazz over an overhead speaker, the gentle hum of dental equipment suction, the snap of dental floss, followed by a faint rhythmic electronic beep that accelerates in tempo.

non_diegetic_music: None.
```

1. Ask what that is
2. Swallow the blinking cylinder

#### dentist 5 — root 1391ms, choices 372ms

> The receptionist slides back the frosted glass window to hand you a clipboard while the waiting room fish tank hums in the corner. She glances down at your intake form, goes completely rigid, and quietly asks you not to move from your chair while she hits the panic button under her desk.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. The frosted glass partition slides open along its metal track, revealing a middle-aged receptionist with short brown hair, silver-framed glasses, and a blue cardigan sitting behind a laminate desk. Two hands enter from the bottom of the frame and hold out a wooden clipboard with a completed white intake sheet. The receptionist takes the clipboard, looks down at the top page, and stops moving entirely, her shoulders locking in place. Without blinking or raising her head, (S1), a tight, barely audible female voice, says <d>[English] Please do not get up from your seat right now.</d> Her right shoulder drops as her right hand reaches down beneath the desk surface, followed by a faint metallic click under the counter, her eyes slowly shifting up to stare directly forward.

overall_soundscape: The continuous low electric hum and water bubbling of a fish tank, sliding glass on metal, the rustle of a clipboard changing hands, a quiet metallic click under a desk.

non_diegetic_music: None.
```

1. Grab the receptionist's glasses
2. Ask about the fish tank

### first day at hogwarts

1. The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.
2. The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.
3. Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.
4. Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.
5. The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

#### first day at hogwarts 1 — root 1347ms, choices 409ms

> The Great Hall buzzes beneath thousands of floating candles as Professor McGonagall lowers the Sorting Hat onto your head. The hat’s frayed brim twists into a grimace before screaming out a house name that has been forbidden for centuries.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across the Great Hall beneath thousands of floating candles toward hundreds of seated students watching from long wooden tables. Standing immediately before the stool, Professor McGonagall, an elderly woman with square spectacles and dark emerald robes, lowers the frayed, patched brown leather Sorting Hat downward until its brim rests just above the field of view. Two hands in black school robes rest on the wooden edges of the stool. The leather folds of the hat's brow twist and split into a wide, gaping tear at the brim, and (S1), a raspy, booming theatrical voice, shouts <d>[English] MORGANA!</d>

overall_soundscape: Murmur of hundreds of voices, flickering flame flutter, rustling heavy fabric, wood scraping softly, followed by a loud theatrical roar echoing through the hall.

non_diegetic_music: None.
```

1. Grab the old hat
2. Yell about the rent

#### first day at hogwarts 2 — root 2032ms, choices 489ms

> The grand marble staircase suddenly groans and swings away from the crowded corridor toward a dusty landing on the restricted third floor. A portrait of an armored knight points a trembling spear directly at you, whispering that the shadows at your heels do not belong to you.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking down along the curving banister of the grand marble staircase as the stone treads grind against the wall, shifting sideways away from the bustling ground-floor hall and locking into a dark, dust-covered archway marked "RESTRICTED 3RD FLOOR." Two hands in wool sweater cuffs reach out to grip the smooth marble rail. Directly ahead in the dim alcove, the painted figure inside a gold-framed oil portrait moves; (S1), an armored knight with a visor raised over glowing painted eyes, thrusts an iron-tipped spear forward out of the canvas, pointing the vibrating tip toward the lens, and says in a raspy, metallic whisper <d>[English] The shadows at your heels do not belong to you.</d>

overall_soundscape: Deep grinding of heavy stone mechanisms, echoing chatter fading from below, the scrape of canvas, a hollow metallic whisper, and the hum of settling dust.

non_diegetic_music: None.
```

1. Grab the iron spearhead
2. Offer the knight a lozenge

#### first day at hogwarts 3 — root 2191ms, choices 489ms

> Steam rises from dozens of brass cauldrons in the chilly dungeon as Professor Snape glides silently between the workstations. He stops abruptly at your desk, eyes narrowing at the glowing violet liquid bubbling in your vial before asking whose forbidden notes you used to brew it.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A glass stirring rod held in a right hand swirls a bubbling, glowing violet liquid inside a clear glass vial resting on the wooden workstation. Pale steam drifts past from neighboring brass cauldrons in the stone dungeon. Black robes sweep into the frame from the aisle as Severus Snape, a pale man with shoulder-length greasy black hair and a hooked nose, comes to a sudden halt opposite the desk. The right hand places the stirring rod down onto the slate tabletop. Snape leans slightly forward, his dark eyes fixed directly on the luminous purple potion, then slowly rises to look straight into the camera lens. (S1), a low, silky, menacing male voice, says <d>[English] Whose forbidden notes did you steal to brew this concoction?</d>

overall_soundscape: Bubbling liquids, gentle clink of glass on stone, hissing steam, the rustle of heavy black robes, echoing dungeon silence.

non_diegetic_music: None.
```

1. Throw the vial at him
2. Drink the violet liquid

#### first day at hogwarts 4 — root 1997ms, choices 382ms

> Trunks pop open around the circular common room as excited first-years compare wands and unpack their squawking owls. A breathless prefect rushes over and thrusts a smoking, screeching red envelope into your hands, warning you that the Howler will detonate in three seconds.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across a circular stone common room lit by a roaring hearth, where children in black robes unpack brass-bound trunks and hold up polished wooden wands while caged owls hoot and flutter on velvet armchairs. A tall older boy with a shining silver badge on his robes rushes through the cluster of students, carrying a crimson envelope emitting thick grey smoke and high-pitched mechanical shrieks. Two hands in black wool sleeves enter from the bottom of the frame with palms open. The older boy slaps the vibrating red envelope directly into the hands, and (S1), a breathless teenage boy's voice, says <d>[English] Catch that! It’s going to blow in three seconds!</d> The envelope’s wax seal rips open on its own, expanding into the shape of a wide, jagged paper mouth that glows bright red and draws in a massive breath.

overall_soundscape: Crackling fireplace, fluttering wings, owl hoots, chattering students, rushing footsteps on stone floor, high-pitched screeching and hissing smoke, sharp intake of air from the tearing envelope.

non_diegetic_music: None.
```

1. Toss it into the fire
2. Stuff it in his mouth

#### first day at hogwarts 5 — root 4349ms, choices 396ms

> The fleet of wooden boats glides silently across the black glass of the Great Lake toward the towering silhouette of the castle. Hagrid suddenly turns his lantern toward your boat, shouting for you to keep your hands inside as a massive, glowing tentacle wraps around your hull.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A fleet of small wooden boats glides smoothly over black, mirror-like water toward the distant silhouette of a massive stone castle with glowing amber windows. Two hands reach forward from the bottom of the frame and rest on the wooden gunwale. In the lead boat ahead, Rubeus Hagrid, a towering man with a thick, tangled black beard and heavy coat, swings a brass lantern around, directing its bright yellow beam back at the boat. (S1), a booming, rough male voice, says <d>[English] Keep yer hands inside the boat, right now!</d> The hands pull back quickly from the rim. The water churns, and a massive, bioluminescent tentacle rises from the depths and curls tightly over the wooden bow, squeezing the timber until it groans.

overall_soundscape: Gentle lapping of lake water, low distant wind, creaking wood, Hagrid's booming shout, a heavy surge and splash of water, wet suction, and splintering boat timber.

non_diegetic_music: None.
```

1. Grab the giant tentacle
2. Sing a sea shanty

### my roommate is a ghost

1. The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.
2. Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.
3. The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."
4. The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.
5. Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

#### my roommate is a ghost 1 — root 1237ms, choices 498ms

> The kitchen sponge is floating over the sink, scrubbing a bowl in mid-air while a breezy voice hums an eerie 1920s jazz tune. A translucent hand suddenly reaches out of the cabinet and offers you a dripping wet teacup.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A yellow kitchen sponge hovers in mid-air over the stainless-steel sink, rubbing in small circles inside a floating ceramic cereal bowl under a thin stream of running tap water while an airy, melodic humming carries a jaunty 1920s jazz tune from the empty space above. Two hands enter from the bottom of the frame, reaching toward the faucet handle, but freeze in place as the upper cabinet door swings slowly outward on squeaking hinges. A pale, semi-transparent human hand extends from the dark interior shelf, holding out a steaming, dripping wet porcelain teacup directly toward the lens.

overall_soundscape: Thin stream of running water splashing in the sink, wet sponge squelching rhythmically against ceramic, a distant breezy hummed 1920s jazz melody, and the slow squeak of wooden cabinet hinges.

non_diegetic_music: None.
```

1. Take the dripping teacup
2. Smash the floating bowl

#### my roommate is a ghost 2 — root 1674ms, choices 483ms

> Three ancient silver coins drop onto your laptop keyboard from the ceiling, clinking softly against the spacebar. A misty silhouette coalesces across the kitchen table, crosses its arms, and politely asks if this covers their half of the Wi-Fi bill.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking down at an open laptop on a wooden kitchen table, hands typing on the keyboard. Three heavy, tarnished silver coins fall from above, clattering onto the keys and settling against the spacebar. The hands stop typing, hovering above the keys. Tilting upward, a translucent grey mist swirls across the opposite side of the table, condensing into the faint figure of a person in a Victorian waistcoast. The figure crosses its translucent arms, leans forward slightly, and (S1), an airy, polite male voice, says <d>[English] Does this adequately settle my half of the internet bill?</d> The figure tilts its head, waiting for a response.

overall_soundscape: Rapid plastic keyboard clicking, the sharp metallic clinking of coins hitting the keys and table, faint ethereal wind whooshing softly, refrigerator hum in the background.

non_diegetic_music: None.
```

1. Pick up the coins
2. Lick the translucent forehead

#### my roommate is a ghost 3 — root 3251ms, choices 400ms

> The bathroom mirror is heavily fogged over despite the ice-cold running tap, and unseen fingers slowly trace letters through the condensation. The dripping message finishes spelling out, "We need to talk about who you brought home last night."

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking into a white porcelain basin where a chrome faucet runs cold water over the metal drain. A right hand enters from the bottom of the frame and twists the cold tap handle tight, but the water continues to gush out. Looking up to the medicine cabinet mirror, thick white condensation covers the glass. Clear vertical and horizontal lines drag through the fog with high-pitched squeaks, droplets rolling down the reflective surface as invisible strokes finish spelling out the final words: "We need to talk about who you brought home last night."

overall_soundscape: Steady rush of running water into a full basin, high-friction squeaks of movement on wet glass, light dripping on porcelain.

non_diegetic_music: None.
```

1. Wipe the mirror clean with your sleeve
2. Lick the wet condensation off the glass

#### my roommate is a ghost 4 — root 1708ms, choices 608ms

> The television remote levitates off the sofa, aggressively flipping channels until it lands on a true-crime documentary. An icy draft brushes the back of your neck as a voice whispers that the suspect on screen used to live in your bedroom.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across the living room at a black television remote resting on the grey fabric cushion of the sofa. The remote lifts into the air, floating horizontally, its buttons pressing downward in rapid succession. The television screen cycles rapidly through a cartoon, a football match, and a cooking show before stopping on a mugshot of a bearded man with the onscreen text "UNSOLVED: THE BEDROOM KILLER." A translucent, pale grey silhouette of a woman materializes beside the television, leaning slightly forward, and (S1), a breathy, chill female whisper, says <d>[English] He slept right where your bed is now.</d> The remote drops straight down, hitting the floorboards beneath the sofa.

overall_soundscape: Rapid electronic channel clicks, the distant low drone of the true-crime narration, a faint rush of cold wind, and the sharp plastic clatter of the remote hitting wooden floorboards.

non_diegetic_music: None.
```

1. Ask who the man is
2. Lick the television screen

#### my roommate is a ghost 5 — root 2050ms, choices 363ms

> Cardboard moving boxes are hovering in mid-air, neatly unpacking themselves into the hallway closet with impossible precision. The closet door abruptly slams shut on its own, and a glowing piece of parchment slides out from underneath warning you never to open the bottom drawer.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Standing in a narrow wooden hallway, watching three sealed cardboard moving boxes levitate two feet off the floor. The top flaps of the center box peel open by themselves with a crisp tear of tape, and a stack of folded white towels floats out in a steady arc, gliding through the open hallway closet doorway and settling onto an upper shelf. The wooden closet door swings violently shut with a heavy bang. From the thin gap beneath the closed door, a slip of parchment glowing with pale golden light slides rapidly across the floorboards, stopping inches away, displaying crisp black ink that reads, "DO NOT OPEN THE BOTTOM DRAWER."

overall_soundscape: Soft humming of levitation, tearing packing tape, smooth sliding of fabric through air, loud wooden door slam, and the faint hiss of paper sliding across hardwood.

non_diegetic_music: None.
```

1. Pick up the glowing parchment
2. Kick the bottom drawer open

### blind date

1. The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.
2. Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.
3. The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.
4. Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.
5. Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

#### blind date 1 — root 1620ms, choices 421ms

> The candlelit bistro is quiet except for soft jazz, and the waiter has just poured two glasses of red wine. A person in a full suit of medieval armor sits down across from you, lifts the visor with a metallic clatter, and asks if you are ready for destiny.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Sitting at a small bistro table draped in a white cloth, where a single tea candle flickers beside two filled glasses of red wine. A right hand enters from the bottom of the frame to adjust the stem of one wine glass. Across the table, a figure clad entirely in polished medieval steel plate armor pulls out the wooden chair and sits down. The armored right gauntlet reaches up to the helmet, pushing the hinged visor upward with a sharp metallic clatter, revealing a pair of wide, unblinking eyes. (S1), an echoing, slightly muffled male voice inside the helmet, says <d>[English] Are you prepared to meet your destiny tonight?</d> The figure leans forward, resting both heavy steel gauntlets flat on the white tablecloth.

overall_soundscape: Soft jazz saxophone in the background, a chair scraping across a hardwood floor, metal armor clinking and rattling, the metallic snap of a raised visor, breathing echoing inside a steel helmet.

non_diegetic_music: None.
```

1. Clink your wine glass against his metal gauntlet
2. Pour red wine straight into his eye slit

#### blind date 2 — root 4335ms, choices 397ms

> Rain streams down the coffee shop window as you wait by the counter with the red carnation your matchmaker told you to bring. Two identical twins in matching trench coats slide into your booth at the exact same second, point at each other, and simultaneously warn you that the other is an imposter.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across a dark wooden booth table where rain runs down a glass window beside it. A right hand enters from the bottom of the frame and sets a single red carnation beside an empty ceramic cup. Two identical clean-shaven men in wet beige trench coats slide onto the opposite bench seat in exact unison. Both snap their right index fingers up to point at each other's chests and lean forward over the table. (S1), a sharp tenor voice, and (S2), an identical sharp tenor voice, say together <d>[English] Do not trust him, he is an imposter.</d> Their fingers remain leveled at each other, their eyes locked on the lens.

overall_soundscape: Steady rain against glass, porcelain scraping lightly on wood, the squeak and rustle of wet trench coats sliding across vinyl seating.

non_diegetic_music: None.
```

1. Smash the ceramic cup
2. Lick the red carnation

#### blind date 3 — root 4129ms, choices 430ms

> The afternoon sun warms the park bench where you sit waiting with two takeout iced coffees. A breathless jogger runs up wearing an infant carrier, hands you a tangle of leashes attached to six barking pugs, and apologizes for bringing the whole family along.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking down at two clear plastic takeout cups of iced coffee resting on the sunlit wooden slats of a park bench. Sneaker steps crunch over gravel as a runner in a neon headband and a chest-mounted infant carrier jogs directly in front of the bench. Six fawn pugs on tangled nylon leashes mill around the runner's shins, snorting and barking. The runner thrusts the gathered leash handles forward. Hands reach up from the bottom of the frame and grip the clump of nylon. The runner releases them, rests hands on knees, and (S1), a breathless high-pitched male voice, says <d>[English] Sorry, couldn't find a sitter for the whole family!</d> The six pugs instantly bolt forward together, snapping the leashes taut and yanking both hands toward the wobbling cups of iced coffee.

overall_soundscape: Park ambiance, rustling leaves, rapid gravel footsteps, dog panting and yapping, plastic cups rattling on wooden slats, fabric stretching under sudden tension.

non_diegetic_music: None.
```

1. Grab both coffee cups
2. Drop trou and bark back

#### blind date 4 — root 1511ms, choices 417ms

> Modern abstract paintings line the sleek white walls of the gallery while a string quartet plays softly in the corner. Your date suddenly slips a heavy velvet pouch into your jacket pocket, leans in close, and whispers that the museum guards have spotted you both.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Standing in a bright art gallery where colorful canvas squares hang on pristine white walls, a woman with dark hair in a sleek navy cocktail dress turns from a painting and steps close. She slides her right hand down, slipping a small, heavy black velvet pouch directly into the left lapel pocket of a grey suit jacket. Her gaze darts past toward the gallery entrance, then locks directly forward as she leans in close, and (S1), an urgent, breathy female voice, says <d>[English] Don't look back. The guards spotted us both.</d> Across the room, two tall security guards in black blazers step briskly around a pedestal sculpture, walking directly forward with their eyes fixed ahead.

overall_soundscape: Soft classical violin and cello quartet music echoing faintly, the rustle of tailored fabric, quiet murmured gallery chatter, and muffled heavy footsteps approaching on polished hardwood floors.

non_diegetic_music: None.
```

1. Hand her the velvet pouch
2. Eat the velvet pouch

#### blind date 5 — root 5145ms, choices 378ms

> Neon lights buzz above a red vinyl diner booth while the waitress drops off a basket of hot fries. A smiling stranger slides into the seat opposite you, clicks a digital stopwatch, and lays out a thick binder titled "Spouse Compatibility Exam (Section 1)."

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A neon-lit red vinyl booth table sits below. A waitress in a striped apron steps up, places a red plastic basket of steaming golden french fries on the laminate table, and walks out of view. A hand reaches in from the bottom of the frame and picks up a single fry. A man in a sharp gray suit and tie slides into the opposite booth seat, beaming directly at the camera. He raises a black digital stopwatch, presses the top button with a sharp click, and slams a thick three-ring binder onto the table, its front cover labeled "Spouse Compatibility Exam (Section 1)." Leaning forward over the binder, (S1), a cheerful, brisk male voice, says <d>[English] Question one: describe your relationship with your mother.</d>

overall_soundscape: Low electrical hum of neon lighting, diner clatter of silverware and distant chatter, plastic basket thudding on laminate, sharp plastic click of a stopwatch, heavy binder slapping the tabletop.

non_diegetic_music: None.
```

1. Eat his stopwatch
2. Flip the binder open

### airport security

1. The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.
2. The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.
3. A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.
4. The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.
5. Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

#### airport security 1 — root 1736ms, choices 355ms

> The full-body scanner hums to a halt, and the monitor facing the checkpoint illuminates a bright red warning square directly over your chest. The TSA agent narrows his eyes, presses a button under the console, and quietly asks everyone in line to back away from the machine.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Standing inside the frosted glass cylinder of the full-body airport scanner, looking out through the transparent exit panel at a uniformed TSA agent, a broad-shouldered man in a navy blue shirt and black gloves stationed behind a sleek computer console. The rotating scanner paddles hum to a sudden halt on either side. On the display monitor mounted on the console, a stylized human silhouette lights up with a glowing red square centered directly over the chest. The agent leans forward, narrows his eyes at the screen, and reaches beneath the desk counter to press a concealed switch. A muted yellow warning light blinks on the floor track outside the cylinder, and (S1), a steady, controlled baritone voice, says <d>[English] Everyone in line, please take five steps back.</d> The agent looks directly into the scanner glass, raises one open gloved palm toward the screen, and grips a radio at his collar.

overall_soundscape: High-pitched electric deceleration hum of the scanner mechanism, low airport terminal murmur, click of an under-desk toggle switch, muffled shuffle of feet on linoleum.

non_diegetic_music: None.
```

1. Push open the frosted door
2. Swallow the blinking red square

#### airport security 2 — root 1469ms, choices 415ms

> The conveyor belt grinds to an abrupt stop, trapping your grey plastic bin inside the X-ray tunnel while three officers crowd around the operator’s screen. An armed supervisor slips on a pair of reinforced gloves and steps up to you, asking why there appears to be a rapid heartbeat coming from your duffel bag.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking over a stainless-steel airport security counter at an X-ray tunnel where a grey plastic bin sits motionless halfway inside. Three uniformed officers lean in closely around a monitor screen beside the belt, pointing at the display. A burly supervisor in a dark tactical vest steps past them, pulling a pair of black reinforced gloves over his thick hands with sharp snaps of elastic. He plants his boots opposite the counter, looks up with a rigid stare, and (S1), a stern authoritative male voice, says <d>[English] Why is there a rapid heartbeat inside your duffel bag?</d> He rests one gloved hand on the holstered sidearm at his belt.

overall_soundscape: Abrupt clunk and mechanical whine of a halted conveyor belt, distant airport terminal hum, sharp snap of stretching rubberized gloves, low murmur of security personnel.

non_diegetic_music: None.
```

1. Open the duffel bag slowly
2. Bark like a frightened puppy

#### airport security 3 — root 4105ms, choices 400ms

> A golden retriever working the snaking line suddenly darts forward and sits down firmly right on top of your left shoe. The handler instantly tenses, drops one hand toward his utility belt, and loudly orders you to raise your empty palms into the air.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking forward in a tile-floored security line between black nylon stanchions, travelers with roller bags shuffle ahead. A golden retriever wearing a blue working vest trotting down the adjacent aisle suddenly darts forward, plants its rear down, and sits solidly atop the left leather shoe at the bottom edge of the frame, tilting its head back to stare directly into the lens. The dog's handler, an officer in a dark blue tactical uniform, steps forward instantly, planting his boots wide, his right hand gripping a pouch on his utility belt. (S1), a sharp assertive male voice, says <d>[English] Keep still! Raise your empty palms into the air!</d> Two open, empty hands enter from the bottom of the frame and rise into view as the dog remains firmly seated.

overall_soundscape: Murmur of airport crowd chatter, rolling luggage wheels on hard tile, squeak of rubber boots, the firm thud of the dog sitting, heavy jingling of tactical belt gear.

non_diegetic_music: None.
```

1. Raise your hands higher
2. Patt the dogs head

#### airport security 4 — root 1806ms, choices 434ms

> The gate agent scans your boarding pass, only for the scanner to let out a sharp, continuous siren that brings the entire checkpoint to a dead silence. Two plainclothes marshals materialize from the side hallway, one of them pulling out a pair of zip-ties while whispering the exact name on your passport.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A right hand extends from the bottom of the frame, holding a paper boarding pass toward a countertop barcode scanner. The gate agent, a woman with pinned dark hair and a blue blazer, pulls the pass across the red laser line. A piercing, continuous siren wails from the console, flashing a red light bar, and the surrounding crowd stops moving. From a narrow access door behind the podium, two men in dark jackets step into view. The first man, tall with cropped hair, reaches into his jacket, pulls out heavy plastic zip-ties, and (S1), a sharp, quiet male voice, says <d>[English] Julian Mercer. Keep both hands where I can see them.</d> He steps forward, looping the plastic tie between his fingers.

overall_soundscape: Background terminal chatter instantly cutting out, high-pitched mechanical siren blaring, rapid leather-soled footsteps on polished floor tile, plastic zip-ties ratcheting once.

non_diegetic_music: None.
```

1. Throw the boarding pass
2. Swallow the boarding pass

#### airport security 5 — root 4424ms, choices 406ms

> Travelers hurry past in their socks, tossing electronics into grey bins under the harsh fluorescent lights of the terminal. A breathless stranger bumps hard against your shoulder, slips a heavily taped stainless-steel canister into your jacket pocket, and begs you not to let them find it.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A conveyor belt rattles under overhead fluorescent tubes, carrying grey plastic bins loaded with laptops and phones. Travelers in socks shuffle past in parallel lanes. Two hands enter from the bottom of the frame, setting a grey plastic bin onto the metal rollers. A man in a rumpled navy blazer collides against the right side of the frame, knocking the bin sideways. His hand shoves a thick, duct-taped stainless-steel canister into the open pocket of a dark jacket. He grips the canvas lapel and looks straight forward. (S1), a breathless, raspy male voice, says <d>[English] Please, do not let them find it.</d> He releases the lapel and bolts toward an exit door as an alarm chimes at the metal detector archway ahead.

overall_soundscape: Conveyor belt motor humming, plastic bins clattering on steel rollers, shuffling socks on linoleum, muffled terminal announcements, abrupt electronic chime.

non_diegetic_music: None.
```

1. Grab the taped canister
2. Unbuckle his navy blazer

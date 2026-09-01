# pipeline eval run — 2026-09-01T23:26:58.495Z

- Expander and episode writer: `google/gemini-3.7-flash` at temperature 1.5
- Choice writer: `google/gemini-3.7-flash`
- Scenes per premise: 5
- Duration: 10s
- Expanded: 6/6

## Latency

| premise | expand | episode write | choice write |
|---|---|---|---|
| zoo | 5166ms | median 1781ms, min 1212ms, max 1935ms | median 1373ms, min 1052ms, max 1680ms |
| dentist | 4619ms | median 1800ms, min 1608ms, max 3349ms | median 1685ms, min 589ms, max 1873ms |
| first day at hogwarts | 2216ms | median 1793ms, min 1416ms, max 4069ms | median 1577ms, min 1486ms, max 1839ms |
| my roommate is a ghost | 2019ms | median 1688ms, min 1608ms, max 4236ms | median 1588ms, min 1376ms, max 3416ms |
| blind date | 6185ms | median 1998ms, min 1673ms, max 2539ms | median 1645ms, min 1205ms, max 2404ms |
| airport security | 5407ms | median 2395ms, min 1785ms, max 2519ms | median 1395ms, min 976ms, max 2470ms |
| **all** | median 5166ms, min 2019ms, max 6185ms | median 1871ms, min 1212ms, max 4236ms | median 1559ms, min 589ms, max 3416ms |

## Premises

### zoo

1. A group of toddlers presses against the glass at the penguin exhibit while a zookeeper tosses whole fish into the water. A dripping wet macaroni penguin waddles past the "Staff Only" gate, hops onto your shoe, and stares straight up at you.
2. The sun beats down on the primate pavilion as a crowd laughs at two capuchins grooming each other near the edge of the moat. A sudden rustle overhead reveals a third monkey hanging by its tail, reaching its tiny hand directly toward your open backpack.
3. Families line the elevated wooden deck with bundles of lettuce leaves, waiting their turn to feed the towering giraffes. An enormous adult male bypasses every outstretched leaf, leans its massive head right over the railing, and presses its purple tongue against the lens of your camera.
4. The reptile house is dimly lit and humming with the low buzz of heat lamps over various terrarium displays. A breathless intern drops a heavy set of keys onto the floor in front of you and points with wide eyes at an empty, unlatched enclosure labeled *Inland Taipan*.
5. Shoppers bustle through the zoo gift shop, browsing through plush animals, sun hats, and frozen treats by the main exit. The person inside the six-foot-tall plush tiger costume quietly unzips the head and extends a trembling hand holding a walkie-talkie that is broadcasting frantic radio chatter about an uncontained tiger.

#### zoo 1 — episode 1242ms, choices 1052ms

> A group of toddlers presses against the glass at the penguin exhibit while a zookeeper tosses whole fish into the water. A dripping wet macaroni penguin waddles past the "Staff Only" gate, hops onto your shoe, and stares straight up at you.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking through the large viewing window of the penguin exhibit, where several small children press their hands and faces against the glass, pointing at a zookeeper in a teal polo tossing silver fish into the churning blue water. Beyond the enclosure's waist-high metal railing, an open gate labeled "Staff Only" stands ajar. A macaroni penguin with spiky yellow crest feathers, dripping wet with water beading on its black coat, waddles quickly across the concrete walkway toward the camera. It hops with both feet landing squarely on top of the left leather boot at the bottom of the frame, tilts its head back, and fixes its round, dark eyes directly on the lens, letting out a sharp, raspy bray.

overall_soundscape: Children's high-pitched giggles and murmurs muffled through thick glass, splashes of water inside the exhibit, wet webbed feet slapping against concrete, and a loud, abrupt penguin bray.

non_diegetic_music: None.
```

1. Scoop up the penguin
2. Shout to the zookeeper

#### zoo 2 — episode 1212ms, choices 1559ms

> The sun beats down on the primate pavilion as a crowd laughs at two capuchins grooming each other near the edge of the moat. A sudden rustle overhead reveals a third monkey hanging by its tail, reaching its tiny hand directly toward your open backpack.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across a low stone wall at a sunlit moat where two capuchin monkeys sit side by side on a boulder, grooming each other's fur. A crowd of zoo visitors stands along the perimeter railing, laughing. Above, broad tropical leaves rustle and part. A third capuchin swings down headfirst, anchored by its tail wrapped around a thick overhead branch, directly above an open canvas backpack sitting on the edge of the stone wall. The monkey extends a small, dark hand downward, fingers spreading open an inch above the open zipper compartment, its dark eyes locked directly forward.

overall_soundscape: Murmurs and laughter from the zoo crowd, distant bird calls, rustling leaves directly overhead, and the faint splash of water in the moat.

non_diegetic_music: None.
```

1. Yank the backpack away
2. Offer the monkey an apple

#### zoo 3 — episode 1781ms, choices 1373ms

> Families line the elevated wooden deck with bundles of lettuce leaves, waiting their turn to feed the towering giraffes. An enormous adult male bypasses every outstretched leaf, leans its massive head right over the railing, and presses its purple tongue against the lens of your camera.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Families with small children stand along the weathered cedar railing of an elevated wooden platform, holding green bundles of romaine lettuce toward a group of giraffes in the sunlit enclosure below. A towering male giraffe strides past the line of outstretched leaves, its long neck swinging forward toward the center of the railing. A woman in a khaki sunhat to the left lowers her leaf and turns, (S1), an amused female voice, saying <d>[English] Look, he’s coming straight for you!</d> The giraffe's massive mottled head dips down over the wooden beam, its dark, prehensile purple tongue unfurling several inches and flattening wetly against the glass.

overall_soundscape: Murmur of crowd chatter, rustling dry lettuce leaves, gentle breeze through nearby acacia trees, heavy giraffe breathing, and a wet smear sound against the glass.

non_diegetic_music: None.
```

1. Ask the woman for lettuce
2. Press palm against the glass

#### zoo 4 — episode 1931ms, choices 1233ms

> The reptile house is dimly lit and humming with the low buzz of heat lamps over various terrarium displays. A breathless intern drops a heavy set of keys onto the floor in front of you and points with wide eyes at an empty, unlatched enclosure labeled *Inland Taipan*.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Standing in a dim tiled corridor lined with glowing glass vivariums, a young intern in a green zoo uniform and baseball cap stumbles forward, panting. A heavy brass ring of keys slips from his trembling fingers, hitting the concrete floor with a loud metallic clatter. The intern, (S1), a high-pitched, shaky young male voice, points a trembling index finger past the left side of the frame and says <d>[English] It slipped right past me, check the floor!</d> The view turns toward the glass case marked with a red placard reading "Inland Taipan". The acrylic door hangs open two inches, its interior branches completely bare. Two hands enter from the bottom of the frame, reaching down toward the dropped keys on the ground, when a long, scaled brown tail slides out from beneath the base of the opposite terrarium, disappearing directly between the feet at the bottom edge of the frame.

overall_soundscape: Low electrical hum of heat lamps and ventilation fans, heavy brass keys crashing and jangling against concrete floor, rapid ragged breathing, faint dry slithering across smooth tile.

non_diegetic_music: None.
```

1. Kick the keys toward him
2. Tell him to freeze completely

#### zoo 5 — episode 1935ms, choices 1680ms

> Shoppers bustle through the zoo gift shop, browsing through plush animals, sun hats, and frozen treats by the main exit. The person inside the six-foot-tall plush tiger costume quietly unzips the head and extends a trembling hand holding a walkie-talkie that is broadcasting frantic radio chatter about an uncontained tiger.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across the brightly lit zoo gift shop where families in sun hats browse racks of plush animals and line up at a frozen treat freezer near the glass exit doors. Standing beside a display rack of inflatable giraffes, a six-foot-tall plush tiger costume remains motionless. The plush tiger head unzips downward from beneath the faux-fur chin. A pale, trembling human hand emerges from the parted seam, extending a black walkie-talkie directly toward the center of the frame. The walkie-talkie's speaker crackles as (S1), a sharp, static-laced female voice over the radio, says <d>[English] Code red, Sector Four! The tiger breached the enclosure!</d> The person inside the costume abruptly drops the walkie-talkie onto the linoleum floor and grips both hands around the glass exit door handle, rattling the locked glass against its frame.

overall_soundscape: Ambient gift shop chatter, hum of freezer compressors, distant chime of cash registers, metallic zipper pull, walkie-talkie static burst and speaker output, plastic device clicking onto linoleum, violent rattling of locked metal and glass.

non_diegetic_music: None.
```

1. Grab the dropped walkie-talkie
2. Shout a warning to shoppers

### dentist

1. The dental hygienist clips the paper bib around your neck while humming along to the soft rock playing overhead. She picks up the sharp metal probe, leans in toward your lower jaw, and suddenly drops the tool onto the metal tray with an audible gasp.
2. The dentist adjusts the bright overhead light, squinting closely at the freshly developed panoramic X-ray glowing on the wall mount. He taps a strange, metallic silhouette lodged deep behind your molars and quietly asks his assistant whose chart this actually is.
3. The waiting room aquarium bubbles quietly in the corner as the receptionist sorts through a fresh stack of colorful insurance clipboards. The inner office door suddenly swings open, and a trembling man in a white lab coat backs out into the hallway with both hands raised.
4. You sit fully reclined in the examination chair while the sweet-smelling nitrous oxide mask hisses gently over your nose. The dentist reaches for the high-speed drill, but the building's power abruptly cuts out, plunging the operatory into pitch darkness.
5. An energetic toddler in dinosaur pajamas is running wild laps around the reception counter while their mother frantically apologizes to the staff. The child trips over the edge of your chair, launching an open cup of bright blue mouthwash straight toward your lap.

#### dentist 1 — episode 1800ms, choices 589ms

> The dental hygienist clips the paper bib around your neck while humming along to the soft rock playing overhead. She picks up the sharp metal probe, leans in toward your lower jaw, and suddenly drops the tool onto the metal tray with an audible gasp.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking up from a reclined dental chair at a dental hygienist in light-blue scrubs, clear protective glasses, and a blue surgical mask, who reaches down with both hands to fasten the metal clips of a textured paper bib under the chin. A soft rock melody plays softly from overhead speakers as she hums in pitch. She turns to a stainless steel tray on the right, picks up a hooked metal periodontal probe with her right hand, and leans down, bringing the tip of the instrument toward the lower row of teeth. Her eyes widen above her mask, fixating on the inside of the lower jaw. Her fingers lose their grip and the metal probe clatters onto the tray below as (S1), a startled female voice muffled by a mask, says <d>[English] Oh god, what is growing inside your gum line?</d> She stumbles a step backward, raising both gloved hands to her chest.

overall_soundscape: Faint soft rock ballad on a low ceiling speaker, humming vocalizations, crisp metallic clatter of metal tools on a steel tray, sharp intake of breath, rubber soles squeaking on linoleum.

non_diegetic_music: None.
```

1. Hand her the handheld mirror
2. Ask what she sees in there

#### dentist 2 — episode 1871ms, choices 1791ms

> The dentist adjusts the bright overhead light, squinting closely at the freshly developed panoramic X-ray glowing on the wall mount. He taps a strange, metallic silhouette lodged deep behind your molars and quietly asks his assistant whose chart this actually is.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A large overhead dental lamp tilts down into the upper edge of view, its glare reflecting off the white linoleum walls. A male dentist in blue scrubs and clear protective glasses turns toward a glowing wall-mounted lightbox displaying a panoramic dental X-ray. He leans closer, pointing the tip of a stainless steel explorer at a dense, sharply angled metallic silhouette embedded beneath the lower left jawbone. He turns his head slightly toward a female assistant in green scrubs standing beside the instrument tray, and (S1), a quiet raspy male voice, says <d>[English] Whose chart did you pull for this room?</d> The assistant glances from the clipboard in her hands up to the X-ray, her eyes widening.

overall_soundscape: Low hum of the dental light transformer, fluorescent bulb buzz, faint metal click of the dental tool against the lightbox screen.

non_diegetic_music: None.
```

1. Claim the scan is yours
2. Grab the clipboard from her

#### dentist 3 — episode 1734ms, choices 1873ms

> The waiting room aquarium bubbles quietly in the corner as the receptionist sorts through a fresh stack of colorful insurance clipboards. The inner office door suddenly swings open, and a trembling man in a white lab coat backs out into the hallway with both hands raised.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A large glass aquarium bubbles in the corner of a brightly lit medical waiting room. Behind the curved front desk, a receptionist in blue scrubs taps a stack of pastel plastic clipboards against the counter to align them. The frosted-glass inner office door abruptly swings wide against the wall. A man in a white lab coat stumbles backward through the doorway into the corridor, both palms raised high in front of his chest. His knees shake, and his eyes remain fixed on the dark interior of the exam room behind him as (S1), a sharp trembling male voice, says <d>[English] Stay back, do not come out here.</d> A pale, elongated hand with black-tipped fingers grips the edge of the open doorframe from inside the darkness.

overall_soundscape: Low bubbling of the aquarium pump, paper tapping on laminate, the sudden clatter of the heavy door hitting the drywall, and rapid squeaking of rubber soles on polished linoleum.

non_diegetic_music: None.
```

1. Slam the office door shut
2. Smash the front desk alarm

#### dentist 4 — episode 3349ms, choices 1304ms

> You sit fully reclined in the examination chair while the sweet-smelling nitrous oxide mask hisses gently over your nose. The dentist reaches for the high-speed drill, but the building's power abruptly cuts out, plunging the operatory into pitch darkness.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking up from the reclined vinyl chair past the soft plastic edge of a clear nasal hood at Dr. Evans, a man in blue surgical scrubs, sterile latex gloves, and magnification loupes strapped to his forehead. He reaches to his left, gripping a stainless-steel dental drill from its bracket. The high-pitched whine of the tool begins, but with a sharp electrical crack, the overhead fluorescent panels shut off. A low battery-powered emergency strip on the baseboard instantly turns on, washing the room in dim amber light. Dr. Evans freezes, the metal tip of the drill hovering an inch above the lens. He slowly lifts his head toward the open operatory doorway behind the chair, the drill tip trembling in the dim light.

overall_soundscape: Soft continuous hiss of gas, quiet mechanical hum of dental equipment, sharp snap of electrical cut, metallic click of drill stopping, low hum of emergency backup power.

non_diegetic_music: None.
```

1. Push the drill tray over
2. Ask who is out there

#### dentist 5 — episode 1608ms, choices 1685ms

> An energetic toddler in dinosaur pajamas is running wild laps around the reception counter while their mother frantically apologizes to the staff. The child trips over the edge of your chair, launching an open cup of bright blue mouthwash straight toward your lap.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Sitting in a low vinyl waiting-room chair, looking past crossed knees at a curved white reception desk. A toddler wearing green fleece dinosaur pajamas with felt dorsal spikes sprints past the counter, tiny sneakers squeaking against the polished linoleum floor. Behind the counter, a receptionist in teal scrubs blinks in surprise as a woman in a beige trench coat chases behind the child, hands outstretched. (S1), a breathless high-pitched female voice, says <d>[English] I am so sorry, he just had apple juice!</d> The toddler rounds the corner of the desk, veers directly toward the chair, and catches a toe on the metal chair leg. The child pitches forward onto both knees, and the small paper cup in his right hand flies upward, sending an arc of bright blue mouthwash spinning mid-air directly toward the lap of the camera. Two hands enter from the bottom of the frame, palms turning outward to block the incoming spray.

overall_soundscape: Rubber sneakers squeaking on polished linoleum, rapid toddler footsteps, low hum of fluorescent lights, receptionist's keyboard clicking, a sudden scuff and thump of the child tripping, liquid sloshing through the air.

non_diegetic_music: None.
```

1. Catch the flying paper cup
2. Help the fallen toddler up

### first day at hogwarts

1. Hundreds of floating candles illuminate the Great Hall as the ancient Sorting Hat is lowered onto your head. The brim suddenly twists open in wide-eyed horror and loudly shrieks that it has never encountered a mind like yours before.
2. The Hogwarts Express grinds to a halt in the pitch-black rain while a towering half-giant with an iron lantern gestures for the first-years to follow him down a slippery path toward the dark lake. Just as you reach the shore, a massive, glowing tentacle breaks the surface of the water and wraps tightly around the front of your rowboat.
3. A row of heavy iron cauldrons bubbles violently along the dungeon walls as the Potions master sweeps down the aisle with a sneer. He stops directly over your workspace, his eyes fixing on the dense, purple vapor rapidly hissing out from under your desk.
4. You step onto the magnificent grand staircase just as the heavy stone steps groan and swing violently away from the main corridor. The landing connects to a pitch-black doorway marked with glowing red runes, and the latch on the heavy wooden door slowly clicks open.
5. The crowded common room is filled with students trying out joke wands and practicing basic sparks under the warm firelight. An older student accidentally drops a quivering, speckled egg onto the rug at your feet, and it instantly cracks open to reveal a pair of smoking, reptilian eyes.

#### first day at hogwarts 1 — episode 1499ms, choices 1839ms

> Hundreds of floating candles illuminate the Great Hall as the ancient Sorting Hat is lowered onto your head. The brim suddenly twists open in wide-eyed horror and loudly shrieks that it has never encountered a mind like yours before.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Sitting on a wooden stool at the front of a stone-walled hall beneath hundreds of floating candles, looking out at four long banquet tables crowded with students in black robes. Professor McGonagall, a stern woman with tight gray hair in a dark green velvet robe, lowers the tattered brown leather Sorting Hat downward into the top of the frame. The heavy brim settles over the forehead. The folds of the leather suddenly contort into two gaping eye-holes and a wide, twisted mouth above the brow. The fabric stretches violently, and (S1), a raspy, booming male voice from directly above, shrieks <d>[English] Sweet Merlin, what is this mind? Get me off!</d> The entire hall goes completely still as the hat convulses and twists harder, its mouth gaping open in terror.

overall_soundscape: Quiet rustling of robes, the soft crackle of floating candles, the raspy heavy voice vibrating from above, followed by dead silence in the hall.

non_diegetic_music: None.
```

1. Rip the hat off
2. Whisper a threat upward

#### first day at hogwarts 2 — episode 2236ms, choices 1676ms

> The Hogwarts Express grinds to a halt in the pitch-black rain while a towering half-giant with an iron lantern gestures for the first-years to follow him down a slippery path toward the dark lake. Just as you reach the shore, a massive, glowing tentacle breaks the surface of the water and wraps tightly around the front of your rowboat.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A towering man in a thick moleskin coat with a tangled black beard holds an iron lantern aloft against the driving rain, turning back on a steep mud path and gesturing downward with a massive arm. (S1), a booming, gruff male voice, calls out <d>[English] Mind yer step now, first-years! Down to the fleet!</d> The lantern light bobs as the path descends to a rocky shoreline lined with wooden rowboats floating on black water. Two hands clad in black school robes enter from the bottom of the frame, stepping into the nearest rowboat and gripping the wet wooden gunwales. The boat rocks gently as the black surface of the lake churns, and a thick, bioluminescent tentacle erupts from the water, coiling tightly around the boat's bow and hauling it sharply downward into the dark.

overall_soundscape: Heavy rain pouring on mud and rocks, wind whistling, distant train steam hiss, squelching footsteps, sloshing lake water, loud wet breach and creaking wood.

non_diegetic_music: None.
```

1. Smash the tentacle with an oar
2. Scream to the giant for help

#### first day at hogwarts 3 — episode 4069ms, choices 1486ms

> A row of heavy iron cauldrons bubbles violently along the dungeon walls as the Potions master sweeps down the aisle with a sneer. He stops directly over your workspace, his eyes fixing on the dense, purple vapor rapidly hissing out from under your desk.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Stone dungeon walls line the room, where iron cauldrons bubble with green and amber liquids over low fires. Down the stone aisle, the Potions master, a pale man with curtained black hair and sweeping black robes, strides forward with a curled lip. Two hands in black school robes rest flat on the scarred wooden tabletop beside empty glass vials. The master stops abruptly at the front of the desk, his dark eyes dropping downward. Dense, thick purple vapor hisses out from beneath the desk, rising in tight coils past the wooden edge. The master leans forward, drawing a dark wooden wand from his sleeve, and (S1), a silky, sharp male voice, says <d>[English] What unauthorized brew is festering beneath your station?</d> A sharp crack splits the center of the wooden desk as bright violet sparks burst through the seam.

overall_soundscape: Bubbling liquids in iron cauldrons, heavy fabric sweeping over flagstones, sharp hissing of vapor, wood groaning and snapping with a burst of crackling sparks.

non_diegetic_music: None.
```

1. Kick the hidden cauldron over
2. Blame the student beside you

#### first day at hogwarts 4 — episode 1416ms, choices 1492ms

> You step onto the magnificent grand staircase just as the heavy stone steps groan and swing violently away from the main corridor. The landing connects to a pitch-black doorway marked with glowing red runes, and the latch on the heavy wooden door slowly clicks open.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Two bare hands reach forward to grip the cold stone balustrade as the massive staircase shudders, stone scraping against stone as the entire flight pivots sideways across the cavernous hall. Dust and grit rain down through the air as the movement halts with a sharp jolt against a high stone landing. Ahead stands a massive archway framing an iron-banded timber door, its surface carved with runes that pulse with a deep crimson light. The latch on the timber door lifts upward with a metallic scrape, the lock mechanism clicking free as the thick wooden slab begins to swing inward into absolute darkness.

overall_soundscape: Deep grinding of heavy stone moving against stone, falling masonry grit, sudden mechanical thud of the staircase settling, sharp metallic click of the iron latch, and the low creak of heavy wooden hinges.

non_diegetic_music: None.
```

1. Slam the heavy door shut
2. Call out into the darkness

#### first day at hogwarts 5 — episode 1793ms, choices 1577ms

> The crowded common room is filled with students trying out joke wands and practicing basic sparks under the warm firelight. An older student accidentally drops a quivering, speckled egg onto the rug at your feet, and it instantly cracks open to reveal a pair of smoking, reptilian eyes.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Across a stone-walled common room illuminated by a blazing hearth, students in dark robes laugh as gold and violet sparks erupt from long wooden wands. A tall, dark-haired student in an unbuttoned robe trips over a low footstool, fumbling a heavy, grey-speckled egg the size of a melon from his satchel. The egg drops onto the crimson rug directly in front of two leather boots at the bottom of the frame. (S1), a hurried male voice with a slight crack, says <d>[English] Don't touch it, it's not ready yet!</d> The shell splits with a sharp snap, releasing a thick puff of grey vapor as two jagged halves fall apart to expose a scaled, charcoal-black snout and two slitted, glowing orange reptilian eyes that fix straight upward.

overall_soundscape: Murmur of a crowded room, crackling fireplace, sharp pop of magical sparks, heavy thud on a rug, sharp cracking of an eggshell, brief hiss of escaping steam.

non_diegetic_music: None.
```

1. Pick up the creature
2. Smother it with your cloak

### my roommate is a ghost

1. Your floating roommate is currently reorganizing the spice rack by levitating paprika jars through the air while humming a tune from the 1920s. A sudden knock at the front door sends a jar crashing onto the tile, and the doorknob slowly begins to turn from the outside.
2. A chilly breeze sweeps through the hallway as the translucent figure sitting on the sofa suddenly phases halfway into the living room floor to inspect the carpet. His pale, glowing hand reaches out from the floorboards, desperately clutching an unopened letter addressed to you from fifty years ago.
3. The morning light cuts through the kitchen steam, revealing a pair of floating yellow dish gloves scrubbing a frying pan entirely on their own. The spectral resident suddenly drops the pan, points toward the open bathroom door, and screams silently as dark water begins to pour over the threshold.
4. Your roommate’s ghostly cat is curled up asleep on the ceiling above your bed, perfectly defying gravity while batting at phantom dust motes. The feline's ears suddenly perk up, and it lets out a bloodcurdling hiss as the bedroom closet door slowly unlatches itself.
5. The kitchen cabinets are rattling in rhythm while your spectral housemate tries to flip pancakes with a wooden spoon he can barely solidify enough to hold. He accidentally drops the burning hot pan straight through his semi-transparent foot, and it is tumbling directly toward your bare toes.

#### my roommate is a ghost 1 — episode 1688ms, choices 1376ms

> Your floating roommate is currently reorganizing the spice rack by levitating paprika jars through the air while humming a tune from the 1920s. A sudden knock at the front door sends a jar crashing onto the tile, and the doorknob slowly begins to turn from the outside.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A young woman with curly brown hair wearing a yellow sweater floats horizontally three feet above the linoleum floor, humming a brisk melody of "Ain't We Got Fun" as small glass jars of paprika glide through the air in a neat arc toward an open wooden spice rack on the wall. Three heavy thuds strike the apartment door on the right. The woman gasps, her body dropping six inches in the air, and one of the paprika jars plummets to the floor, shattering on the ceramic tile with a spray of red powder. She looks over her shoulder toward the entryway. The brass doorknob rattles, clicks, and begins to rotate slowly clockwise from the outside.

overall_soundscape: Humming with a light vibrato, the faint glass clink of floating jars, three heavy wooden knocks, a sharp gasp, glass shattering on tile with paprika scattering, followed by the metallic clicking and scraping of a turning brass lock mechanism.

non_diegetic_music: None.
```

1. Slide the deadbolt shut
2. Pull the floating woman down

#### my roommate is a ghost 2 — episode 1608ms, choices 1588ms

> A chilly breeze sweeps through the hallway as the translucent figure sitting on the sofa suddenly phases halfway into the living room floor to inspect the carpet. His pale, glowing hand reaches out from the floorboards, desperately clutching an unopened letter addressed to you from fifty years ago.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across a dim, wooden-floored living room toward a worn fabric sofa where a translucent, glowing figure of a man in vintage tweed sits. A draft rustles the sheer curtains by the window. The figure leans forward, his torso and head sinking directly into the dark floorboards until only his shoulders and a glowing arm remain visible above the wood. He turns his head upward through the timber grain, staring directly forward, and thrusts his pale, luminous hand straight up through the floor. In his translucent fingers, he grips a yellowed, wax-sealed paper envelope bearing faded black ink that reads "FOR YOU - OCTOBER 14, 1974." (S1), a hollow, echoing male voice, says <d>[English] Take it before the house swallows the truth.</d> The wood grain around his wrist begins to ripple and darken like liquid tar, pulling his hand and the letter downward into the floorboards.

overall_soundscape: A low wind whistling through a drafty hallway, fabric rustling, a low resonant hum from the glowing figure, and the faint crackle of dry paper.

non_diegetic_music: None.
```

1. Snatch the envelope
2. Stomp the darkening floorboards

#### my roommate is a ghost 3 — episode 4236ms, choices 2477ms

> The morning light cuts through the kitchen steam, revealing a pair of floating yellow dish gloves scrubbing a frying pan entirely on their own. The spectral resident suddenly drops the pan, points toward the open bathroom door, and screams silently as dark water begins to pour over the threshold.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Bright morning sunlight slants through rising steam in a kitchen, illuminating a pair of hollow yellow rubber dish gloves suspended in mid-air over the stainless steel sink. The gloves grip a soapy sponge and scour a cast-iron frying pan beneath a steady stream of running tap water. The gloves abruptly stiffen and release their hold; the heavy pan falls, slamming into the metal basin. The left glove turns and points a rigid index finger toward the open doorway of the bathroom down the short hallway, while the right glove opens wide against empty air where a jaw would be, vibrating silently. Over the wooden threshold of the bathroom doorway, a surge of opaque black water pours out, rushing across the floorboards directly toward the kitchen.

overall_soundscape: Steady hiss of running tap water, sponge scouring iron, loud metallic clatter and ring of cast-iron striking the stainless steel sink, heavy wet surging sound of water spilling and flowing over wooden floorboards.

non_diegetic_music: None.
```

1. Slam the hallway door shut
2. Ask the gloves what happened

#### my roommate is a ghost 4 — episode 1679ms, choices 3416ms

> Your roommate’s ghostly cat is curled up asleep on the ceiling above your bed, perfectly defying gravity while batting at phantom dust motes. The feline's ears suddenly perk up, and it lets out a bloodcurdling hiss as the bedroom closet door slowly unlatches itself.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Lying on a bed, looking straight up at the white plaster ceiling where a translucent, glowing blue-gray domestic cat rests curled upside down directly overhead. The cat paws lightly at empty air, its tail flicking against the plaster. Both hands enter from the bottom of the frame, gripping the edge of a gray duvet and pulling it up to chest level. The feline's ears swivel backward, flattening flat against its head. It scrambles to all fours on the ceiling, arching its back with fur standing on end, and bares sharp translucent fangs while letting out a sharp, high-pitched feline screech. The perspective shifts forward toward the far wall, where the brass knob of a white louvered closet door turns with a metallic click. The door swings outward into the lit bedroom, revealing a pitch-black interior as long, gray, multi-jointed fingers wrap around the edge of the opening panel.

overall_soundscape: Soft fabric rustling, an eerie low hum from the glowing cat, a harsh piercing cat hiss, a mechanical door latch clicking, and the creak of closet hinges.

non_diegetic_music: None.
```

1. Turn on the bedside lamp
2. Hurl the duvet at it

#### my roommate is a ghost 5 — episode 1955ms, choices 1477ms

> The kitchen cabinets are rattling in rhythm while your spectral housemate tries to flip pancakes with a wooden spoon he can barely solidify enough to hold. He accidentally drops the burning hot pan straight through his semi-transparent foot, and it is tumbling directly toward your bare toes.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking into a brightly lit kitchen where upper cabinet doors click and shudder against their frames in an even beat. At the stove stands a translucent, glowing blue-tinted young man in a faded flannel shirt, his fingers flickering between solid flesh and mist as he grips a wooden spoon over a smoking cast-iron skillet. He jerks the spoon under a browned pancake; the pan slips from his vaporous grasp, drops straight through his glowing left instep without touching it, and flips end-over-end through the air, spitting hot grease as the heavy iron rim plummets toward bare toes resting on the checkered linoleum floor. The ghostly figure reaches down with both translucent hands, his eyes wide, and (S1), an airy, echoing male voice, says <d>[English] Watch out, jump back right now!</d> The burning pan spins mere inches above the bare feet.

overall_soundscape: Rhythmic rattling of wooden cabinet doors, sizzling batter and hissing grease, an airy supernatural hum, the metallic tumble of the skillet through the air.

non_diegetic_music: None.
```

1. Kick the falling skillet away
2. Tell him to catch it

### blind date

1. The host leads the way through the crowded bistro to a corner booth where a smiling date waits with a red carnation on the table. As the chair is pulled out, the date looks up, the smile instantly vanishes, and they whisper the name of their ex-spouse.
2. Across the candlelit table, the date pulls a laminated binder from their bag and lines up three separate digital stopwatches on the tablecloth. They click a pen, tap the five-minute timer, and announce that phase one of the twenty-part compatibility assessment has officially begun.
3. The date waves excitedly from a patio table, seated between two stern-looking strangers in matching business suits who are already taking notes on clipboards. As the empty chair is reached, the date beams and explains that their personal life coaches will be observing the entire evening.
4. The date slides into the booth wearing dark sunglasses in the dim lounge and repeatedly checks over both shoulders. Under the tablecloth, their foot shoves a heavy steel briefcase against yours, and they whisper that the drop is complete.
5. A person in a full suit of polished steel plate armor sits across the high-end restaurant table, awkwardly trying to guide a breadstick through the narrow visor of their helmet. The visor creaks open an inch, revealing a pair of nervous eyes and a muffled voice asking if the outfit feels too casual.

#### blind date 1 — episode 2340ms, choices 2404ms

> The host leads the way through the crowded bistro to a corner booth where a smiling date waits with a red carnation on the table. As the chair is pulled out, the date looks up, the smile instantly vanishes, and they whisper the name of their ex-spouse.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Following close behind a tall host in a black waistcoat navigating through the crowded bistro tables toward a secluded corner booth. A woman in a dark green silk blouse sits at the booth, smiling warmly beside a small glass vase holding a single red carnation. Two hands enter from the bottom of the frame, taking hold of the dark wooden chair opposite her and sliding it backward across the floor. The woman tilts her head up to make eye contact, her smile instantly freezing and dropping into wide, unblinking stillness, and (S1), a quiet trembling female voice, whispers <d>[English] Julian... how are you alive?</d>

overall_soundscape: Murmur of crowded restaurant chatter, clinking cutlery and wine glasses, chair legs scraping lightly on polished hardwood floor, a sharp intake of breath.

non_diegetic_music: None.
```

1. Ask who wanted me dead
2. Slide into the chair

#### blind date 2 — episode 1675ms, choices 1645ms

> Across the candlelit table, the date pulls a laminated binder from their bag and lines up three separate digital stopwatches on the tablecloth. They click a pen, tap the five-minute timer, and announce that phase one of the twenty-part compatibility assessment has officially begun.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Across a small table illuminated by a single votive candle, an earnest person with neatly parted brown hair and a pressed navy blazer reaches down into a leather tote bag, lifts out a thick white three-ring binder with a laminated cover, and drops it flat on the white linen cloth. They withdraw three small black digital stopwatches, arranging them in a precise horizontal row beneath the binder. With a quick flick of their thumb, they click a retractable metal pen, press the side button on the leftmost stopwatch, and look up directly into the camera. (S1), a crisp and measured voice, says <d>[English] Phase one of the compatibility assessment has officially begun.</d> The LCD screen blinks, digits rapidly counting down from five minutes as S1 flips open the binder to a grid of checkboxes.

overall_soundscape: Murmur of ambient restaurant chatter, clinking cutlery in the distance, the heavy thump of the binder on linen, sharp clicks of a retractable pen and stopwatch buttons, and the rustle of turning plastic-sleeved pages.

non_diegetic_music: None.
```

1. Snap the binder shut
2. Ask what the prize is

#### blind date 3 — episode 1673ms, choices 1205ms

> The date waves excitedly from a patio table, seated between two stern-looking strangers in matching business suits who are already taking notes on clipboards. As the empty chair is reached, the date beams and explains that their personal life coaches will be observing the entire evening.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Walking forward across a terracotta restaurant patio toward a wrought-iron table set for two. A person in a bright yellow sweater sits on the far side, waving enthusiastically with both hands, flanked closely by two individuals in identical dark charcoal business suits who hold wooden clipboards and click ballpoint pens in unison. Hands enter from the bottom of the frame and pull out the empty wrought-iron chair opposite the person in yellow, the chair legs scraping against the tile. Sitting down, the view levels with the person in yellow, who rests both elbows on the table, smiles broadly, and (S1), an upbeat, high-pitched voice, says <d>[English] Don't worry, my personal life coaches just observe everything!</d> The two suited figures simultaneously raise their clipboards to eye level, their pens poised directly over blank scorecards printed with the word "PASS / FAIL".

overall_soundscape: Murmur of outdoor restaurant chatter, clinking glassware, metallic chair legs scraping roughly on terracotta tile, dual rhythmic ballpoint pen clicking, rustling of clipboard paper.

non_diegetic_music: None.
```

1. Snatch the nearest clipboard
2. Ask what failing scores get

#### blind date 4 — episode 1998ms, choices 1680ms

> The date slides into the booth wearing dark sunglasses in the dim lounge and repeatedly checks over both shoulders. Under the tablecloth, their foot shoves a heavy steel briefcase against yours, and they whisper that the drop is complete.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Across a polished mahogany table in a dim red-lit lounge, a person in a high-collared black trench coat and dark oversized sunglasses slides quickly into the opposite side of the booth. They glance sharply over their left shoulder toward the entrance, then back over their right toward the bar. Beneath the edge of the hanging velvet tablecloth, a hard metallic weight slides forward with a dull scrape, bumping firmly against both shins. Leaning in close over the table, hands gripping the edge, (S1), an urgent, tight female voice, whispers <d>[English] The drop is complete. Do not open that case yet.</d> Her head jerks sideways as the red light from the bar wall suddenly shifts to harsh white, and two tall silhouetted figures stop right beside the booth.

overall_soundscape: Low lounge murmur, clinking glasses, fabric rustling, dull metal-on-metal scrape beneath the table, harsh click of a light switch, heavy footsteps stopping abrupt beside the booth.

non_diegetic_music: None.
```

1. Kick the case toward her
2. Invite the silhouettes to sit

#### blind date 5 — episode 2539ms, choices 1331ms

> A person in a full suit of polished steel plate armor sits across the high-end restaurant table, awkwardly trying to guide a breadstick through the narrow visor of their helmet. The visor creaks open an inch, revealing a pair of nervous eyes and a muffled voice asking if the outfit feels too casual.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Across a white linen-draped table set with crystal wine glasses and polished silverware, a figure in a full suit of mirror-bright steel plate armor clutches a long grissini breadstick in an articulated metal gauntlet. The metal fingers scrape loudly against the plate as the knight lifts the breadstick toward the narrow, horizontal slit of a closed sallet helmet. The breadstick taps bluntly against the steel cheek guard, snapping in half and dropping crumbs across a silk napkin. A gauntleted left hand reaches up and pushes the visor upward an inch with a sharp metallic creak. Two wide, blinking brown eyes peer out through the gap, and (S1), a muffled, youthful male voice echoing from inside the steel helm, says <d>[English] Be honest, is this armor a bit too casual?</d> A towering maître d' steps silently into view behind the armored figure, holding a heavy silver cloche above the knight's head, ready to slam it down.

overall_soundscape: Soft restaurant murmur, clinking wine glasses, the distinct metallic scrape and clink of steel plate armor, a dry snap of a breadstick, the squeak of a metal visor hinge, and heavy muffled breathing inside steel.

non_diegetic_music: None.
```

1. Throw wine at maître d
2. Yell to duck down

### airport security

1. The TSA agent frowning at the X-ray monitor calls a supervisor over to point at an unidentifiable glowing mass inside the duffel bag on the conveyor belt. The supervisor taps a silent alarm button beneath the desk, and a heavy security gate immediately slams down over the exit corridor.
2. The full-body scanner chimes with a harsh double-beep as the motorized glass panels finish their rotating sweep. An agent turns the external display around, showing an impossible yellow outline of a third human hand wrapped around the midsection.
3. A beagle in a neon detector vest works its way down the queue of travelers, ignoring half-eaten pretzels and open duty-free bags. It stops abruptly at the shoelaces, sits down firmly on the floor, and lets out a single, piercing howl while staring straight up.
4. The gray plastic bins clatter down the metal rollers toward the bag retrieval area, crowded with laptops, belts, and loose coins. A gloved officer reaches into the nearest tray, lifts a hissing stainless-steel thermos, and drops it as thick neon-blue smoke billows across the table.
5. The document scanner at the checkpoint flashes red as the agent swipes the passport across the glass a third time. She glances up, mutters a code into her lapel microphone, and two armed federal marshals step out from behind a concrete pillar into the line of sight.

#### airport security 1 — episode 2132ms, choices 1395ms

> The TSA agent frowning at the X-ray monitor calls a supervisor over to point at an unidentifiable glowing mass inside the duffel bag on the conveyor belt. The supervisor taps a silent alarm button beneath the desk, and a heavy security gate immediately slams down over the exit corridor.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking over the conveyor belt at the airport security checkpoint, a TSA agent in a blue uniform with short dark hair leans closely over the illuminated X-ray monitor. The screen displays a scan of a duffel bag containing a dense, bright turquoise glowing mass that pulses slightly. The agent raises a hand, waving toward a tall supervisor in a white shirt and gold badge standing nearby, and (S1), a clipped male voice, says <d>[English] Supervisor, take a look at this screen right now.</d> The supervisor steps over, bends to inspect the display, reaches under the rim of the stainless-steel inspection desk, and presses a concealed red button. A heavy metal security gate crashes down from the ceiling behind the exit archway with a loud metallic clang, completely blocking the corridor as red emergency lights begin to flash across the room.

overall_soundscape: Humming conveyor belt motor, airport terminal background chatter, rapid mechanical click of a button, deafening metal crash of the gate slamming onto linoleum floor, muffled electronic siren hum.

non_diegetic_music: None.
```

1. Snatch the duffel bag
2. Tell them it will explode

#### airport security 2 — episode 2519ms, choices 976ms

> The full-body scanner chimes with a harsh double-beep as the motorized glass panels finish their rotating sweep. An agent turns the external display around, showing an impossible yellow outline of a third human hand wrapped around the midsection.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Standing inside a cylindrical transparent security scanner as the curved glass panels slide open with a motorized hum. Ahead on the gray linoleum floor, a female security officer in a dark blue uniform steps forward and swivels a mounted touch monitor toward the glass. The monitor displays a glowing green silhouette of a human torso, with a distinct, bright yellow outline of a third five-fingered human hand gripping tightly around the left side of the ribcage. (S1), a sharp professional female voice, says <d>[English] Do not move. Keep both hands raised right now.</d> She reaches her right hand toward the radio on her tactical vest, keeping her eyes fixed forward.

overall_soundscape: High-pitched double electronic chime, motorized glass hum, rubber soles on linoleum, click of a plastic monitor hinge.

non_diegetic_music: None.
```

1. Slap the monitor screen down
2. Demand a manual pat down

#### airport security 3 — episode 1785ms, choices 1461ms

> A beagle in a neon detector vest works its way down the queue of travelers, ignoring half-eaten pretzels and open duty-free bags. It stops abruptly at the shoelaces, sits down firmly on the floor, and lets out a single, piercing howl while staring straight up.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. A tiled airport terminal corridor stretches forward, flanked by stanchions and a line of standing passengers with rolling luggage. A beagle wearing a neon-green vest with bold black text reading "DETECTOR DOG" sniffs along the line, trotting past dropped pretzel pieces and an open plastic duty-free bag. A uniformed female handler in dark navy cargo pants follows behind on a short leash. The beagle approaches directly, lowering its snout to sniff the black shoelaces at the bottom of the frame. It halts, sits back firmly on its haunches directly over the shoes, tilts its head back toward the lens, and unleashes a loud, sharp howl as the handler unclips the leash and reaches forward.

overall_soundscape: Airport background chatter, rolling luggage wheels clicking on floor tile seams, distant intercom chimes, dog panting and sniffing close up, a single loud piercing howl.

non_diegetic_music: None.
```

1. Toss the dog a pretzel
2. Offer the officer your passport

#### airport security 4 — episode 2397ms, choices 2470ms

> The gray plastic bins clatter down the metal rollers toward the bag retrieval area, crowded with laptops, belts, and loose coins. A gloved officer reaches into the nearest tray, lifts a hissing stainless-steel thermos, and drops it as thick neon-blue smoke billows across the table.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Gray plastic bins clatter down the steel gravity rollers, bumping into each other on the stainless steel table. Inside the closest gray bin lies a silver laptop, a black leather belt, and a tall stainless-steel thermos with a red digital display flashing rapidly on its cap. (S1), an airport security officer in a blue uniform and blue nitrile gloves, reaches both hands into the bin and lifts the thermos. A sharp, high-pitched hiss cuts through the air, and S1 instantly recoils, dropping the canister back onto the metal tray. It strikes the plastic with a loud crack, the lid pops loose, and thick, neon-blue smoke bursts out, rolling in heavy waves across the metal table and engulfing the conveyor belt. S1 stumbles backward against the baggage scanner, eyes wide, and shouts, (S1), a sharp, strained male voice, says <d>[English] Get back from the belt right now!</d> A pair of hands in gray sleeves enters from the bottom of the frame, reaching directly into the swirling blue cloud toward the flashing canister.

overall_soundscape: Plastic bins clattering on metal rollers, sharp metallic hissing, loud crack of dropped metal on plastic, dense rushing hiss of pressurized smoke, echoing shouts, background terminal murmur.

non_diegetic_music: None.
```

1. Grab the gray-sleeved wrists
2. Hit the emergency stop button

#### airport security 5 — episode 2395ms, choices 1322ms

> The document scanner at the checkpoint flashes red as the agent swipes the passport across the glass a third time. She glances up, mutters a code into her lapel microphone, and two armed federal marshals step out from behind a concrete pillar into the line of sight.

```text
integrated_multimodal_description: [Shot 1] Photoreal live-action, first-person POV at eye level, one continuous shot, natural head sway, no cuts. Looking across a high polished counter at a document scanner glowing solid red under a dark blue passport. An airport security agent with tightly pinned black hair and a navy uniform swipes the passport across the glass pane, and a sharp dual-tone beep rings out as the glass flashes crimson again. She lifts her head, pressing a small black lapel microphone with two fingers, and (S1), a clipped female voice, says <d>[English] We have a status red, secondary gate four.</d> She slides the passport into a locked under-counter drawer and turns the brass key. From behind a thick concrete pillar to her left, two federal marshals in dark tactical vests and sidearms step forward into the lane, their right hands unfastening the thumb breaks on their holsters as they lock eyes with the camera.

overall_soundscape: Electronic scanner beeps, low terminal chatter, hum of fluorescent lights, and the mechanical snap of holsters unbuckling.

non_diegetic_music: None.
```

1. Shove luggage at the marshals
2. Claim full diplomatic immunity

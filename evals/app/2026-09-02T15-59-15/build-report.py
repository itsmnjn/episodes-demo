# Builds report.html from the run folder's JSON. Run: python3 build-report.py
import json, os, html, statistics as st
here = os.path.dirname(os.path.abspath(__file__)); stamp = os.path.basename(here)
L = lambda n: json.load(open(f"{here}/{n}"))
premises = L("premises.json"); episodes = L("episodes.json"); media = L("media.json"); timings = L("timings.json"); V = L("verdicts.json"); config = L("config.json")
sha = open(f"{here}/git-sha").read().strip()[:7]
blob = open(f"{here}/blob-usage.txt").read().strip().splitlines()
series = []
for p in premises:
    c = L(f"series/{p['n']}.create.json"); i = L(f"series/{p['n']}.id.json")
    series.append({**p, **c, **i})
by_series = {s["id"]: s for s in series}
eps = [e for e in episodes["episodes"]]
seams = {f'{s["series"]}/{s["episode"]}': s for s in media["seams"]}
esc = html.escape
CH = {"pass": "ok", "weak": "weak", "fail": "fail", "na": "na"}

# ---- aggregate rubric counts
rub = V["rubric"]; counts = {r: {"pass": 0, "weak": 0, "fail": 0, "na": 0} for r in rub}
for k, v in V["episodes"].items():
    for r in rub: counts[r][v[r][0]] += 1
def rate(r):
    c = counts[r]; n = c["pass"] + c["weak"] + c["fail"]
    return f'{c["pass"]}/{n}' if n else "–"
steps = timings["steps"]; waits = [w for w in timings["waits"] if w["settle_outcome"] == "ok"]
wait_med = st.median([w["submit_to_settle_attempt_done_s"] for w in waits])
stuck = timings["failedSettleAttempts"]; stuck_n = len(stuck); stuck_sum = sum(stuck.values())

def chip(state, label): return f'<span class="chip {CH[state]}">{esc(label)}</span>'
def verdict_row(key):
    v = V["episodes"].get(key)
    if not v: return ""
    out = []
    for r in rub:
        s, ev = v[r]
        if s == "na" and not ev: continue
        out.append(f'<li><span class="chip {CH[s]}">{esc(V["rubricLabels"][r])}</span> <span class="ev">{esc(ev)}</span></li>')
    return "<ul class=\"verdicts\">" + "".join(out) + "</ul>"

def video_src(e):
    if e["videoUrl"]: return e["videoUrl"], "Blob"
    rel = f'../../../out/app-eval/{stamp}/{e["seriesId"]}/{e["id"]}.mp4'
    return rel, "local copy pulled from fal (settle blocked)"

def episode_block(e):
    key = f'{e["seriesId"]}/{e["id"]}'; src, src_label = video_src(e)
    strip = f'strips/{e["seriesId"]}--{e["id"]}.jpg'; seam = f'strips/{e["seriesId"]}--{e["id"]}-seam.jpg'
    sm = seams.get(key); m = media["clips"].get(key, {})
    status = "ready" if e["status"] == "ready" else "stuck in “generating”: rendered at fal, Blob upload failed"
    move = f'<span class="move">Move: “{esc(e["label"])}”</span>' if e["label"] else '<span class="move">Opening</span>'
    if e["label"] and (e["label"] in ("Ask him who sent the mask", "Ask the raccoon its name")): move += ' <span class="tag">typed by me, spoken</span>'
    choices = ", ".join(f"“{esc(c)}”" for c in (e["choices"] or [])) or "<em>none written</em>"
    body = e["prompt"]
    seam_html = ""
    if sm:
        seam_html = f'''<figure class="seam"><img loading="lazy" src="{seam}" alt=""><figcaption>Seam: parent's held frame (left) vs this clip's first frame. Mean gray difference <b>{sm["seam"]}</b>; motion inside this clip from 0 to 20 percent is {sm["withinClip0to20"]}; an unrelated clip is {sm["unrelatedRoot"]}.</figcaption></figure>'''
    t = []
    return f'''
    <article class="episode" id="ep-{esc(e["seriesId"])}-{esc(e["id"])}">
      <header><h4>Episode {esc(e["id"])}</h4>{move}<span class="status {'ok' if e["status"]=="ready" else 'fail'}">{esc(status)}</span></header>
      <div class="ep-grid">
        <div class="media">
          <video controls preload="metadata" playsinline src="{esc(src)}"></video>
          <div class="src">source: {esc(src_label)} · {m.get("resolution","")} · {m.get("duration",0):.1f}s · {m.get("bytes",0)/1e6:.1f} MB · audio {"yes" if m.get("audio") else "no"}</div>
        </div>
        <div class="detail">
          {verdict_row(key)}
          <p class="choices"><b>Written moves:</b> {choices}</p>
          <details><summary>Prompt as rendered</summary><pre>{esc(body)}</pre></details>
        </div>
      </div>
      <figure class="strip"><img loading="lazy" src="{strip}" alt=""><figcaption>Frames at 0, 20, 40, 60, 80, 99 percent.</figcaption></figure>
      {seam_html}
    </article>'''

def series_block(s):
    sid = s["id"]; s_eps = [e for e in eps if e["seriesId"] == sid]
    ex = V["expander"][sid]; ti = V["titles"][sid]
    FILMED = ' <span class="tag">filmed</span>'
    scenes = "".join(f'<li class="{"chosen" if n==s["chosen"] else ""}">{esc(sc)}{FILMED if n==s["chosen"] else ""}</li>' for n, sc in enumerate(s["scenes"]))
    return f'''
  <section class="series" id="s-{esc(sid)}">
    <h2>{s["n"]}. {esc(s["title"])}</h2>
    <p class="premise"><b>Premise</b> “{esc(s["premise"])}” <span class="tag">{esc(s["testing"])}</span></p>
    <div class="two">
      <div><p>{chip(ti[0], "Title")} <span class="ev">{esc(ti[1])}</span></p><p>{chip(ex[0], "Expander")} <span class="ev">{esc(ex[1])}</span></p></div>
      <div><p class="k">Three scenes offered</p><ol class="scenes">{scenes}</ol></div>
    </div>
    <p class="note">{esc(s["notes"])}</p>
    {"".join(episode_block(e) for e in s_eps)}
  </section>'''

findings = [
 ("blocker", "Blob is full, and a full Blob leaves episodes stuck forever.",
  f"Vercel Blob (Hobby, 1 GB) holds {blob[0].split('totalMB=')[1]} MB. From about ten minutes into the run every settle failed with “Storage quota exceeded”. {stuck_n} episodes rendered fine at fal and are stuck in “generating”; the viewer sees “Filming… a few minutes” with no end and no error. There is no failed state for a settle error, only for a render error.",
  "Treat a settle error as a failure after a few attempts, or add a “rendered, not stored” state. Separately, free space: the six eval series hold about 180 MB; older series hold the rest (see appendix)."),
 ("high", "A failing settle re-runs in full on every poll, from every open tab.",
  f"Each 5-second poll on a stuck episode downloads the clip again (about 12 MB), calls the choice writer again, and retries both uploads. Measured in about 15 minutes: {stuck_sum} failed settle attempts across {stuck_n} episodes, {timings['choicesCallsTotal']} choice-writer calls for 16 episodes, {timings['bytesPushedAllAttempts']/1e9:.1f} GB pushed at Blob.",
  "A settling lock or status, and backoff. The choices call should not run until the clip is stored."),
 ("high", "Even a healthy settle is longer than the poll interval, so one tab settles the same episode twice.",
  f"storeClip median is {steps['storeClip']['median_ms']/1000:.1f} s against a 5 s poll. The first series' opening was settled twice by the single browser tab, five seconds apart, before my poller existed (server log 00:10:41 and 00:10:46). Across the run 7 of 10 healthy episodes settled 2 to 4 times, though those counts include my own poller.",
  "Same fix as above: mark the row settling, or have the poll await the in-flight settle."),
 ("high", "A non-human protagonist breaks point of view at the render.",
  "The cat series: all three clips show an orange cat from behind, a follow camera rather than the cat's eyes. By depth two the camera had migrated to the human who walked in. The writer's first sentence was right (“first-person POV of a house cat, low to the floor”, paws from the bottom of frame); the model read “paws creeping forward” as a visible cat.",
  "Iterate the non-human first sentence on the test bench: bun run root \"i'm a house cat in a tokyo apartment\" --render. Until it holds, the premise rule for animals is a promise the render does not keep."),
 ("medium", "The wait copy says “a few minutes”; the wait is 10 to 16 seconds.",
  f"Submit to settled, healthy episodes: median {wait_med:.0f} s (fal reports about 4.3 s of inference; the rest is the poll and the settle). Tap to play is about 15 to 20 s once the next poll lands.",
  "Say “a few seconds”, or nothing."),
 ("medium", "One child in ten never shows its move, and its last beat rendered as a deformity.",
  "Raccoon, “Slam the cooler door shut”: no hand and no cooler door in any sampled frame; the cooler stays closed. The prompt's “turns its head completely upside down between its front paws” became a second face.",
  "Nothing structural; it is the model's miss rate on a physical move. Worth tracking as a number over more runs."),
 ("medium", "The expander stacks a second cliffhanger on premises that already have one, and drifts surreal on plain ones.",
  "Bus stop and Sopranos: all six scenes keep the premise's cliffhanger and add another (sedans, a social security number read aloud, a man under a bus; feds, a house fire, a caller). The Sopranos scenes also copied the premise's first person (“to me”, “my knuckles”). Bakery: all three scenes went supernatural for “a bakery at dawn”.",
  "One rule to consider: if the premise ends on a cliffhanger, the scene ends on that one."),
 ("low", "Two writer format slips in five child prompts.",
  "Cat, depth two: dialogue tagged [Japanese] but written in English. Bus stop child: a voice from the phone speaks with no speaker tag, because only visible characters may speak. The rule has no answer for a voice on a phone, which is a legitimate off-screen speaker.",
  "Decide whether off-screen voices exist; if yes, give them a tag rule."),
 ("low", "Choice pairs: 4 of 9 are two physical acts of the same kind.",
  "Laundromat root (hit the stop / pry the handle), cat root (swat / snag), cat child (tip / bite), bakery root (swat / catch). Every label is verb-first and 3 to 5 words. One pair points at a sound-only beat the viewer may not have registered.",
  "The pair rule holds a little over half the time. The eval flags will not catch “same kind”; it needs a reader."),
 ("low", "Titles are literal in all six, and wrong in two.",
  "“Elderly Woman Drops Phone”: she hands it over and runs. “Pigeon Escapes the Balcony Rail”: it only starts to spread its wings.",
  "The writer sees the prompt, which ends before the outcome; it is inferring an ending. “Names what happens” could be “names what is shown”."),
 ("unverified", "Enter in the typed-move field did not submit through my browser tool.",
  "Typing a move and pressing Enter left the value in the field twice in a row; submitting the form programmatically worked and the branch was created. This is likely my key tool, not the app, but I could not prove it.",
  "Press Enter in the field by hand once."),
 ("good", "What held.",
  "The seam is exact: a child's first frame differs from the parent's held frame by about 2 gray levels, against 35 to 70 for ordinary motion inside a clip. Point of view held in 13 of 16 clips, every miss being the cat. Spoken moves were handled right both times: the child opens on the answer and the protagonist's words are never shown. Claymation propagated to the child, including the protagonist's clay hand. Named likenesses landed from names alone. Turbo renders in about 4.3 s of inference.",
  ""),
]

def finding(f):
    sev, claim, ev, fix = f
    fix_html = f'<p class="fix"><b>Fix</b> {esc(fix)}</p>' if fix else ""
    return f'<li class="finding {sev}"><span class="sev">{esc(sev)}</span><div><h3>{esc(claim)}</h3><p>{esc(ev)}</p>{fix_html}</div></li>'

# rubric table
rows = []
for e in eps:
    key = f'{e["seriesId"]}/{e["id"]}'; v = V["episodes"].get(key)
    if not v: continue
    cells = "".join(f'<td class="{CH[v[r][0]]}" title="{esc(v[r][1])}">{"" if v[r][0]=="na" else v[r][0]}</td>' for r in rub)
    rows.append(f'<tr><td><a href="#ep-{esc(e["seriesId"])}-{esc(e["id"])}">{esc(by_series[e["seriesId"]]["title"])} · {esc(e["id"])}</a></td>{cells}</tr>')
rub_head = "".join(f"<th>{esc(V['rubricLabels'][r])}<br><small>{rate(r)}</small></th>" for r in rub)
rubric_table = f'<table class="rubric"><thead><tr><th>Episode</th>{rub_head}</tr></thead><tbody>{"".join(rows)}</tbody></table>'

order = ["expand", "rootPrompt", "title", "submitRoot", "episodePrompt", "submitEpisode", "render", "clipDownload", "clipUpload", "lastFrame", "storeClip", "choices"]
lat_rows = "".join(f'<tr><td>{s}</td><td>{steps[s]["n"]}</td><td>{steps[s]["median_ms"]}</td><td>{steps[s]["min_ms"]}</td><td>{steps[s]["max_ms"]}</td></tr>' for s in order if s in steps)
wait_rows = "".join(f'<tr><td>{esc(by_series[w["series"]]["title"])} · {w["episode"]}</td><td>{w["kind"]}</td><td>{w["submit_to_settle_attempt_done_s"]}</td><td class="{ "ok" if w["settle_outcome"]=="ok" else "fail"}">{w["settle_outcome"]}</td></tr>' for w in sorted(timings["waits"], key=lambda w: (w["series"], w["episode"])))

page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Episodes app eval · {stamp}</title>
<style>
:root{{--ink:#0e0d0c;--card:#171513;--line:#2a2724;--paper:#efe9e0;--mute:#9a928a;--ember:#e0642f;--ok:#4caf7a;--weak:#d9a441;--fail:#e05a4f;--na:#4a4744}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--ink);color:var(--paper);font:15px/1.55 -apple-system,Inter,Segoe UI,Helvetica,Arial,sans-serif}}
a{{color:var(--paper)}}h1,h2,h3,h4{{font-weight:600;letter-spacing:-.01em;margin:0}}
.wrap{{max-width:1180px;margin:0 auto;padding:40px 28px 120px}}
.hero{{border-bottom:1px solid var(--line);padding-bottom:28px;margin-bottom:36px}}.hero h1{{font-size:34px}}.hero p{{color:var(--mute);margin:8px 0 0}}.hero code{{color:var(--paper)}}
.tiles{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:26px 0}}.tile{{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px}}.tile b{{display:block;font-size:26px;font-weight:600}}.tile span{{color:var(--mute);font-size:13px}}
section.block{{margin:44px 0}}section.block>h2{{font-size:22px;margin-bottom:14px}}
ol.findings{{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}}.finding{{display:grid;grid-template-columns:96px 1fr;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px 18px}}.finding h3{{font-size:16px;margin-bottom:6px}}.finding p{{margin:0 0 6px;color:#d9d2c8}}.finding .fix{{color:var(--mute)}}
.sev{{align-self:start;font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:4px 8px;border-radius:999px;text-align:center;border:1px solid var(--line)}}
.blocker .sev{{background:var(--fail);color:#fff;border-color:transparent}}.high .sev{{color:var(--fail);border-color:var(--fail)}}.medium .sev{{color:var(--weak);border-color:var(--weak)}}.low .sev{{color:var(--mute)}}.unverified .sev{{color:#8fb3d9;border-color:#8fb3d9}}.good .sev{{color:var(--ok);border-color:var(--ok)}}
table{{border-collapse:collapse;width:100%;font-size:14px}}th,td{{text-align:left;padding:7px 10px;border-bottom:1px solid var(--line);vertical-align:top}}th{{color:var(--mute);font-weight:500}}th small{{color:var(--paper)}}
.rubric td.ok{{background:rgba(76,175,122,.18);color:var(--ok)}}.rubric td.weak{{background:rgba(217,164,65,.18);color:var(--weak)}}.rubric td.fail{{background:rgba(224,90,79,.2);color:var(--fail)}}.rubric td.na{{color:var(--na)}}.rubric td{{text-transform:capitalize}}
td.ok{{color:var(--ok)}}td.fail{{color:var(--fail)}}
.chip{{display:inline-block;font-size:12px;padding:2px 9px;border-radius:999px;border:1px solid;margin-right:6px;white-space:nowrap}}.chip.ok{{color:var(--ok);border-color:var(--ok)}}.chip.weak{{color:var(--weak);border-color:var(--weak)}}.chip.fail{{color:var(--fail);border-color:var(--fail)}}.chip.na{{color:var(--na);border-color:var(--na)}}
.ev{{color:#d9d2c8}}.tag{{font-size:11px;color:var(--mute);border:1px solid var(--line);border-radius:999px;padding:1px 8px;margin-left:6px;white-space:nowrap}}
section.series{{margin:56px 0;padding-top:28px;border-top:1px solid var(--line)}}section.series>h2{{font-size:24px}}.premise{{margin:10px 0 14px;font-size:16px}}.two{{display:grid;grid-template-columns:1fr 1fr;gap:24px}}.two p{{margin:6px 0}}.k{{color:var(--mute);font-size:13px;text-transform:uppercase;letter-spacing:.12em}}
ol.scenes{{padding-left:20px;margin:6px 0}}ol.scenes li{{color:var(--mute);margin:6px 0}}ol.scenes li.chosen{{color:var(--paper)}}.note{{color:var(--mute);font-style:italic;margin:14px 0 8px}}
article.episode{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px 20px;margin:18px 0}}article.episode header{{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:12px}}article.episode h4{{font-size:17px}}.move{{color:var(--paper)}}.status{{font-size:12px;margin-left:auto}}.status.ok{{color:var(--ok)}}.status.fail{{color:var(--fail)}}
.ep-grid{{display:grid;grid-template-columns:270px 1fr;gap:22px}}.media video{{width:100%;aspect-ratio:9/16;background:#000;border-radius:6px}}.src{{color:var(--mute);font-size:12px;margin-top:6px}}
ul.verdicts{{list-style:none;padding:0;margin:0 0 12px}}ul.verdicts li{{margin:5px 0}}.choices{{margin:8px 0}}details summary{{cursor:pointer;color:var(--mute)}}pre{{white-space:pre-wrap;font:13px/1.5 ui-monospace,Menlo,monospace;color:#cfc8be;background:#0b0a09;padding:12px;border-radius:6px}}
figure{{margin:14px 0 0}}figure img{{width:100%;border-radius:6px;display:block}}figcaption{{color:var(--mute);font-size:12px;margin-top:6px}}figure.seam img{{max-width:460px}}
.limits li{{margin:6px 0}}.appendix pre{{max-height:320px;overflow:auto}}
@media (max-width:820px){{.ep-grid,.two{{grid-template-columns:1fr}}.finding{{grid-template-columns:1fr}}}}
</style></head><body><div class="wrap">
<header class="hero"><h1>Episodes app eval</h1>
<p>Run {esc(stamp)} · commit <code>{esc(sha)}</code> · roots and children on <code>{esc(config["root"])}</code> / <code>{esc(config["child"])}</code> · writers <code>{esc(config["root_model"])}</code> (expander, root, choices), <code>{esc(config["episode_model"])}</code> (next episode, title)</p>
<p>Six premises from one word to a paragraph, two with their own cliffhanger. Every series was created through the create page and walked in the player; nothing was hand-edited. I judged six fixed frames per clip against a rubric written before the first render. Audio was not judged.</p>
<div class="tiles">
<div class="tile"><b>{len(V["episodes"])}</b><span>clips judged (6 roots, 10 children)</span></div>
<div class="tile"><b>{rate("pov")}</b><span>point of view held</span></div>
<div class="tile"><b>{rate("move")}</b><span>move visible in the opening frames</span></div>
<div class="tile"><b>{rate("seam")}</b><span>seam exact (≈2 gray levels)</span></div>
<div class="tile"><b>{wait_med:.0f} s</b><span>submit to settled, median, healthy</span></div>
<div class="tile"><b>{steps["render"]["median_ms"]/1000:.1f} s</b><span>render as seen by the poll (fal: ≈4.3 s inference)</span></div>
<div class="tile"><b>{stuck_n}</b><span>episodes stuck on the Blob quota</span></div>
<div class="tile"><b>{stuck_sum}</b><span>failed settle attempts in ≈15 min</span></div>
</div></header>

<section class="block"><h2>Findings, ranked</h2><ol class="findings">{"".join(finding(f) for f in findings)}</ol></section>

<section class="block"><h2>Rubric, every clip</h2><p style="color:var(--mute)">Hover a cell for the evidence; click the row to jump to the clip. Header counts are passes over judged cells.</p>{rubric_table}</section>

<section class="block"><h2>Latency from the server log</h2><p style="color:var(--mute)">First attempt per step per episode, in milliseconds. Render is measured from the row's insert to the poll that found it done, so it carries up to one 5-second poll interval.</p>
<div class="two"><table><thead><tr><th>Step</th><th>n</th><th>median</th><th>min</th><th>max</th></tr></thead><tbody>{lat_rows}</tbody></table>
<table><thead><tr><th>Episode</th><th>kind</th><th>submit → settle done, s</th><th>settle</th></tr></thead><tbody>{wait_rows}</tbody></table></div></section>

<section class="block"><h2>How to read my verdicts</h2><ul class="limits">
<li><b>Frames, not motion.</b> Six frames at 0, 20, 40, 60, 80, 99 percent, the same for every clip. A beat between samples can be missed; a beat I call missing may sit between frames. The strips are under each clip so you can check me.</li>
<li><b>No audio.</b> Dialogue delivery, the soundscape, and whether the protagonist's voice leaks in are unjudged. The bus stop child and both spoken-move children are the ones to listen to.</li>
<li><b>Seam is a mean.</b> The number is a mean absolute gray difference on a 96×170 downsample, so a small local change (a phone flipping open) would not move it. I checked three pairs by eye; they matched.</li>
<li><b>My poller doubled the polling</b> on healthy episodes, so the “settled 2 to 4 times” count overstates a single viewer. The single-tab double settle on the first opening happened before my poller started.</li>
<li><b>One rater, sixteen clips.</b> Pass, weak, fail; no scores.</li>
<li><b>Five clips were never settled</b> because of the Blob quota. I pulled them from fal's result by request id (read-only) so they could be judged; their written moves do not exist.</li>
</ul></section>

{"".join(series_block(s) for s in series)}

<section class="block appendix"><h2>Appendix</h2>
<p class="k">Blob usage at the end of the run</p><pre>{esc(chr(10).join(blob))}</pre>
<p class="k">Files</p><p style="color:var(--mute)">episodes.json (every row and prompt), media.json (probe and seam numbers), timings.json, verdicts.json, server-log.jsonl (the dev server's log for the run), series/*.json (the create page's scenes and prompts as shown), frames/ and strips/. Clips for the stuck episodes are under out/app-eval/{esc(stamp)}/ and are not committed.</p>
</section>
</div>
<script>
document.querySelectorAll('.rubric tbody tr').forEach(tr=>tr.addEventListener('click',e=>{{if(e.target.tagName!=='A')tr.querySelector('a').click()}}));
// pause other videos when one plays
document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(o=>{{if(o!==v)o.pause()}})));
</script></body></html>'''
open(f"{here}/report.html", "w").write(page); print("wrote report.html", len(page), "bytes")

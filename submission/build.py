"""Build Supporting_Artifacts_Rohit_Kumar.html (then printed to PDF by print.js)."""
import base64, json, html, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(os.path.join(HERE, 'links.json')))
extra_rows = json.load(open(os.path.join(HERE, 'extra_interviews.json')))
shots = cfg.get('conversation_shots', [])

def img(path):
    with open(os.path.join(HERE, path), 'rb') as f:
        return 'data:image/png;base64,' + base64.b64encode(f.read()).decode()

def img_any(path):
    ext = path.rsplit('.', 1)[-1].lower()
    mime = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}.get(ext, 'image/png')
    with open(path, 'rb') as f:
        return f'data:{mime};base64,' + base64.b64encode(f.read()).decode()

e = html.escape

# ---------- Interview log ----------
interviews = [
 ("01","Shashikant Kumar","Unclear (ixigo + IRCTC)","Call","ixigo and IRCTC bookings","Waitlist uncertainty; wants to know what to do if a ticket doesn't confirm","Low"),
 ("02","Prince","Active ixigo user","Call","Train + hotel; family and friends; connecting trips","Values the confirmation % and 3X Refund; books for others","Low"),
 ("03","Amrish","Unclear","Call","ixigo vs IRCTC; Tatkal","Weighs Tatkal vs regular tickets, travel time vs cost","Low"),
 ("04","Diwakar","Active ixigo user","Call","Bookings for his father","Wants clear WL/RAC status; general ticket as a fallback","Low"),
 ("05","Nitin Anuj","Active ixigo user","Call","Mumbai; festival season","Needs alternatives in festival peaks; last-minute vs advance booking","Low"),
 ("06","Aditya","Active ixigo user (2 yrs)","Call","Varanasi; family; 2AC","Trusts about 85–90%; comfort first; would take a flight or bus; didn't know 3X Refund","Good"),
 ("07","Diwakar Durlabh","Active ixigo user","Call","Ahmedabad–Prayagraj","Books at about 80% chance; uses 3X Refund","Medium–Low"),
 ("08","Ashish","Active ixigo user, 12–15 trips/yr","Call","Mumbai–Delhi","Books at 80%+ and often gets RAC; wants short, on-time night trains; checks IRCTC for data mismatches","Good"),
 ("09","Avi Anika","IRCTC user (never booked on ixigo)","Call","Delhi–Prayagraj / Lucknow","Downloaded ixigo but books on official IRCTC","Good"),
 ("10","Anika","MakeMyTrip user","Call","Delhi–Kanpur","On-time arrival comes first; books only at 80%+, else goes by car","Good"),
 ("11","Alok Vishwakarma","IRCTC user","Call","Mumbai–Patna","Finds IRCTC easy; Tatkal and bus as alternatives","Low"),
 ("12","Durlabh*","Checks ixigo, books on IRCTC","Call","Patna–Delhi","Worried about extra charges, refund method and voucher terms","Low–Medium"),
 ("13","Priya","Active ixigo user","Call","Punjab–West Bengal","Books WL only at 80%+; otherwise IRCTC / Premium Tatkal; avoids long flight layovers","Good"),
 ("14","Sayantika","Active ixigo user","Call","Malda–Delhi; Durga Puja","Uses about 80%, 90% when urgent; plans ahead","Good"),
 ("15","Sandeep Ghosh","Using ixigo less","Call","Railway bookings","Wants 90–95%; a high-chance ticket didn't confirm; login friction cut his usage","Medium–Low"),
 ("16","Anup Mondal","Active ixigo user","Call","Bangalore–Kolkata; family","Values timings, availability and sorting; flight as an alternative","Medium–Low"),
 ("17","Abhay","IRCTC user","Call","Train tracking","General ticket as a last resort; bus and flight also considered","Very low"),
 ("18","Yashveer","Using ixigo less","Call","Shiv Ganga Express; night travel","Finds ixigo more complicated than IRCTC","Low–Medium"),
 ("19","Abhilash","Checks ixigo, books on IRCTC","Call","Varanasi–Delhi","Uses ixigo for information; books on IRCTC because it is official","Low"),
 ("20","Sushant","Checks ixigo, books on IRCTC","Call","Bangalore–Darbhanga","Checks ixigo, books on IRCTC; 3X Refund unclear","Very low"),
 ("21","Mamta Singh","Active ixigo user","WhatsApp","Mumbai–Agra; Rajdhani; family","Booked WL at 95%, confirmed about 4 h before departure; books only above 90%; prefers a flight to Tatkal; rates ixigo 4/5","Good"),
]
survey = [
 ("S01","Survey respondent","Uses IRCTC, ixigo, ConfirmTkt","Survey","Family function; 3–4 people; booked 1+ month ahead","Searched 3–5 times; got confirmed Tatkal on IRCTC; a high-chance ticket once ended as RAC; trust in % 2/5; top priority journey time","Survey"),
 ("S02","Survey respondent","Uses 6 apps incl. ixigo","Survey","Holiday; 2 people; 2–7 days ahead","Tatkal stayed WL, so flew (booked on ixigo); trust 1/5; too many options to compare; top priority comfort","Survey"),
 ("S03","Survey respondent","IRCTC, ixigo","Survey","No waitlist in the last 6 months","Screened out after Q1","Survey"),
 ("S04","Survey respondent","IRCTC, ixigo, Paytm","Survey","Work; solo; same day","Confirmed Tatkal on ixigo after 3–5 searches; trust 1/5; found out too late; top priority journey time","Survey"),
 ("S05","Survey respondent","IRCTC, ixigo, ConfirmTkt, agent","Survey","Festival; 3–4 people; 2–7 days ahead","Tried every option, searched 10+ times, finally used an agent; didn't trust the prediction; top priority confirmation","Survey"),
 ("S06","Survey respondent","IRCTC, ixigo, MakeMyTrip","Survey","Work; solo; same day","Confirmed Tatkal on IRCTC; too many options to compare; trust 3/5; top priority arrival time","Survey"),
 ("S07","Survey respondent","IRCTC only","Survey","Family function; 5+ people; 1+ month ahead","Searched 10+ times and asked family; booked on IRCTC; trust 1/5; wants a comfortable family train","Survey"),
]
rows = interviews + [tuple(r) for r in extra_rows] + survey
n_people = 20 + len(extra_rows) + 7

def log_table():
    out = ['<table class="log"><thead><tr><th>#</th><th>Name</th><th>Type</th><th>Channel</th><th>Route / context</th><th>Key insight</th><th>Evidence</th></tr></thead><tbody>']
    for r in rows:
        cls = ' class="sv"' if r[3] == 'Survey' else (' class="new"' if r[0].startswith('W') else '')
        out.append(f'<tr{cls}>' + ''.join(f'<td>{e(x)}</td>' for x in r) + '</tr>')
    out.append('</tbody></table>')
    return ''.join(out)

# ---------- New-flow SVG (two rows) ----------
def box(x, y, w, h, lines, kind='plain', fs=14):
    fills = {'plain': ('#ffffff', '#8a97a6'), 'new': ('#e3e8fc', '#2c4bd6'), 'ok': ('#e2f3ea', '#1d8a57')}
    f, s = fills[kind]
    cy = y + h / 2 - (len(lines) - 1) * (fs * 0.62)
    t = ''.join(f'<tspan x="{x + w / 2}" dy="{0 if i == 0 else fs * 1.25}">{e(l)}</tspan>' for i, l in enumerate(lines))
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{f}" stroke="{s}" stroke-width="1.5"/>'
            f'<text x="{x + w / 2}" y="{cy + fs * 0.35}" text-anchor="middle" font-size="{fs}" fill="#15202c">{t}</text>')

def new_flow_svg():
    W, bw, bh, gap = 1060, 176, 84, 40
    xs = [10 + i * (bw + gap) for i in range(5)]
    y1, y2, y3 = 30, 230, 370
    p = [f'<svg viewBox="0 0 {W} 480" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Inter, DejaVu Sans, sans-serif">',
         '<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#6a7684"/></marker></defs>']
    row1 = [(['Search route', 'and date'], 'plain'), (['WL 42 with outcome', 'meter: berth 35%', 'RAC 25% · WL 40%'], 'new'),
            (['See best ways', 'to reach'], 'plain'), (['One ranked list', 'chips + 80% cut-off', 'top pick + backup'], 'new'),
            (['Option detail', 'odds explained', 'backup ready'], 'new')]
    for i, (l, k) in enumerate(row1):
        p.append(box(xs[i], y1, bw, bh, l, k))
        if i < 4:
            p.append(f'<line x1="{xs[i] + bw}" y1="{y1 + bh / 2}" x2="{xs[i + 1] - 2}" y2="{y1 + bh / 2}" stroke="#6a7684" stroke-width="1.5" marker-end="url(#ar)"/>')
    # Row 2, right to left: Book (under E) <- ... snake
    bx = xs[4]
    p.append(box(bx, y2, bw, bh, ['Book in 2 taps'], 'plain'))
    p.append(f'<line x1="{bx + bw / 2}" y1="{y1 + bh}" x2="{bx + bw / 2}" y2="{y2 - 2}" stroke="#6a7684" stroke-width="1.5" marker-end="url(#ar)"/>')
    # Diamond under D
    cx, cy = xs[3] + bw / 2, y2 + bh / 2
    p.append(f'<polygon points="{cx - 92},{cy} {cx},{cy - 58} {cx + 92},{cy} {cx},{cy + 58}" fill="#ffffff" stroke="#8a97a6" stroke-width="1.5"/>')
    p.append(f'<text x="{cx}" y="{cy - 4}" text-anchor="middle" font-size="14" fill="#15202c"><tspan x="{cx}">Confirmed at</tspan><tspan x="{cx}" dy="17">chart time?</tspan></text>')
    p.append(f'<line x1="{bx}" y1="{cy}" x2="{cx + 94}" y2="{cy}" stroke="#6a7684" stroke-width="1.5" marker-end="url(#ar)"/>')
    # Travel under C
    tx = xs[2]
    p.append(box(tx, y2, bw, bh, ['Travel'], 'ok'))
    p.append(f'<line x1="{cx - 92}" y1="{cy}" x2="{tx + bw + 2}" y2="{cy}" stroke="#6a7684" stroke-width="1.5" marker-end="url(#ar)"/>')
    p.append(f'<text x="{(cx - 92 + tx + bw) / 2}" y="{cy - 10}" text-anchor="middle" font-size="13" fill="#1d8a57" font-weight="600">yes</text>')
    # Backup below diamond
    p.append(box(cx - bw / 2, y3, bw, 70, ['Book backup', 'in 1 tap'], 'plain'))
    p.append(f'<line x1="{cx}" y1="{cy + 58}" x2="{cx}" y2="{y3 - 2}" stroke="#6a7684" stroke-width="1.5" marker-end="url(#ar)"/>')
    p.append(f'<text x="{cx + 10}" y="{cy + 84}" font-size="13" fill="#c43f37" font-weight="600">no</text>')
    p.append(f'<path d="M{cx - bw / 2} {y3 + 35} H{tx + bw / 2} V{y2 + bh + 2}" fill="none" stroke="#6a7684" stroke-width="1.5" marker-end="url(#ar)"/>')
    # Regret question under B
    rx = xs[1]
    p.append(box(rx, y2, bw, bh, ['"Was this the', 'right choice?"'], 'plain'))
    p.append(f'<line x1="{tx}" y1="{cy}" x2="{rx + bw + 2}" y2="{cy}" stroke="#6a7684" stroke-width="1.5" marker-end="url(#ar)"/>')
    # Learning loop back up to ranked list (D)
    ly = (y1 + bh + y2) / 2 + 6
    p.append(f'<path d="M{rx + bw / 2} {y2} V{ly} H{xs[3] + bw / 2} V{y1 + bh + 2}" fill="none" stroke="#2c4bd6" stroke-width="1.5" stroke-dasharray="5 5" marker-end="url(#ar)"/>')
    p.append(f'<text x="{(rx + xs[3]) / 2 + bw / 2}" y="{ly - 8}" text-anchor="middle" font-size="13" fill="#2c4bd6" font-weight="600">outcomes improve odds and ranking</text>')
    p.append('</svg>')
    return ''.join(p)

# ---------- Trajectory chart ----------
def trajectory_svg():
    pts = [(0, 26, 'Baseline'), (2, 32, 'Pilot'), (4, 37, 'Scale'), (6, 42, 'Full')]
    W, H, L, R, T, B = 560, 260, 48, 20, 24, 40
    X = lambda m: L + m / 6 * (W - L - R)
    Y = lambda v: T + (50 - v) / 30 * (H - T - B)
    p = [f'<svg viewBox="0 0 {W} {H}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Inter, DejaVu Sans, sans-serif">']
    for v in (20, 30, 40, 50):
        p.append(f'<line x1="{L}" x2="{W - R}" y1="{Y(v)}" y2="{Y(v)}" stroke="#e1e6ec"/><text x="{L - 8}" y="{Y(v) + 4}" text-anchor="end" font-size="11" fill="#6a7684">{v}%</text>')
    for m in range(0, 7):
        p.append(f'<text x="{X(m)}" y="{H - B + 18}" text-anchor="middle" font-size="11" fill="#6a7684">M{m}</text>')
    p.append(f'<line x1="{L}" x2="{W - R}" y1="{Y(42)}" y2="{Y(42)}" stroke="#2c4bd6" stroke-dasharray="4 4"/><text x="{W - R}" y="{Y(42) - 6}" text-anchor="end" font-size="11" fill="#2c4bd6">target 42%</text>')
    d = ' '.join(f'{"M" if i == 0 else "L"}{X(m)} {Y(v)}' for i, (m, v, _) in enumerate(pts))
    p.append(f'<path d="{d}" fill="none" stroke="#2c4bd6" stroke-width="2.5"/>')
    for m, v, lab in pts:
        p.append(f'<circle cx="{X(m)}" cy="{Y(v)}" r="4.5" fill="#2c4bd6"/><text x="{X(m)}" y="{Y(v) + 18}" text-anchor="middle" font-size="11" fill="#15202c">{v}% · {lab}</text>')
    p.append('</svg>')
    return ''.join(p)

def rank_bars():
    data = [('Journey time', 2.33), ('Confirmation chance', 3.0), ('Arrival time', 3.33), ('Class / comfort', 4.17), ('Station nearby', 4.67), ('Price', 4.83), ('Free cancellation', 5.67)]
    out = ['<div class="bars">']
    for name, v in data:
        w = (8 - v) / (8 - 2.33) * 100
        col = '#2c4bd6' if v <= 3.4 else '#aeb9c6'
        out.append(f'<div class="bar"><span class="bn">{e(name)}</span><span class="bt"><span style="width:{w:.0f}%;background:{col}"></span></span><span class="bv">{v:.1f}</span></div>')
    out.append('</div>')
    return ''.join(out)

links = cfg['links']
link_rows = ''.join(f'<tr><td>{e(k)}</td><td>{("<a href=" + chr(34) + e(v) + chr(34) + ">" + e(v) + "</a>") if v.startswith("http") else e(v)}</td></tr>' for k, v in links)

def fig_row(items):
    return '<div class="shots">' + ''.join(f'<figure><img src="{img_any(x["path"])}" alt="{e(x["caption"])}"><figcaption>{e(x["caption"])}</figcaption></figure>' for x in items) + '</div>'
calls = [x for x in shots if x.get('group') == 'calls']
chats = [x for x in shots if x.get('group') == 'whatsapp']
if shots:
    shots_pages = f'''<section class="page"><h2>2a · Call recordings</h2><p class="lead">All 20 calls were recorded with the iPhone call recorder and kept in one Notes folder; each has an audio file, a transcript and a summary.</p>{fig_row(calls)}</section>
<section class="page"><h2>2b · WhatsApp interview</h2><p class="lead">One interview ran as a WhatsApp chat in English, using the same questions as the calls.</p>{fig_row(chats)}</section>'''
else:
    shots_pages = '''<section class="page"><h2>2 · Screenshots from user conversations</h2><div class="todo">Screenshots to be added.</div></section>'''

ann = [
 ('a1.png', 'Screen 1 · Search result with an honest outcome', 'The WL 42 train shows own berth 35% · RAC 25% · stays WL 40% (pin 1) and one entry point to every alternative (pin 2).'),
 ('a2.png', 'Screen 2 · Best ways to reach', 'Priority chips (3), the 80% cut-off filter (4), a top pick with its reason (5) and a confirmed backup (6).'),
 ('a2b.png', 'Screen 2 (scrolled) · Nothing hidden silently', 'The nearby station carries its cab cost (8); options below the cut-off, including the user’s own train (7), sit in one line at the bottom.'),
 ('a3.png', 'Screen 3 · Option detail', 'The chance explained as the last 10 similar Saturdays (9); backup and protection in plain words (10).'),
 ('a4.png', 'Screen 4 · Plan set', 'Plan, ready backup, chart-time timeline and the post-trip regret question that feeds the ranking (11).'),
]
ann_pages = ''.join(f'''<section class="page"><div class="eyebrow">5 · Prototype · best-way-to-reach.lovable.app</div><h2>{e(t)}</h2><p class="lead">{e(d)}</p><img class="ann" src="{img(f)}" alt="{e(t)}"></section>''' for f, t, d in ann)

doc = f'''<!doctype html><html><head><meta charset="utf-8"><title>Supporting Artifacts – Rohit Kumar</title>
<style>
@page {{ size: A4 landscape; margin: 12mm 14mm; }}
* {{ box-sizing: border-box; }}
body {{ font-family: Inter, 'DejaVu Sans', sans-serif; color: #15202c; font-size: 10.5pt; line-height: 1.45; margin: 0; }}
.page {{ page-break-after: always; }}
.page:last-child {{ page-break-after: auto; }}
h1 {{ font-size: 30pt; margin: 0 0 6pt; letter-spacing: -0.5px; }}
h2 {{ font-size: 17pt; margin: 0 0 6pt; letter-spacing: -0.2px; }}
h3 {{ font-size: 12pt; margin: 10pt 0 4pt; }}
.lead {{ color: #4a5868; margin: 0 0 10pt; max-width: 230mm; }}
.eyebrow {{ font-size: 9pt; letter-spacing: 2px; text-transform: uppercase; color: #2c4bd6; font-weight: 700; }}
table {{ border-collapse: collapse; width: 100%; font-size: 8.8pt; }}
th {{ background: #15202c; color: #f3f5f8; text-align: left; padding: 5pt 6pt; font-weight: 600; }}
td {{ border-bottom: 1px solid #d6dde4; padding: 3.6pt 6pt; vertical-align: top; }}
tr:nth-child(even) td {{ background: #f6f8fa; }}
tr.sv td {{ color: #2f3c4a; }}
tr.new td {{ background: #eef6ee; }}
thead {{ display: table-header-group; }}
tr {{ page-break-inside: avoid; }}
.log td:nth-child(1) {{ width: 4%; }} .log td:nth-child(2) {{ width: 11%; font-weight: 600; }} .log td:nth-child(3) {{ width: 14%; }}
.log td:nth-child(4) {{ width: 7%; }} .log td:nth-child(5) {{ width: 17%; }} .log td:nth-child(7) {{ width: 8%; }}
.cover {{ display: flex; flex-direction: column; gap: 12pt; }}
.cover .meta {{ color: #4a5868; font-size: 12pt; }}
.links td:first-child {{ width: 32%; font-weight: 600; }}
a {{ color: #2c4bd6; text-decoration: none; word-break: break-all; }}
.contents {{ columns: 2; font-size: 10.5pt; color: #2f3c4a; }}
.flow {{ width: 100%; border: 1px solid #d6dde4; border-radius: 8pt; padding: 8pt; }}
.ann {{ width: 100%; max-height: 160mm; object-fit: contain; border: 1px solid #d6dde4; border-radius: 8pt; }}
.grid2 {{ display: grid; grid-template-columns: 1.15fr 1fr; gap: 14pt; align-items: start; }}
.tiles {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; }}
.tile {{ border: 1px solid #d6dde4; border-radius: 8pt; padding: 8pt 10pt; }}
.tile .k {{ font-size: 8.5pt; color: #4a5868; }}
.tile .v {{ font-size: 16pt; font-weight: 700; color: #2c4bd6; }}
.bars {{ display: flex; flex-direction: column; gap: 5pt; }}
.bar {{ display: grid; grid-template-columns: 120pt 1fr 26pt; gap: 8pt; align-items: center; font-size: 9.5pt; }}
.bt {{ height: 10pt; background: #e9edf2; border-radius: 3pt; overflow: hidden; display: block; }}
.bt span {{ display: block; height: 100%; }}
.bv {{ font-weight: 700; text-align: right; }}
.todo {{ border: 2px dashed #c4860f; border-radius: 8pt; padding: 18pt; color: #8a5a00; background: #fbf1dd; }}
.shots {{ display: flex; gap: 12pt; justify-content: center; align-items: flex-start; }}
.shots figure {{ margin: 0; flex: 1; max-width: 80mm; }}
.shots img {{ width: 100%; max-height: 138mm; object-fit: contain; border: 1px solid #d6dde4; border-radius: 6pt; background: #111; }}
figcaption {{ font-size: 9pt; color: #4a5868; margin-top: 4pt; }}
.note {{ font-size: 8.5pt; color: #6a7684; margin-top: 6pt; }}
.pill {{ display: inline-block; padding: 1pt 6pt; border-radius: 99pt; font-size: 8pt; font-weight: 700; }}
</style></head><body>

<section class="page cover">
  <div class="eyebrow">ixigo Trains · Product capstone</div>
  <h1>Supporting Artifacts</h1>
  <div class="meta">Best Way to Reach: turning a waitlisted ticket into a travel plan people trust<br>Rohit Kumar · Airtribe Product Management Launchpad · 6 November 2026</div>
  <table class="links"><thead><tr><th>Deliverable</th><th>Link</th></tr></thead><tbody>{link_rows}</tbody></table>
  <h3>Contents</h3>
  <div class="contents">1. Interview log ({len(rows)} records, about {n_people} users)<br>2. Screenshots from user conversations (calls and WhatsApp)<br>3. Competitor analysis<br>4. UX flow: today vs new<br>5. Prototype annotated screens<br>6. OKRs and metric dashboard<br>7. Guardrails and event tracking<br>8. Raw research notes: survey<br>9. Raw research notes: interview themes and hypotheses</div>
</section>

<section class="page">
  <h2>1 · Interview log</h2>
  <p class="lead">{len(interviews) + len(extra_rows)} interview records ({20 + len(extra_rows)} calls and chats, about {20 + len(extra_rows)} unique people) plus 7 survey respondents: about {n_people} users in total. Insights are paraphrased; several call transcripts were noisy, so each record carries an evidence label (how clearly the recording supports the insight). Record 12 may be the same person as record 07. Survey respondents are anonymised (S01–S07).</p>
  {log_table()}
</section>

{shots_pages}

<section class="page">
  <h2>3 · Competitor analysis</h2>
  <p class="lead">Every major player pairs a prediction with paid protection; none helps the user compare alternatives and choose.</p>
  <table><thead><tr><th style="width:15%">Player</th><th style="width:30%">When the train is waitlisted</th><th style="width:20%">Strength</th><th>Gap for the user</th></tr></thead><tbody>
  <tr><td><b>ixigo Trains</b></td><td>Waitlist prediction; Alternate Travel Plan pays 3X (flight/bus) or 2X (train) value if the ticket stays WL; Assured free cancellation</td><td>Strong prediction (ConfirmTkt) plus cross-mode inventory</td><td>Refund mostly a coupon, selected trains only; the user still has to find and book the alternative</td></tr>
  <tr><td><b>ConfirmTkt</b> (ixigo group)</td><td>Alternates: other-station quota on the same train, two-train splits, train + bus</td><td>Finds hidden confirmed seats</td><td>Many raw options with no ranking by the user’s priorities</td></tr>
  <tr><td><b>IRCTC VIKALP</b></td><td>Free opt-in; auto-shift to another train on the same route if seats are free</td><td>Free, official</td><td>No choice after opting in; outcome known only at chart time</td></tr>
  <tr><td><b>MakeMyTrip</b></td><td>Trip Guarantee 3X; same-train longer route and nearby-station suggestions</td><td>Smart route hacks in search</td><td>Trade-offs (arrival, station distance) not explained</td></tr>
  <tr><td><b>redRail</b> (redBus)</td><td>Confirmation probability; Alternate Trip add-on with 3X refund</td><td>Bus inventory built in</td><td>Protects money, not the journey</td></tr>
  <tr><td><b>Airlines</b></td><td>Last-minute flights</td><td>Certain seat</td><td>Price spikes; not linked to the train search</td></tr>
  <tr><td><b>Offline agents</b></td><td>Tatkal attempts, quota know-how, one clear answer</td><td>Trust and a single recommendation</td><td>Extra cost, no transparency</td></tr>
  </tbody></table>
  <p class="note">Sources: ixigo.com/trains/alternate-travel; YourStory (ConfirmTkt Alternates); LatestLY (IRCTC VIKALP); Travel Trends Today (MakeMyTrip); GrabOn (redRail Alternate Trip). Accessed October 2026.</p>
</section>

<section class="page">
  <h2>4a · UX flow today</h2>
  <p class="lead">Users bounce between searches, apps and people; red notes show the pain points measured in research.</p>
  <img class="flow" src="{img('today.png')}" alt="Current waitlist journey flow">
</section>

<section class="page">
  <h2>4b · UX flow with Best Way to Reach</h2>
  <p class="lead">One ranked list, honest odds and a ready backup replace the loop; trip outcomes feed back into the ranking.</p>
  <div class="flow">{new_flow_svg()}</div>
</section>

{ann_pages}

<section class="page">
  <h2>6 · OKRs and metric dashboard</h2>
  <p class="lead"><b>Objective:</b> turn a waitlisted search into a travel plan users trust, within 6 months.</p>
  <table><thead><tr><th style="width:8%">KR</th><th style="width:42%">Key result</th><th style="width:16%">Baseline</th><th style="width:14%">Target</th><th>Source</th></tr></thead><tbody>
  <tr><td>KR1</td><td><b>24-hour resolved booking rate</b> for users who hit WL (North Star)</td><td>26%</td><td>42%</td><td>Case brief</td></tr>
  <tr><td>KR2</td><td>Trust in the shown chance (in-app pulse, 1–5)</td><td>1.7</td><td>3.5</td><td>Survey Q13</td></tr>
  <tr><td>KR3</td><td>Searches before booking</td><td>3–5 for most</td><td>1–2</td><td>Survey Q8</td></tr>
  <tr><td>KR4</td><td>Post-booking regret (“wrong choice”), guardrail</td><td>New</td><td>≤ 8%, not above control</td><td>Regret question</td></tr>
  <tr><td>KR5</td><td>Cross-mode share of resolved bookings (bus + flight)</td><td>Today’s share</td><td>+10 pts</td><td>Booking data</td></tr>
  </tbody></table>
  <div class="grid2" style="margin-top:12pt">
    <div><h3>North Star target path (users who see the feature)</h3>{trajectory_svg()}</div>
    <div><h3>Dashboard tiles</h3><div class="tiles">
      <div class="tile"><div class="k">Resolved in 24h</div><div class="v">26% → 42%</div></div>
      <div class="tile"><div class="k">Trust in the %</div><div class="v">1.7 → 3.5</div></div>
      <div class="tile"><div class="k">Open rate of Best Way to Reach</div><div class="v">60%</div></div>
      <div class="tile"><div class="k">Bookings from top pick or backup</div><div class="v">50%</div></div>
      <div class="tile"><div class="k">Calibration gap (CNF / RAC / WL)</div><div class="v">≤ 5 pts</div></div>
      <div class="tile"><div class="k">90-day repeat booking</div><div class="v">85.6% → 88%</div></div>
    </div></div>
  </div>
  <p class="note">Rollout: pilot 5% of WL users on 20 routes (months 1–2), families (month 3), all WL users (months 4–6), then the PNR page. Path values are targets, not results.</p>
</section>

<section class="page">
  <h2>7 · Guardrails and event tracking</h2>
  <table><thead><tr><th style="width:30%">Guardrail</th><th style="width:40%">Why</th><th>Threshold</th></tr></thead><tbody>
  <tr><td>Post-booking regret</td><td>Catches bad recommendations</td><td>≤ 8%, not above control</td></tr>
  <tr><td>Prediction calibration (predicted vs actual CNF, RAC, WL)</td><td>Catches overstated confidence</td><td>Gap ≤ 5 pts per bucket</td></tr>
  <tr><td>Cancellation rate of recommended options</td><td>Users booked something that didn’t fit</td><td>Not above control</td></tr>
  <tr><td>Complaints mentioning “prediction wrong” or RAC</td><td>Trust</td><td>−30%</td></tr>
  <tr><td>Page load time</td><td>Experience on 4G and low-end phones</td><td>&lt; 2 s</td></tr>
  </tbody></table>
  <h3>Event tracking</h3>
  <table><thead><tr><th style="width:18%">Event</th><th style="width:32%">Trigger</th><th>Key properties</th></tr></thead><tbody>
  <tr><td>wl_seen</td><td>WL / no seats shown on search or booking</td><td>route, date, train, class, wl_no, pax, p_cnf, p_rac, p_wl</td></tr>
  <tr><td>bwr_opened</td><td>User opens Best Way to Reach</td><td>entry_point, options_count</td></tr>
  <tr><td>chip_selected</td><td>Priority chip tapped</td><td>chip, position_before, position_after</td></tr>
  <tr><td>cutoff_changed</td><td>Cut-off toggled or changed</td><td>on, value, options_hidden</td></tr>
  <tr><td>option_viewed</td><td>Card opened</td><td>mode, rank, price, arrive_time, certainty</td></tr>
  <tr><td>option_booked</td><td>Booking completed from the list</td><td>mode, rank, label (top_pick / backup / other), fare</td></tr>
  <tr><td>backup_selected</td><td>Backup kept for a WL ticket</td><td>backup_mode, trigger_time</td></tr>
  <tr><td>chart_outcome</td><td>Chart prepared</td><td>final_status (CNF / RAC / WL), predicted split</td></tr>
  <tr><td>regret_answered</td><td>Post-trip question answered</td><td>answer, mode, rank</td></tr>
  </tbody></table>
</section>

<section class="page">
  <h2>8 · Raw research notes: survey</h2>
  <p class="lead">Bilingual Google Form, 18 questions; 7 responses, 6 had hit a waitlist in the last 6 months. Directional only.</p>
  <div class="grid2">
    <table><thead><tr><th style="width:62%">Finding</th><th>Result (n = 6)</th></tr></thead><tbody>
    <tr><td>Searched 3+ times before deciding</td><td>6 of 6 (2 searched 10+)</td></tr>
    <tr><td>Hardest part: too many options or too many apps</td><td>4 of 6</td></tr>
    <tr><td>Trust in an app’s “% chance” (1–5)</td><td>Average 1.7; nobody above 3</td></tr>
    <tr><td>A 70%+ ticket ended differently</td><td>2 of the 4 who remember (1 RAC, 1 stayed WL)</td></tr>
    <tr><td>Tried Tatkal for this trip</td><td>5 of 6 (3 got confirmed)</td></tr>
    <tr><td>Final booking channel</td><td>IRCTC 3, ixigo 2, agent 1</td></tr>
    <tr><td>Final outcome</td><td>Confirmed train 4, flight 1, agent 1</td></tr>
    <tr><td>What a plan + backup must show (open text)</td><td>Confirmed seat; reserved seat; price and comfort; a good train for family comfort</td></tr>
    </tbody></table>
    <div><h3 style="margin-top:0">What matters most (average rank, 1 = top)</h3>{rank_bars()}<p class="note">Price ranked 6th of 7: time and certainty matter more.</p></div>
  </div>
</section>

<section class="page">
  <h2>9 · Raw research notes: interview themes and hypotheses</h2>
  <div class="grid2">
    <div><h3 style="margin-top:0">Themes from the interview synthesis</h3>
    <table><tbody>
    <tr><td><b>A</b></td><td>Confirmation probability is a major decision aid: personal cut-offs of 80%, 85–90% and 90%+.</td></tr>
    <tr><td><b>B</b></td><td>Familiarity and trust in IRCTC hold back booking on ixigo.</td></tr>
    <tr><td><b>C</b></td><td>Login and flow friction reduce repeat use for some.</td></tr>
    <tr><td><b>D</b></td><td>3X Refund needs clear discovery and plain terms.</td></tr>
    <tr><td><b>E</b></td><td>Users want a useful backup: flights, buses, other trains, Tatkal.</td></tr>
    <tr><td><b>F</b></td><td>Priorities are personal: comfort, punctuality, speed, safety, timing.</td></tr>
    <tr><td><b>G</b></td><td>Festival peaks and Tatkal add complexity.</td></tr>
    <tr><td><b>H</b></td><td>Data freshness and status confidence matter.</td></tr>
    </tbody></table></div>
    <div><h3 style="margin-top:0">Hypothesis check</h3>
    <table><thead><tr><th>#</th><th>Hypothesis</th><th>Verdict</th></tr></thead><tbody>
    <tr><td>H1</td><td>Can’t compare alternatives</td><td>Supported</td></tr>
    <tr><td>H2</td><td>Don’t trust a bare %</td><td>Refined: relied on, not trusted</td></tr>
    <tr><td>H3</td><td>Options scattered across tabs</td><td>Partly</td></tr>
    <tr><td>H4</td><td>Price is not the main blocker</td><td>Supported</td></tr>
    <tr><td>H5</td><td>Late panic near chart time</td><td>Partly</td></tr>
    <tr><td>H6</td><td>One clear answer wins elsewhere</td><td>New angle: IRCTC habit and trust</td></tr>
    <tr><td>H7</td><td>CNF vs RAC gap hurts trust</td><td>Supported</td></tr>
    </tbody></table>
    <p class="note">Primary barrier: low decision confidence. Users can’t compare options on their own priorities, and they lean on a percentage they don’t trust.</p></div>
  </div>
</section>
</body></html>'''

open(os.path.join(HERE, 'Supporting_Artifacts_Rohit_Kumar.html'), 'w').write(doc)
print('rows', len(rows), 'people', n_people)

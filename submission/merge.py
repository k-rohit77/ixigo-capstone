# Build one Word file with Steps 1-8: cover + Step 1 research + Steps 2-8 PRD + Trip Resolver screens.
from docx import Document
from docx.shared import Pt, Inches, RGBColor, Mm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docxcompose.composer import Composer

S = '/tmp/claude-0/-home-claude/0ff84c12-62d1-5134-9305-45a1fe6f1e04/scratchpad/steps/'
OUT = S + 'Capstone_Steps_1-8_Rohit_Kumar.docx'
NEW = 'https://prototype-rohit-ixigo.lovable.app'
ACC, INK, GREY = RGBColor(0x2C, 0x4B, 0xD6), RGBColor(0x15, 0x20, 0x2C), RGBColor(0x4A, 0x58, 0x68)


def texts(el):
    return el.findall('.//' + qn('w:t'))


def set_text(el, new):
    ts = texts(el)
    ts[0].text = new
    for t in ts[1:]:
        t.text = ''


def unwrap(h):  # turn a hyperlink back into plain runs
    parent, idx = h.getparent(), h.getparent().index(h)
    for r in list(h):
        rpr = r.find(qn('w:rPr'))
        if rpr is not None:
            for tag in ('w:rStyle', 'w:u', 'w:color'):
                e = rpr.find(qn(tag))
                if e is not None:
                    rpr.remove(e)
        parent.insert(idx, r)
        idx += 1
    parent.remove(h)


def add_link(p, url, text):
    rid = p.part.relate_to(url, RT.HYPERLINK, is_external=True)
    h = OxmlElement('w:hyperlink')
    h.set(qn('r:id'), rid)
    r = OxmlElement('w:r')
    rpr = OxmlElement('w:rPr')
    c = OxmlElement('w:color'); c.set(qn('w:val'), '2C4BD6'); rpr.append(c)
    u = OxmlElement('w:u'); u.set(qn('w:val'), 'single'); rpr.append(u)
    r.append(rpr)
    t = OxmlElement('w:t'); t.text = text; r.append(t)
    h.append(r)
    p._p.append(h)


def retitle(doc, new):
    p = doc.paragraphs[0]
    set_text(p._p, new)
    p.paragraph_format.page_break_before = True


# ---- Step 1 research
research = Document(S + 'research.docx')
retitle(research, 'Part 1 – Step 1: Market & User Research')

# ---- Steps 2-8 PRD, with links fixed for a file that is read offline
prd = Document(S + 'prd.docx')
retitle(prd, 'Part 2 – Steps 2–8: Problem, Solution & PRD')
rels = prd.part.rels
for p in prd.paragraphs:
    for h in p._p.findall(qn('w:hyperlink')):
        rid = h.get(qn('r:id'))
        if rid not in rels:
            continue
        url, label = rels[rid].target_ref, ''.join(t.text for t in texts(h))
        if 'N44ZFHRrTX9A8tSE4TPxAY' in url:  # Step 1 doc is now Part 1 of this file
            set_text(h, label.replace('doc', '').strip() + ' (Part 1 of this file)')
            unwrap(h)
        elif '7at45wbTiVVxD9d7GvPLar' in url or 'lovable.app' in url:  # point every prototype link to the live Lovable app
            rels[rid]._target = NEW
            if 'lovable.app' in label:
                set_text(h, 'prototype-rohit-ixigo.lovable.app')
        elif 'KPxNPimZcUWhTTiMVHkK7B' in url:
            r = OxmlElement('w:r'); t = OxmlElement('w:t')
            t.set(qn('xml:space'), 'preserve'); t.text = ' (screens in Part 3 of this file)'
            r.append(t); h.addnext(r)
        print('link:', label, '->', ''.join(t.text for t in p._p.findall('.//' + qn('w:t')))[:160])
for t in prd.element.body.iter(qn('w:t')):
    if t.text and 'best-way-to-reach.lovable.app' in t.text:
        t.text = t.text.replace('best-way-to-reach.lovable.app', 'prototype-rohit-ixigo.lovable.app')

# ---- cover (master keeps the exported docs' styles)
master = Document(S + 'research.docx')
body = master.element.body
for el in list(body):
    if el.tag != qn('w:sectPr'):
        body.remove(el)


def para(text='', size=11, bold=False, color=INK, after=6, before=0):
    p = master.add_paragraph()
    if text:
        r = p.add_run(text); r.font.size = Pt(size); r.bold = bold; r.font.color.rgb = color
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.space_before = Pt(before)
    return p


para('', after=70)
para('IXIGO TRAINS · PRODUCT CAPSTONE', 10, True, ACC, 12)
para('Steps 1–8: research, problem, solution, PRD and AI extension', 26, True, INK, 12)
para('Best Way to Reach: turning a waitlisted ticket into a travel plan people trust', 14, False, GREY, 6)
para('Rohit Kumar · Airtribe PM Launchpad · 6 November 2026', 12, False, GREY, 36)
para('What’s inside', 14, True, INK, 8)
parts = [
    ('Part 1 – Step 1: Market & user research', 'Goal and hypotheses, research plan, survey and interview script, survey results, competitive analysis, personas and the barriers the research validated.'),
    ('Part 2 – Steps 2–8: Problem, solution & PRD', 'Problem statement, funnel, primary barrier, business impact, RICE, shortlisted solutions, journey map, PRD, prototype, go-to-market, metrics, risks and the AI trip resolver.'),
    ('Part 3 – Step 8: Trip Resolver screens', 'Two runs of the working AI demo, with example messages.'),
]
for i, (h, d) in enumerate(parts, 1):
    para(f'{i}.  {h}', 12, True, INK, 2)
    p = para(d, 11, False, GREY, 10)
    p.paragraph_format.left_indent = Inches(0.3)
para('Links', 14, True, INK, 8, before=14)
p = para('Live prototype: ', 11, True, INK, 4)
add_link(p, NEW, NEW)
p = para('Also in the submission: ', 11, True, INK, 4)
r = p.add_run('final deck (PDF), video walkthrough and Supporting Artifacts (PDF).'); r.font.size = Pt(11)

# ---- compose
comp = Composer(master)
comp.append(research)
comp.append(prd)
d = comp.doc

# ---- Part 3: Trip Resolver screens
h = d.add_paragraph('Part 3 – Step 8: Trip Resolver screens', style='Heading 1')
h.paragraph_format.page_break_before = True
d.add_paragraph('The Trip Resolver is the conversational front door to Best Way to Reach. The traveller describes the trip in their own words; '
                'the tool shows what it understood, the priority weights it applied, and a ranked plan with a top pick, a confirmed backup and honest odds. '
                'Sample trains and fares; the live AI run is shown in the video walkthrough.')
shots = [
    ('tr-1.png', 'Run 1 · “We are 3 people, my mother is 65 and can’t sit up all night. Need to reach Lucknow by Sunday morning for a wedding. Budget around ₹5,000 total.” '
                 'Result: AC sleeper bus with confirmed seats as the top pick, Lucknow Mail 2A as backup; the user’s WL 42 train shows own berth 35% · RAC 25% · stays WL 40%; '
                 'options breaking the limits (sitting overnight, over budget, arriving late) are listed as left out.'),
    ('tr-2.png', 'Run 2 (Hinglish) · “Student hoon, sabse sasta option chahiye. Bus bhi chalega, bas Sunday tak pahunch jaun.” '
                 'Result: weights shift to low price, the cheapest confirmed option leads, and the reply mixes Hindi. This run used the built-in keyword parser, the fallback when AI is unavailable.'),
]
for i, (f, cap) in enumerate(shots):
    if i:
        brk = d.add_paragraph(); brk.paragraph_format.page_break_before = True
    d.add_picture(S + f, width=Inches(5.3))
    d.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    c = d.add_paragraph()
    r = c.add_run(cap); r.font.size = Pt(9.5); r.font.color.rgb = GREY
p = d.add_paragraph()
r = p.add_run('Other messages to try: '); r.bold = True
p.add_run('“Solo trip for a job interview at 11 AM Sunday in Lucknow. I must not be late. Price doesn’t matter much.” · '
          '“Family of 3 with a small kid, we want to sit together and avoid buses. Fine with paying a bit more.”')

# ---- A4 pages and a page-number footer
for s in d.sections:
    s.page_width, s.page_height = Mm(210), Mm(297)
    s.left_margin = s.right_margin = Mm(20)
    s.top_margin = s.bottom_margin = Mm(20)
    fp = s.footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    rr = fp.add_run('ixigo Capstone · Steps 1–8 · Rohit Kumar · page '); rr.font.size = Pt(8.5); rr.font.color.rgb = GREY
    fld = OxmlElement('w:fldSimple'); fld.set(qn('w:instr'), 'PAGE')
    r = OxmlElement('w:r'); rpr = OxmlElement('w:rPr'); sz = OxmlElement('w:sz'); sz.set(qn('w:val'), '17'); rpr.append(sz); r.append(rpr)
    t = OxmlElement('w:t'); t.text = '1'; r.append(t); fld.append(r); fp._p.append(fld)

comp.save(OUT)
print('saved', OUT)

// Builds Supporting_Artifacts_Rohit_Kumar.docx (editable Word version of the supporting-artifacts PDF).
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, PageOrientation, ImageRun, HeadingLevel, BorderStyle, ExternalHyperlink,
  LevelFormat, Footer, PageNumber, VerticalAlign,
} = require('docx');

const DIR = __dirname;
const D = JSON.parse(fs.readFileSync(path.join(DIR, 'docx_data.json'), 'utf8'));
const FONT = 'Arial';
const INK = '15202C', MUTED = '4A5868', ACCENT = '2C4BD6', LINE = 'D6DDE4', ZEBRA = 'F6F8FA';
const PAGE_W = 15398;            // usable width in twips (A4 landscape, 0.5" margins)
const PX_W = 1000;               // usable width in px for images (approx.)

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 20, bold: o.bold, italics: o.italics, color: o.color || INK });
const para = (children, o = {}) => new Paragraph({ children: Array.isArray(children) ? children : [children], spacing: { before: o.before || 0, after: o.after ?? 120 }, alignment: o.align, keepNext: o.keepNext });
const text = (t, o = {}) => para(run(t, o), o);
const h1 = (t, first) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: !first, children: [new TextRun({ text: t, font: FONT })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: FONT })] });
const lead = (t) => text(t, { color: MUTED, size: 21, after: 160 });

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function table(header, rows, widths, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const fs_ = o.size || 18;
  const mk = (cells, isHead, idx) => new TableRow({
    tableHeader: isHead,
    cantSplit: true,
    children: cells.map((c, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      borders,
      shading: isHead ? { type: ShadingType.CLEAR, fill: INK, color: 'auto' } : (idx % 2 === 1 ? { type: ShadingType.CLEAR, fill: ZEBRA, color: 'auto' } : undefined),
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: String(c ?? ''), font: FONT, size: fs_, bold: isHead || (o.boldCol === i), color: isHead ? 'FFFFFF' : INK })] })],
    })),
  });
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [mk(header, true, -1), ...rows.map((r, i) => mk(r, false, i))],
  });
}

function image(file, wPx, hPx) {
  const ext = path.extname(file).slice(1).toLowerCase().replace('jpeg', 'jpg');
  return new ImageRun({ type: ext, data: fs.readFileSync(path.isAbsolute(file) ? file : path.join(DIR, file)), transformation: { width: Math.round(wPx), height: Math.round(hPx) }, altText: { title: path.basename(file), description: path.basename(file), name: path.basename(file) } });
}
function fitImage(file, size, maxW, maxH) {
  const [w, h] = size; const s = Math.min(maxW / w, maxH / h);
  return image(file, w * s, h * s);
}

function imageRow(items, maxH) {
  const n = items.length; const cw = Math.floor(PAGE_W / n);
  const cellPx = Math.floor(PX_W / n) - 16;
  return new Table({
    width: { size: cw * n, type: WidthType.DXA },
    columnWidths: Array(n).fill(cw),
    rows: [new TableRow({ children: items.map(it => new TableCell({
      width: { size: cw, type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.TOP,
      margins: { top: 0, bottom: 0, left: 80, right: 80 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [fitImage(it.path, it.size, cellPx, maxH)] }),
        new Paragraph({ spacing: { after: 0 }, children: [run(it.caption, { size: 17, color: MUTED })] }),
      ],
    })) })],
  });
}

const children = [];

// ---------- Cover ----------
children.push(text('IXIGO TRAINS · PRODUCT CAPSTONE', { size: 18, bold: true, color: ACCENT, after: 200 }));
children.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: 'Supporting Artifacts', font: FONT })] }));
children.push(text('Best Way to Reach: turning a waitlisted ticket into a travel plan people trust', { size: 24, color: MUTED, after: 60 }));
children.push(text('Rohit Kumar · Airtribe Product Management Launchpad · 6 November 2026', { size: 24, color: MUTED, after: 300 }));
children.push(new Table({
  width: { size: PAGE_W, type: WidthType.DXA }, columnWidths: [4800, PAGE_W - 4800],
  rows: [
    new TableRow({ tableHeader: true, children: ['Deliverable', 'Link'].map((t, i) => new TableCell({ width: { size: i ? PAGE_W - 4800 : 4800, type: WidthType.DXA }, borders, shading: { type: ShadingType.CLEAR, fill: INK, color: 'auto' }, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: t, font: FONT, size: 19, bold: true, color: 'FFFFFF' })] })] })) }),
    ...D.links.map(([k, v], idx) => new TableRow({ children: [
      new TableCell({ width: { size: 4800, type: WidthType.DXA }, borders, shading: idx % 2 ? { type: ShadingType.CLEAR, fill: ZEBRA, color: 'auto' } : undefined, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [run(k, { size: 19, bold: true })] })] }),
      new TableCell({ width: { size: PAGE_W - 4800, type: WidthType.DXA }, borders, shading: idx % 2 ? { type: ShadingType.CLEAR, fill: ZEBRA, color: 'auto' } : undefined, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [v.startsWith('http') ? new ExternalHyperlink({ link: v, children: [new TextRun({ text: v, style: 'Hyperlink', font: FONT, size: 19 })] }) : run(v, { size: 19 })] })] }),
    ] })),
  ],
}));
children.push(text('', { after: 120 }));
children.push(text('Contents', { bold: true, size: 24, after: 80 }));
['1. Interview log', '2. Screenshots from user conversations (calls and WhatsApp)', '3. Competitor analysis', '4. UX flow: today vs new', '5. Prototype annotated screens', '6. OKRs and metric dashboard', '7. Guardrails and event tracking', '8. Raw research notes: survey', '9. Raw research notes: interview themes and hypotheses']
  .forEach(t => children.push(text(t, { size: 20, after: 40, color: '2F3C4A' })));

// ---------- 1 Interview log ----------
const nInterviews = D.interviews.length + D.extra.length;
const rows = [...D.interviews, ...D.extra, ...D.survey];
children.push(h1('1 · Interview log'));
children.push(lead(`${nInterviews} interview records (20 recorded calls and 1 WhatsApp interview, about ${20 + D.extra.length} unique people) plus 7 survey respondents: ${rows.length} records, about ${20 + D.extra.length + 7} users. Insights are paraphrased; several call transcripts were noisy, so each record carries an evidence label. Record 12 may be the same person as record 07. Survey respondents are anonymised (S01–S07).`));
children.push(table(['#', 'Name', 'Type', 'Channel', 'Route / context', 'Key insight', 'Evidence'], rows, [600, 1900, 2300, 1100, 2700, 5598, 1200], { size: 17, boldCol: 1 }));

// ---------- 2 Screenshots ----------
const calls = D.shots.filter(s => s.group === 'calls');
const chats = D.shots.filter(s => s.group === 'whatsapp');
children.push(h1('2a · Call recordings'));
children.push(lead('All 20 calls were recorded with the iPhone call recorder and kept in one Notes folder; each has an audio file, a transcript and a summary.'));
children.push(imageRow(calls, 520));
children.push(h1('2b · WhatsApp interview'));
children.push(lead('One interview ran as a WhatsApp chat in English, using the same questions as the calls.'));
children.push(imageRow(chats, 520));

// ---------- 3 Competitor analysis ----------
children.push(h1('3 · Competitor analysis'));
children.push(lead('Every major player pairs a prediction with paid protection; none helps the user compare alternatives and choose.'));
children.push(table(['Player', 'When the train is waitlisted', 'Strength', 'Gap for the user'], [
  ['ixigo Trains', 'Waitlist prediction; Alternate Travel Plan pays 3X (flight/bus) or 2X (train) value if the ticket stays WL; Assured free cancellation', 'Strong prediction (ConfirmTkt) plus cross-mode inventory', 'Refund mostly a coupon, selected trains only; the user still has to find and book the alternative'],
  ['ConfirmTkt (ixigo group)', 'Alternates: other-station quota on the same train, two-train splits, train + bus', 'Finds hidden confirmed seats', 'Many raw options with no ranking by the user’s priorities'],
  ['IRCTC VIKALP', 'Free opt-in; auto-shift to another train on the same route if seats are free', 'Free, official', 'No choice after opting in; outcome known only at chart time'],
  ['MakeMyTrip', 'Trip Guarantee 3X; same-train longer route and nearby-station suggestions', 'Smart route hacks in search', 'Trade-offs (arrival, station distance) not explained'],
  ['redRail (redBus)', 'Confirmation probability; Alternate Trip add-on with 3X refund', 'Bus inventory built in', 'Protects money, not the journey'],
  ['Airlines', 'Last-minute flights', 'Certain seat', 'Price spikes; not linked to the train search'],
  ['Offline agents', 'Tatkal attempts, quota know-how, one clear answer', 'Trust and a single recommendation', 'Extra cost, no transparency'],
], [2300, 4600, 3300, 5198], { size: 18, boldCol: 0 }));
children.push(text('Sources: ixigo.com/trains/alternate-travel; YourStory (ConfirmTkt Alternates); LatestLY (IRCTC VIKALP); Travel Trends Today (MakeMyTrip); GrabOn (redRail Alternate Trip). Accessed October 2026.', { size: 16, color: MUTED, before: 120 }));

// ---------- 4 UX flows ----------
children.push(h1('4a · UX flow today'));
children.push(lead('Users bounce between searches, apps and people; red notes show the pain points measured in research.'));
children.push(para(fitImage('today.png', D.imgs['today.png'], PX_W, 560), { align: AlignmentType.CENTER }));
children.push(h1('4b · UX flow with Best Way to Reach'));
children.push(lead('One ranked list, honest odds and a ready backup replace the loop; trip outcomes feed back into the ranking.'));
children.push(para(fitImage('newflow.png', D.imgs['newflow.png'], PX_W, 560), { align: AlignmentType.CENTER }));

// ---------- 5 Annotated screens ----------
D.ann.forEach((a, i) => {
  children.push(h1(i === 0 ? '5 · Prototype annotated screens' : `5 · ${a.title}`));
  if (i === 0) {
    children.push(new Paragraph({ spacing: { after: 80 }, children: [run('Live prototype: ', { bold: true }), new ExternalHyperlink({ link: 'https://prototype-rohit-ixigo.lovable.app', children: [new TextRun({ text: 'https://prototype-rohit-ixigo.lovable.app', style: 'Hyperlink', font: FONT, size: 20 })] })] }));
    children.push(h2(a.title));
  }
  children.push(lead(a.desc));
  children.push(para(fitImage(a.file, a.size, PX_W, i === 0 ? 470 : 520), { align: AlignmentType.CENTER }));
});

// ---------- 6 OKRs ----------
children.push(h1('6 · OKRs and metric dashboard'));
children.push(new Paragraph({ spacing: { after: 140 }, children: [run('Objective: ', { bold: true }), run('turn a waitlisted search into a travel plan users trust, within 6 months.')] }));
children.push(table(['KR', 'Key result', 'Baseline', 'Target', 'Source'], [
  ['KR1', '24-hour resolved booking rate for users who hit WL (North Star)', '26%', '42%', 'Case brief'],
  ['KR2', 'Trust in the shown chance (in-app pulse, 1–5)', '1.7', '3.5', 'Survey Q13'],
  ['KR3', 'Searches before booking', '3–5 for most', '1–2', 'Survey Q8'],
  ['KR4', 'Post-booking regret (“wrong choice”), guardrail', 'New', '≤ 8%, not above control', 'Regret question'],
  ['KR5', 'Cross-mode share of resolved bookings (bus + flight)', 'Today’s share', '+10 pts', 'Booking data'],
], [1000, 6600, 2400, 2600, 2798], { size: 18 }));
children.push(text('', { after: 60 }));
const half = Math.floor(PAGE_W / 2);
children.push(new Table({
  width: { size: half * 2, type: WidthType.DXA }, columnWidths: [half, half],
  rows: [new TableRow({ children: [
    new TableCell({ width: { size: half, type: WidthType.DXA }, borders: noBorders, children: [
      text('North Star target path (users who see the feature)', { bold: true, size: 20, after: 60 }),
      para(fitImage('trajectory.png', D.imgs['trajectory.png'], 480, 230), { after: 0 }),
    ] }),
    new TableCell({ width: { size: half, type: WidthType.DXA }, borders: noBorders, children: [
      text('Dashboard tiles', { bold: true, size: 20, after: 60 }),
      table(['Metric', 'Baseline → target'], [
        ['Resolved in 24 h', '26% → 42%'], ['Trust in the %', '1.7 → 3.5'], ['Open rate of Best Way to Reach', '60%'],
        ['Bookings from top pick or backup', '50%'], ['Calibration gap (CNF / RAC / WL)', '≤ 5 pts'], ['90-day repeat booking', '85.6% → 88%'],
      ], [half - 2700, 2600], { size: 18 }),
    ] }),
  ] })],
}));
children.push(text('Rollout: pilot 5% of WL users on 20 routes (months 1–2), families (month 3), all WL users (months 4–6), then the PNR page. Path values are targets, not results.', { size: 16, color: MUTED, before: 120 }));

// ---------- 7 Guardrails + events ----------
children.push(h1('7 · Guardrails and event tracking'));
children.push(table(['Guardrail', 'Why', 'Threshold'], [
  ['Post-booking regret', 'Catches bad recommendations', '≤ 8%, not above control'],
  ['Prediction calibration (predicted vs actual CNF, RAC, WL)', 'Catches overstated confidence', 'Gap ≤ 5 pts per bucket'],
  ['Cancellation rate of recommended options', 'Users booked something that didn’t fit', 'Not above control'],
  ['Complaints mentioning “prediction wrong” or RAC', 'Trust', '−30%'],
  ['Page load time', 'Experience on 4G and low-end phones', '< 2 s'],
], [5600, 5600, 4198], { size: 18 }));
children.push(h2('Event tracking'));
children.push(table(['Event', 'Trigger', 'Key properties'], [
  ['wl_seen', 'WL / no seats shown on search or booking', 'route, date, train, class, wl_no, pax, p_cnf, p_rac, p_wl'],
  ['bwr_opened', 'User opens Best Way to Reach', 'entry_point, options_count'],
  ['chip_selected', 'Priority chip tapped', 'chip, position_before, position_after'],
  ['cutoff_changed', 'Cut-off toggled or changed', 'on, value, options_hidden'],
  ['option_viewed', 'Card opened', 'mode, rank, price, arrive_time, certainty'],
  ['option_booked', 'Booking completed from the list', 'mode, rank, label (top_pick / backup / other), fare'],
  ['backup_selected', 'Backup kept for a WL ticket', 'backup_mode, trigger_time'],
  ['chart_outcome', 'Chart prepared', 'final_status (CNF / RAC / WL), predicted split'],
  ['regret_answered', 'Post-trip question answered', 'answer, mode, rank'],
], [2800, 5600, 6998], { size: 18 }));

// ---------- 8 Survey ----------
children.push(h1('8 · Raw research notes: survey'));
children.push(lead('Bilingual Google Form, 18 questions; 7 responses, 6 had hit a waitlist in the last 6 months. Directional only.'));
children.push(table(['Finding', 'Result (n = 6)'], [
  ['Searched 3+ times before deciding', '6 of 6 (2 searched 10+)'],
  ['Hardest part: too many options or too many apps', '4 of 6'],
  ['Trust in an app’s “% chance” (1–5)', 'Average 1.7; nobody above 3'],
  ['A 70%+ ticket ended differently', '2 of the 4 who remember (1 RAC, 1 stayed WL)'],
  ['Tried Tatkal for this trip', '5 of 6 (3 got confirmed)'],
  ['Final booking channel', 'IRCTC 3, ixigo 2, agent 1'],
  ['Final outcome', 'Confirmed train 4, flight 1, agent 1'],
  ['What a plan + backup must show (open text)', 'Confirmed seat; reserved seat; price and comfort; a good train for family comfort'],
], [7698, 7700], { size: 18 }));
children.push(text('What matters most (average rank, 1 = top)', { bold: true, size: 20, before: 200, after: 60 }));
children.push(para(fitImage('rankbars.png', D.imgs['rankbars.png'], 640, 220)));
children.push(text('Price ranked 6th of 7: journey time, confirmation chance and arrival time matter more.', { size: 16, color: MUTED }));

// ---------- 9 Themes + hypotheses ----------
children.push(h1('9 · Raw research notes: interview themes and hypotheses'));
children.push(h2('Themes from the interview synthesis'));
children.push(table(['', 'Theme'], [
  ['A', 'Confirmation probability is a major decision aid: personal cut-offs of 80%, 85–90% and 90%+.'],
  ['B', 'Familiarity and trust in IRCTC hold back booking on ixigo.'],
  ['C', 'Login and flow friction reduce repeat use for some.'],
  ['D', '3X Refund needs clear discovery and plain terms.'],
  ['E', 'Users want a useful backup: flights, buses, other trains, Tatkal.'],
  ['F', 'Priorities are personal: comfort, punctuality, speed, safety, timing.'],
  ['G', 'Festival peaks and Tatkal add complexity.'],
  ['H', 'Data freshness and status confidence matter.'],
], [800, 14598], { size: 18, boldCol: 0 }));
children.push(h2('Hypothesis check'));
children.push(table(['#', 'Hypothesis', 'Verdict'], [
  ['H1', 'Can’t compare alternatives', 'Supported'],
  ['H2', 'Don’t trust a bare %', 'Refined: relied on, not trusted'],
  ['H3', 'Options scattered across tabs', 'Partly'],
  ['H4', 'Price is not the main blocker', 'Supported'],
  ['H5', 'Late panic near chart time', 'Partly'],
  ['H6', 'One clear answer wins elsewhere', 'New angle: IRCTC habit and trust'],
  ['H7', 'CNF vs RAC gap hurts trust', 'Supported'],
], [800, 8000, 6598], { size: 18 }));
children.push(text('Primary barrier: low decision confidence. Users can’t compare options on their own priorities, and they lean on a percentage they don’t trust.', { size: 18, color: MUTED, before: 120 }));

const doc = new Document({
  creator: 'Rohit Kumar',
  title: 'Supporting Artifacts – Rohit Kumar',
  styles: {
    default: { document: { run: { font: FONT, size: 20 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 56, bold: true, color: INK }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 34, bold: true, color: INK }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, color: INK }, paragraph: { spacing: { before: 200, after: 80 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Supporting Artifacts · Rohit Kumar · page ', font: FONT, size: 16, color: '8A97A6' }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '8A97A6' })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync(path.join(DIR, 'Supporting_Artifacts_Rohit_Kumar.docx'), buf); console.log('ok', buf.length); });

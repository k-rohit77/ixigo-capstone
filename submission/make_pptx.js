// Editable PowerPoint version of the ixigo capstone deck (19 slides, speaker notes included).
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/0b8e0ac6-669f-4a69-a11f-c071b453fe5a_067cd89d-07c6-42db-b200-6063466bb4ac/pptx/scripts/apply_theme.js');

const S = '/tmp/claude-0/-home-claude/0ff84c12-62d1-5134-9305-45a1fe6f1e04/scratchpad/';
const OUT = path.join(S, 'pptx', 'Rohit_Kumar_Product_Capstone.pptx');

const THEME = {
  name: 'Best Way to Reach',
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  colors: {
    dk1: '15202C', lt1: 'FFFFFF', dk2: '4A5868', lt2: 'F3F5F8',
    accent1: '2C4BD6', accent2: '1D8A57', accent3: 'C4860F', accent4: 'C43F37', accent5: 'F0B94A', accent6: '8FA3FF',
    hlink: '2C4BD6', folHlink: '6A7684',
  },
};
// Extra tints (hex, not part of the theme)
const CARD = 'FBFCFD', LINE = 'D6DDE4', SOFT = 'E3E8FC', GREY = 'C3CCD6', QUIET = '6A7684', ZEBRA = 'E9EDF2', ONDARK = 'B9C6D4', ONDARK2 = 'D5DEE8';

const notesOf = (id) => {
  const h = fs.readFileSync(path.join(S, 'deck/project/slides', id + '.html'), 'utf8');
  const m = h.match(/<aside>([\s\S]*?)<\/aside>/);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pres.author = 'Rohit Kumar';
pres.title = 'ixigo Capstone – Best Way to Reach';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

const X0 = 0.89, W0 = 11.55; // left margin and content width (in)

pres.defineSlideMaster({
  title: 'CONTENT_LIGHT',
  background: { color: 'F3F5F8' },
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: X0, y: 0.55, w: W0, h: 1.2, fontSize: 32, bold: true, color: C.text1, align: 'left', valign: 'top', margin: 0 }, text: '' } }],
  slideNumber: { x: 12.35, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.text2, align: 'right' },
});
pres.defineSlideMaster({
  title: 'DARK',
  background: { color: '15202C' },
  objects: [],
  slideNumber: { x: 12.35, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: ONDARK, align: 'right' },
});
pres.defineSlideMaster({
  title: 'ACCENT',
  background: { color: '2C4BD6' },
  objects: [],
});

// ---------- helpers ----------
const T = (slide, text, o) => slide.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: 'top', color: C.text1, fontSize: 14 }, o));
const card = (slide, x, y, w, h, o = {}) => slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: o.fill || CARD }, line: { color: o.line || LINE, width: o.lw || 0.75 }, objectName: o.name });
const meter = (slide, x, y, w, h, parts) => { // outcome-meter motif: own berth / RAC / stays WL
  let cx = x; const cols = [C.accent2, C.accent3, C.accent4];
  parts.forEach((p, i) => { const pw = w * p / 100; if (pw > 0) slide.addShape(pres.shapes.RECTANGLE, { x: cx, y, w: pw, h, fill: { color: cols[i] }, line: { type: 'none' } }); cx += pw; });
};
const footer = (slide, text) => T(slide, text, { x: X0, y: 6.85, w: 11.0, h: 0.35, fontSize: 10, color: QUIET });
const hdr = (t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: '15202C' } } });
const tableOpts = (x, y, w, colW, fs = 12) => ({ x, y, w, colW, fontSize: fs, fontFace: 'Arial', color: '15202C', border: { type: 'solid', pt: 0.5, color: LINE }, valign: 'middle', margin: [0.05, 0.08, 0.05, 0.08], autoPage: false });
const zebra = (rows) => rows.map((r, i) => r.map(c => (typeof c === 'object' ? c : { text: String(c), options: i % 2 === 1 ? { fill: { color: ZEBRA } } : {} })));

// ===== 1 Cover =====
pres.addSection({ title: 'Why' });
let s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Why' });
T(s, 'IXIGO TRAINS · PRODUCT CAPSTONE', { x: X0, y: 0.85, w: 8, h: 0.4, fontSize: 12, bold: true, color: '8FA3FF', charSpacing: 2 });
T(s, 'Best Way to Reach', { x: X0, y: 2.35, w: 10, h: 1.2, fontSize: 60, bold: true, color: 'FFFFFF' });
T(s, 'Turning a waitlisted ticket into a travel plan people trust', { x: X0, y: 3.55, w: 9.5, h: 0.6, fontSize: 22, color: ONDARK });
meter(s, X0, 4.55, 5.2, 0.16, [35, 25, 40]);
T(s, 'Own berth 35% · RAC 25% · Stays WL 40%', { x: X0, y: 4.8, w: 6, h: 0.35, fontSize: 12, color: ONDARK });
T(s, 'Rohit Kumar', { x: X0, y: 6.3, w: 3, h: 0.4, fontSize: 16, bold: true, color: 'FFFFFF' });
T(s, 'Airtribe PM Launchpad · November 2026', { x: 3.4, y: 6.34, w: 6, h: 0.4, fontSize: 12, color: ONDARK });
s.addNotes(notesOf('cover'));

// ===== 2 Goal =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'Why' });
s.addText('Only 1 in 4 waitlisted users leaves with a plan', { placeholder: 'title' });
T(s, '26%', { x: X0, y: 2.0, w: 4.2, h: 1.7, fontSize: 115, bold: true, color: C.accent4 });
T(s, 'resolve a booking within 24 hours today', { x: X0, y: 3.75, w: 4.2, h: 0.4, fontSize: 16, color: C.text2 });
T(s, '→', { x: 5.3, y: 2.35, w: 1.0, h: 1.0, fontSize: 54, color: QUIET, align: 'center' });
T(s, '42%', { x: 6.55, y: 2.0, w: 4.2, h: 1.7, fontSize: 115, bold: true, color: C.accent1 });
T(s, 'target in 6 months', { x: 6.55, y: 3.75, w: 4.2, h: 0.4, fontSize: 16, color: C.text2 });
T(s, [{ text: 'Resolved booking ', options: { bold: true } }, { text: '= a confirmed train, bus or flight for the trip, or a waitlisted ticket with a backup or protection the user chose knowingly.', options: { color: C.text2 } }], { x: X0, y: 5.4, w: 10.5, h: 0.9, fontSize: 16 });
s.addNotes(notesOf('goal'));

// ===== 3 Context =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'Why' });
s.addText('Trains are ixigo’s core, so this moment matters', { placeholder: 'title' });
[['84.8M', 'monthly active users, Q4 FY26'], ['104M', 'train passenger segments booked, FY26'], ['₹511 cr', 'train revenue, about 42% of the total'], ['85.6%', 'repeat transaction rate']].forEach(([v, l], i) => {
  const x = X0 + i * (2.7 + 0.25); card(s, x, 1.85, 2.7, 1.9);
  T(s, v, { x: x + 0.25, y: 2.1, w: 2.3, h: 0.7, fontSize: 34, bold: true });
  T(s, l, { x: x + 0.25, y: 2.85, w: 2.25, h: 0.75, fontSize: 13, color: C.text2 });
});
T(s, 'ixigo, ConfirmTkt and AbhiBus already hold trains, predictions and buses. The gap is not inventory: it is helping users choose between options with confidence.', { x: X0, y: 4.25, w: 10.4, h: 0.9, fontSize: 16, color: C.text2 });
footer(s, 'Source: ixigo FY26 figures from the capstone brief');
s.addNotes(notesOf('context'));

// ===== 4 Research =====
pres.addSection({ title: 'What we learned' });
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we learned' });
s.addText('How I researched it', { placeholder: 'title' });
[['20', 'User interviews', '20 recorded calls + 1 WhatsApp chat, English and Hindi'], ['7', 'Survey responses', 'Bilingual 18-question Google Form; 6 had a recent waitlist'], ['5', 'Competitors', 'ixigo, ConfirmTkt, IRCTC VIKALP, MakeMyTrip, redRail'], ['7', 'Hypotheses', 'From “can’t compare” to “a 90% chance ends in RAC”']].forEach(([v, h, l], i) => {
  const x = X0 + i * (2.7 + 0.25); card(s, x, 1.45, 2.7, 2.75);
  T(s, v, { x: x + 0.25, y: 1.7, w: 2.2, h: 0.85, fontSize: 46, bold: true, color: C.accent1 });
  T(s, h, { x: x + 0.25, y: 2.6, w: 2.2, h: 0.4, fontSize: 16, bold: true });
  T(s, l, { x: x + 0.25, y: 3.05, w: 2.25, h: 1.0, fontSize: 13, color: C.text2 });
});
T(s, 'Mix: 10 active ixigo users, 3 who check ixigo but book on IRCTC, 2 who use it less now, 4 IRCTC or MakeMyTrip users, 2 unclear.', { x: X0, y: 4.65, w: 10.6, h: 0.8, fontSize: 16, color: C.text2 });
s.addNotes(notesOf('research'));

// ===== 5 Voices =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we learned' });
s.addText('What 20 travellers told me', { placeholder: 'title' });
[['8 of 20', C.accent1, 'have a personal cut-off', 'They book a waitlisted ticket only above 80–95% chance. The number is their decision rule.'],
 ['3 of 20', C.accent3, 'were let down by high odds', 'Often got RAC, or a high-chance ticket did not confirm. Same as my own 90% that ended in RAC.'],
 ['6 of 20', C.accent2, 'named a different top priority', 'Comfort, punctuality, speed, safety, timing. One sort order cannot serve them all.']].forEach(([v, col, h, l], i) => {
  const x = X0 + i * (3.7 + 0.225); card(s, x, 1.45, 3.7, 2.6);
  T(s, v, { x: x + 0.28, y: 1.65, w: 3.2, h: 0.75, fontSize: 36, bold: true, color: col });
  T(s, h, { x: x + 0.28, y: 2.42, w: 3.2, h: 0.4, fontSize: 16, bold: true });
  T(s, l, { x: x + 0.28, y: 2.85, w: 3.15, h: 1.1, fontSize: 13, color: C.text2 });
});
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X0, y: 4.35, w: W0, h: 1.05, rectRadius: 0.1, fill: { color: '15202C' }, line: { type: 'none' } });
T(s, [{ text: 'Also heard: ', options: { bold: true, color: 'F0B94A' } }, { text: '8 named a fallback (flight, bus, Tatkal); 7 book mainly on IRCTC or MakeMyTrip; 2 found login or the flow harder than IRCTC; 3X Refund terms were unclear to several.', options: { color: 'E3E8F0' } }], { x: X0 + 0.3, y: 4.55, w: W0 - 0.6, h: 0.75, fontSize: 14 });
footer(s, '21 records: 20 calls + 1 WhatsApp chat; two may be the same person. Counts are qualitative signals, not market share.');
s.addNotes(notesOf('voices'));

// ===== 6 Survey =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we learned' });
s.addText('Survey: lots of searching, little trust', { placeholder: 'title' });
[['6 of 6', C.accent1, 'searched 3+ times before deciding; 2 searched 10+'], ['1.7 / 5', C.accent4, 'average trust in an app’s “% chance”'], ['4 of 6', C.accent1, 'said the hardest part was too many options or too many apps'], ['2 of 4', C.accent3, 'who recall a 70%+ ticket saw it end as RAC or stay WL']].forEach(([v, col, l], i) => {
  const x = X0 + (i % 2) * (2.6 + 0.2), y = 1.45 + Math.floor(i / 2) * (2.0 + 0.2);
  card(s, x, y, 2.6, 2.0);
  T(s, v, { x: x + 0.22, y: y + 0.2, w: 2.2, h: 0.7, fontSize: 30, bold: true, color: col });
  T(s, l, { x: x + 0.22, y: y + 0.95, w: 2.2, h: 0.95, fontSize: 12, color: C.text2 });
});
s.addChart(pres.charts.BAR, [{ name: 'Average rank', labels: ['Journey time', 'Confirmation chance', 'Arrival time', 'Class / comfort', 'Station nearby', 'Price', 'Free cancellation'], values: [2.3, 3.0, 3.3, 4.2, 4.7, 4.8, 5.7] }], {
  x: 6.5, y: 1.45, w: 5.95, h: 4.6, barDir: 'bar', catAxisOrientation: 'maxMin', chartColors: ['2C4BD6', '2C4BD6', '2C4BD6', 'AEB9C6', 'AEB9C6', 'AEB9C6', 'AEB9C6'],
  showTitle: true, title: 'What matters most: average rank (lower = more important)', titleFontSize: 12, titleColor: '15202C', titleFontFace: '+mn-lt',
  showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 11, dataLabelColor: '15202C', dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0.0',
  catAxisLabelFontSize: 11, catAxisLabelColor: '4A5868', catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 7,
  valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false, barGapWidthPct: 60,
});
footer(s, 'Bilingual Google Form · 7 responses, 6 hit a WL in the last 6 months · small sample, directional only');
s.addNotes(notesOf('survey'));

// ===== 7 Competitors =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we learned' });
s.addText('Everyone sells protection; nobody helps you choose', { placeholder: 'title' });
s.addTable([
  [hdr('Player'), hdr('When the train is waitlisted'), hdr('Gap for the user')],
  ...zebra([
    ['ixigo Trains', 'Prediction; Alternate Travel Plan (3X / 2X value)', 'Refund mostly a coupon; user still finds the alternative'],
    ['ConfirmTkt', 'Alternates: other quotas, split and train + bus', 'Many raw options, no ranking'],
    ['IRCTC VIKALP', 'Free auto-shift to another train', 'No choice, outcome known only at chart'],
    ['MakeMyTrip', 'Trip Guarantee 3X; route and station hacks', 'Trade-offs not explained'],
    ['redRail', 'Probability; Alternate Trip add-on', 'Protects money, not the journey'],
    ['Agents', 'Tatkal, quota know-how, one answer', 'Extra cost, no transparency'],
  ]),
], Object.assign(tableOpts(X0, 1.45, W0, [2.3, 4.6, 4.65], 13), { rowH: 0.45 }));
T(s, 'Opportunity: own the decision moment with a ranked, honest comparison.', { x: X0, y: 5.05, w: W0, h: 0.45, fontSize: 16, bold: true, color: C.accent1 });
s.addNotes(notesOf('competitors'));

// ===== 8 Funnel =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we learned' });
s.addText('Most users drop between exploring and choosing', { placeholder: 'title' });
s.addChart(pres.charts.BAR, [{ name: 'Users per 100', labels: ['Hit WL / no seats', 'Explore alternatives (−28)', 'Compare 2+ options (−24, can’t compare)', 'Choose an option (−14, don’t trust odds)', 'Resolved booking in 24 h (−8)'], values: [100, 72, 48, 34, 26] }], {
  x: X0, y: 1.75, w: W0, h: 4.1, barDir: 'bar', catAxisOrientation: 'maxMin', chartColors: ['C3CCD6', 'C3CCD6', 'F0B94A', 'F0B94A', '2C4BD6'],
  showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 13, dataLabelColor: '15202C', dataLabelFontFace: '+mn-lt', dataLabelFontBold: true,
  catAxisLabelFontSize: 13, catAxisLabelColor: '15202C', catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 115,
  valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false, barGapWidthPct: 45,
});
T(s, '38 of 100 are lost between exploring and choosing: that is where both solutions act.', { x: X0, y: 5.95, w: W0, h: 0.45, fontSize: 16, color: C.text2 });
footer(s, 'Per 100 users. 26% from the brief; middle stages estimated from interviews and the survey.');
s.addNotes(notesOf('funnel'));

// ===== 9 Barrier =====
s = pres.addSlide({ masterName: 'ACCENT', sectionTitle: 'What we learned' });
T(s, 'PRIMARY BARRIER', { x: X0, y: 1.75, w: 6, h: 0.4, fontSize: 12, bold: true, color: 'D3DBFF', charSpacing: 2 });
T(s, 'Users don’t lack options. They lack a way to choose with confidence.', { x: X0, y: 2.25, w: 11.0, h: 2.2, fontSize: 46, bold: true, color: 'FFFFFF' });
T(s, 'They can’t compare trains, dates, buses and flights in one view, and a single “% confirm” hides whether they’ll get a berth, RAC or nothing.', { x: X0, y: 4.65, w: 10.0, h: 1.0, fontSize: 16, color: 'E3E8FC' });
s.addNotes(notesOf('barrier'));

// ===== 10 Impact =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we learned' });
s.addText('+16 points is worth about ₹120 crore a year', { placeholder: 'title' });
[['9.6 lakh', 'extra resolved bookings a month'], ['₹10 cr', 'net revenue a month at full rollout']].forEach(([v, l], i) => {
  const y = 1.75 + i * 1.65; card(s, X0, y, 3.4, 1.45);
  T(s, v, { x: X0 + 0.25, y: y + 0.2, w: 3.0, h: 0.65, fontSize: 32, bold: true, color: C.accent1 });
  T(s, l, { x: X0 + 0.25, y: y + 0.88, w: 3.0, h: 0.45, fontSize: 13, color: C.text2 });
});
s.addTable([
  [hdr('Mode'), { text: 'Extra / month', options: { bold: true, color: 'FFFFFF', fill: { color: '15202C' }, align: 'right' } }, { text: 'Net ₹ / booking', options: { bold: true, color: 'FFFFFF', fill: { color: '15202C' }, align: 'right' } }, { text: '₹ cr / month', options: { bold: true, color: 'FFFFFF', fill: { color: '15202C' }, align: 'right' } }],
  ...[['Train', '5,76,000', '60', '3.5'], ['Bus', '2,88,000', '110', '3.2'], ['Flight', '96,000', '350', '3.4'], ['Total', '9,60,000', '', '10.0']].map((r, i) => r.map((c, j) => ({ text: c, options: Object.assign({ align: j ? 'right' : 'left', bold: i === 3 }, i % 2 === 1 ? { fill: { color: ZEBRA } } : {}) }))),
], Object.assign(tableOpts(4.75, 1.75, 7.7, [2.2, 1.9, 1.8, 1.8], 14), { rowH: 0.6 }));
T(s, 'Plus fewer users lost to IRCTC and agents, more cross-mode users, and higher repeat use.', { x: X0, y: 5.3, w: W0, h: 0.45, fontSize: 15, color: C.text2 });
footer(s, 'Assumptions: 60 lakh waitlisted users a month; mix 60% train, 30% bus, 10% flight. Estimates, not ixigo data.');
s.addNotes(notesOf('impact'));

// ===== 11 Ideas =====
pres.addSection({ title: 'What we build' });
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we build' });
s.addText('The top three of 14 ideas fix the barrier', { placeholder: 'title' });
const R = (t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: '15202C' }, align: 'right' } });
const ideaRows = [['Honest outcome meter (CNF / RAC / WL)', '60', '2', '80%', '2', '48.0'], ['Priority chips', '60', '1', '70%', '1', '42.0'], ['Smart compare view', '60', '3', '80%', '4', '36.0'], ['Chart-time decision nudge', '40', '1', '60%', '1', '24.0'], ['Explainable prediction', '60', '1', '70%', '2', '21.0'], ['AI trip resolver', '60', '2', '50%', '4', '15.0'], ['Group-fit filter', '20', '2', '70%', '2', '14.0']];
s.addTable([
  [hdr('Idea'), R('Reach'), R('Impact'), R('Conf.'), R('Effort'), R('RICE')],
  ...ideaRows.map((r, i) => r.map((c, j) => ({ text: c, options: Object.assign({ align: j ? 'right' : 'left', bold: i < 3 && (j === 0 || j === 5) }, i < 3 ? { fill: { color: SOFT } } : {}) }))),
], Object.assign(tableOpts(X0, 1.45, W0, [5.35, 1.24, 1.24, 1.24, 1.24, 1.24], 14), { rowH: 0.42 }));
T(s, [{ text: 'Why these three: ', options: { bold: true } }, { text: 'they hit the primary barrier head-on. The meter fixes trust; chips and the compare view fix comparison.', options: { color: C.text2 } }], { x: X0, y: 5.2, w: W0, h: 0.8, fontSize: 16 });
footer(s, 'Reach = lakh users a month · Effort = person-months · 7 more ideas in the PRD doc');
s.addNotes(notesOf('ideas'));

// ===== 12 Solution =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we build' });
s.addText('Two solutions, one plan the user believes', { placeholder: 'title' });
[[C.accent1, 'A · FIXES COMPARISON', 'Best Way to Reach', ['One ranked list: trains, classes, dates, nearby stations, bus, flight', 'Chips plus a “my cut-off” filter, 80% by default', 'Top pick with a reason, plus a confirmed backup'], null],
 [C.accent2, 'B · FIXES TRUST', 'Honest Outcome Meter', ['Own berth / RAC / stays WL instead of one “% confirm”', '“Last 10 similar Saturdays” shows why', 'Never says guaranteed; ranges when data is thin'], [55, 30, 15]]].forEach(([col, eb, h, bullets, m], i) => {
  const x = X0 + i * (5.65 + 0.25);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.45, w: 5.65, h: 4.3, rectRadius: 0.1, fill: { color: CARD }, line: { color: col, width: 1.5 } });
  T(s, eb, { x: x + 0.35, y: 1.75, w: 5.0, h: 0.35, fontSize: 12, bold: true, color: col, charSpacing: 1 });
  T(s, h, { x: x + 0.35, y: 2.15, w: 5.0, h: 0.6, fontSize: 26, bold: true });
  T(s, bullets.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < bullets.length - 1 } })), { x: x + 0.35, y: 2.95, w: 4.95, h: 1.9, fontSize: 15, color: C.text1, paraSpaceAfter: 6 });
  if (m) { meter(s, x + 0.35, 5.1, 4.95, 0.14, m); T(s, 'Own berth 55% · RAC 30% · Stays WL 15%', { x: x + 0.35, y: 5.32, w: 4.95, h: 0.3, fontSize: 11, color: C.text2 }); }
  else { // priority chips, as in the prototype
    let cx = x + 0.35;
    [['Balanced', true, 1.1], ['Arrive by 10 AM', false, 1.6], ['Cheapest', false, 1.1]].forEach(([t, on, cw]) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: 4.98, w: cw, h: 0.34, rectRadius: 0.17, fill: { color: on ? '15202C' : 'FFFFFF' }, line: { color: on ? '15202C' : GREY, width: 0.75 }, objectName: 'chip ' + t });
      T(s, t, { x: cx, y: 4.98, w: cw, h: 0.34, fontSize: 11, bold: on, align: 'center', valign: 'middle', color: on ? 'FFFFFF' : C.text1 });
      cx += cw + 0.12;
    });
    T(s, 'Priority chips re-rank the list', { x: x + 0.35, y: 5.4, w: 4.95, h: 0.3, fontSize: 11, color: C.text2 });
  }
});
s.addNotes(notesOf('solution'));

// ===== 13 Screens =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we build' });
s.addText('The prototype in four screens', { placeholder: 'title' });
s.addText([{ text: 'Live: prototype-rohit-ixigo.lovable.app', options: { hyperlink: { url: 'https://prototype-rohit-ixigo.lovable.app' }, color: C.accent1, bold: true } }], { isTextBox: true, margin: 0, x: X0, y: 1.12, w: 8, h: 0.4, fontSize: 15 });
[['v2-results.png', '1 · Honest odds'], ['v2-bwr.png', '2 · Ranked list'], ['v2-detail.png', '3 · Odds + backup'], ['v2-done.png', '4 · Plan set']].forEach(([f, cap], i) => {
  const w = 2.35, h = w * 1602 / 800, x = X0 + 0.35 + i * (w + 0.55);
  s.addImage({ path: path.join(S, 'deck/shots2', f), x, y: 1.6, w, h, altText: cap });
  T(s, cap, { x, y: 6.45, w, h: 0.35, fontSize: 14, bold: true, align: 'center' });
});
s.addNotes(notesOf('screens'));

// ===== 14 Journey =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What we build' });
s.addText('Where the journey changes', { placeholder: 'title' });
s.addTable([
  [hdr('Stage'), hdr('Today'), hdr('With Best Way to Reach')],
  ...zebra([
    ['Sees WL', '“40% chance”, is that good?', 'Own berth 25% · RAC 15% · WL 60%'],
    ['Explores', 'Re-searches trains, dates, other apps', 'One button opens one ranked list'],
    ['Compares', 'Notes prices and times in memory', 'Chips and cut-off re-rank; top pick + backup'],
    ['Decides', 'Calls family or agent, or gives up', 'Books in 2 taps, backup ready'],
    ['Waits', 'Checks PNR many times', 'One chart-time alert'],
    ['After trip', '“The app was wrong” if RAC', '“Was this the right choice?”'],
  ]),
], Object.assign(tableOpts(X0, 1.45, W0, [2.1, 4.7, 4.75], 15), { rowH: 0.55 }));
s.addNotes(notesOf('journey'));

// ===== 15 GTM =====
pres.addSection({ title: 'How we launch' });
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'How we launch' });
s.addText('Launch in the waitlist moment, cohort by cohort', { placeholder: 'title' });
[['Months 1–2', 'Pilot', '5% of WL users, top 20 routes, A/B test', 'Next if +4 pts, regret ≤ control'], ['Month 3', 'Families', 'Bookings with 3+ passengers', 'Next if group-fit used by 30%'], ['Months 4–6', 'All WL users', '50% then 100%', 'Guardrails stable 4 weeks'], ['Then', 'PNR page', 'Rescue users already holding WL', '10% book a backup']].forEach(([when, h, l, gate], i) => {
  const x = X0 + i * (2.7 + 0.25); card(s, x, 1.45, 2.7, 2.55);
  T(s, when, { x: x + 0.22, y: 1.65, w: 2.3, h: 0.35, fontSize: 12, bold: true, color: C.accent1 });
  T(s, h, { x: x + 0.22, y: 2.0, w: 2.3, h: 0.45, fontSize: 18, bold: true });
  T(s, l, { x: x + 0.22, y: 2.5, w: 2.3, h: 0.75, fontSize: 13, color: C.text2 });
  T(s, gate, { x: x + 0.22, y: 3.3, w: 2.3, h: 0.6, fontSize: 12, bold: true });
});
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X0, y: 4.35, w: W0, h: 1.55, rectRadius: 0.1, fill: { color: '15202C' }, line: { type: 'none' } });
T(s, 'GROWTH LOOP', { x: X0 + 0.3, y: 4.53, w: 5, h: 0.3, fontSize: 12, bold: true, color: '8FA3FF', charSpacing: 2 });
T(s, 'Hit WL → top pick + backup → trip outcome and regret logged → odds and ranking get sharper → user trusts ixigo first next time and shares the plan on WhatsApp', { x: X0 + 0.3, y: 4.9, w: W0 - 0.6, h: 0.9, fontSize: 15, color: 'E3E8F0' });
s.addNotes(notesOf('gtm'));

// ===== 16 Metrics =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'How we launch' });
s.addText('One North Star, held in check by guardrails', { placeholder: 'title' });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X0, y: 1.85, w: W0, h: 1.05, rectRadius: 0.1, fill: { color: '2C4BD6' }, line: { type: 'none' } });
T(s, '26% → 42%', { x: X0 + 0.35, y: 2.03, w: 3.6, h: 0.7, fontSize: 34, bold: true, color: 'FFFFFF' });
T(s, '24-hour resolved booking rate for users who hit WL or no seats', { x: 4.6, y: 2.18, w: 7.6, h: 0.5, fontSize: 16, color: 'E3E8FC' });
[['Supporting', ['60% of WL users open Best Way to Reach', 'Searches before booking: 3–5 → 1–2', 'Time to booking: −40%', 'Trust in the shown chance: 1.7 → 3.5']], ['Guardrails', ['Regret (“wrong choice”) ≤ 8%', 'Predicted vs actual CNF / RAC / WL within 5 pts', 'No rise in cancellations of picks', '“Prediction wrong” complaints −30%']]].forEach(([h, items], i) => {
  const x = X0 + i * (5.65 + 0.25); card(s, x, 3.15, 5.65, 2.6);
  T(s, h, { x: x + 0.3, y: 3.35, w: 5.0, h: 0.4, fontSize: 18, bold: true });
  T(s, items.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < items.length - 1 } })), { x: x + 0.3, y: 3.85, w: 5.05, h: 1.75, fontSize: 14, color: C.text1, paraSpaceAfter: 6 });
});
s.addNotes(notesOf('metrics'));

// ===== 17 Risks =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'How we launch' });
s.addText('Risks we plan for', { placeholder: 'title' });
s.addTable([
  [hdr('Risk'), hdr('Level'), hdr('Mitigation')],
  ...zebra([
    ['Wrong top pick', 'Medium', 'Always show a backup; regret tracking'],
    ['Odds overconfident', 'Medium', 'Split + ranges; calibration guardrail'],
    ['Honest odds cut WL bookings', 'Medium', 'Offer protected WL and backup together'],
    ['Bus or flight data slow', 'Medium', 'Show trains first, stream others in'],
    ['Seen as upselling flights', 'Low', '“Balanced” default; cheapest always visible'],
  ]),
], Object.assign(tableOpts(X0, 1.45, W0, [4.2, 1.6, 5.75], 15), { rowH: 0.5 }));
T(s, [{ text: 'Trade-offs we accept: ', options: { bold: true } }, { text: 'honesty over short-term conversion, a clear recommendation over a neutral list, and speed over full automation in v1.', options: { color: C.text2 } }], { x: X0, y: 4.85, w: W0, h: 0.8, fontSize: 16 });
s.addNotes(notesOf('risks'));

// ===== 18 AI =====
pres.addSection({ title: 'What next' });
s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'What next' });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X0, y: 0.8, w: 5.7, h: 5.85, rectRadius: 0.1, fill: { color: 'E7ECF1' }, line: { type: 'none' } });
s.addImage({ path: path.join(S, 'deck/shots/ai-out.png'), x: X0 + 0.15, y: 1.23, w: 5.4, h: 5.4 * 1572 / 1704, altText: 'Trip Resolver showing what it understood, priority weights and a ranked plan' });
T(s, 'STEP 8 · AI EXTENSION', { x: 7.05, y: 1.1, w: 5.4, h: 0.35, fontSize: 12, bold: true, color: '8FA3FF', charSpacing: 2 });
T(s, 'Trip Resolver: say it in your own words', { x: 7.05, y: 1.55, w: 5.4, h: 1.3, fontSize: 30, bold: true, color: 'FFFFFF' });
const ai = ['Claude turns “3 of us, mother is 65, reach by Sunday, ₹5,000” into weights and limits', 'Transparent code ranks real options; AI never invents trains or prices', 'Same honest odds; “guaranteed” is blocked', 'Works in Hinglish; keyword fallback if AI is down'];
T(s, ai.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < ai.length - 1 } })), { x: 7.05, y: 3.05, w: 5.4, h: 3.3, fontSize: 15, color: ONDARK2, paraSpaceAfter: 8 });
s.addNotes(notesOf('ai'));

// ===== 19 Close =====
s = pres.addSlide({ masterName: 'CONTENT_LIGHT', sectionTitle: 'What next' });
s.addText('From “Is 40% good?” to “I know how I’m getting there.”', { placeholder: 'title' });
[['Next 2 weeks', 'Validate RAC-split data with ConfirmTkt; usability test with 5 users'], ['Next 2 months', 'Pilot on 20 routes, A/B against today’s flow'], ['Next 6 months', 'All WL users; 42% resolved bookings']].forEach(([h, l], i) => {
  const x = X0 + i * (3.7 + 0.225); card(s, x, 2.35, 3.7, 2.1);
  T(s, h, { x: x + 0.28, y: 2.6, w: 3.2, h: 0.35, fontSize: 13, bold: true, color: C.accent1 });
  T(s, l, { x: x + 0.28, y: 3.0, w: 3.15, h: 1.3, fontSize: 16 });
});
T(s, 'Prototype, AI demo, research and PRD: links in the submission · Rohit Kumar', { x: X0, y: 5.6, w: W0, h: 0.45, fontSize: 14, color: C.text2 });
s.addNotes(notesOf('close'));

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('written', OUT);
})();

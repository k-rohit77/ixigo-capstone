# ixigo Capstone – Full Context

**Course:** Airtribe – Product Management Launchpad
**Case:** ixigo – Building Confident Travel Alternatives
**Owner:** Rohit Kumar
**Started:** 22 Oct 2026
**Live research doc:** https://claude.ai/artifact/N44ZFHRrTX9A8tSE4TPxAY

---

## 0. Why this matters

Last capstone scored **55%** against a target of **80%**. Main ways to avoid repeating it:

1. Submit **every item** under "What to submit" (about 30 across 9 steps). Use the checklist in section 9.
2. Use **real research**: 20+ interviews with real quotes, survey data, app reviews.
3. Tie **every step back to the 26% → 42% target** with numbers.
4. Prioritisation, metrics, and impact need **actual numbers in tables**, not adjectives.
5. Build a **clickable prototype** and do the optional **Step 8** for bonus marks.
6. Deck of 15–20 slides in **Why → What → How → What next** order, plus a ~15 min Loom.

---

## 1. The brief (from the case PDF)

### ixigo at a glance (FY26)
| Metric | Value |
|---|---|
| Monthly active users (Q4 FY26) | 84.82 million |
| Lifetime downloads | 810.94 million |
| Lifetime registered users | 379.48 million |
| Lifetime transacted users | 56.38 million |
| Passenger segments booked | 141.52 million |
| Train passenger segments booked | 104.12 million |
| Repeat transaction rate | 85.55% |
| Revenue from operations | ~₹1,228 crore |
| Train revenue from operations | ~₹511 crore |
| Brands | ixigo, ConfirmTkt, AbhiBus |

Also launched **ixigo NEXT** (AI-native app: TARA, Trip Mode, agentic travel flows).

### Problem statement
Users whose preferred train or class has **no confirmed seat** (waitlisted or unavailable) enter a high-friction loop: they repeatedly search other trains, classes, dates, stations, buses, flights, and don't confidently decide.

- Today: only **26%** complete a *resolved travel booking* within **24 hours**.
- Target (6 months): **42%**.

**Resolved travel booking =**
1. A confirmed train, bus, or flight booking that meets the journey need, **or**
2. A waitlisted train booking where the user **deliberately** chose an eligible protection or fallback option.

### Constraints
- Focus on the consumer-facing **ixigo Trains** experience.
- Users already know origin, destination, and approximate date.
- Only situations where the preferred train or class has no confirmed seat.
- Help users discover, understand, compare, and choose alternatives.
- May use alternate trains, classes, dates, nearby stations, buses, flights, protected WL bookings.
- Must account for price, journey time, arrival time, station convenience, confirmation probability, cancellation flexibility.
- **Communicate uncertainty honestly; never present predictions as guarantees.**
- **Don't rely only on discounts, coupons, or aggressive notifications.**

### Out of scope
Railway seat inventory, timetable redesign, IRCTC quota rules, Tatkal policy, railway pricing, airline/bus inventory creation, station/airport/train operations, payment gateway, refund policy, customer-support staffing.

---

## 2. Problem in simple words

A user knows the trip (e.g. Mumbai → Patna, 5 Nov) but the train shows WL. Every alternative has a trade-off: price, time, arrival, station, certainty, cancellation. The user can't compare them easily, doesn't trust the % prediction, keeps re-searching, and leaves to IRCTC, a bus app, or an agent.

**Example:** Ravi, Diwali trip, WL 85, "40% chance". Checks 3 trains (all WL), a 22-hour bus, a ₹9,000 flight. Can't compare, doesn't trust 40%, calls an agent. He is one of the 74 out of 100 ixigo loses.

**One line:** users don't fail because there are no options; they fail because they can't confidently choose. **Fix the decision, not the inventory.**

---

## 3. Step-by-step deliverables

| Step | Topic | What to submit |
|---|---|---|
| 1 | Market & user research | Research questions + hypotheses · Research plan · Interview tracker (user type, channel, insights) · Competitive analysis table · Travel decision personas · Top anticipated barriers |
| 2 | Frame the problem | Refined problem statement (with 1–2 quotes) · Funnel with drop-offs · Primary barrier + rationale · Business impact analysis |
| 3 | Ideation & prioritisation | 10–15 ideas · Prioritisation table (RICE) · 2 shortlisted solutions + rationale · Trade-off analysis |
| 4 | Experience, PRD & prototype | User journey map · PRD · Interactive prototype link · 2–3 annotated screens |
| 5 | GTM, growth loop, monetisation | GTM plan · Growth/behaviour loop diagram · Business impact model (trains, buses, flights) · Cohort rollout plan |
| 6 | Metrics | North Star + target · Supporting (leading/lagging) · Guardrails (bad recs, overstated confidence, post-booking regret) · Event tracking spec |
| 7 | Risks & trade-offs | Risk assessment + mitigations · Trade-offs · Constraints & assumptions |
| 8 | Vibe coding (optional, bonus) | Working AI artifact · How it fits the journey · Prompts and logic |
| 9 | Storytelling | 15–20 slide deck · ~15 min Loom · Prototype links · Supporting artifacts (research, PRD, prioritisation table, metrics dashboard) |

---

## 4. Step 1 – Research (in progress)

### Hypotheses
| # | Hypothesis | Test |
|---|---|---|
| H1 | Users see alternatives but can't compare them on what they care about (arrival, station, certainty), so they re-search instead of deciding. | Interviews (count re-searches), live booking walkthrough |
| H2 | Users don't trust a confirmation % alone; they want to know "what happens if it doesn't confirm". | Interviews + app reviews |
| H3 | Alternatives are scattered across trains/buses/flights tabs, so cross-mode comparison is too much work. | Behavioural walkthrough |
| H4 | Price isn't the main blocker; arrival time, station, family/luggage needs often matter more. | Survey ranking question |
| H5 | Users "park" a WL ticket, then panic near chart time and leak to Tatkal, buses, or agents. | Interviews: timeline of last WL trip |
| H6 | Users who resolve elsewhere got one clear recommendation from an agent, family, or another app. | Interviews with segment B |
| H7 | Predictions blur outcomes: "chance to confirm" doesn't separate CNF (own berth) from RAC (shared berth) or WL, so a "correct" prediction still feels wrong. | Interviews: ask what outcome they expected vs got; app reviews tagged RAC |

### Founder observation (own experience)
I booked a WL ticket that showed a **~90% chance to confirm**. It ended as **RAC**: I could board but had to share a berth. The prediction felt wrong even though I could travel.

**Takeaway:** users judge a prediction by the outcome they *expected* (own berth), not by whether they can board. Showing the likely outcome as CNF / RAC / WL split, not one "confirm %", is a design input for Steps 2, 4 and 6 (guardrail on overstated confidence).

### Research questions
1. When your train showed WL/unavailable, what did you do in the next 10 minutes, and the next 24 hours? (H1, H5)
2. Which factors decided your final choice? Rank top three. (H4)
3. How much do you trust an app's confirmation %, and what would make you trust it more? (H2)
4. How did you compare other trains, dates, stations, buses, flights? What was hardest? (H1, H3)
5. If you booked WL, what was your backup if it didn't confirm? (H2, H5)
6. If you booked elsewhere or didn't travel, what made that option win? (H6)
7. If an app gave you one ready plan, what must it show before you'd book it? (H1, H2)

### Segments (20+ interviews)
| Segment | Who | Count |
|---|---|---|
| A | Resolved inside ixigo/ConfirmTkt | 6 |
| B | Hit WL on ixigo, booked elsewhere | 6 |
| C | Gave up or postponed | 4 |
| D | Non-ixigo (IRCTC-only or agent) | 4 |

Include 5+ festive/high-demand routes and 4+ family/group travellers.

### Methods and timeline
| Method | Sample |
|---|---|
| Google Form survey (LinkedIn, WhatsApp) | 50+ responses |
| 1:1 interviews, 15–20 min | 20+ users |
| Play Store review mining (ixigo, ConfirmTkt, IRCTC Rail Connect) | 40–60 reviews tagged |
| Competitor walkthrough | 1 route, 4 apps |

- **Day 1:** finalise survey + script, share survey, send recruit messages to 30+ people
- **Days 2–5:** 4–5 interviews a day, mine reviews in parallel
- **Day 6:** competitor walkthrough
- **Day 7:** cluster insights, fill tracker, write personas and barriers

### Recruiting
**Where:** family/office WhatsApp groups, old Kissht/HDB field teams, LinkedIn, college/MBA groups, referrals from each interviewee.

**WhatsApp message:**
> Hi! I'm doing a short product research project on train travel. Have you faced a waitlisted or no-seat train ticket in the last 6 months? If yes, can I take 15 minutes on a call to hear what you did? No selling, just your experience. 🙏

**Screener:** "When your train showed WL or no seats, what did you finally do?" → assign A/B/C/D.

### Interview script (15–20 min)
1. **Warm-up (2 min):** How often do you travel by train? Which apps do you book on?
2. **Last trip (5 min):** Last time your train showed WL/no seats: route, date, who travelled?
3. **Next steps (4 min):** What did you do right after? How many searches? Checked buses, flights, other dates?
4. **Decision (4 min):** What did you finally do, where, with whom? What made it win?
5. **Trust (2 min):** Saw a confirmation %? Believed it? What happened?
6. **Ideal fix (2 min):** If the app gave one ready plan, what must it show before you'd book?

**Rules:** ask for stories, not opinions · ask "why?" twice · write 1–2 exact quotes (Hindi is fine) · never pitch your solution · fill the tracker row right after each call · record or screenshot with permission as proof.

### Interview tracker template
| ID | Segment | Channel | Route & trip type | What happened | Final outcome | Key quote | Insight | Hypothesis |
|---|---|---|---|---|---|---|---|---|
| U01 | A | | | | | | | |
| … | | | | | | | | |
| U20 | D | | | | | | | |

Final outcome = confirmed on ixigo · protected WL on ixigo · booked elsewhere · did not travel.

### App-review mining codes
| Code | Theme | Hypothesis |
|---|---|---|
| PRED | Prediction said high chance, didn't confirm | H2 |
| COMP | Hard to compare or find alternatives | H1, H3 |
| ATP | Confused by Alternate Travel Plan / 3X refund terms | H2 |
| LATE | Learned too late, no options left | H5 |
| COST | Alternatives too costly | H4 |
| RAC | Expected confirmed berth, got RAC | H2, H7 |
| OTHER | Anything else | – |

### Competitive analysis
| Player | What it offers when WL | Strength | Gap |
|---|---|---|---|
| **ixigo Trains** | WL prediction; Alternate Travel Plan (3X value for flight/bus, 2X for train if WL doesn't confirm); Assured free cancellation | Strong prediction (ConfirmTkt) + cross-mode inventory | Refund mostly as coupon, selected trains only; user still has to find and book the alternative |
| **ConfirmTkt** (ixigo group) | Alternates: same-train other-station quota, 2-train splits, train + bus combos | Finds hidden confirmed seats | Many raw options, no ranking by user priorities |
| **IRCTC VIKALP** | Free opt-in; auto-shift to alternate train on same route if seats free | Free, official | No guarantee, no choice after opt-in, result only after chart |
| **MakeMyTrip Trains** | Trip Guarantee 3X; same-train longer-route and nearby-station suggestions | Smart route hacks | Trade-offs (arrival, station distance) not explained |
| **redRail (redBus)** | Confirmation probability; Alternate Trip add-on (3X refund) | Bus inventory built in | Protects money, not the journey |
| **Airlines (direct)** | Last-minute flights | Certain seat | Price spikes, not linked to train search |
| **Offline agents** | Tatkal, quota knowledge, one clear answer | Trust, single recommendation | Extra cost, no transparency |

**Insight:** every big player pairs a prediction with a paid 3X-refund product, so protection is no longer a differentiator. **Nobody helps the user compare alternatives side by side and decide.** Opportunity: own the decision moment.

Sources: [ixigo ATP](https://www.ixigo.com/trains/alternate-travel) · [ConfirmTkt Alternates](https://yourstory.com/2016/06/confirmtkt-alternates) · [IRCTC VIKALP](https://www.latestly.com/india/information/what-is-irctc-vikalp-scheme-and-how-can-it-help-you-get-confirmed-train-tickets-during-diwali-and-chhath-puja-know-details-7165175.html/amp) · [MakeMyTrip](https://www.traveltrendstoday.in/makemytrip-introduces-tech-driven-features-for-better-train-travel-experience/) · [redRail](https://www.grabon.in/indulge/travel/redbus-seat-guarantee-alternate-trip/)

### Draft personas (replace with interview data)
| | Festive Family Planner | Time-Bound Professional | Budget Student | Anxious Waiter |
|---|---|---|---|---|
| Who | 38, Chhath/Diwali trip home, family of 5 | 29, work trip/interview, solo | 21, home or exam, solo | 45, books early, checks PNR daily |
| Must-have | Seats together, SL/3A, no night arrival | Arrive by fixed time | Lowest total cost | Certainty before chart |
| Will trade | Price, date ±1 day | Price, mode (will fly) | Time, comfort, mode (bus) | Little; hates switching |
| Behaviour | Many searches, asks relatives, goes to agent | Quick train vs flight compare | Checks bus apps, general quota | Waits, panics at chart time |
| Blocker | Alternatives rarely fit whole group | Can't see train vs flight by arrival in one view | Distrusts bus/split journeys | Distrusts %, no backup plan |
| Would help | One plan for the whole group + fallback | Ranked by arrival with honest certainty | Cheapest confirmed option + clear trade-offs | Protected booking + pre-decided fallback |

### Top anticipated barriers
1. **No side-by-side comparison** across trains, dates, stations, buses, flights. (H1, H3)
2. **Low trust in predictions:** a bare % with no explanation or fallback. (H2)
3. **Late realisation** near chart time, when good options are gone. (H5)
4. **Group constraints:** families need seats together, same class. (H4)
5. **Protection feels like insurance, not a plan:** 3X coupons protect money, not the journey. (H2)

**Likely primary barrier:** decision overload: options exist but no clear, trusted way to compare them. Validate against interview counts.

---

## 5. Survey (Google Form, 16 questions, ~4 min)

**Title:** Train travel when your ticket is waitlisted – 4 min survey
**Description:** I'm researching how people handle waitlisted or unavailable train tickets. No selling, answers are anonymous.

**Section 1 – Screening**
1. In the last 6 months, did your preferred train show Waitlisted (WL), RAC or No seats? *(Multiple choice)* Yes · No *(→ Submit form)*
2. How often do you travel by train? *(MC)* Once a month or more · Every 2–3 months · 2–3 times a year · Once a year or less
3. Which apps/channels do you use to book trains? *(Checkboxes)* IRCTC · ixigo · ConfirmTkt · MakeMyTrip · redRail/redBus · Paytm · Travel agent · Other

**Section 2 – Your last waitlisted trip**
4. What was the trip for? *(MC)* Festival/going home · Work · Exam or interview · Family function · Holiday · Other
5. How many people were travelling? *(MC)* Just me · 2 · 3–4 · 5 or more
6. How many days before the journey were you booking? *(MC)* Same/next day · 2–7 days · 1–4 weeks · More than a month
7. What did you do after seeing WL/no seats? *(Checkboxes)* Searched other trains · Tried another class · Tried another date · Checked a nearby station · Checked buses · Checked flights · Booked WL anyway · Asked family or an agent · Gave up
8. How many times did you search before deciding? *(MC)* 1–2 · 3–5 · 6–10 · More than 10
9. What did you finally do? *(MC)* Booked a confirmed train · Booked WL with protection/backup (ATP, VIKALP) · Booked WL with no backup · Took a bus · Took a flight · Agent/Tatkal · Postponed or cancelled
10. Where did you finally book? *(MC)* ixigo/ConfirmTkt · IRCTC · Another app · Agent · Did not book

**Section 3 – How you decide**
11. Rank what matters most. *(MC grid, one response per column)* Rows: Price · Arrival time · Total journey time · Chance of confirmation · Station close to home · Class/comfort · Free cancellation. Columns: Rank 1–5
12. How much do you trust an app's confirmation chance (e.g. "65%")? *(Linear scale 1–5)*
13. Hardest part of finding an alternative? *(MC)* Too many options to compare · Didn't trust the prediction · Too costly · Couldn't get seats together · Found out too late · Had to check many apps · Other
14. If an app showed one recommended plan + a backup, what must it show for you to book it? *(Paragraph)*

**Section 4 – About you**
15. Age group *(MC)* Under 22 · 22–30 · 31–45 · 46+
16. Can I call you for a 15-min chat? Name + WhatsApp number. *(Short answer, optional)*

**Mapping:** Q7–9 → H1, H5 · Q10 → H6 · Q11 → H4 · Q12 → H2 · Q13 → H1, H3 · Q16 → interview list.

---

## 6. Ideas parked for later steps
- **Step 2 primary barrier (draft):** users can't compare alternatives on certainty and trade-offs, so they re-search and leak.
- **North Star (draft):** resolved booking rate within 24h, 26% → 42%.
- **Guardrails (draft):** post-booking regret, prediction calibration/accuracy (measured as CNF vs RAC vs WL, not just "boarded"), cancellation rate of alternatives.
- **Design idea from founder experience:** show outcome split, e.g. "CNF 60% · RAC 30% · WL 10%", instead of a single confirm %.
- **Step 8 idea:** AI "trip resolver" that ranks alternatives by the user's priorities and explains certainty honestly.
- **Business impact:** compute in ₹ = additional resolved bookings × avg ticket value × take rate, split across train/bus/flight.

---

## 7. Status

| Step | Status |
|---|---|
| 1 – Research | Framework done; survey to share; 0/20 interviews done |
| 2 – Frame problem | Not started (needs interview data) |
| 3–9 | Not started |

---

## 8. Next actions
- [ ] Build Google Form from section 5 and share it
- [ ] Send recruit message to 30+ people
- [ ] Run 20 interviews, fill tracker after each call
- [ ] Collect 40–60 Play Store reviews and tag them
- [ ] Share notes/survey export with Claude for synthesis → Step 2

---

## 9. Submission checklist
**Step 1:** ☐ Questions + hypotheses ☐ Research plan ☐ Interview tracker ☐ Competitive table ☐ Personas ☐ Barriers
**Step 2:** ☐ Refined problem statement ☐ Funnel ☐ Primary barrier ☐ Business impact
**Step 3:** ☐ 10–15 ideas ☐ RICE table ☐ 2 shortlisted ☐ Trade-offs
**Step 4:** ☐ Journey map ☐ PRD ☐ Prototype link ☐ 2–3 annotated screens
**Step 5:** ☐ GTM ☐ Growth loop diagram ☐ Impact model ☐ Cohort rollout
**Step 6:** ☐ North Star ☐ Supporting ☐ Guardrails ☐ Event tracking
**Step 7:** ☐ Risks + mitigations ☐ Trade-offs ☐ Constraints
**Step 8:** ☐ Working artifact ☐ Journey fit ☐ Prompts/logic
**Step 9:** ☐ 15–20 slides ☐ ~15 min Loom ☐ Prototype links ☐ Supporting artifacts

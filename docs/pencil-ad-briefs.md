# Soligo Air — Pencil Ad Briefs (15 Creatives)

Copy-paste-ready briefs for [Pencil](https://www.trypencil.com/) to generate the
3 ad sets defined in the Q2 2026 Meta plan: **Tune-Up Trip-Wire**, **AC Sale + 0% Financing**,
and **Air Care+ Membership**.

Pencil works best when you set up the **Brand + Product** once, then run each brief as a
new "Creative" with the brief text, format, and copy variants. This doc is structured to
mirror that workflow exactly.

---

## 0 · One-time setup in Pencil

Run these once before generating any ads. Everything below references this brand kit.

### Brand → Create Brand

```
Brand name: Soligo Air
Industry: HVAC / Home Services
Location: Orlando, FL (Central Florida service area)
Tagline: Family-Owned Orlando HVAC. Real Comfort, Real Honest.
Tone of voice: confident, honest, no-nonsense, family-warm; never gimmicky or pushy
Brand voice rules:
- Lead with the offer or the outcome, never the company name
- Use plain English ("AC", not "HVAC system" unless we mean replacement)
- Cite the license number on every ad: FL #CAC1823002
- Never use "best", "#1", or unverifiable superlatives
- Include the phone number when space allows: (321) 384-7868
```

### Brand → Visual identity

```
Primary color: #F75600 (Soligo Orange)
Secondary color: #FF7A30 (Orange Light)
Dark accent:    #002C6D (Soligo Navy)
Mid accent:     #0047B3 (Royal Blue)
Background:     #FFFFFF / #F8F9FD (soft)
Typography: Poppins (Bold 700/800 for headlines, 400/500 body)
Logo: upload icon-v2.png (use existing brand logo from soligoair.shop repo)
Logo placement: bottom-right corner, 80px equivalent, on every static
```

### Brand → Compliance

```
Mandatory legal text on every creative (small, bottom):
"Licensed FL #CAC1823002 · (321) 384-7868"

Image safety rules:
- Real-feeling Florida imagery: palm trees, suburban Orlando homes, golden-hour light
- Diverse cast that matches actual customer base — Hispanic/Latino families welcome
- No stock-photo Caucasian thumbs-up; no lab-coat techs; no over-polished CGI
- No more than 20% text overlay (Meta auto-throttles otherwise)
```

### Product → Add 3 Products

Create three Product entries in Pencil so each ad set inherits the right offer details.

#### Product A · "$89 AC Tune-Up"
```
Name: $89 AC Tune-Up
Price: $89
Description: 21-point safety check, refrigerant level test, coil cleaning, capacitor test, drain line flush, thermostat calibration. Same-week scheduling in Orlando + Central FL.
Offer line: $89 AC Tune-Up · Orlando homeowners
Landing page: https://soligoair.shop/lp-meta-ac-tune-up-orlando
```

#### Product B · "AC Replacement · 0% APR"
```
Name: AC Replacement · 0% APR Financing
Price: $0 down · 0% APR for 18 months
Description: New high-efficiency SEER2 AC system. Free in-home estimate, same-week installation, $500 instant rebate. Most Orlando homeowners save $80-150/mo on power.
Offer line: $0 Down · 0% APR · 18 Months · $500 Instant Rebate
Landing page: https://soligoair.shop/lp-meta-ac-installation-orlando
```

#### Product C · "Air Care+ Membership"
```
Name: Air Care+ Membership
Price: $29/mo (first month FREE)
Description: 2 annual tune-ups, 15% off all repairs, priority dispatch, zero overtime fees, transferable when you sell. No contract, cancel anytime. Members save $340+ in year one.
Offer line: First Month FREE · $29/mo after · No contract
Landing page: https://soligoair.shop/lp-meta-air-care-plus
```

### Audience → Add 3 Audiences

Pencil uses audience to tune the creative direction (lifestyle, age cues, language).

```
Audience 1 — "Tune-Up Prospect"
Demographics: Homeowners 30-65, Orlando + Central FL (25mi radius)
Mindset: Practical, value-driven, weather-aware. Wants to avoid breakdowns, doesn't want to be sold a new system.
Pain point: Last summer's brutal AC failure or surprise bill.
What they fear: Being sold something they don't need.

Audience 2 — "AC Replacement Shopper"
Demographics: Homeowners 35-65, AC is 8+ years old, considering replacement
Mindset: Comparing quotes, thinking about financing, anxious about a $5-15K decision
Pain point: Power bill keeps climbing, AC is loud / weak / leaking
What they fear: Getting ripped off; pushy sales pressure

Audience 3 — "Membership Joiner"
Demographics: Homeowners 35-65 who already had service from Soligo Air OR engaged with brand
Mindset: Already trusts the brand, wants peace of mind, values predictability
Pain point: Calling around for quotes every time something breaks
What they fear: Being locked into a contract
```

### Output formats (apply to every creative)

```
Aspect ratios: 1:1 (1080x1080), 4:5 (1080x1350), 9:16 (1080x1920)
Export: PNG and JPG, sRGB
Variants per brief: 4 (Pencil generates 4 by default — keep all and split-test)
```

---

## 1 · How to use this doc in Pencil

For each ad below:

1. In Pencil, click **+ New Creative**
2. Select the matching **Brand** = Soligo Air
3. Select the matching **Product** (A, B, or C)
4. Select the matching **Audience**
5. Paste the **Creative Brief** into the prompt/brief field
6. Paste the **Visual Direction** into the image-prompt field (or "art direction")
7. Paste the **Headline**, **Primary Text**, and **CTA** into the copy fields
8. Set **Aspect Ratios** = 1:1, 4:5, 9:16
9. Click **Generate**
10. Pick the best variant, then duplicate the creative and run with the alt headlines (H2, H3) for split testing

**Naming convention** when you save creatives in Pencil:

```
soligo_{TUNEUP|FINANCE|MEMBER}_{T1..T5|F1..F5|M1..M5}_{1x1|4x5|9x16}_v1
```

---

## 2 · SET 1 — Tune-Up Trip-Wire (5 creatives)

> **Product:** A · "$89 AC Tune-Up"  ·  **Audience:** 1 · "Tune-Up Prospect"
> **Landing page:** https://soligoair.shop/lp-meta-ac-tune-up-orlando

---

### T1 · "$89 Big Number"

**Creative Brief**
```
Bold-typography ad selling a $89 AC tune-up to Orlando homeowners. The hero element
is the price — a massive "$89" stamp dominating the canvas. The image must communicate
"this is the price, no fine print" in under one second. Strong, clean, confident — not
a flyer aesthetic. Modern advertising design, not local-business clipart.
```

**Visual Direction (image prompt)**
```
Bold flat-design advertising creative, huge number "$89" in bright orange (#F75600)
centered on white background, small line-art AC condenser icon top-right corner,
clean Poppins-style sans-serif typography, soft drop shadow under the number,
professional HVAC brand aesthetic, premium minimal layout, plenty of negative space,
high contrast, square 1:1 format
```

**Headline (primary):** `$89 AC Tune-Up Orlando`
**Headline alts:** `Beat the Heat — $89` · `Save $1,000s for $89`
**Primary text:**
> Most AC breakdowns happen on the hottest day — and they're almost always preventable.
> $89 catches small problems before they cost you thousands. 21-point safety check by
> a licensed Orlando HVAC tech. Same-week scheduling.
> Licensed FL #CAC1823002.

**CTA button:** `Book Now`

---

### T2 · "Tech in Action"

**Creative Brief**
```
Trust-driven ad showing a real, friendly Orlando HVAC technician at work on an outdoor
AC unit. The technician is the proof — competent, calm, approachable, not corporate.
Florida suburban backyard setting with palm trees. Communicates "real local company,
real techs, $89 is real."
```

**Visual Direction (image prompt)**
```
Photorealistic advertising photo of a friendly Hispanic male HVAC technician in his
mid-30s, wearing a clean orange polo shirt with small embroidered logo, kneeling
beside a white residential AC condenser unit in a sunny suburban Orlando Florida
backyard, holding a digital multimeter, smiling warmly at the camera, palm trees and
stucco home in the background, golden hour lighting, shallow depth of field, sharp
focus, professional advertising photography, square 1:1 format
```

**Headline (primary):** `Real Tech, $89 Visit`
**Headline alts:** `Orlando Licensed — $89` · `No Upsell, Just $89`
**Primary text:**
> $89 — by a real licensed Orlando HVAC tech, not a 5-minute "courtesy check." Includes
> 21 real diagnostics, written report, and zero upsell pressure. Family-owned. Same week.
> Licensed FL #CAC1823002.

**CTA button:** `Book Tune-Up`

---

### T3 · "Before/After Coil"

**Creative Brief**
```
Proof-driven ad. A side-by-side photo of a dirty AC coil vs the same coil after
a tune-up cleaning. The visual does the persuading — shows ROI without copy doing
the heavy lifting. Demonstrates that $89 buys real, visible work.
```

**Visual Direction (image prompt)**
```
Split-screen comparison advertising photo, left side shows a dirty corroded HVAC
evaporator coil with visible dust, debris, and grime; right side shows the same
coil clean, shining, metallic silver after professional cleaning; thin orange (#F75600)
vertical divider line down the middle with a small arrow pointing right; clean studio
lighting, sharp focus, advertising still life, white background, square 1:1 format
```

**Headline (primary):** `This Costs You 30%`
**Headline alts:** `Dirty Coil = High Bill` · `$89 Cuts Your Bill`
**Primary text:**
> A dirty AC coil makes your system work 30% harder — and your power bill 30% bigger.
> $89 tune-up includes coil cleaning. Pays for itself in one Florida summer.
> Licensed FL #CAC1823002.

**CTA button:** `Schedule Tune-Up`

---

### T4 · "21-Point Checklist"

**Creative Brief**
```
Specificity-driven ad. Lists exactly what's in the $89 tune-up so the prospect knows
this isn't a 5-minute drive-by. Visual is a clean infographic checklist — credibility
through concreteness. Differentiates Soligo Air from "free tune-up" scams.
```

**Visual Direction (image prompt)**
```
Clean modern infographic-style advertising creative, vertical white card with 21 green
checkmarks listing AC tune-up items: "Refrigerant Level Check", "Coil Cleaning",
"Capacitor Test", "Drain Line Flush", "Thermostat Calibration", "Electrical Tightening",
"Filter Inspection", "Blower Motor Test", "Compressor Amp Draw", and 12 more.
Header text "21-POINT AC SAFETY CHECK" in dark navy (#002C6D), bright orange "$89" badge
in top-right corner of the card, white background, square 1:1, modern flat design,
Poppins font
```

**Headline (primary):** `What $89 Gets You`
**Headline alts:** `21 Real Checks — $89` · `Not a Sticker. A Tune-Up.`
**Primary text:**
> Most "tune-ups" are 5 minutes and a sticker. Ours is 21 real diagnostics — refrigerant,
> coils, capacitors, drain line, thermostat — by a licensed FL tech. $89. Book yours.
> Licensed FL #CAC1823002.

**CTA button:** `See What's Included`

---

### T5 · "Customer Save Story"

**Creative Brief**
```
Social-proof ad. A real customer testimonial card with a specific dollar-amount save
story. Communicates "this is what $89 prevents." High-trust, low-pressure, very HVAC.
```

**Visual Direction (image prompt)**
```
Clean testimonial card design, white background with subtle orange (#F75600) accent
border in top-right corner, 5 yellow stars at the top, quote in dark navy (#002C6D)
text "Caught a failing capacitor before it became a $1,000 emergency. Worth every
penny.", customer attribution "— Carlos R., Apopka FL" in smaller dark gray text,
small circular customer avatar with "C" initial in orange, premium minimalist
advertising design, square 1:1 format, generous white space
```

**Headline (primary):** `$89 Saved Carlos $1,000`
**Headline alts:** `Real Story — Real Save` · `Orlando 5★ — $89`
**Primary text:**
> Carlos's tech caught a failing capacitor during his $89 tune-up. The fix took 15 minutes.
> The emergency repair would've been $1,000+ on a brutal Sunday. Book yours before summer.
> Licensed FL #CAC1823002.

**CTA button:** `Book My Tune-Up`

---

## 3 · SET 2 — AC Sale + 0% Financing (5 creatives)

> **Product:** B · "AC Replacement · 0% APR"  ·  **Audience:** 2 · "AC Replacement Shopper"
> **Landing page:** https://soligoair.shop/lp-meta-ac-installation-orlando

---

### F1 · "$0 Down Big Number"

**Creative Brief**
```
Offer-led ad. The headline number is "$0 DOWN" — the largest financial objection to
AC replacement is the upfront cost, and this image kills it instantly. Premium look,
not bargain-bin financing. Communicates that this is real, legitimate financing from
a licensed contractor — not a sketchy rent-to-own.
```

**Visual Direction (image prompt)**
```
Bold premium advertising creative, massive "$0 DOWN" in white text on a navy-to-orange
gradient background (#002C6D fading to #F75600), smaller white text below "0% APR ·
18 MONTHS · $500 OFF", a sleek modern white residential AC condenser unit photo composed
into the bottom-right corner, dramatic studio lighting on the AC unit, square 1:1
format, professional HVAC brand aesthetic, premium feel
```

**Headline (primary):** `$0 Down · 0% APR`
**Headline alts:** `New AC, $0 Today` · `18 Months · No Payments`
**Primary text:**
> Replace your old AC with a new high-efficiency system — $0 down, 0% APR for 18 months,
> $500 instant rebate. Free in-home estimate. Same-week installation in Orlando.
> Licensed FL #CAC1823002.

**CTA button:** `Get Free Estimate`

---

### F2 · "Old vs New System"

**Creative Brief**
```
Comparison ad. Side-by-side photo of an old, beat-up AC unit vs a brand-new modern
unit. Visual storytelling: this is your AC now, this is what it could be. Plays to
homeowner pride + power-bill anxiety.
```

**Visual Direction (image prompt)**
```
Side-by-side photo comparison advertising creative, left side shows an old rusty
corroded outdoor AC condenser unit with peeling paint and visible debris, in a dirty
overgrown side yard; right side shows a brand new pristine white modern AC condenser
unit on a clean concrete pad in a landscaped yard with mulch and palm trees;
vertical orange (#F75600) divider line down the middle, photorealistic, golden hour
lighting on both sides for consistency, square 1:1 format
```

**Headline (primary):** `Cut Your Bill in Half`
**Headline alts:** `Old AC = Money Burned` · `New SEER, Lower Bills`
**Primary text:**
> New SEER2 systems use 40-50% less power than 10-year-old units. Most Orlando homeowners
> save $80-150/month. $0 down, 0% APR. Free quote — no pressure.
> Licensed FL #CAC1823002.

**CTA button:** `See My Savings`

---

### F3 · "Family in Cool Home"

**Creative Brief**
```
Lifestyle ad. The outcome of replacing your AC: a calm, cool, comfortable home while
Florida bakes outside. Emotional pull, not feature dump. Smart thermostat showing
72°F is the visual proof.
```

**Visual Direction (image prompt)**
```
Warm lifestyle advertising photo, a happy diverse family of four (parents and two
kids) relaxing on a modern grey sectional couch in a bright comfortable Florida
living room, modern smart thermostat on the wall in the background reading "72°F",
bright sunlight streaming through a large window with palm trees visible outside
(suggesting a hot day outside), ceiling fan, soft natural interior lighting,
photorealistic, candid moment, professional advertising photography, 4:5 aspect
```

**Headline (primary):** `While Orlando Sweats…`
**Headline alts:** `72° All Summer` · `Stay Cool, Pay Less`
**Primary text:**
> Don't survive another Orlando summer with an AC on its last legs. New high-efficiency
> system, $0 down, 0% APR for 18 months. Free quote, same-week install.
> Licensed FL #CAC1823002.

**CTA button:** `Get My Quote`

---

### F4 · "Financing Calculator"

**Creative Brief**
```
Math-led ad. Shows the actual numbers: old power bill vs new AC payment + new lower
power bill = net savings. The math wins the argument. Clean infographic, not slide-deck.
```

**Visual Direction (image prompt)**
```
Clean infographic advertising creative, smartphone-style calculator card on a soft
light-blue background (#F8F9FD), three rows: top row "Old AC Bill: $320/mo" with red
strikethrough, middle row "New AC Payment: $89/mo", bottom row "New Power Bill: $210/mo",
big bottom badge "$231/mo SAVED" in bright orange (#F75600), small subtext "$0 DOWN ·
0% APR · 18 MO", modern flat design, premium fintech aesthetic, square 1:1 format
```

**Headline (primary):** `Pay Less Than the Bill`
**Headline alts:** `$89/mo · New AC` · `Save $231/mo`
**Primary text:**
> Most Orlando homeowners save more on their power bill than they pay for the new system.
> New AC: $89/mo. Power saved: $231/mo. Math wins. $0 down.
> Licensed FL #CAC1823002.

**CTA button:** `Calculate My Savings`

---

### F5 · "Owner On-Camera"

**Creative Brief**
```
Trust ad. The owner of Soligo Air, on camera, in front of a branded service truck.
Cuts through the "every HVAC company is the same" noise by putting a human face on it.
Especially powerful for the high-AOV replacement decision.
```

**Visual Direction (image prompt)**
```
Authentic photo of a Hispanic male HVAC business owner in his 40s, wearing a clean
orange Soligo Air branded polo shirt, standing confidently in front of a white service
truck with the company logo on the door, suburban Orlando driveway, blue sky, palm
trees in the background, photorealistic eye-level shot, friendly confident expression,
arms crossed casually, golden hour lighting, professional advertising portraiture,
square 1:1 format
```

**Headline (primary):** `Family-Owned Orlando AC`
**Headline alts:** `Free Quote — Owner Calls` · `No Commission Pressure`
**Primary text:**
> I'm the owner of Soligo Air. We're a small Orlando family team — no commission pressure,
> no upselling. I'll personally come quote your AC replacement, free. $0 down, 0% APR if
> you decide to move forward.
> Licensed FL #CAC1823002.

**CTA button:** `Book Free Estimate`

---

## 4 · SET 3 — Air Care+ Membership (5 creatives)

> **Product:** C · "Air Care+ Membership"  ·  **Audience:** 3 · "Membership Joiner"
> **Landing page:** https://soligoair.shop/lp-meta-air-care-plus

---

### M1 · "$0 First Month Stamp"

**Creative Brief**
```
Offer-led ad. The hero is "$0 first month" — removes the only objection (recurring
billing fear). Premium minimal design, like a fintech app onboarding screen, not
a coupon clipper aesthetic.
```

**Visual Direction (image prompt)**
```
Bold advertising creative, huge "$0" in bright orange (#F75600) centered on white
background, banner text below in dark navy "FIRST MONTH FREE", small disclaimer text
"$29/mo after · cancel anytime · no contract", small blue shield icon at top center,
clean modern flat design, premium feel, generous negative space, Poppins font, square
1:1 format
```

**Headline (primary):** `Air Care+ Free Month`
**Headline alts:** `$29/mo · Cancel Anytime` · `AC Peace of Mind, Free`
**Primary text:**
> First month free on Air Care+ — Soligo Air's AC membership: 2 tune-ups/year, 15% off
> repairs, priority dispatch, zero overtime fees. $29/mo after. Cancel anytime, no contract.
> Licensed FL #CAC1823002.

**CTA button:** `Start Free Month`

---

### M2 · "Benefits Visual List"

**Creative Brief**
```
Specificity ad. Lists the 4 concrete perks of membership in a clean infographic.
Transparency = trust. Better than vague "peace of mind" copy.
```

**Visual Direction (image prompt)**
```
Clean infographic advertising creative, vertical white card layout with 4 benefit
rows, each with an icon and label: (1) calendar icon "2 ANNUAL TUNE-UPS", (2) wrench
icon "15% OFF ALL REPAIRS", (3) clock icon "PRIORITY DISPATCH", (4) shield icon
"ZERO OVERTIME FEES", header "AIR CARE+ MEMBERSHIP" in dark navy (#002C6D),
bright orange "$29/mo" badge bottom center, modern flat design, premium fintech
aesthetic, square 1:1 format, Poppins font
```

**Headline (primary):** `$1/Day · Total Coverage`
**Headline alts:** `4 Reasons to Join` · `2 Tune-Ups · 15% Off · VIP`
**Primary text:**
> Less than $1/day for 2 annual tune-ups, 15% off every repair, priority dispatch on
> hot days, and zero overtime fees. First month free. $29/mo after, cancel anytime.
> Licensed FL #CAC1823002.

**CTA button:** `Become a Member`

---

### M3 · "$340 Saved Big Number"

**Creative Brief**
```
Math ad. The headline number is the savings, not the price. Reframes membership from
"a monthly bill" to "money in your pocket." Strong against price objections.
```

**Visual Direction (image prompt)**
```
Bold typography advertising creative, huge "$340+" in bright orange (#F75600) centered
on a dark navy background (#002C6D), white subtext underneath "MEMBERS SAVE IN YEAR ONE",
small calculator icon, small white tag at top reading "AIR CARE+ MEMBERSHIP",
dramatic clean design with high contrast, premium minimalist aesthetic, square 1:1 format
```

**Headline (primary):** `Members Save $340+`
**Headline alts:** `Worth It Year One` · `$340 vs $29/mo`
**Primary text:**
> 2 tune-ups ($178 value) + 15% off avg. repair ($67 saved) + one no-overtime callout
> ($95 saved) = $340+ saved year one. Membership pays for itself the first time you
> need us. First month free.
> Licensed FL #CAC1823002.

**CTA button:** `Join Air Care+`

---

### M4 · "Customer Story Card"

**Creative Brief**
```
Social-proof ad. Real member testimonial card. Specific name, specific location,
specific dollar amount. The anti-corporate testimonial.
```

**Visual Direction (image prompt)**
```
Clean testimonial card advertising design, white background with subtle orange
(#F75600) accent border on top edge, 5 yellow stars at the top, quote in dark navy
(#002C6D) text "Best $29 I spend each month. They treat us like VIPs.", customer
attribution "— Lisa M., Lake Mary FL" in smaller dark gray text, small circular
customer avatar with "L" initial in orange, generous white space, premium minimalist
advertising design, square 1:1 format
```

**Headline (primary):** `"Best $29 I Spend"`
**Headline alts:** `5★ from Lisa, Lake Mary` · `Real Member Story`
**Primary text:**
> Lisa joined Air Care+ last spring. Two tune-ups, no overtime when her AC died Sunday
> morning, priority service all summer. Her words, not ours. Try month one free.
> Licensed FL #CAC1823002.

**CTA button:** `Try Free Month`

---

### M5 · "Hot Day VIP"

**Creative Brief**
```
Urgency + benefit ad. Plays the heatwave card — when it's 95° and everyone's calling,
members go first. Concrete value moment, not abstract perks.
```

**Visual Direction (image prompt)**
```
Lifestyle photo composite advertising creative, foreground hand holding a smartphone
showing a notification "✓ Priority Dispatch — Tech En Route", background scene shows
a Florida outdoor thermometer reading "95°F" in bright sunlight, beads of condensation
visible on the thermometer, palm tree silhouette, photorealistic, dramatic contrast
between the cool blue phone screen and the brutal hot orange-red outdoor scene,
square 1:1 format
```

**Headline (primary):** `Skip the 95° Wait`
**Headline alts:** `Members Go First` · `Priority When It's 95°`
**Primary text:**
> While Orlando waits 3 days, members are cool by tonight. Air Care+ priority dispatch,
> no overtime fees, 15% off the repair. First month free. $29/mo after.
> Licensed FL #CAC1823002.

**CTA button:** `Get Priority Service`

---

## 5 · After Pencil generates: review checklist

For each generated creative, verify before approving for ad upload:

- [ ] Logo present (bottom-right, 80px equivalent, not obscured)
- [ ] License text legible: `Licensed FL #CAC1823002`
- [ ] Phone visible: `(321) 384-7868`
- [ ] Brand colors only (#F75600, #002C6D, white) — flag any rogue palettes
- [ ] Text overlay <20% of canvas (Meta auto-throttle threshold)
- [ ] No misspellings ("Orlando", "tune-up", "$89", "$29/mo")
- [ ] Faces/imagery match the customer base (avoid generic stock looks)
- [ ] All 3 aspect ratios exported (1:1, 4:5, 9:16)
- [ ] Filename matches naming convention

## 6 · Upload to Meta Ads Manager

Once all 15 creatives × 3 aspects × 4 variants are generated and reviewed (approx 180
asset files), upload via Meta Ads Manager → Asset Library → Upload Media. Then build:

- **Campaign 1 (Tune-Up Trip-Wire):** 1 ad set, 5 ads (T1-T5), each ad with 3 headline +
  3 primary-text variants in Dynamic Creative
- **Campaign 2 (Retargeting / Membership):** 1 ad set, 5 ads (M1-M5)
- **Campaign 3 (Reactive / Replacement):** 1 ad set, 5 ads (F1-F5)

Each ad's primary text rotation is in `docs/pencil-ad-briefs.md` (this file) — three
hook lines per image. Use them in Dynamic Creative for systematic split-testing.

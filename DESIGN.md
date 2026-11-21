---
name: Kevin Ou
description: A junk journal bound as a Japanese station stamp-rally book, one page of taped paper on indigo bookcloth.
colors:
  eki-red: "#d6262f"
  eki-red-deep: "#a8161e"
  stamp-indigo: "#2546a8"
  stamp-green: "#1f8a5a"
  marigold: "#f2a900"
  bookcloth: "#1f2a5c"
  bookcloth-deep: "#161e45"
  grid-paper: "#f4f2ea"
  kraft: "#c89d6c"
  kraft-ink: "#3b2614"
  rail-mint: "#bfe6d3"
  rail-mint-deep: "#8ccbb0"
  ledger-pink: "#f7cfc6"
  washi-yellow: "#ffe066"
  photocopy: "#e7e6e1"
  stamp-cream: "#fffdf6"
  paper-white: "#ffffff"
  ticket-ink: "#134a35"
  ink: "#17161a"
  ink-soft: "#3d3b44"
typography:
  display:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "clamp(4.2rem, 13vw, 9.6rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.02em"
  body:
    fontFamily: "Zen Maru Gothic, ui-rounded, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  lede:
    fontFamily: "Zen Maru Gothic, ui-rounded, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.5
  hand:
    fontFamily: "Gaegu, Comic Sans MS, cursive"
    fontSize: "1.35rem"
    fontWeight: 400
    lineHeight: 1.15
  label:
    fontFamily: "Courier Prime, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  tag: "3px"
  slip: "4px"
  ticket: "6px"
  badge: "10px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  column-gap: "clamp(12px, 2vw, 28px)"
  sheet-pad: "clamp(24px, 3.4vw, 44px)"
  spread-top: "clamp(36px, 5vw, 64px)"
  route-height: "58px"
  snap: "8px"
components:
  route-link:
    textColor: "{colors.ticket-ink}"
    typography: "{typography.label}"
    padding: "6px 8px"
  route-bar:
    backgroundColor: "{colors.rail-mint}"
    height: "{spacing.route-height}"
  station-sign:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "12px 26px 10px"
  sheet-grid:
    backgroundColor: "{colors.grid-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "{spacing.sheet-pad}"
  sheet-kraft:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.kraft-ink}"
    padding: "{spacing.sheet-pad}"
  sheet-photocopy:
    backgroundColor: "{colors.photocopy}"
    textColor: "{colors.ink}"
    padding: "{spacing.sheet-pad}"
  ticket:
    backgroundColor: "{colors.rail-mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ticket}"
    padding: "14px 18px"
  ticket-links:
    backgroundColor: "#fff3c4"
    textColor: "{colors.eki-red-deep}"
    rounded: "{rounded.ticket}"
    padding: "14px 18px"
  eki-stamp:
    backgroundColor: "{colors.stamp-cream}"
    textColor: "{colors.eki-red}"
    rounded: "{rounded.round}"
    size: "128px"
  rally-card:
    backgroundColor: "{colors.stamp-cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ticket}"
    width: "232px"
    padding: "10px 12px 8px"
  rally-ring:
    rounded: "{rounded.round}"
    size: "34px"
  note-yellow:
    backgroundColor: "{colors.washi-yellow}"
    textColor: "{colors.ink}"
    padding: "18px 20px"
  note-pink:
    backgroundColor: "{colors.ledger-pink}"
    textColor: "{colors.ink}"
    padding: "18px 20px"
  receipt:
    backgroundColor: "#fbfbf8"
    textColor: "{colors.ink}"
    padding: "22px 22px 30px"
  data-tag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.tag}"
    padding: "4px 8px"
---

# Design System: Kevin Ou

## Overview

**Creative North Star: "The Stamp-Rally Junk Journal"**

The page is a journal lying open on indigo bookcloth. Every section is a station on a rail line, and every station is a pile of torn papers held down with washi tape: grid paper, kraft, mint rail-ticket stock, ledger pink, photocopy grey, receipts, a polaroid, a postcard. Each station carries an eki stamp the visitor presses to collect, and a rally card in the corner keeps count. The build has no cards and no boxes. Things are grouped by how they overlap, how they are taped, and how much they are tilted.

The system is dense and handmade but disciplined. Paper colours carry the world, three stamp inks carry identity, and eki red is spent only on things a finger or cursor can act on. Type is split by job: Dela Gothic for anything stamped or signed, Zen Maru Gothic for reading, Gaegu for margin scribbles, and Courier Prime for ticket and receipt data. Motion is physical and short. A stamp presses, a scrap lifts when grabbed, a card slides out of its pocket, and nothing drifts on its own.

**Key Characteristics:**
- Indigo bookcloth ground with a fixed weave texture and a soft top-lit radial.
- Paper sheets with torn bottom edges (SVG mask), grain texture, and layered paper shadows.
- Washi tape strips in yellow stripe, blue diagonal, and coral dot, at a slight rotation, on top of everything they hold.
- A 12-column spread grid that pieces deliberately break with negative margins and rotation.
- Eki red reserved for interaction; indigo and green as station inks.
- A waxy crayon cursor trail (tapered, ragged edge, paper-tooth texture fixed to the page) that sheds tiny wax crumbs, plus click-stamp impressions, all off under reduced motion. Sections place their pieces once on scroll: the sign drops in, the sheet wipes down, scraps settle in a non-uniform stagger. A shinkansen rides the top route as scroll progress.

## Colors

The palette is paper and ink: warm, slightly dusty paper stocks on a deep cool bookcloth, with three saturated stamp inks.

### Primary
- **Eki Stamp Red** (eki-red): the touch colour. Focus rings (3px dashed), link underlines, hovered dots and rings, the current station on the route, drum-pad hover, the default stamp ink, and the default cursor trail.
- **Pressed Red** (eki-red-deep): link and action text on light paper, such as the find-me ticket links, receipt links, the "tap to print the rest" prompt, and the pocket peek line. Link hover moves to it.

### Secondary
- **Station Indigo** (stamp-indigo): stamp ink for indigo stations, the second word of the name, placard bands, the postage stamp, margin arrows, and handwritten notes that point at something.
- **Station Green** (stamp-green): the rail line itself, route dots, green station stamps and sign bars, and stamped state on the route.

### Tertiary
- **Marigold** (marigold): stand-in sign bar for stations whose stamp ink is red, award tags, ribbons, and the postcard airmail border. It keeps a red station's sign from spending red on something that cannot be touched.

### Neutral
- **Indigo Bookcloth** (bookcloth) and **Deep Bookcloth** (bookcloth-deep): the ground and the scrollbar track. Text set directly on the cloth is washi yellow handwriting or 55% white.
- **Grid Paper** (grid-paper): the main reading sheet, ruled with 22px lines at 16% indigo.
- **Kraft** (kraft) with **Kraft Ink** (kraft-ink): the brown-paper sheet and its text.
- **Rail Mint** (rail-mint) and **Mint Deep** (rail-mint-deep): the route strip, the admit ticket, the mint note, and the scrollbar thumb.
- **Ticket Ink** (ticket-ink): dark green text on mint stock, such as route labels, ticket stubs, and ticket field names.
- **Ledger Pink** (ledger-pink), **Washi Yellow** (washi-yellow), **Photocopy Grey** (photocopy): note and sheet stocks. Washi yellow also fills text selection and the skip link.
- **Stamp Cream** (stamp-cream) and **Paper White** (paper-white): stamp faces, the rally card, polaroids, signs, badges, and ribbons.
- **Ink** (ink) and **Soft Ink** (ink-soft): body text and secondary text.

### Named Rules
**The Red Means Touch Rule.** Eki red and pressed red appear only on things that respond to the pointer, the keyboard, or a tap: links, buttons, stamps, rings, pads, the trail. A station whose colour is red takes a marigold sign bar. The red margin rule on ledger paper is part of the paper itself and is the one allowed exception.

**The Three Inks Rule.** Stamp impressions come in red, indigo, or green, set per station through `--c`. Every other colour is a paper stock or a tape.

## Typography

**Display Font:** Dela Gothic One (with Arial Black)
**Body Font:** Zen Maru Gothic (with ui-rounded, system-ui)
**Handwritten Font:** Gaegu (with Comic Sans MS)
**Data Font:** Courier Prime (with ui-monospace)

**Character:** A heavy Japanese poster gothic does the stamping and signage, and a soft rounded gothic does the reading. A loose marker hand writes in the margins, and a typewriter mono prints the tickets. Each face has one job and stays in it.

### Hierarchy
- **Display** (400, clamp(4.2rem, 13vw, 9.6rem), 0.86, -0.035em): the name on the cover page only. The second word turns indigo and tilts -3deg.
- **Headline** (400, clamp(2.4rem, 6vw, 4.6rem), 1, -0.01em): station names on the eki-mei-hyo signs, balanced wrapping.
- **Title** (400, about 1.5rem): object names such as the receipt shop name, the badge org, the rail-ticket cities, and the pocket tab. Placard country names scale up to clamp(2.2rem, 5vw, 3.6rem).
- **Body** (400 and 700, 1.0625rem, 1.6): sheet copy, 62ch max, stepping to 1rem under 640px. The lede is 1.2rem at 1.5.
- **Hand** (400, 1.35rem, 1.15): margin notes, hints, captions, and the postcard message. Captions run 1.05 to 1.2rem.
- **Label / Data** (700, 0.7 to 0.85rem, 0.03 to 0.14em, often uppercase): route stations, ticket fields, sign subtitles, receipt lines, and stamp dates. Numerals use tabular figures.

### Named Rules
**The One Face Per Job Rule.** Dela Gothic is for stamped and signed things, Zen Maru for anything read as a sentence, Gaegu for anything Kevin "wrote" by hand, and Courier Prime for printed data. Don't set body copy in Gaegu or data in Zen Maru.

**The Hints Are Handwritten Rule.** Instructions to the visitor ("tap the placard to flip it", "drag the prints around") are Gaegu notes in washi yellow on the cloth or soft ink on paper. They are never buttons or labels.

## Layout

Each station is a `spread`: a 12-column grid (column gap clamp(12px, 2vw, 28px)) inside a 1240px journal, with a clamp(16px, 4vw, 48px) side gutter. Pieces take column spans and then break them on purpose with negative margins (-6% to -26%), tilt through `--r`, and z-index stacking, so neighbouring papers overlap instead of sitting in cells. The station sign sits on row 1 at the left, or shifted to column 4 on alternating stations, and the stamp sits at the top right.

The route strip is fixed to the top at 58px (54px on phones), and the rally card is fixed to the bottom right at 232px wide. Scroll padding clears the route.

At 960px and below the grid drops to 6 columns. Pieces restack into one reading order, offsets shrink to small positive margins, and stamps move below their station. At 640px and below, everything runs to the full width, the rally card becomes a full-width bottom bar with nine rings in a row, the route scrolls sideways and auto-centres the current station, and the postcard loses its tilt.

Dragged scraps snap to an 8px module when dropped.

## Elevation & Depth

Depth is physical paper stacking: layered soft shadows, overlap order, and rotation. There are no hard offset shadows and no flat-colour cards. A paper's height is shown by its shadow and by what sits on top of it.

### Shadow Vocabulary
- **Paper** (`box-shadow: 0 1px 1px rgba(10,12,30,.18), 0 6px 14px -4px rgba(10,12,30,.35), 0 18px 32px -16px rgba(10,12,30,.45)`): every resting sheet, note, ticket, stamp face, and badge.
- **Lift** (`box-shadow: 0 2px 2px rgba(10,12,30,.15), 0 18px 30px -8px rgba(10,12,30,.45), 0 40px 60px -24px rgba(10,12,30,.5)`): a grabbed scrap, a hovered rail ticket, and the two always-raised objects, the rally card and the postcard.
- **Route** (`box-shadow: 0 6px 18px -8px rgba(5,10,30,.6)`): the fixed route strip over the page.

### Named Rules
**The Lift On Grab Rule.** Paper rises from Paper to Lift only while it is held or hovered as a control. When a scrap is grabbed, the rest of its spread dims (saturate .5, brightness .82) until it drops.

## Shapes

The form language comes from real paper. Sheets and receipts have torn bottom edges, drawn with an SVG mask at 16px (9px on the route). Tickets have half-circle punches cut into both short sides (9px radius) and a dashed tear line before the stub. Washi tape has zigzag cut ends. Stamps, rings, stickers, patches, and drum pads are circles with a dashed or inset second ring. Corners are small and real: 3px tags, 4px slips and ribbons, 6px tickets and the rally card, and 10px lanyard badges. Dashed rules (1.5 to 2.5px) mark perforations, empty stamp rings, and receipt dividers.

## Components

### Route Strip (navigation)
Rail-ticket mint with a fine white diagonal hatch and a torn bottom edge. A 4px green rail runs through 16px station dots. Labels are Courier Prime 700, 0.75rem, uppercase. Hovering scales a dot to 1.25 with a red border. The current station fills red at scale 1.3, and stamped stations fill green.

### Eki Stamp (signature)
Before it is pressed, the stamp is a 128px cream disc (104px on phones, 96px beside a sign on tablet) with a dashed ring in 55% of the station ink, an inset outline, a faded station icon, and a Gaegu "press" label. Hovering scales it to 1.06 and turns it -4deg, and pressing scales it to 0.94. Pressed, an SVG impression drawn in the station ink (outer ring, inner ring, arced station name, icon, and year) plays the `press` keyframe over 0.6s: from scale 1.55 and transparent, to 0.94 at 35%, to settling at 1 and 0.92 opacity, through an ink-bleed SVG filter. Stamps persist in local storage.

### Rally Card
A cream, grain-textured card at -1.5deg with a yellow washi tab and Lift shadow. It holds the title in Dela Gothic and the count in Courier Prime with the number in red. It opens to a grid of 34px dashed rings that fill solid in the station ink when collected. Finishing the rally plays a 2.6s paper-confetti fall in the palette colours.

### Paper Sheets
Grid, kraft, and photocopy stock with clamp(24px, 3.4vw, 44px) padding, the Paper shadow, a torn bottom edge, and grain. They are the only containers that hold running prose.

### Tickets
Mint or butter (#fff3c4) stock with punched sides, a vertical Dela Gothic stub behind a dashed tear, and Courier Prime field rows (a 6.5em key column with the value in 700). The links ticket sets its links in pressed red.

### Notes, Ribbons, Badges, Receipts, Postcard
Notes are flat colour stock (yellow, pink, mint) with grain. Ribbons are circular award rosettes with tails. Badges hang from striped indigo lanyards. Receipts are mono and print the rest of their lines when tapped, through a 0.6s grid-row expansion. The postcard has an airmail border in marigold, white, and indigo, a split message and address layout, and an indigo postage stamp.

### Inputs / Toys
The build has no form fields. Interactive toys stand in for controls: drum pads (circular, ink border, red on hover, scale .9 and -4deg on hit), crayons (rise 8px on hover and 16px when selected, and they set the trail colour), placards (0.8s Y-axis flip, peeking -8deg on hover), and rail tickets (a punch hole scales in when pressed).

### Motion grammar
Easing is a single curve, `cubic-bezier(.16, 1, .3, 1)`. Durations run 0.12s for pad hits, 0.25 to 0.3s for hover feedback, 0.5 to 0.6s for slides, drops, and the stamp press, and 0.8s for the placard flip. The cursor trail is a 420ms tapered marker ribbon in the chosen crayon colour, drawn from an eased pen head (lerp .42 per frame) with a paper-white spine highlight. Every 90px of travel it sheds one die-cut sticker (white border, flat fill) that falls under gravity for 1.3s. It draws only for a mouse or pen. A click on bare paper leaves a 1.4s ring-and-star impression plus a seven-sticker burst. The Eco Wrap booklet turns pages with a .45s perspective swing. Under `prefers-reduced-motion`, the trail, click stamps, confetti, and smooth scroll are off, and transitions collapse to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** reserve eki red (#d6262f) and pressed red (#a8161e) for elements that respond to input, and give a red station a marigold sign bar.
- **Do** group content by overlap, tape, and tilt on the 12-column spread, and break spans with negative margins and `--r` rotation.
- **Do** put every new container on a real paper stock with grain, the Paper shadow, and a torn or punched edge where the object would have one.
- **Do** keep stamp ink to red, indigo, or green per station, applied through `--c`.
- **Do** write visitor instructions as Gaegu hand notes, and keep every fact reachable without hover.
- **Do** use the one easing curve `cubic-bezier(.16, 1, .3, 1)`, and turn the trail, confetti, and smooth scroll off under reduced motion.

### Don't:
- **Don't** use bordered boxes, flat UI cards, or a hero, about, and experience-card stack. Papers overlap instead.
- **Don't** add ambient or looping motion. Things move only when pressed, grabbed, pulled, or flipped.
- **Don't** use hard offset shadows. Depth comes from the Paper and Lift shadow stacks.
- **Don't** use red for decoration, status, or emphasis on things that cannot be touched.
- **Don't** set body copy in Dela Gothic or Gaegu, or data in anything but Courier Prime.

## Station grounds (added)

Every station sits on its own full-bleed bookcloth band with a hard edge and no rule between bands: Hello indigo #1f2a5c, DECA green #1c4636 (linen diagonal), Model UN blue #183a5c (dot), Music plum #43223d (woven), Scouts olive #2e3b25 (canvas), Court slate #2a2c47 (speckle), Code ink #172034 (blueprint grid), Photos darkroom #36201c (safelight glow), Find me #20285a (airmail stripe). Pieces enter once per station: tossed from alternating angles on an overshoot curve (cubic-bezier(.34,1.45,.64,1)), lanyard badges swing on a damped linear() curve, and photos and notes drift a few pixels against the scroll. Instruments are drawn SVG cutouts with a white die-cut border.

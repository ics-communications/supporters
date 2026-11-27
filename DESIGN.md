---
name: ICS Supporters
description: Member and supporter web pages in the ics-site world, wine, copper and cream, with Libre Baskerville saying and Outfit stating, recorded from the 2026 AGM ballot.
colors:
  wine: "#9B0D24"
  wine-deep: "#7A0A1C"
  wine-mid: "#BE0B28"
  accent: "#A85A32"
  accent-light: "#C87A52"
  accent-on-wine: "#E9B48F"
  accent-muted: "#8E4A28"
  accent-pale: "#EEDACA"
  accent-deep: "#7A4020"
  cream: "#FDFBF7"
  cream-warm: "#F9F5ED"
  parchment: "#F0E9DD"
  text-dark: "#2E1318"
  text-body: "#3A3330"
  text-on-dark: "#E8C2C2"
  quiet: "#6B655F"
  rule: "rgba(155, 13, 36, 0.13)"
  rule-soft: "rgba(155, 13, 36, 0.07)"
  field: "rgba(155, 13, 36, 0.18)"
typography:
  display:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "clamp(1.8rem, 3vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "clamp(1.3rem, 2.4vw, 1.6rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "1.22rem"
    fontWeight: 700
    lineHeight: 1.25
  voice:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.75
  small:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  fact-label:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.12em"
  ledger:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.35
    fontFeature: "tnum, lnum"
rounded:
  none: "0"
spacing:
  container-pad: "2rem"
  container-pad-mobile: "1.25rem"
  column-gap: "3.6rem"
  column-gap-narrow: "2.4rem"
  panel-width: "28rem"
  panel-width-narrow: "22rem"
  item: "2.6rem"
  item-inset: "2.4rem"
  nominee: "2.2rem"
  field-gap: "1rem"
  target: "44px"
components:
  hero:
    backgroundColor: "{colors.wine-deep}"
    textColor: "{colors.cream}"
    padding: "1.15rem 0 1.35rem"
  ballot-panel:
    backgroundColor: "{colors.cream-warm}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.none}"
    padding: "1.05rem 1.4rem 1.2rem"
    width: "{spacing.panel-width}"
  vote-row-reading:
    backgroundColor: "#FFFFFF"
    padding: "0.42rem 0.6rem 0.5rem"
  segment:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.none}"
    padding: "0.35rem 0.4rem"
    height: "{spacing.target}"
  segment-chosen:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.cream}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.6rem"
    height: "48px"
  button-accent-hover:
    backgroundColor: "{colors.accent-deep}"
  button-accent-disabled:
    backgroundColor: "{colors.accent-muted}"
  text-field:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.none}"
    padding: "0.65em 0.9em"
    height: "46px"
  error-box:
    textColor: "{colors.text-dark}"
    padding: "0.8em 1em"
  footer:
    backgroundColor: "{colors.parchment}"
    textColor: "{colors.text-body}"
    padding: "1.8rem 0 2.2rem"
---

# Design System: ICS Supporters

## Overview

**Creative North Star: "The Scholar's Hearth"**

This repo has no identity of its own. Its web pages inherit the ics-site world (sibling repo `ics-site`, DESIGN.md "The Scholar's Hearth"), with the same token names, and restate it for pages that stand alone on supporters.icscanada.edu. The first and so far only page built in this world is the 2026 AGM ballot (`26-agm/ballot/`), and everything below is taken from its shipped CSS. Wine and cream carry the mass. Copper carries the voice, the calls to act and the rules. Libre Baskerville says things: titles, names, and an italic voice for the question being asked. Outfit states things: labels, figures, choices and running text. Corners are square. Depth comes from tone, with one lifted surface.

The ballot shows the world in an operational setting. The page is a reading column with a working panel beside it, and it is dense but calm. Figures sit in real ruled tables, choices are large square segments, and the state of the task is always in view. Both faces are self-hosted as variable woff2 files (`fonts/fonts.css`), so the page loads nothing from third parties.

Scope: DESIGN.md documents the web world used by the ballot. The other surfaces in this repo (`26-impact/`, `26-annual/`) are separate report pieces set in Spectral with their own palette, and this system does not govern them.

**Key Characteristics:**
- A compact wine-deep hero over a cream page, with a copper hairline across its top.
- One lifted surface per page: cream-warm, a 3px copper top rule, and a faint wine shadow.
- Serif for what is said, sans for what is stated.
- Wine fill marks a choice that has been made.
- Square corners everywhere, and wine-tinted hairlines as the line language.
- Tabular numerals wherever figures line up.

## Colors

A warm palette with no cool hues: wine, copper and cream, with wine-tinted hairlines in place of grey borders.

### Primary
- **Deep Wine** (`wine-deep`): the hero ground, under two soft radial glows (copper at 12% lower left, brand red at 18% upper right). Also the theme colour.
- **Ecclesiastical Wine** (`wine`): headings and names on cream, the chosen ballot segment, the count figure, links in states and the footer, focus outlines, and the ledger's header underline.
- **ICS Brand Red** (`wine-mid`): errors, in the error border, the invalid field and error text. Its only other use is as an 18% glow in the hero ground.

### Secondary
- **Burnt Copper** (`accent`): the primary button, the 3px top rule on the ballot panel, item numbers in headings, and the hero hairline.
- **Light Copper** (`accent-light`): decoration only, in gradient rules and the sending thread. Never text.
- **Copper Glow** (`accent-on-wine`): copper text on wine, such as the hero's italic phrase, fact labels and link hovers (6:1 on wine-deep).
- **Muted Copper** (`accent-muted`): small copper text, such as ballot numbers, nominee seats, notes links, the clear and back controls, and the disabled button.
- **Deep Copper** (`accent-deep`): the italic voice (the question put to members, the notes intro, ballot note, ledger sub-heads) and button hover.
- **Copper Blush** (`accent-pale`): text selection and the test-mode band.

### Neutral
- **Cream** (`cream`): the page ground, segment bars and text fields.
- **Warm Cream** (`cream-warm`): the lifted ballot panel.
- **Parchment** (`parchment`): the footer band and the portrait placeholder.
- **Ink** (`text-dark`): strong text, legends, field labels, ledger figures and totals.
- **Body Umber-Grey** (`text-body`): running text.
- **Rose Mist** (`text-on-dark`): text on wine, such as the hero subtitle and days left.
- **Quiet** (`quiet`): secondary text such as sources, notes, ledger headers and the blank review answer. It is the ballot's replacement for ics-site's Stone, chosen so small text clears 4.5:1 on cream and warm cream.
- **Wine Hairline** (`rule`): item dividers, group-title underlines, the reading row's border and the footer top.
- **Faint Hairline** (`rule-soft`): ledger rows, review rows, the nominee divider and the panel border.
- **Field Stroke** (`field`): segment bars and text-field borders (1.5px).

### Named Rules
**The Copper Voice Rule.** Copper speaks and wine names. The italic voice is deep copper, and headings and names are wine. Never set a heading in copper, and never set the italic voice in wine.

**The Red Means Wrong Rule.** As a solid colour, brand red (`wine-mid`) appears only to mark an error. Selection, emphasis and state use wine.

## Typography

**Display Font:** Libre Baskerville (with Georgia, serif), 400, 400 italic and 700
**Body Font:** Outfit (with the system sans stack), 300 to 700
**Root size:** 110%, so 1rem is 17.6px.

**Character:** A bookish transitional serif over a clean geometric sans. The serif's italic is the institution asking its members something.

### Hierarchy
- **Display** (700, clamp 1.8–2.3rem, 1.12, -0.01em): the hero title in cream, balanced. One phrase goes italic in copper glow.
- **Headline** (700, clamp 1.3–1.6rem, 1.25): item titles in wine, with a copper number at 0.8em.
- **Title** (700, 1.2–1.3rem, 1.25–1.3): panel heading, nominee names and state headings, in wine. Group titles step down to 0.86rem.
- **Voice** (400 italic, 0.8–1.02rem, 1.65–1.7): the question put to members at 1.02rem, the notes intro at 0.88rem and the ballot note at 0.8rem, all in deep copper.
- **Body** (Outfit 400, 0.92rem, 1.75, max 64ch): the notes. The page default is 1rem at 1.65, and the hero subtitle is Outfit 300 at 0.92rem.
- **Small** (Outfit 600, 0.8rem, 1.4): ballot legends and field labels (labels add 0.02em). Segment text is 500 at 0.78rem, or 0.74rem in three-way bars.
- **Label** (Outfit 600, 0.78rem, 0.08em, uppercase): buttons.
- **Fact label** (Outfit 600, 0.72rem, 0.12em, uppercase): the hero's definition terms and ledger column headers, which label data.
- **Ledger** (Outfit 400, 0.8rem, 1.35, tabular lining numerals): financial tables.

### Named Rules
**The Two Voices Rule.** Baskerville for what is said (titles, names, the italic question), Outfit for what is stated (labels, figures, choices, body).

**The Figures Line Up Rule.** Counts, days left, item numbers and every table figure use tabular numerals.

## Layout

A 1200px container with 2rem side padding (1.25rem at 900px and below). Above 900px the page is a two-column grid: notes in a flexible column, and the ballot panel at 28rem with a 3.6rem gap (22rem and 2.4rem at 1080px and below). The panel is sticky 1rem from the top and capped to the viewport height. It scrolls inside, and its footer, holding the main action, stays pinned. At 900px and below the page becomes one column with the ballot first and the notes after, and each item links back to its row. The hero is a two-column grid (content, then facts behind a copper-glow left rule) that stacks at 900px, where the facts move under a top rule. Items are separated by 2.6rem plus 2.4rem across a hairline, and nominees by 2.2rem. Reading text is held to 62–64ch. Targets are at least 44px, and inputs are at least 16px so phones do not zoom. The one exception is the row's Clear button, at 28px: it sits against the choices, and a larger hit area would overlap them and risk clearing a vote by mistake. It still meets the WCAG 2.2 AA minimum of 24px.

## Elevation & Depth

Flat and tonal. The hero is wine-deep with radial glows, the panel is cream-warm on cream, and the footer is parchment. Exactly one surface lifts: the ballot panel, with a faint wine shadow. The button gains a copper glow on hover, and text fields gain a wine ring on focus. There are no other shadows.

### Shadow Vocabulary
- **Panel lift** (`box-shadow: 0 14px 40px rgba(155, 13, 36, 0.07)`): the one lifted working surface.
- **Copper glow** (`box-shadow: 0 6px 20px rgba(168, 90, 50, 0.3)`): button hover, with a 1px rise.
- **Focus ring** (`box-shadow: 0 0 0 3px rgba(155, 13, 36, 0.1)`): focused text field. An invalid field uses brand red at 12%.

### Named Rules
**The One Lifted Surface Rule.** A page lifts one surface, the thing the reader works in, and marks it with the 3px copper top rule. Everything else stays flat.

## Shapes

Square throughout: panel, segments, buttons, fields, error boxes and portraits all have a radius of 0. Lines carry the shape language: a 3px copper top rule on the lifted panel, a 3px copper-to-transparent hairline across the hero, a 1.5px wine underline under ledger headers, and wine-tinted hairlines between items and rows. Portraits are 3:4 and cropped toward the top.

## Components

### Hero
**Compact and factual.** Wine-deep with radial glows and the copper hairline. Logo at 3.2rem, display title, a Rose Mist subtitle, then a definition list of facts. The terms are fact labels in copper glow, the values are cream with dates in bold Baskerville, and links are cream with a copper-glow underline.

### Ballot Panel (signature)
- **Surface:** warm cream, a faint hairline border, a 3px copper top rule and the panel lift. Square.
- **Head:** a wine Baskerville title, a count in Quiet with the figure in bold wine, and an italic deep-copper note.
- **Groups:** a wine serif group title over a wine hairline.
- **Footer:** sticky to the panel's bottom on desktop, holding the full-width accent button.

### Vote Rows and Segmented Choices (signature)
- **Row:** a fieldset legend in Ink (Outfit 600, 0.8rem) with a muted-copper tabular number, and the title linking to its notes. On desktop, two-choice rows put the legend and a 13rem bar on one line.
- **Segments:** one square bar with a 1.5px field stroke on cream, divided by 1px field lines, and each segment at least 44px tall. Hover tints 5% wine. **The chosen segment fills with wine and turns cream and semibold.** Focus draws a 2px wine outline.
- **Clear:** an underlined muted-copper text button that appears once a row is marked.

### Reading Highlight
The row whose notes are on screen turns white with a wine hairline border, and its number turns from muted copper to wine. It fades over 0.2s and is off in the single-column layout.

### Buttons
- **Accent (primary):** copper, white uppercase label, 48px minimum height, full width in the panel. On hover it turns deep copper, rises 1px and gains the copper glow. Pressing resets the lift. Disabled while sending, it turns muted copper with a progress cursor.
- **Text button:** muted copper, underlined at 35% copper, deepening on hover. Used for Back and Clear.

### Review List
A ruled list: number, item, then the answer right-aligned in wine semibold. A blank answer is set in Quiet italic Baskerville.

### Inputs / Fields
- **Style:** cream ground, a 1.5px field stroke, square, 46px minimum height and a wine caret. The label is Ink at 0.8rem 600 above, with Quiet notes at 0.76rem.
- **Hover / Focus:** the stroke darkens to 34% wine on hover. On focus it turns solid wine with the 3px focus ring.
- **Error:** a brand-red stroke and ring, a brand-red message at 0.78rem 500, and a summary box with a 6% brand-red tint, a 20% border and a bold brand-red lead.
- **Sending:** a 2px copper thread slides along a hairline (1.6s). Under reduced motion it holds still in light copper.

### Ledger Tables
Real tables. A serif caption with an Outfit Quiet aside, uppercase Quiet column headers over a 1.5px wine rule, right-aligned tabular figures in Ink, faint hairline rows, totals in semibold with a wine hairline, and italic deep-copper sub-heads. Pairs sit two-up and stack at 1080px, and wide tables scroll inside their figure.

### Nominee Block
A 9.5rem 3:4 portrait on parchment beside the biography, with a wine serif name, a copper number and a muted-copper seat line. Separated by a faint hairline, and stacked at 560px with the portrait at 8.5rem.

### Footer
A parchment band under a wine hairline, with body text at 0.8rem, strong text in Ink and wine underlined links.

## Do's and Don'ts

### Do:
- **Do** use the ics-site token names and values exactly as listed. This repo restates that world and does not fork it.
- **Do** mark a made choice with a wine fill and cream text, never with copper.
- **Do** keep tap targets at 44px or more, and text inputs at 16px or more.
- **Do** set every figure that lines up in tabular numerals, and set financial figures as real tables.
- **Do** keep `rule`, `rule-soft` and `field` as wine-tinted hairlines, not greys.
- **Do** self-host Libre Baskerville and Outfit as woff2 files.

### Don't:
- **Don't** round corners on panels, segments, buttons or fields.
- **Don't** lift more than one surface on a page.
- **Don't** use solid brand red (`wine-mid`) for anything but errors.
- **Don't** set light copper as text. It is for gradient rules only.
- **Don't** introduce cool hues or neutral greys. Secondary text is Quiet (`quiet`).

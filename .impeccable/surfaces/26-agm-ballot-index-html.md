---
version: 1
slug: "26-agm-ballot-index-html"
primary_target: "26-agm/ballot/index.html"
related_targets: []
---

# 2026 AGM ballot (26-agm/ballot/)

Mode: Operate. ICS members cast one ballot for the December 12, 2026 AGM, in advance or during the meeting. The page posts to an Apps Script web app (26-agm/ballot-script/) that validates and records each ballot in the 2026 Google Form, the record of truth. The native Form stays live as the fallback.

Audience: ICS members, many older, on desktop and phone, voting once a year. Task: read the notes, mark six items (blanks allowed), give name, email and a typed signature, cast. States: open, closed (after 4:00 pm ET Dec 12 or closed by hand), sending, recorded, failed, uncertain.

Visual world: inherited from ics-site (DESIGN.md "The Scholar's Hearth"; academics/apply-ma-phd.html form components). No new identity.

## Direction contract

THESIS: The members' package and the ballot side by side. The category default, a long Google Form with bios crammed into each question, is refused.

OWN-WORLD: ics-site wine hero over a cream ground; copper 3px top rule on the lifted ballot panel; Libre Baskerville for item titles and the copper-italic question; Outfit for labels and figures; square corners; wine fill for the chosen segment.

STORY: A member sees the deadline and what to read, reads each item's notes beside the vote, marks their choices, reviews them, signs, and is told plainly that the ballot was recorded.

FIRST VIEWPORT: Compact wine hero (title, meeting, closing time, links). Left two-thirds: the notes column, starting with Item 1, financial tables as real tables. Right third: a sticky "Your ballot" panel of six items with segmented choices, a count, and Review and sign.

FORM: Package beside the ballot, position 3 of 7 on the ranked list (dealt lead). seed:7d2a32f3da6e14b0

FINISH: unreviewed and undocumented is unfinished; the finish reviewer and documenter run before this surface ships.

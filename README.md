# ICS Supporters

Pages for supporters of the Institute for Christian Studies (Toronto).

Static HTML/CSS, the same shape as the sibling ICS repos (`perspective`, `philosophy`, `ics-site`). Open `index.html` in a browser to preview; there is no build step yet.

- `PRODUCT.md`: who the site is for and what it must do.
- `DESIGN.md`: the design system, recorded once the first pages are built.
- `info/`: local reference material (ignored by git).

## The Impact Report lives in two repos

The Impact Report 2025–26 is kept in two places, and the two copies must stay identical:

- ics-site: `impact-report-2025-26/`
- supporters: `26-impact/`, served at https://supporters.icscanada.edu/26-impact/ (the supporters front page forwards to it)

**Every change made in one must be made in the other, in the same sitting, and committed and pushed in both repos.** The easiest way is to edit one copy, then copy the folder across:

```
rsync -a --exclude='._*' --exclude=.DS_Store <edited folder>/ <other folder>/
```

Then check that they match (no output means identical):

```
diff -rq --exclude='._*' --exclude=.DS_Store \
  /workspace/transferportal/Github/ics-site/impact-report-2025-26 \
  /workspace/transferportal/Github/supporters/26-impact
```

`make-pdf.mjs` is gitignored in both repos but kept identical too. It writes the PDF to that repo's `copy-review/impact-report-2025-26/`, and its links point to supporters.icscanada.edu/26-impact/. The favicon link (`../assets/logos/ics-favicon.png`) works in both repos because each has that file.

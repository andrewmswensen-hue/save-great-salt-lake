# Great Salt Lake Site

## What we're building
A single-page, scrollable, fact-first educational website about the Great Salt Lake water crisis. The site explains the crisis in plain English, calls out the political hypocrisy driving it (Gov. Cox + alfalfa-farming legislators), and gives visitors a clear path to take action by contacting their state representatives.

## Goals
1. **Educate** — explain what's happening, why, and who's responsible, using only peer-reviewed and authoritative sources.
2. **Confront** — name specific politicians (esp. Cox, Joel Ferry, Sen. Sandall, Rep. Snider) who have either personally profited from alfalfa farming or shielded the industry while asking residents to take shorter showers.
3. **Activate** — make it dead simple for a visitor to find and email their state legislator with a pre-drafted letter.

## How it's structured
- `index.html` — the entire site, single scrollable page
- `styles.css` — visual styling (color palette inspired by the lake: desaturated blues, salt whites, rust/red for alarm, alfalfa-green)
- `script.js` — light interactivity (smooth scroll, rep-lookup form, copy-letter button)
- `.claude/launch.json` — dev server config for live preview

## Tech choices (why these)
- **Plain HTML/CSS/JS, no frameworks.** Andrew is non-technical. Anything fancy (React/Next/etc.) adds build steps that make hosting and editing harder. A static folder can be dragged into Netlify, Cloudflare Pages, or any host with zero setup.
- **No external dependencies.** Self-contained so it loads fast and doesn't break if a CDN goes down.
- **Mobile-first responsive.** Most political-action traffic comes from phones.

## Fact-check status
All headline stats and political claims have been independently fact-checked against peer-reviewed sources and Utah news outlets. See in-line `data-source` attributes and the Sources section at the bottom of the page for citations. Key landmines identified and avoided:
- Cox's farm is in the Sevier River basin, NOT the GSL watershed — the hypocrisy framing is about him defending alfalfa and resisting acreage reform, NOT about his farm directly draining the lake.
- Mercury appears in lake sediment but is NOT confirmed in airborne dust studies — only arsenic, lithium, copper, manganese, iron, and lead are cited as airborne contaminants.
- Joel Ferry (DNR Director, ex-House NR chair) and Sen. Scott Sandall (Promontory ranch on the lake itself) are the strongest hypocrisy cases — both have farms in the GSL watershed.

## Editing later
To change copy, edit `index.html`. To change colors/fonts/spacing, edit `styles.css`. Everything is annotated with comments so a non-coder can find what they want to change.

## Running locally
From this folder, run `python3 -m http.server 8000` and visit `http://localhost:8000`. Or use the preview tools (see `.claude/launch.json`).

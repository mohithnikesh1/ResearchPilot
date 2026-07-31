# 🧭 ResearchPilot — Frontend

**An independent AI publishing & open access assistant built to help UW-Madison researchers.**

> Find the right journal. Check your rights. Deposit to the right repository.

Live app: **https://mohithnikesh1.github.io/ResearchPilot/**
Backend API: **https://mohithnikesh-researchpilot.hf.space** (FastAPI on HuggingFace Spaces — see the companion backend repo)

---

## What it does

| Tab | What you get |
|---|---|
| 📰 **Journal submission** | Browse 32K+ SCImago-ranked journals by subject, or paste an abstract for AI-matched recommendations with a full Green OA breakdown, verified quartiles, Altmetric attention, related works, and a UW-Madison APC-agreement badge (13 publishers, always with a verify-eligibility caveat). |
| 🛡️ **License checking** | **DOI-first and grounded**: with a DOI, self-archiving facts come from the OA.Works Permissions database (the dataset behind cOAlition S's Journal Checker Tool) — never from the AI. Without a DOI, you get a journal-level estimate clearly marked "Not confirmed". Deposit routes: MINDS@UW, ShareYourPaper (deposits an open copy to Zenodo), or direct Zenodo deposit. |
| 🗄️ **Data repository** | Curated-registry repository matching. MINDS@UW and Dryad (both free for UW-Madison researchers) always listed first; every factual field served from verified records, not generated. |
| 💬 **ResearchPilot Assistant** | Streaming chat grounded in a UW-Madison knowledge base (APC agreements, OA policy, data services) with smart routing to the three tools. |

## Design

- **UW-Madison palette**: Badger Red `#c5050c`, dark red `#9b0000`, warm-gray surfaces — with the official UW brand typefaces **Red Hat Display / Red Hat Text** (Google Fonts).
- Original animated SVG wordmark (no trademarked UW marks are used).
- Static site — no build step. HTML + CSS + ES modules only.

```
index.html          page shell (hero, tabs, forms, chat widget, footer)
css/style.css       full design system
assets/logo.svg     animated wordmark   assets/favicon.svg
js/api.js           fetch wrapper (HF_BASE points at the backend Space)
js/app.js           tab router, progress helpers, chat widget (SSE)
js/journal.js       journal tab (subject browse + manuscript analysis)
js/license.js       license tab (DOI-first rendering, verified banners)
js/repository.js    data tab
js/render.js        shared card/badge renderers
js/render_additions.js  Altmetric + related-works widgets
```

## Deploy

1. Push this repo to GitHub and enable **GitHub Pages** (deploy from `main`, root).
2. If your backend Space URL differs, change `HF_BASE` in `js/api.js`.

## Independence & attribution

ResearchPilot is an **independent tool** — not an official service of UW-Madison or UW-Madison Libraries. Ranking metrics from SCImago Journal Rank 2025 (© SCImago Lab, based on Scopus® data). DOI-level permissions from the OA.Works Permissions API. Always verify policies on [Open Policy Finder](https://openpolicyfinder.jisc.ac.uk) and repositories on [re3data](https://www.re3data.org) before deposit. UW-Madison APC-agreement details last verified May 2026.

**Privacy:** text you submit is sent to the OpenAI API to generate results and is not used to train OpenAI models (per OpenAI API policy). Do not submit confidential or sensitive information.

MIT licence.

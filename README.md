# 🧭 ResearchPilot — Frontend

**An independent AI publishing and open-access assistant for University of Wisconsin–Madison researchers.**

> Find the right journal. Understand your sharing rights. Give your research data a home.

**▶ Use it now: https://mohithnikesh1.github.io/ResearchPilot/** — no sign-in or installation needed.

Backend API: **https://mohithnikesh-researchpilot.hf.space** (FastAPI on a Hugging Face Docker Space — companion backend repo)

Version **3.0.0** · English-only interface · requires the matching 3.0.0 backend (`journal_discovery_v2` response schema).

---

## What it does

| Tool | What you get |
|---|---|
| 📰 **Find a journal** | Two modes. **Browse by subject** maps your subject to the closed SCImago/ASJC vocabulary (with visible spelling correction or nearest-category disclosure). **Analyse your manuscript** classifies your title and abstract, then ranks active journals from a verified Scopus × SCImago index (32,050 active journals). Every card shows an explainable fit score (not an acceptance probability), per-subject SJR quartiles with SCImago links, indexation status (new, renamed, discontinued…), access model, recent OpenAlex article evidence, a UW–Madison publisher-agreement *candidate* signal (never a waiver decision), journal website and author-guideline links, and an on-demand Jisc Open Policy Finder check. Compare up to five journals side by side, export CSV/BibTeX/RIS, draft a cover letter, and explore related works and citation chains. |
| 🛡️ **Share your article** | **With a DOI:** article-level self-archiving permissions from the OA.Works Permissions database (the data behind cOAlition S's Journal Checker Tool), evaluated against your chosen version, deposit location, licence and funder, plus a ShareYourPaper deposit link and an optional MINDS@UW holdings check. **With a journal name or ISSN:** the journal-level record from the authenticated Jisc Open Policy Finder API, with each policy option shown separately. Policy facts never come from the AI; anything not stated stays *unknown*. |
| 🗄️ **Find a data repository** | A two-step form (dataset details, then sharing requirements). The AI only selects entries from a curated registry of 24 repositories; every factual field is served from reviewed records. MINDS@UW and Dryad (UW–Madison membership) are offered when your requirements allow, and sensitive or personal data triggers explicit review warnings. |
| 💬 **Chat with ResearchPilot** | Streaming chat grounded in curated UW–Madison and scholarly-communication guidance (APC agreements, OA policy, metrics, RDM, FAIR data), with live Open Policy Finder data for journal-policy questions and one-click routes into the three tools. |

## Project layout

The live site is **one self-contained file**:

```
index.html   everything: inline CSS (#researchpilot-styles), config block
             (#researchpilot-config), app JavaScript (#researchpilot-code),
             embedded SVG logo/favicon, MIT licence header
```

Inside the script, a v1.8 "discovery" layer (`rbV18*` functions) overrides the older journal renderers; the licence, repository, chat and related-works code is shared.

`js/`, `css/` and `assets/` are **legacy files from the earlier multi-file version**. `index.html` does not load them, and editing them has no effect on the site.

## Configuration

All API calls use `apiBase` in the inline config block near the end of `index.html`:

```js
window.RESEARCHPILOT_CONFIG = Object.freeze({
  apiBase: "https://mohithnikesh-researchpilot.hf.space",
  model: "gpt-5.6-luna"   // kept for request compatibility; the backend chooses the model
});
```

Never put API keys or other secrets in this repository — they belong in the Hugging Face Space settings.

## Hosting

The site is hosted on **GitHub Pages** from the `main` branch (repository root) at https://mohithnikesh1.github.io/ResearchPilot/, and talks to the live backend at https://mohithnikesh-researchpilot.hf.space.

To publish an update:

1. Deploy any matching backend change first and confirm [`/api/health`](https://mohithnikesh-researchpilot.hf.space/api/health) reports `version: "3.0.0"` and `ready: true`.
2. Update `index.html` on `main`; GitHub Pages republishes it automatically.
3. If the page is ever served from a different origin, add that origin to `RESEARCHPILOT_ALLOWED_ORIGINS` in the Space settings.

## Design

- UW–Madison-inspired palette: primary red `#c5050c`, dark red `#9b0000`, warm neutral surfaces; system font stack (no external font or script downloads).
- Original SVG wordmark and favicon, embedded as data URIs. No trademarked UW marks are used.
- Static site with no build step and no external dependencies.
- Keyboard-accessible tabs (arrow keys, Home/End), managed focus in dialogs and step changes, and responsive layouts down to phone width.

## Independence and attribution

ResearchPilot is an **independent tool** — not an official service of UW–Madison or UW–Madison Libraries. Recommendations are decision support, not guarantees of acceptance, funding eligibility or permission to deposit.

- Journal metrics: SCImago Journal Rank 2025 (© SCImago Lab, based on Scopus® data), used under non-commercial terms with attribution.
- Article-level permissions: [ShareYourPaper Permissions](https://shareyourpaper.org/permissions) (OA.Works).
- Journal-level policies: [Jisc Open Policy Finder](https://openpolicyfinder.jisc.ac.uk), licensed CC BY-NC-ND 4.0.
- Journal and works metadata: [OpenAlex](https://openalex.org).
- Verify repositories at [re3data](https://www.re3data.org) and current APC agreements with [UW–Madison Libraries](https://www.library.wisc.edu/research-support/scholarly-communication/open-access/publishing-support/) (institutional guidance last reviewed September 2026).

**Privacy:** manuscript details, dataset descriptions and chat messages may be sent to OpenAI to provide AI assistance. OpenAlex receives subject keywords, not your unpublished title or abstract; policy checks send the DOI or journal identifiers to the relevant services. Do not submit confidential manuscripts or identifiable personal or health data.

## Licence

MIT — see [LICENSE](LICENSE).

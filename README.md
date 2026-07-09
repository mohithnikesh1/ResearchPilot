# 🧭 ResearchPilot — Frontend

Static frontend (GitHub Pages) for **ResearchPilot**, an AI publishing & open access assistant for researchers, with UW-Madison-specific guidance.

- **Live app:** https://mohithnikesh1.github.io/ResearchPilot/
- **Backend:** FastAPI on HuggingFace Spaces — set `HF_BASE` in `js/api.js` to your Space URL.

## Tabs
1. **Journal Submission** — browse 32,000+ journals by subject or analyse a manuscript (10 detailed matches + 20 quick matches), with SCImago-verified quartiles and a UW-Madison APC agreement badge.
2. **License Checking** — self-archiving policy by version (Preprint / AAM / VoR). Results are grounded in **live Open Policy Finder (Jisc) data** and clearly labelled *Verified* or *AI-generated — not verified*.
3. **Data Repository** — repository recommendations with FAIR alignment; Dryad and MINDS@UW surfaced first for UW-Madison researchers.

## Privacy & AI notice
Text submitted (titles, abstracts, dataset descriptions) is sent to the OpenAI API via the backend to generate results and is not used to train OpenAI models. Do not submit confidential or sensitive information. AI output can contain errors — always use the built-in verify links (SCImago, Open Policy Finder, DOAJ, OpenAlex, re3data, FAIRsharing).

## Attribution
Journal ranking data: SCImago Journal Rank 2025 (© SCImago Lab, based on Scopus® data by Elsevier). Policy data: Open Policy Finder (Jisc). Enrichment: OpenAlex.

## License
MIT — see [LICENSE](LICENSE).

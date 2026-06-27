# 🪱 Sandworm Overlay

A transparent, always-on-top desktop overlay for **Dune: Awakening** deep-desert
sand crawling. It runs a **phase-lock loop timer** that cycles once every **2:30**
— your safe crawl window before the worm aggros.

No start button: when you land, note where the marker is, and bail when it loops
back round to the same spot. One full lap is exactly 2:30, wherever you landed.

> ⚠️ **Disclaimer:** This is 100% AI-coded slop. I (the repo owner) have never read
> a single line of it and have no intention of starting. It was vibe-coded end to
> end by an LLM. Run it at your own risk — no warranty, no support, no idea. 🤖🏜️

The app lives in **[`sandworm-overlay/`](./sandworm-overlay)** — see its
[README](./sandworm-overlay/README.md) for controls, build steps, and tuning.

## Downloads

- **Tagged releases:** push a `v*` tag and GitHub Actions builds Windows + macOS
  installers into a draft Release.
- **Ad-hoc builds:** run the **build** workflow manually (Actions → build → Run
  workflow); installers are attached to the run as downloadable artifacts.

## Design mockups

The static HTML explorations that led to the final design:

- `sandcrawl-timer-mockups.html` — early trigger-based timer concepts
- `sandcrawl-timer-notrigger.html` — no-interaction concepts (read-the-future vs phase-lock)
- `sandcrawl-timer-phaselock.html` — the phase-lock dial + bar with position-memory aids

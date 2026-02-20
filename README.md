# TapIn — NFC Loyalty Check-in for Good Moves Studio

TapIn is an NFC-powered loyalty check-in system for [Good Moves Pilates Studio](https://www.goodmovesstudio.com) in Berlin. Customers tap their phone on an NFC tag at the studio to check in, earn stamps, and unlock free classes.

## What's in this repo

### Interactive Prototype
- **`tapin-prototype-standalone.html`** — Self-contained clickable prototype. Open in any browser to demo the full user journey. No build tools needed.
- **`tapin-interactive-prototype.jsx`** — React source for the redesigned prototype (Untitled UI + glassmorphism design system)

### Wireframes
- **`tapin-all-wireframes.jsx`** — Combined wireframes for all screens
- **`tapin-home-wireframe.jsx`** — Home screen wireframe
- **`tapin-j1-wireframe.jsx`** — Journey 1: First check-in
- **`tapin-j2-wireframe.jsx`** — Journey 2: Returning check-in
- **`tapin-j3-wireframe.jsx`** — Journey 3: Reward claim

### Earlier prototype iterations
- **`tapin-prototype.jsx`** — Original prototype
- **`tapin-prototype-interactive.jsx`** — Earlier interactive version
- **`tapin-wireframes.jsx`** — Earlier combined wireframes

### Design assets
- **`tapin-figma-svgs/`** — Exported SVGs (branded + wireframe versions)
- **`tapin-figma-prompt.md`** — Figma design prompt/spec

### Pitch decks
- **`TapIn-Pitch-GMS.pptx`** — GMS-branded pitch deck
- **`TapIn-Pitch.pptx`** — General pitch deck
- **`TapIn-Keynote.pptx`** — Keynote-style deck
- **`TapBack-Pitch-GMS.pptx`** / **`TapBack-Pitch.pptx`** — TapBack variant decks

## User Journey

1. **First visit** — Customer taps NFC, enters phone number, gets stamp 1/10
2. **Return visits** (2–9) — Instant check-in with progress tracking
3. **10th visit** — Free class earned! Link to Mindbody account to claim
4. **Book free class** — Choose from today's schedule, booked via Mindbody
5. **Cycle resets** — Stamp card resets, loyalty continues

## Tech Stack (planned)
- Rails 7 monolith with Hotwire (Stimulus + Turbo)
- PostgreSQL
- PWA (Progressive Web App)
- NFC Web API

## Quick Demo

Just open `tapin-prototype-standalone.html` in Chrome/Safari and click "Simulate NFC Tap" to walk through the full journey.

---

Built for Good Moves Pilates Studio, Berlin.

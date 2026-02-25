# Cowork Prompt: TapIn Native — iOS App Clips + Native Admin

## Project Setup

First, create a new project folder and private GitHub repo:

1. Create a folder at `~/code/rajpdp123/TapIn-Native`
2. Initialise a git repo with a `.gitignore` (Xcode + Node + Ruby)
3. Create a **private** GitHub repo at `rajpdp123/TapIn-Native` using the GitHub CLI (`gh repo create rajpdp123/TapIn-Native --private`)
4. Push the initial commit
5. Use this PAT for push access: `<GITHUB_PAT>` (scoped to rajpdp123 repos)

---

## Context: What TapIn Is

TapIn is an **NFC-powered loyalty check-in system** for [Good Moves Pilates Studio](https://www.goodmovesstudio.com) in Berlin. Customers tap their phone on an NFC tag at the studio reception to check in, earn loyalty stamps, and unlock free classes.

The studio uses **Mindbody** as its booking/POS system. ~40–60% of bookings come through aggregator platforms (Urban Sports Club, ClassPass, Gympass), which create separate Mindbody profiles with placeholder emails — meaning the studio can't directly contact these members. TapIn solves this by capturing a real phone number on the very first tap.

### The existing TapIn prototype (in the `rajpdp123/TapIn` repo) includes:
- A **customer-facing PWA** prototype (HTML/React, standalone) with the full user journey
- An **admin dashboard PWA** prototype (HTML/React) with 5 tabs: Home, Members, Mindbody, Messages, Loyalty
- Wireframes, SVGs, Figma prompts, and pitch decks
- All built with the **GMS Brand** design system: Terracotta Red `#B0482D`, Soft Beige `#EEDBC3`, Deep Blue `#001DA2`, font Quicksand, glassmorphism cards

You can reference `rajpdp123/TapIn` on GitHub for the exact designs, flows, and mock data.

---

## What TapIn Native Should Be

This is a **new version** of TapIn that uses **native iOS capabilities** instead of being PWA-only. Same concept, same studio, same brand — but built for a much better customer experience using Apple's ecosystem.

### Customer Side: App Clip (primary) + PWA (fallback)

**App Clip** is the star of the show. When a customer taps the NFC tag at reception:

1. **iOS users** → An App Clip launches instantly (no App Store download needed). The App Clip handles:
   - First visit: phone number entry → stamp 1/10
   - Return visits (2–9): instant check-in with haptic feedback, progress animation
   - 10th visit: reward celebration, name + email collection, Mindbody linking
   - Profile view: stamp card, visit history, preferences
   - The App Clip should feel **native iOS** — use SwiftUI, SF Symbols, haptics, smooth animations, native NFC reading

2. **Android / unsupported** → Falls back to the **PWA** (same design, web-based), which is what the existing TapIn prototype already is

The NFC tag should be configured to trigger the App Clip via an **App Clip Code** or universal link with the associated domain. Research the best way to configure NFC tags for App Clips (NDEF record with universal link).

### Admin Side: Native iOS App (iPad + iPhone)

The admin dashboard should be a **native SwiftUI app** (not a PWA), designed for the receptionist's iPad at the front desk but also usable on iPhone. It should have the same 5-tab structure as the existing admin prototype:

1. **Home** — Live tap-in feed (real-time via WebSocket or polling), today's stats cards, quick insights. Phone-only members (visits 1–9) shown with phone number + yellow badge.

2. **Members** — Search by name/phone/source, filter chips (All, Linked, Standalone, Pending, Conflict), member detail view, add member flow.

3. **Mindbody** — Connection status + setup flow, sync settings, and the **merge conflict resolution workflow**:
   - 3-phase flow: Review → Confirm → Resolved
   - 4 actions: Link, Merge MB profiles, Create new MB client, Skip
   - Each conflict shows the TapIn member alongside candidate Mindbody profiles
   - Confirm step with action summary before executing
   - Resolved state with undo option

4. **Messages** — Channel selector (SMS/Push), message composer, audience segmentation (All, Loyal 5+, New <3, Inactive 30d, Custom), scheduled/sent list with delivery stats.

5. **Loyalty** — Programme card with toggle, programme builder (name, threshold slider, reward type, expiry), programme history.

### Match Statuses (same logic as current TapIn):
- `linked` — Matched to Mindbody client via phone/email (typically direct bookers)
- `standalone` — No match, TapIn operates independently (aggregator members)
- `pending` — Awaiting email at visit 10 to retry match
- `conflict` — Multiple possible Mindbody matches, needs manual resolution

### Mindbody Matching Strategy (Option B + C):
- **Layer 1 (Phone Match)**: At first tap, attempt phone number match against Mindbody API. Direct bookers match immediately. Aggregator members fail (placeholder phone).
- **Layer 2 (Accept the Gap)**: For unmatched members, loyalty runs standalone. At visit 10, collect name + email and retry name-based match. If found, retroactively link. If not, TapIn remains primary record.

---

## GMS Brand Design System

All UI must follow the Good Moves Studio brand:

- **Colours**: Terracotta Red `#B0482D` (customer primary), Soft Beige `#EEDBC3` (backgrounds), Deep Blue `#001DA2` (admin accent), Light `#FBF6F1`
- **Font**: Quicksand (headings + display), system font (body)
- **Style**: Glassmorphism cards (frosted glass, subtle shadows), warm gradients, rounded corners, blob background shapes
- **Tone**: Warm, welcoming, Berlin-casual. Not corporate.
- **Admin app** uses blue as primary accent (vs red for customer)
- **Customer App Clip** uses red/terracotta as primary

---

## Deliverables for This Session

### Phase 1: Project scaffolding
- [ ] Create folder, git repo, push to private GitHub repo
- [ ] Set up Xcode project with two targets: App Clip + Admin App
- [ ] Configure associated domains for App Clip invocation
- [ ] README.md with project overview

### Phase 2: Customer App Clip
- [ ] SwiftUI App Clip target
- [ ] NFC tag reading (or App Clip invocation URL parsing)
- [ ] First visit flow: phone entry → confirmation → stamp 1
- [ ] Return visit flow: instant check-in → progress animation → haptic
- [ ] 10th visit flow: celebration → name/email collection → Mindbody link prompt
- [ ] Stamp card view with visit history
- [ ] GMS brand styling throughout (colours, Quicksand font, glassmorphism)
- [ ] Mock data for demo purposes (same realistic data as current prototype)

### Phase 3: Admin Native App
- [ ] SwiftUI app with 5-tab TabView (Home, Members, Mindbody, Messages, Loyalty)
- [ ] Home tab: live feed, stats cards, insights
- [ ] Members tab: search, filters, detail view, add member
- [ ] Mindbody tab: connection flow, sync settings, merge conflict resolution (3-phase, 4-action)
- [ ] Messages tab: composer, segmentation, scheduled list
- [ ] Loyalty tab: programme builder, history
- [ ] iPad-optimised layout (sidebar navigation on iPad, tab bar on iPhone)
- [ ] GMS brand styling with blue admin accent

### Phase 4: PWA Fallback
- [ ] Port the existing `tapin-prototype-standalone.html` into the project as a web fallback
- [ ] Ensure the NFC tag URL falls through to the PWA for non-iOS devices
- [ ] Host-ready (can be deployed to Railway or Vercel)

---

## Tech Stack

- **App Clip**: SwiftUI, iOS 17+, NFC (Core NFC), App Clip framework
- **Admin App**: SwiftUI, iOS 17+, iPadOS support, NavigationSplitView for iPad
- **Backend** (planned): Rails 7 + PostgreSQL (same as original TapIn plan) — for now use mock data
- **PWA fallback**: HTML + React (Babel standalone), same as existing prototype
- **API**: Mindbody API v6 (Base URL: `https://api.mindbodyonline.com/public/v6`, Site ID: `5746579`)

---

## Important Notes

- This is a **prototype/demo** phase — use mock data, not live API calls
- The App Clip has a **50MB size limit** — keep it lean
- App Clips can be invoked via NFC, QR code, Safari App Banner, or Maps — NFC is our primary trigger
- The admin app should work offline with cached data and sync when connected
- All prototypes should be self-contained and runnable without a backend
- Reference the existing TapIn repo (`rajpdp123/TapIn`) for exact UI patterns, mock data, and flows — don't reinvent, adapt to native

---

## Notion

Update the Good Moves Studio Notion Wiki with a new page documenting this project. Use the **direct Notion REST API** (not the MCP tools, they have a serialization bug). The API token is: `<NOTION_TOKEN>`. The Wiki database ID is `3042d27bec7c802d8856def02d9b1c37`. Always check the Notion Integrations page first before editing.

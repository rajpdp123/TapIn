# Claude Code Prompt: Rebuild TapIn PWA — New Flow

## Goal

Rebuild the TapIn customer PWA at `https://tapin-pwa-production.up.railway.app` to match the agreed design. The current app works but uses the **wrong flow** — it asks for the phone number before check-in. The correct flow is: **NFC tap → instant check-in → phone entry afterwards to save progress**. For returning users who already saved their phone, the experience becomes a **full dashboard** with progress ring, today's classes, and deals.

The existing repo is `rajpdp123/TapIn` (private, branch `main`). The backend (Express + SQLite on Railway) is already deployed and working. This rebuild focuses on **the customer frontend** (`public/index.html`) and adds a few backend enhancements to support the new flow.

**Important: Keep all existing files** — don't delete prototypes, SVGs, pitch decks, or the `polish-tapin-pwa-prompt.md`. Only modify `public/index.html`, `server.js`, `db.js`, and `schedule.js`.

---

## The Two Core Screens

Study these reference screenshots carefully — they are the source of truth for the UI.

### Reference 1: First Check-In Screen
![First Check-in](/tapin-figma-svgs/branded/reference-first-checkin.png)

The first-time experience after an NFC tap. No phone number was required. The user is already checked in:

- "Good Moves Studio" pill badge at top
- Large terracotta circle with white checkmark
- **"You're checked in!"** headline in bold
- **"Visit 1 of 10 — welcome to Good Moves!"** subtext
- **"YOUR PROGRESS"** section label (uppercase, tracked letter-spacing) with **"1/10"** in terracotta
- 5×2 stamp grid: stamp 1 filled (terracotta + white check), stamps 2–10 empty (soft beige)
- Terracotta progress bar (10% filled)
- **"SAVE YOUR PROGRESS"** divider (uppercase, tracked, grey line either side)
- **"Enter your phone number"** bold heading
- **"So we remember you next time. No app needed."** grey subtext
- Phone input: 🇩🇪 flag + "+49" prefix, placeholder "170 1234 5678"
- Privacy note: **"Only stored as a hash · no spam · text DELETE to remove"**
- **"→ Save & Continue"** button at bottom (muted/soft style, not a primary CTA)

**Key insight:** The entire screen is ONE scrollable page. The check-in confirmation and the phone entry are on the same screen — check-in at top, phone entry at bottom. The phone entry is optional but encouraged.

### Reference 2: Returning User Dashboard (Home)
![Home Dashboard](/tapin-figma-svgs/branded/reference-home-dashboard.png)

When a returning user (phone saved in localStorage) taps NFC:

- **"Welcome back"** small text at top left
- **"Good Moves"** large bold headline
- User **avatar** in top right (terracotta circle with initials, or first letter of name)
- **Circular progress ring**: "5 of 10" in the center, "56% COMPLETE" below, ring is terracotta on light beige track
- **Motivational text**: "Halfway! Keep that energy!" (dynamic based on progress — see Motivational Messages below)
- **Row of 10 mini stamp dots**: filled dots are terracotta, empty dots are light beige/grey
- **"🎁 Reward: Free class at visit 10 · 5 to go"** reward info line
- **"Today's Classes"** section header with **"View all →"** link
- Class schedule list: each row has time (07:00), class name (Morning Flow), teacher name (Tara), spots remaining (3 spots), and a **"Book"** button
- **"Deals & Perks"** section header
- Deal cards: "Early Bird Perk" (Popular tag) — "5 morning classes = 1 free coffee"; "Bring a Friend" (New tag)

---

## Customer Flow (Complete)

### Flow A: First-Time Visitor

1. **NFC tap → URL opens** → Splash screen (1.5s, terracotta background, "TAPIN" wordmark)
2. **Instant check-in** → App generates a device_id (UUID v4, stored in localStorage), POSTs to `/api/checkin` with `{ device_id }`. Server creates an anonymous member + records visit 1.
3. **First Check-In screen** (Reference 1) → Shows "You're checked in!" at top, stamp card showing 1/10, then "SAVE YOUR PROGRESS" section below with phone entry.
4. **User enters phone** (optional but encouraged) → POSTs to `/api/member/:id/link-phone` with `{ phone }`. Server links the phone to the anonymous member. Phone is saved to localStorage for next time.
5. **"→ Save & Continue"** → Transitions to a brief confirmation ("Saved! We'll remember you next time.") then fades to done.
6. **If user skips phone entry** → They close the browser. Next NFC tap creates a new anonymous device-based check-in. Their old progress is lost (this is the trade-off for skipping).

### Flow B: Returning Visitor (phone saved)

1. **NFC tap → URL opens** → Splash screen (1.5s)
2. **Auto-check-in** → App reads phone from localStorage, POSTs to `/api/checkin` with `{ phone }`. Server records the visit.
3. **Dashboard** (Reference 2) → Shows "Welcome back" + "Good Moves" header, circular progress ring, today's classes, deals. The check-in already happened — the dashboard is the confirmation.
4. If already checked in today → Dashboard still shows, but with a subtle toast/banner: "You checked in earlier today ✓" (not a blocking screen — just info).

### Flow C: 10th Visit — Reward

1. Check-in triggers visit 10 → server creates reward with verification code
2. **Celebration screen** → Terracotta background, confetti, "You earned a free class!" message, all 10 stamps filled
3. **Name + email form** → "So we can book your free class"
4. **Verification code display** → Large 6-digit code, "Show this to reception"
5. Stamp card resets to 0/10 for next cycle

### Flow D: Offline

1. NFC tap → no connection detected
2. **Offline screen** → "You're offline" with retry button
3. If cached data exists, show last known stamp card (greyed out)

---

## Backend Changes

### Database: Add device_id support

Add `device_id` column to `members` table (nullable, unique). A member can be identified by either `phone` or `device_id`. Phone takes precedence when both exist.

```sql
ALTER TABLE members ADD COLUMN device_id TEXT UNIQUE;
```

### Updated API Endpoints

**`POST /api/checkin`** — now accepts EITHER `{ phone }` OR `{ device_id }`
- If `phone` provided: look up by phone (existing flow)
- If `device_id` provided: look up by device_id; if not found, create new anonymous member
- Enforce same-day cooldown (Berlin timezone)
- Auto-associate class from schedule
- Return: `{ member, visit, visits, rewards, already_checked_in, reward_earned, reward }`

**`POST /api/member/:id/link-phone`** — NEW endpoint
- Body: `{ phone }` (normalised E.164)
- Links a phone number to an existing member (identified by member id)
- If that phone already belongs to another member, merge the accounts (keep the one with more visits, transfer visits from the other)
- Returns: updated member data

**`GET /api/schedule/today`** — ENHANCED
- Returns today's full class schedule with teacher names, time, and spots (hardcoded for MVP)
- Format: `[{ time, name, teacher, spots, bookable }]`

**`GET /api/deals`** — NEW endpoint
- Returns current deals/perks (hardcoded for MVP)
- Format: `[{ title, description, tag, icon }]`

All existing endpoints (`GET /api/member/:phone`, `POST /api/member/:phone/profile`, `GET /api/admin/feed`, `GET /api/admin/stats`, `POST /api/admin/reset`) remain unchanged.

### Enhanced Schedule Data

Update `schedule.js` to include teacher names and spots:

```javascript
const SCHEDULE = {
  1: [ // Monday
    { time: '07:00', name: 'Morning Flow', teacher: 'Tara', spots: 3 },
    { time: '09:30', name: 'Reformer Basics', teacher: 'Elena', spots: 1 },
    { time: '11:00', name: 'Reformer Intermediate', teacher: 'Petra', spots: 4 },
    { time: '16:00', name: 'Barre Sculpt', teacher: 'Maia', spots: 2 },
    { time: '17:30', name: 'Reformer All Levels', teacher: 'Elena', spots: 5 },
    { time: '19:00', name: 'Evening Flow', teacher: 'Tara', spots: 6 },
  ],
  // ... (same teachers/spots pattern for other days)
  6: [ // Saturday
    { time: '09:00', name: 'Weekend Reformer', teacher: 'Petra', spots: 2 },
    { time: '10:30', name: 'Barre & Stretch', teacher: 'Maia', spots: 4 },
    { time: '12:00', name: 'Open Reformer', teacher: 'Elena', spots: 6 },
  ],
  0: [ // Sunday
    { time: '10:00', name: 'Slow Flow', teacher: 'Tara', spots: 5 },
    { time: '11:30', name: 'Reformer Basics', teacher: 'Elena', spots: 3 },
  ],
};
```

### Hardcoded Deals (MVP)

```javascript
const DEALS = [
  {
    title: 'Early Bird Perk',
    description: '5 morning classes = 1 free coffee',
    tag: 'Popular',
    icon: '☕'
  },
  {
    title: 'Bring a Friend',
    description: 'Your friend\'s first class is free',
    tag: 'New',
    icon: '👯'
  },
];
```

---

## Frontend: Customer PWA (`public/index.html`)

Single HTML file. No build tools. All CSS and JS inline. Must load in under 2 seconds on 4G.

### Screen Structure

The PWA has these screens (shown/hidden via `.screen.active` class toggling):

1. **Splash** — 1.5s auto-advance, terracotta background
2. **First Check-In** — the combined check-in confirmation + phone entry (Reference 1)
3. **Dashboard** — returning user home with progress ring + classes + deals (Reference 2)
4. **Celebration** — 10th visit reward
5. **Reward Code** — verification code display
6. **My Card** — full stamp card + visit history
7. **Offline** — no connection state

### Design System (GMS Brand — use EXACT values)

**Colors:**
- Terracotta Red: `#B0482D` — primary, filled stamps, progress ring, accents
- Soft Beige: `#EEDBC3` — card backgrounds, empty stamps, warm neutral
- Deep Blue: `#001DA2` — text highlights, admin accent
- Light Background: `#FBF6F1` — page canvas
- Text Color: `#000044` — body text
- Card White: `rgba(255,255,255,0.72)` with `backdrop-filter: blur(16px)` — glassmorphism

**Typography:**
- Headlines: Quicksand (Google Fonts), weight 600/700 — rounded, warm feel (fallback for Nersans Three)
- Body: `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
- Labels like "YOUR PROGRESS" and "SAVE YOUR PROGRESS": uppercase, letter-spacing 2px, font-size 11px, color rgba(0,0,68,0.4)

**Graphic Elements:**
- Organic blob SVG shapes at page edges (terracotta on beige, ~15% opacity)
- Slightly cut off at edges, covering 30–40% of decorative area
- Generous rounded corners (16–20px for cards, full-round for circles)
- Glassmorphism cards with subtle shadows

**Animations:**
- Stamp fill: satisfying bounce (scale 0 → 1.2 → 1)
- Progress ring: animated stroke-dashoffset on SVG circle
- Screen transitions: 0.3s ease-in-out opacity/transform
- Confetti: multi-color particles on reward earn
- Haptic: `navigator.vibrate([50])` on check-in

### Screen 1: Splash

Terracotta Red `#B0482D` full background. "TAPIN" wordmark centered in Soft Beige `#EEDBC3`. Small "by Good Moves" subtitle. Organic blob shapes at edges (15% opacity). Auto-advances after 1.5s with fade-out.

### Screen 2: First Check-In (Reference 1 — detailed)

This is one scrollable screen with two sections:

**Top section — Check-in confirmation:**
- "Good Moves Studio" pill badge: beige background, terracotta text, rounded-full, centered
- Large terracotta circle (64px) with white SVG checkmark inside, subtle drop shadow
- "You're checked in!" — bold, ~24px, Quicksand, `#000044`
- "Visit X of 10 — welcome to Good Moves!" for first visit; "Visit X of 10 — keep moving!" for visits 2–9
- "YOUR PROGRESS" label: uppercase, tracked (letter-spacing 2px), `rgba(0,0,68,0.4)`, 11px
- "X/10" in terracotta, aligned right of the label
- Stamp grid: 5×2 grid in a glassmorphism card. Filled stamps = terracotta rounded square with white check. Empty stamps = soft beige rounded square with number. The newest stamp has a scale-bounce animation.
- Progress bar: terracotta fill on `rgba(0,0,68,0.06)` track, rounded, 6px height

**Divider:**
- "SAVE YOUR PROGRESS" — centered text with thin lines either side, uppercase, tracked, grey

**Bottom section — Phone entry:**
- "Enter your phone number" — bold, 18px, `#000044`
- "So we remember you next time. No app needed." — 14px, `rgba(0,0,68,0.4)`
- Phone input: glassmorphism card containing flag emoji 🇩🇪 + "+49" prefix (editable) + phone number field. `inputmode="tel"` for numeric keypad. Placeholder: "170 1234 5678"
- Privacy note: "Only stored as a hash · no spam · text DELETE to remove" — 12px, `rgba(0,0,68,0.3)`, centered
- "→ Save & Continue" button: full-width, muted style (NOT terracotta — use `rgba(0,0,68,0.06)` background with `#000044` text). This is intentionally low-key — the check-in was the main event, saving is optional.

### Screen 3: Dashboard (Reference 2 — detailed)

This replaces the old "returning visitor" screen entirely. It's a full-featured home screen:

**Header:**
- "Welcome back" — small text, 13px, `rgba(0,0,68,0.4)`, top left
- "Good Moves" — large bold headline, 28px, Quicksand 700, `#000044`, left-aligned
- User avatar — top right. Terracotta circle (40px) with white initials (first letter of name, or "?" if no name). If user has a name, show initials. If only phone, show last 2 digits.

**Progress section (hero):**
- Circular progress ring — SVG, ~120px diameter. Terracotta `#B0482D` filled arc on `rgba(0,0,68,0.06)` track. Stroke-width ~8px, round linecaps. Animated stroke-dashoffset on load.
- Center of ring: "X of 10" in bold, stacked (X large, "of 10" smaller)
- Below ring: "XX% COMPLETE" in small uppercase tracked text
- Below that: motivational message (see Motivational Messages section)
- Row of 10 mini stamp dots: filled = terracotta, empty = `rgba(0,0,68,0.1)`. Small circles, 8px each, 4px gap.
- Reward line: "🎁 Reward: Free class at visit 10 · X to go" — 13px, `rgba(0,0,68,0.5)`

**Today's Classes section:**
- Section header: "Today's Classes" bold left, "View all →" right (terracotta link)
- Class rows in a glassmorphism card: each row has:
  - Time: bold, terracotta, left-aligned (e.g. "07:00")
  - Class name: bold, `#000044` (e.g. "Morning Flow")
  - Teacher: lighter text, `rgba(0,0,68,0.4)` (e.g. "Tara · 3 spots")
  - "Book" button: small pill, terracotta outline style
- The class currently being attended (matched by check-in time) is highlighted with a subtle terracotta left border
- Classes are fetched from `GET /api/schedule/today`

**Deals & Perks section:**
- Section header: "Deals & Perks"
- Deal cards in glassmorphism: icon + title + description + tag pill
  - "Early Bird Perk" ☕ — "5 morning classes = 1 free coffee" — "Popular" tag (terracotta pill)
  - "Bring a Friend" 👯 — "Your friend's first class is free" — "New" tag (blue pill)
- Deals fetched from `GET /api/deals`

**Already checked in (returning same day):**
If the API returns `already_checked_in: true`, show a subtle toast/banner at top of dashboard: "You checked in earlier today for [class name] ✓" — terracotta background at ~10% opacity, dismissible. Don't block the dashboard.

### Screen 4: Celebration (10th Visit)

Full terracotta `#B0482D` background. Confetti animation (terracotta, blue, beige, gold particles falling). All 10 stamps shown filled (beige on terracotta inverse). Large "🎉" emoji. **"You earned a free class!"** in beige Quicksand headline. "10 visits completed — you're amazing!"

Form below: name and email fields on semi-transparent white cards. "So we can book your free class." Submit button: "Claim My Reward →" in beige with terracotta text.

### Screen 5: Reward Code

Light background. "🎫 Your Free Class Code" heading. Large 6-digit code in monospace, glassmorphism card (e.g. **"482 901"**). "Show this code to reception to book your free class." "Your stamp card has been reset — start collecting again!" "Done" button.

### Screen 6: My Card

Accessible from dashboard or check-in screen. Shows: member info, full stamp grid, visit history, unclaimed rewards with codes. "← Back" button.

### Screen 7: Offline

Cloud with slash icon. "You're offline" headline. "Please check your connection to check in." Retry button. Cached stamp card if available.

---

## Motivational Messages

Dynamic text based on stamp count. Show below the progress ring on the dashboard:

| Stamps | Message |
|--------|---------|
| 0 | "Fresh card — let's get moving!" |
| 1 | "Great start! Keep it up!" |
| 2 | "You're building a streak!" |
| 3 | "3 down, 7 to go!" |
| 4 | "Almost halfway there!" |
| 5 | "Halfway! Keep that energy!" |
| 6 | "More than halfway — you've got this!" |
| 7 | "3 more to go!" |
| 8 | "So close! Just 2 more!" |
| 9 | "One. More. Class. 🔥" |

---

## What to Change (and What NOT to)

### DO change:
- `public/index.html` — complete rewrite of the customer PWA frontend
- `server.js` — add `/api/member/:id/link-phone`, `/api/deals`, update `/api/checkin` to accept device_id, enhance `/api/schedule/today`
- `db.js` — add device_id column migration, update queries
- `schedule.js` — add teacher names and spots to schedule data

### DO NOT change:
- `public/admin.html` — keep the admin page as-is (it works)
- Any files in `tapin-figma-svgs/`, `tapin-prototype-standalone.html`, pitch decks, wireframes
- `polish-tapin-pwa-prompt.md`, `build-tapin-pwa-prompt.md` — keep for reference
- Railway deployment config, Dockerfile, package.json (unless adding a dependency)
- The admin API endpoints (`/api/admin/feed`, `/api/admin/stats`, `/api/admin/reset`)

### DO NOT break:
- The admin page at `/admin` must continue working
- Existing member data in the database (add device_id as nullable column, don't drop tables)
- The `/api/checkin` endpoint must still work with `{ phone }` (for admin-side or returning users)
- The cooldown logic (one check-in per calendar day per member, Berlin timezone)

---

## Deployment

After building, commit, push, and deploy:

```bash
cd ~/path-to/TapIn
git add -A
git commit -m "Rebuild TapIn PWA — check-in first flow + dashboard"
git push origin main
railway up
```

### Verify:
1. Open the URL on a phone (clear localStorage first)
2. Should see splash → instant check-in (stamp 1) → phone entry section below
3. Enter a phone → save → close browser
4. Re-open URL → should see dashboard with progress ring, today's classes, deals
5. Try checking in again same day → dashboard shows with "already checked in" toast
6. Open `/admin` → check-in shows in the live feed
7. The app loads fast, feels like a real product, matches the GMS brand

---

## Success Criteria

When done, the app should:
1. Check in the user **instantly** on NFC tap — no phone number required upfront
2. Show a beautiful check-in confirmation with stamp card and optional phone save
3. For returning users: show a **full dashboard** with circular progress ring, today's classes, and deals
4. Handle the 10th visit with celebration, reward code, and card reset
5. Work offline gracefully (clear message, cached data if available)
6. Match the reference screenshots pixel-for-pixel in layout and feel
7. Feel instant, warm, and rewarding — like the brand

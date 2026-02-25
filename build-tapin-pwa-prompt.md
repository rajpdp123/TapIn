# Claude Code Prompt: Build the Real TapIn PWA

## Goal

Turn the TapIn prototype into a **real, working PWA** deployed at `https://tapin-pwa-production.up.railway.app`. When a customer taps the NFC tag at Good Moves Studio reception, this URL opens in their phone browser and they can actually check in, earn loyalty stamps, and claim rewards.

The existing repo is `rajpdp123/TapIn` (private). It currently has a clickable prototype with mock data. Replace the deployment with a real working app.

---

## Architecture

### Backend: Express + SQLite (deployed on Railway)

Keep it simple — single Node.js service with SQLite for persistence. No separate database service needed. Railway already has the project set up (`tapin-pwa`, project ID: `ddc67cfa-4d5e-4cfb-b60c-99f884db04ff`).

**Data model:**
- `members` table: id, phone (unique, normalised E.164 format), name, email, visit_count, current_stamp_count, total_rewards_claimed, source, match_status, mindbody_client_id, created_at, updated_at
- `visits` table: id, member_id, checked_in_at, class_name, class_time
- `rewards` table: id, member_id, earned_at, claimed_at, reward_type, status, verification_code

**API endpoints:**
- `POST /api/checkin` — body: `{ phone }` → looks up member by phone, enforces cooldown (see below), increments visit, auto-associates class from schedule, returns member data + stamp count
- `POST /api/register` — body: `{ phone }` → creates new member, returns member data with stamp 1
- `GET /api/member/:phone` — returns member profile, visit history, reward status
- `POST /api/member/:phone/profile` — body: `{ name, email }` → updates profile (used at visit 10)
- `POST /api/reward/:id/claim` — marks reward as claimed, generates a 6-digit verification code
- `GET /api/schedule/today` — returns today's class schedule (hardcoded for MVP, Mindbody integration later)
- `GET /api/admin/feed` — returns today's check-ins (for admin dashboard later)
- `GET /api/admin/stats` — returns dashboard stats
- `GET /admin` — simple admin page showing today's live feed + stats (see Admin section below)

### Check-in Cooldown (Anti-abuse)

Prevent multiple check-ins in the same day by the same member:
- One check-in allowed per member per calendar day (Berlin timezone, Europe/Berlin)
- If a member tries to check in again the same day, return their existing check-in data with a friendly "You're already checked in today!" message instead of an error
- The cooldown is per calendar day, not 24 hours — so a 9pm check-in and a 7am next-day check-in are both valid

### Class Association

The check-in should automatically associate with a class based on timing:
- Maintain a hardcoded weekly schedule for MVP (Good Moves runs ~6 classes/day, mostly Reformer Pilates and Barre)
- When a check-in happens, find the class starting within ±30 minutes of the current time
- If exactly one match: auto-associate. If multiple matches or none: leave class as null (the check-in still counts)
- Store class_name and class_time on the visit record
- Show the associated class name on the check-in confirmation screen ("Checked in for Reformer Basics at 09:30!")

**Hardcoded schedule for MVP** (approximate Good Moves schedule, Berlin time):
- Mon–Fri: 07:00 Morning Flow, 09:30 Reformer Basics, 11:00 Reformer Intermediate, 16:00 Barre Sculpt, 17:30 Reformer All Levels, 19:00 Evening Flow
- Sat: 09:00 Weekend Reformer, 10:30 Barre & Stretch, 12:00 Open Reformer
- Sun: 10:00 Slow Flow, 11:30 Reformer Basics

### Frontend: Single-page PWA (HTML + vanilla JS)

One `index.html` that the NFC tag URL opens. No build tools, no framework — just HTML/CSS/JS that works instantly on any phone browser. Must be fast (loads in under 2 seconds on 4G).

**Customer flow:**

1. **NFC tap opens URL** → PWA loads

2. **Phone number screen** — "Welcome to Good Moves!" with phone input:
   - Numeric keypad optimised (`inputmode="tel"`)
   - Pre-filled country code +49 (editable for non-German numbers)
   - If returning visitor (localStorage has phone), show "Welcome back, [name or phone]!" with a large **"Check In"** button — single tap, no re-entry needed
   - If localStorage is cleared, they just re-enter phone — all data is server-side, nothing lost
   - Phone numbers normalised to E.164 format before any API call

3. **Check-in confirmation** — after successful check-in:
   - Haptic feedback via `navigator.vibrate([50])` if supported
   - Stamp animation (stamp fills in with satisfying bounce)
   - Shows current progress: "Stamp 4 of 10" with visual stamp card
   - Shows associated class: "Reformer Basics at 09:30" (or "General check-in" if no class matched)
   - If already checked in today: friendly "You're already checked in! ✓" screen showing their existing stamp count

4. **10th visit** — celebration screen:
   - Confetti animation + "You earned a free class!" message
   - Prompt for name + email (explain why: "So we can book your free class")
   - After submitting: show **verification code** (6 digits) and instruction: "Show this code to reception to book your free class"
   - The code is stored server-side and visible on the admin feed
   - Stamp card resets to 0/10 for the next cycle

5. **Stamp card view** — accessible anytime via a "My Card" link:
   - Visual 10-stamp grid showing filled/empty stamps
   - Visit history (date, class, time)
   - Any unclaimed rewards with their verification codes
   - Total visits across all cycles

**Returning visitor handling — be realistic about cookies:**
- Use localStorage to remember the phone number (faster than cookies, same limitation)
- The primary purpose is convenience (skip phone re-entry), NOT identity — the server is the source of truth
- If localStorage is unavailable or cleared: the experience still works perfectly, just requires phone entry
- NEVER show an error or broken state if localStorage fails — gracefully fall back to the phone entry screen
- Show a subtle "Remember me on this device" toggle on first registration (default: on)

### Offline behaviour — be honest:
- Service worker caches the app shell (HTML, CSS, JS, fonts, icons) for instant loading
- If the device is offline when they try to check in, show a clear, friendly message: "You're offline — please check your connection to check in" with a retry button
- Do NOT pretend check-ins work offline — they require the server
- The stamp card view CAN work offline if we cache the last known state in localStorage

---

## Reward Fulfilment

There's no Mindbody booking integration yet, so the reward claim flow works like this:

1. Customer earns reward at visit 10 → celebration screen
2. Customer enters name + email → system generates a **6-digit verification code** (e.g. "482901")
3. Customer sees: "Show this screen to reception to claim your free class" with the code displayed prominently
4. The admin feed shows the reward with the same code — receptionist can verify at a glance
5. Receptionist manually books the free class in Mindbody and marks it claimed in the admin feed
6. The customer's reward status updates to "Claimed"

This is intentionally low-tech for MVP. Mindbody API integration for direct booking comes later.

---

## Simple Admin Page

Build a lightweight admin page at `/admin` (no auth for MVP — this is an internal tool on the studio's network). This gives the receptionist immediate visibility:

- **Today's feed**: Live list of check-ins (newest first) showing name/phone, class, time, stamp count, and any reward codes
- **Stats bar**: Total check-ins today, unique members today, rewards earned today
- **Reward verification**: Any unclaimed rewards highlighted with their 6-digit codes so the receptionist can match them
- **Design**: Simple, clean, uses the blue admin accent (`#001DA2`) — doesn't need to be fancy, just functional and readable on an iPad at the desk

This replaces the need for the full admin PWA prototype in the short term.

---

## Design System (GMS Brand)

All UI must follow the Good Moves Studio brand exactly:

- **Colours**: Terracotta Red `#B0482D` (primary buttons, accents), Soft Beige `#EEDBC3` (background), Deep Blue `#001DA2` (text accents), Light `#FBF6F1` (card backgrounds), White `#FFFFFF`
- **Font**: Google Fonts — Quicksand (600/700 for headings), system font stack for body
- **Style**: Glassmorphism cards (`rgba(255,255,255,0.72)` with `backdrop-filter: blur(16px)`), warm gradients, rounded corners (16-24px), subtle shadows, decorative blob SVG backgrounds
- **Tone**: Warm, welcoming, Berlin-casual. Not corporate. Celebrate the customer.
- **Animations**: Smooth transitions (0.3s cubic-bezier), stamp fill animation, confetti on reward earn, subtle haptic via `navigator.vibrate()` on check-in

Reference the existing prototype at `tapin-prototype-standalone.html` in the repo for exact visual patterns. Match the look and feel — it's been carefully designed.

---

## File Structure

```
/
├── public/
│   ├── index.html          # Customer PWA (single page, all screens)
│   ├── admin.html          # Simple admin feed page
│   ├── manifest.json       # Web app manifest
│   ├── sw.js               # Service worker
│   └── icons/              # App icons (generate from GMS brand)
├── server.js               # Express server + API + serves static files
├── db.js                   # SQLite setup, migrations, queries
├── schedule.js             # Hardcoded class schedule + time-matching logic
├── package.json
├── Dockerfile
├── .gitignore
└── README.md               # Update with real app docs
```

---

## Deployment — Git Push + Railway (YOU MUST DO ALL OF THIS)

After building the app, you MUST commit, push to GitHub, and deploy to Railway. Do not stop after writing code — the app must be live.

### Step 1: Git commit and push

```bash
cd ~/path-to/TapIn
git add -A
git commit -m "Build real TapIn PWA with Express + SQLite backend"
git remote set-url origin https://rajpdp123:<GITHUB_PAT>@github.com/rajpdp123/TapIn.git
git push origin main
```

Replace `<GITHUB_PAT>` with the actual token. If the push is blocked by GitHub secret scanning, make sure no tokens are hardcoded in source files — use environment variables instead.

### Step 2: Railway setup

The Railway project already exists. Use the Railway CLI to link to it and deploy:

```bash
# Install if needed
brew install railway

# Login
railway login

# Link to the existing project
railway link --project ddc67cfa-4d5e-4cfb-b60c-99f884db04ff
```

### Step 3: Add volume for SQLite persistence

```bash
# Create a volume mounted at /data for the SQLite database
railway volume add --mount /data
```

### Step 4: Set environment variables

```bash
railway variables set DATABASE_PATH=/data/tapin.db TZ=Europe/Berlin
```

### Step 5: Deploy

```bash
railway up
```

Or if auto-deploy from GitHub is configured, the push in Step 1 triggers it automatically. Verify either way.

### Step 6: Verify

- Open `https://tapin-pwa-production.up.railway.app` — customer PWA should load
- Open `https://tapin-pwa-production.up.railway.app/admin` — admin feed should load
- Test a check-in: enter a phone number, verify stamp 1 appears
- Refresh the page, verify localStorage recognises you, one-tap check-in works
- Check `/admin` shows the check-in in the feed

If anything fails, check Railway logs (`railway logs`) and fix before finishing.

**SQLite durability note**: SQLite on Railway volumes is fine for MVP traffic (~20-50 check-ins/day). Enable WAL mode (`PRAGMA journal_mode=WAL`) for better concurrent read/write handling. If the service grows, migrate to Railway's Postgres addon — but don't over-engineer for now.

---

## What NOT to do

- Do NOT delete or modify the existing prototype files (`tapin-prototype-standalone.html`, `tapin-interactive-prototype.jsx`, wireframes, pitch decks, SVGs) — keep them in the repo
- Do NOT connect to Mindbody API yet — use mock/placeholder for matching status. Real integration comes later
- Do NOT touch any other Railway projects (gms-dashboard-production, gms-retention-dashboard-production, gms-teacher-hub-cron)
- Do NOT add authentication to the admin page yet — it's internal-only for MVP
- Do NOT over-engineer — this is an MVP. Simple, working, beautiful.

---

## Notion

After deployment, update the Good Moves Studio Notion Wiki:
- Update the "TapIn — Admin Dashboard & Matching Strategy" page (id: `30e2d27bec7c814682e0e8908cd1f402`) to note that the customer PWA is now a live working app with real backend
- Update the Integrations page "TAPIN PWA HOSTING" section with any new env vars, volume details, or admin URL
- Use the **direct Notion REST API** via curl (NOT the Notion MCP tools — they have a serialization bug). Token: `<NOTION_TOKEN>`. Wiki DB: `3042d27bec7c802d8856def02d9b1c37`.

---

## Success Criteria

When done, I should be able to:
1. Open `https://tapin-pwa-production.up.railway.app` on my phone
2. Enter my phone number → get stamp 1 with a satisfying animation and class association
3. Refresh the page → localStorage recognises me → one-tap check-in for stamp 2
4. Try to check in again same day → friendly "already checked in" message (no double-counting)
5. Repeat across days until stamp 10 → celebration + name/email entry + verification code
6. Open `/admin` on the studio iPad → see my check-ins in the live feed with the reward code
7. The app looks beautiful and matches the GMS brand exactly
8. It loads fast, handles offline gracefully (clear message, not a broken screen)
9. It feels like a real product, not a prototype

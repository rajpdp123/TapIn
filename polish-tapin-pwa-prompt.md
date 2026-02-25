# Claude Code Prompt: Polish TapIn PWA — Visual & Brand Alignment

## Context

The TapIn PWA is live at `https://tapin-pwa-production.up.railway.app` with a working Express + SQLite backend. All core functionality is solid — check-in, cooldown, class association, stamps, rewards, admin feed. **Do not touch the backend or API logic.** This prompt is purely about bringing the frontend HTML/CSS/JS up to the brand standard we designed.

The repo is `rajpdp123/TapIn` (private). The frontend files are `public/index.html` and `public/admin.html`.

Reference the SVG wireframes in `tapin-figma-svgs/branded/` — these are the design source of truth. Also reference `tapin-prototype-standalone.html` for visual patterns.

---

## What to fix (10 items, front-end only)

### 1. Add a splash screen (1.5 seconds)

When the page loads, show a full-screen splash BEFORE showing the phone entry or returning user screen.

- Full terracotta `#B0482D` background
- "TAPIN" wordmark centered in Soft Beige `#EEDBC3`, large bold Quicksand (36px+)
- Small "by Good Moves" subtitle beneath in beige at 50% opacity
- Subtle loading spinner (a thin beige ring rotating)
- Organic blob shapes at the edges (15% opacity beige on terracotta) — reuse the existing blob SVG paths from the page
- Auto-advances after 1.5s with a fade transition
- This sets the tone — it should feel like tapping Apple Pay, not loading a form

### 2. Fix the greeting — use "Hey Good Mover!"

The current welcome screen says "Welcome to Good Moves!" — change it to the brand greeting:

- Headline: **"Hey Good Mover!"** (not "Welcome to Good Moves!")
- Keep the wave emoji 👋
- Subtext: **"Enter your number to start collecting visits. Your 10th class is on us!"**
- Add a small pill badge above the headline: "Good Moves Pilates Studio" in a rounded rect with `rgba(176,72,45,0.08)` background and `#B0482D` text (see `tapin-03-j1-first-checkin.svg` line 21-22 for the exact pattern)

### 3. Replace the green checkbox emoji with branded check icon

The check-in confirmation uses ✅ (green emoji). Replace it everywhere with a **branded terracotta circle with white checkmark**:

```css
/* The check icon should be: */
.check-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #B0482D;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.check-icon::after {
  content: '✓';
  color: white;
  font-size: 36px;
  font-weight: 700;
}
```

Use this same pattern on the check-in confirmation, the already-checked-in screen, and anywhere else the green emoji currently appears. No green anywhere in the app — the palette is terracotta, beige, blue, and white only.

### 4. Add the class association blue pill badge

When a check-in matches a class, show the class name in a **blue pill badge** instead of plain grey text:

```css
.class-pill {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 12px;
  background: rgba(0, 29, 162, 0.08);
  color: #001DA2;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
}
```

- Matched class: `<span class="class-pill">Reformer Basics · 09:30</span>`
- No match (general check-in): `<span class="class-pill" style="background: rgba(0,0,68,0.06); color: rgba(0,0,68,0.5);">General check-in</span>` — grey variant, still a pill

The pill should appear directly below the "You're checked in!" headline, before the stamp card. See `tapin-03-j1-first-checkin.svg` lines 26-28 for the exact design.

### 5. Build the returning visitor "Welcome back" screen

When localStorage has a saved phone number, the app should NOT just pre-fill the phone input. Instead, show a completely different screen:

- Large 👋 emoji (same as current)
- **"Welcome back, Sarah!"** — use their name if available, otherwise **"Welcome back!"** with their phone shown smaller below
- Their current stamp progress shown as a compact horizontal row of mini stamps (filled terracotta, empty beige, about 22×22px each)
- A single large **"Check In"** button (terracotta, full width, 64px tall, 20px border-radius) — this is the hero action
- Below it: small grey text link **"Not Sarah? Switch account"** (or "Not you? Switch account" if no name) — tapping this clears localStorage and shows the phone entry screen
- Below that: **"View My Card →"** link in terracotta

This screen makes returning visitors feel recognised. One tap and they're done. See `tapin-12-returning-visitor.svg` for the exact layout.

### 6. Warm up the stamp card colours

The empty stamps currently look greyish/white. They should use the brand's Soft Beige:

```css
/* Empty stamp */
.stamp-empty {
  background: #EEDBC3;
  border: 2px solid rgba(0, 0, 68, 0.1);
  border-radius: 10px;
  color: rgba(0, 0, 68, 0.45);
}

/* Filled stamp */
.stamp-filled {
  background: #B0482D;
  border: 2px solid #B0482D;
  border-radius: 10px;
  color: #FFFFFF;
}
```

Also add a subtle scale animation on the most recently filled stamp — `transform: scale(1.08)` with a 0.3s transition when it appears.

### 7. Strengthen typography

Headlines should feel bolder and more confident:

- "You're checked in!" — `font-size: 24px; font-weight: 700; color: #000044; font-family: 'Quicksand', sans-serif;`
- "Hey Good Mover!" — same treatment, 28px
- "Welcome back, Sarah!" — 26px
- "You earned a free class!" — 28px on the terracotta celebration background
- Progress text ("Stamp 4 of 10") — `font-size: 14px; font-weight: 600; color: #B0482D;`
- "9 more until your free class!" — `font-size: 13px; color: rgba(0,0,68,0.55);`

Make sure Quicksand 600 and 700 weights are loaded from Google Fonts. The current headings may be loading but feel too light.

### 8. Improve the admin feed visual hierarchy

On `public/admin.html`:

**Avatar colours by member type:**
- Known members (have a name): Deep Blue `#001DA2` circle with white initials
- Phone-only members (no name yet): Soft Beige `#EEDBC3` circle with terracotta `#B0482D` "?" or first digits
- Reward earners: Terracotta `#B0482D` circle with beige initials

**Reward rows need highlighting:**
```css
.feed-item.reward {
  border-left: 4px solid #B0482D;
  background: rgba(176, 72, 45, 0.03);
}
.reward-code {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 8px;
  background: rgba(176, 72, 45, 0.1);
  color: #B0482D;
  font-family: 'SF Mono', 'Menlo', 'Consolas', monospace;
  font-weight: 700;
  font-size: 13px;
}
```

**New member badge:**
```css
.badge-new {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(0, 29, 162, 0.08);
  color: #001DA2;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}
```

**Phone number masking:**
Instead of showing full phone "+4915257664554", show "+49 152 ••• 4554" (show first 3 digits after country code, mask middle, show last 4).

**Add class name to each feed row** — the data is already in the API response (`class_name`), just display it. Format: "Reformer Basics · 09:30" in small grey text below the name/phone.

See `tapin-13-admin-feed.svg` for the full target design.

### 9. Add the "Already checked in" screen

When the cooldown triggers, the current screen probably just shows a message on the same check-in screen. Make it a distinct, friendly state:

- Same terracotta circle + white check icon (from fix #3)
- Headline: **"You're already checked in! ✓"** (the ✓ here is text, not emoji)
- Subtext: "You checked in earlier today for **Reformer Basics at 09:30**." (or "earlier today" if no class)
- Show their current stamp card (same as normal check-in screen)
- Tone: friendly, not an error. This person came to class — they just already tapped today.
- "My Card" link + "Done" button at bottom

See `tapin-09-already-checked-in.svg` for the layout.

### 10. Polish the reward verification code display

When a customer earns their 10th stamp and enters name/email, the verification code screen should be unmissable:

```css
.verification-code {
  font-family: 'SF Mono', 'Menlo', 'Consolas', monospace;
  font-size: 44px;
  font-weight: 700;
  color: #B0482D;
  letter-spacing: 6px;
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid rgba(176, 72, 45, 0.2);
  border-radius: 20px;
}
```

- Format the 6 digits with a space in the middle: "482 901" not "482901"
- Label above: "VERIFICATION CODE" in small caps, grey
- Below: "Show this code to reception to book your free class"
- Then: "Your stamp card has been reset — start collecting again!" in a blue info box

See `tapin-10-reward-verification.svg` for the exact layout.

---

## What NOT to change

- **Backend/API**: Do not modify `server.js`, `db.js`, `schedule.js`, or any API endpoints
- **Database schema**: Do not run any migrations or alter tables
- **File structure**: Keep `public/index.html` and `public/admin.html` as single files
- **Existing functionality**: Check-in flow, cooldown, class association, reward earning — all working, don't break them
- **Service worker**: Don't change caching strategy
- **Railway config**: Don't touch Dockerfile, env vars, or volumes
- **Other repo files**: Prototypes, SVGs, wireframes, prompts — leave them alone

---

## Design reference files

Look at these SVGs in the repo for exact visual targets:

| Screen | SVG reference |
|--------|--------------|
| Check-in confirmation | `tapin-figma-svgs/branded/tapin-03-j1-first-checkin.svg` |
| Reward celebration | `tapin-figma-svgs/branded/tapin-05-j3a-reward-claim.svg` |
| Already checked in | `tapin-figma-svgs/branded/tapin-09-already-checked-in.svg` |
| Verification code | `tapin-figma-svgs/branded/tapin-10-reward-verification.svg` |
| My Card view | `tapin-figma-svgs/branded/tapin-11-my-card.svg` |
| Returning visitor | `tapin-figma-svgs/branded/tapin-12-returning-visitor.svg` |
| Admin feed | `tapin-figma-svgs/branded/tapin-13-admin-feed.svg` |
| Offline state | `tapin-figma-svgs/branded/tapin-14-offline.svg` |

Also reference `tapin-prototype-standalone.html` for the overall GMS visual language.

---

## Deployment

After making changes:

```bash
cd ~/path-to/TapIn
git add public/index.html public/admin.html
git commit -m "Polish TapIn PWA — align frontend to GMS brand designs"
git remote set-url origin https://rajpdp123:<GITHUB_PAT>@github.com/rajpdp123/TapIn.git
git push origin main
```

Railway auto-deploys from the main branch. Verify at:
- `https://tapin-pwa-production.up.railway.app` — customer PWA
- `https://tapin-pwa-production.up.railway.app/admin` — admin feed

---

## Success criteria

After this polish pass, the app should:
1. Open with a 1.5s branded terracotta splash screen before anything else
2. Greet first-time visitors with "Hey Good Mover!" and the studio pill badge
3. Show returning visitors a "Welcome back, Sarah!" screen with one-tap check-in
4. Display a branded terracotta check icon (not green emoji) on confirmation
5. Show class names in blue pill badges on check-in confirmation
6. Have warm beige empty stamps (not grey/white) with the latest stamp subtly pulsing
7. Display the already-checked-in state as a friendly confirmation, not a generic message
8. Show verification codes in large monospace with proper formatting (space in middle)
9. Have admin feed rows with coloured avatars, reward highlighting, new member badges, and masked phone numbers
10. Feel premium and on-brand — warm, bold, alive. Like it was designed, not just coded.

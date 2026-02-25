# TapIn — Figma Design Prompt (GMS Branded)

Paste this into Figma Make, Figma AI, or any AI design tool.

---

Design a mobile-first Progressive Web App called **TapIn** — an NFC-powered loyalty check-in system for **Good Moves Pilates Studio** in Berlin Prenzlauer Berg. The app should feel instant, warm, and rewarding — like tapping Apple Pay. It has two sides: the **customer PWA** (opens from an NFC tap) and a **simple admin page** (used by the receptionist on an iPad).

## Brand System (use these EXACT values)

**Colors:**
- Primary: Terracotta Red `#B0482D` — hero backgrounds, accents, filled stamps, customer CTA buttons
- Soft Beige `#EEDBC3` — warm neutral, card backgrounds, secondary surfaces
- Deep Blue `#001DA2` — admin accent, text highlights, feature callouts
- Light Background `#FBF6F1` — page canvas, content backgrounds
- Card White `#FFFFFF` — glassmorphism card fills
- Text Color `#000044` — body text, dark UI elements

**Typography:**
- Headlines: Quicksand (600/700 weight, rounded, warm). Fallback: Nunito or Varela Round
- Body: System UI / Inter — clean and readable
- Hierarchy: Large bold headlines, comfortable body text at ~16px, small caps for labels

**Graphic Elements:**
- Organic blob-like SVG shapes in terracotta on beige (or vice versa)
- Cut them off at edges — don't contain them fully in frame
- Cover ~30-40% of decorative area
- Keep playful and dynamic, never covering key content
- Glassmorphism cards: `rgba(255,255,255,0.72)` with `backdrop-filter: blur(16px)`, subtle shadows

**Tone:** Warm, bold, alive, joyful. The brand greeting is "Hey Good Movers!"

---

## Customer PWA Screens (10 screens, iPhone 15 Pro frame — 393×852)

### Screen 1: Splash Screen
After NFC tap triggers the URL. Terracotta Red `#B0482D` full background. "TAPIN" wordmark centered in Soft Beige `#EEDBC3`, with a small "by Good Moves" subtitle beneath. Subtle loading spinner. Organic blob shapes at edges (15% opacity beige on terracotta). Auto-advances after 1.5s. Feel: instant, branded, confident.

### Screen 2: First-Time Visitor — Phone Number Entry
Light Background `#FBF6F1` canvas. Top: small pill badge "Good Moves Pilates Studio" in beige with terracotta text. Headline: "Hey Good Mover!" in large bold Quicksand. Subtext: "Enter your number to start collecting visits. Your 10th class is on us!" Phone input field with 🇩🇪 +49 prefix (editable), white card with rounded corners and beige border (turns terracotta when focused). `inputmode="tel"` numeric keypad. Arrow submit button in terracotta. Bottom toggle: "☑ Remember me on this device" (default on). Privacy note: "We only store your phone number. No spam, ever." Bottom: decorative blob shapes in beige/terracotta.

### Screen 3: Check-In Confirmation (Visit 4 of 10, with class)
Light Background. Large terracotta circle with white checkmark, animated in with satisfying bounce. Haptic feedback indicator. **"You're checked in!"** headline. **"Reformer Basics at 09:30"** — class name auto-associated from schedule, shown in a blue pill badge below the headline. Below: stamp card in a white rounded glassmorphism card. 10 squares in a 5×2 grid — first 4 filled (terracotta with white check), remaining 6 empty (light beige with numbers). The 4th stamp has a pulse/scale animation effect. Progress bar below: terracotta fill on beige track, 40% filled. Text: "Visit 4 of 10 — keep moving!" "My Card" link at bottom to view full history. "Done" button in terracotta.

### Screen 4: Check-In Confirmation (No class match)
Same as Screen 3 but instead of class name, shows **"General check-in"** in a grey pill badge. This appears when the check-in time doesn't match any scheduled class within ±30 minutes.

### Screen 5: Returning Visitor — One-Tap Check-In
This loads directly after splash for returning users (localStorage has their phone). Shows: "Welcome back, Sarah!" (or phone number if no name yet) in large Quicksand headline. Below: their current stamp progress (e.g. 6/10 filled). Single large **"Check In"** button in terracotta — one tap and done. Small "Not Sarah?" link below to switch to phone entry. Feel: instant, zero friction.

### Screen 6: Already Checked In Today
Light Background. Large terracotta circle with white checkmark. **"You're already checked in! ✓"** headline. Subtext: "You checked in earlier today for Reformer Basics at 09:30." Shows their current stamp card (e.g. 7/10). Tone is friendly, not an error — just confirming they're all set. "My Card" link, "Done" button.

### Screen 7: 10th Visit — Celebration
Full terracotta `#B0482D` background with confetti animation (terracotta, blue, beige, gold particles). Large beige circle with 🎉 emoji. **"You earned a free class!"** in beige Quicksand headline. "10 visits completed — you're amazing!" All 10 stamps filled (beige-on-terracotta inverse). Below the celebration: form fields for **name** and **email** on white cards. Explanation text: "So we can book your free class." Submit button in beige with terracotta text: "Claim My Reward →". This is the emotional peak — make it spectacular.

### Screen 8: Reward Verification Code
Light Background. Large circle with 🎁 icon. **"Your free class is ready!"** headline. Prominent 6-digit verification code displayed in a large, clear, monospace font inside a white glassmorphism card (e.g. **"482 901"** with space for readability). Instruction text: "Show this code to reception to book your free class." Below: "Your code is saved — you can find it anytime in My Card." A note: "Your stamp card has been reset — start collecting again!" "Done" button.

### Screen 9: Stamp Card / My Card View
Accessible via "My Card" link from any screen. Light Background. Top: Member name (or phone if no name), small pill showing total visits across all cycles (e.g. "24 total visits"). **Current stamp card** (same 5×2 grid as check-in screen). **Visit history** list below: each row shows date, class name, and time. Most recent first. **Unclaimed rewards** section (if any): highlighted card with the 6-digit verification code and "Show at reception" instruction. Clean, informational, reference screen.

### Screen 10: Offline State
Light Background. Cloud icon with slash through it. **"You're offline"** headline. "Please check your connection to check in." Friendly, clear, not scary. Retry button in terracotta: "Try Again". Below: if cached stamp card data exists, show the last known stamp card view (greyed slightly) with note "Last updated: Today 09:30".

---

## Admin Page Screens (2 screens, iPad landscape — 1194×834 and iPhone — 393×852)

### Screen 11: Admin Live Feed (iPad)
Clean white background with Deep Blue `#001DA2` header bar. "TapIn Admin" title in white Quicksand. **Stats bar** across the top: three cards showing "Check-ins Today" (23), "Unique Members" (18), "Rewards Earned" (2) — each in white cards with blue accent. **Live feed** below: scrollable list of today's check-ins (newest first). Each row shows: time (09:32), name or phone number ("Sarah M." or "+49 170..."), class ("Reformer Basics"), visit count ("Visit 7/10"), and stamp indicator. **Reward rows** are highlighted with a terracotta left border and show the 6-digit verification code prominently. New member rows have a blue "NEW" badge. Feed auto-refreshes. Clean, glanceable — designed for the receptionist's iPad at the front desk.

### Screen 12: Admin Live Feed (iPhone)
Same content as Screen 11 but in a single-column mobile layout. Stats as horizontal scroll cards at top. Feed rows stacked vertically. Optimised for quick glances on the owner's phone.

---

## Navigation

**Customer PWA:** No persistent nav bar — flow-based. "My Card" link accessible from check-in confirmation and as a floating button. Back arrows where needed. The flow is: NFC tap → Splash → Phone Entry (or One-Tap) → Check-In Confirmation → (optionally) My Card.

**Admin page:** Single page with stats bar + feed list. No tab navigation needed for MVP.

---

## Key Interactions to Prototype

**Customer flow:**
- NFC tap → Splash → Phone Entry (first-time) or One-Tap Check-In (returning)
- Phone input with numeric keypad → Check-in confirmation with stamp animation
- Stamps filling up progressively with satisfying bounce animation
- Class auto-association showing in blue pill badge
- Already-checked-in-today friendly confirmation
- Reward celebration with confetti on 10th visit
- Name/email form → 6-digit verification code display
- My Card view with visit history and reward codes

**Admin flow:**
- Page loads with today's stats + live feed
- Feed shows real-time check-ins with class names
- Reward entries highlighted with verification codes for receptionist matching
- Pull-to-refresh / auto-refresh

---

## Design Notes

- All corners generously rounded (16-20px for cards, full round for avatar badges)
- Generous whitespace — the app should breathe
- Transitions smooth and fast (0.3s cubic-bezier) — speed is everything
- The stamp card is the hero element — make it beautiful and satisfying
- Glassmorphism: `backdrop-filter: blur(16px)`, white cards at 72% opacity, subtle shadows
- The verification code must be extremely readable — large, clear, monospace
- Admin page is functional, not decorative — clean data display with blue accent
- Auto-layout everything for responsive behavior
- Haptic feedback annotation on check-in confirmation (navigator.vibrate)

# TapIn — Figma Prototype Prompt (GMS Branded)

Paste this into Figma Make, Figma AI, or any AI design tool:

---

Design a mobile-first Progressive Web App called **TapIn** — an NFC-powered loyalty check-in system for **Good Moves Pilates Studio** in Berlin Prenzlauer Berg. The app should feel instant, warm, and rewarding — like tapping Apple Pay.

## Brand System (use these EXACT values)

**Colors:**
- Primary: Terracotta Red `#B0482D` — hero backgrounds, accents, filled stamps
- Soft Beige `#EEDBC3` — warm neutral, card backgrounds, secondary surfaces
- Deep Blue `#001DA2` — bold accents, feature highlights
- Light Background `#FBF6F1` — page canvas, content backgrounds
- Text Color `#000044` — body text, dark UI elements

**Typography:**
- Headlines: Nersans Three (bold, rounded, playful display font). Fallback: Nunito or Varela Round
- Body: System UI / Inter — clean and readable
- Hierarchy: Large bold headlines, comfortable body text at ~16px, small caps for labels

**Graphic Elements:**
- Use organic, blob-like shapes in terracotta on beige (or vice versa)
- Cut them off at edges — don't contain them fully in frame
- Cover ~30-40% of decorative area
- Keep them playful and dynamic, never covering faces or key content

**Tone:** Warm, bold, alive, joyful. The brand greeting is "Hey Good Movers!"

---

## Screens to Design (6 screens, iPhone 15 Pro frame — 393×852)

### 1. Splash Screen
After NFC tap triggers the URL. Terracotta Red `#B0482D` full background. "TAPIN" wordmark centered in Soft Beige `#EEDBC3`, with a small "by Good Moves" subtitle beneath. Subtle loading spinner. Organic blob shapes at edges (15% opacity beige on terracotta). This screen auto-advances after 1.5 seconds. Feel: instant, branded, confident.

### 2. First-Time Visitor — Phone Number Entry
Light Background `#FBF6F1` canvas. Top: small pill badge "Good Moves Pilates Studio" in beige with terracotta text. Headline: "Hey Good Mover!" in large bold text (`#000044`). Subtext: "Enter your number to start collecting visits. Your 10th class is on us." Phone input field with 🇩🇪 +49 prefix, white card with rounded corners and beige border (turns terracotta when focused). Arrow submit button in terracotta. Privacy note: "We only store your phone number. No spam, ever." Bottom: decorative blob shapes in beige/terracotta.

### 3. Check-In Confirmation (Visit 4 of 10)
Light Background. Large terracotta circle with white checkmark, animated in. "You're checked in!" headline. "Visit 4 of 10. Keep moving!" subtext. Below: a stamp card in a white rounded card. 10 squares in a 5×2 grid — first 4 filled (terracotta with white check), remaining 6 empty (light beige with numbers). The 4th stamp is slightly larger (pulse effect). Progress bar below the grid: terracotta fill on beige track, 40% filled. "Done" button at bottom in terracotta.

### 4. Returning Visitor — Instant Check-In
Same as screen 3 but skip the phone entry. This screen loads directly after the NFC tap for returning users. The experience is: tap → splash → this screen. One tap, done.

### 5. Reward Unlocked (Visit 10 of 10)
Full terracotta `#B0482D` background. Large beige circle with 🎉 emoji. "You earned a free class!" in beige headline text. "10 visits completed — you're amazing. Show this at reception to redeem." All 10 stamps filled in the card (with beige-on-terracotta inverse styling). Confetti particles in terracotta, blue, beige, and gold falling from top. "Redeem Free Class" button in beige with terracotta text. This is the emotional peak — make it celebratory.

### 6. Studio Owner Dashboard
Dark header (`#000044`) with rounded bottom corners. "STUDIO DASHBOARD" label + "Good Moves" heading in beige. Three stat cards in a row: Today's Check-ins (23), Active Members (147), Rewards Redeemed (8). Each card is white with beige border, centered icon + large number + small label. Below: "Recent Check-ins" list — each row shows avatar initials (in colored rounded squares), name, time ago, and visit count. Highlight rows for reward redemptions (terracotta border) and new members (blue badge). Clean, glanceable — checked between classes.

---

## Navigation
Bottom tab bar with 4 items: New User (👤), Check-in (✓), Reward (🎁), Studio (📊). Active tab highlighted in terracotta. Frosted glass effect on the bar background.

## Key Interactions to Prototype
- Tap → Splash → Phone Entry (first-time) or Check-in (returning)
- Phone input → Check-in confirmation with stamp animation
- Stamps filling up progressively with each visit
- Reward celebration with confetti on 10th visit
- Tab navigation between all screens
- Dashboard pull-to-refresh gesture

## Design Notes
- All corners should be generously rounded (16-20px for cards, 44px for the phone frame)
- Generous whitespace — the app should breathe
- Transitions should feel smooth and fast — this lives and dies on speed
- The stamp card is the hero element — make it beautiful and satisfying
- Auto-layout everything for clean responsive behavior

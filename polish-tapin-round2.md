# TapIn PWA — Polish Round 2 (8 Fixes + Profile Screen + Notification Bubbles)

This prompt covers visual alignment to the agreed reference designs, a new Profile screen, and branded notification bubbles. Apply all changes to the existing codebase — do NOT rewrite files from scratch.

---

## Brand Reference (use these exact values)

| Token | Value |
|-------|-------|
| Terracotta | `#B0482D` |
| Beige | `#EEDBC3` |
| Deep Blue | `#001DA2` |
| Light BG | `#FBF6F1` |
| Text | `#000044` |
| Display font | `'Quicksand', system-ui, sans-serif` |
| Body font | `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` |

---

## Fix 1: "Save & Continue" button style (first check-in screen)

**File:** `public/index.html`

The button at line ~196 currently uses the `btn-muted` class (solid dark grey fill with checkmark). Change it to a ghost/outline style with an arrow icon to match the reference design.

**Current:**
```html
<button class="btn-muted fade-up d3" onclick="savePhone()">✓ Save & Continue</button>
```

**Change to:**
```html
<button class="btn btn-outline fade-up d3" style="width:100%;padding:16px;font-size:16px;border-radius:16px" onclick="savePhone()">→ Save & Continue</button>
```

---

## Fix 2: Blue class pill badge on check-in screen

**File:** `public/index.html`

After the "You're checked in!" heading and `ci-subtext` paragraph (around line 161), add a **blue pill badge** that shows the class name when available (e.g. "Morning Flow at 09:30") or "General check-in" in grey when no class matches.

**Add this element** right after the `<p id="ci-subtext">` line:
```html
<div id="ci-class-pill" style="display:none;margin-bottom:8px">
  <span id="ci-class-text" style="display:inline-block;padding:6px 14px;border-radius:100px;font-size:12px;font-weight:600;font-family:var(--font-display)"></span>
</div>
```

**In the JS** — inside the `renderFirstCheckin(data)` function (around line 444), after setting `ci-subtext`, add:
```js
const pill = document.getElementById('ci-class-pill');
const pillText = document.getElementById('ci-class-text');
if (data.visit && data.visit.class_name) {
  pillText.textContent = data.visit.class_name + ' at ' + data.visit.class_time;
  pillText.style.background = 'rgba(0,29,162,0.08)';
  pillText.style.color = '#001DA2';
  pill.style.display = 'block';
} else {
  pillText.textContent = 'General check-in';
  pillText.style.background = 'rgba(0,0,68,0.06)';
  pillText.style.color = 'rgba(0,0,68,0.45)';
  pill.style.display = 'block';
}
```

---

## Fix 3: Dashboard progress section layout — horizontal (ring left, text right)

**File:** `public/index.html`

Currently the progress card (inside `#screen-dash`, the `.glass` card around line 214) stacks the ring, text, dots, and reward vertically. The reference design has the **ring on the left** and **percentage + motivational text on the right**, side by side.

**Replace** the entire progress card `<div class="glass fade-up d1" style="padding:24px;text-align:center;margin-bottom:16px">` block (lines ~214–229) with:

```html
<div class="glass fade-up d1" style="padding:20px;margin-bottom:16px">
  <div style="display:flex;align-items:center;gap:20px">
    <!-- Ring -->
    <div style="position:relative;width:100px;height:100px;flex-shrink:0">
      <svg width="100" height="100" style="transform:rotate(-90deg)">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,68,0.06)" stroke-width="7"/>
        <circle id="ring" cx="50" cy="50" r="42" fill="none" stroke="#B0482D" stroke-width="7" stroke-linecap="round" stroke-dasharray="263.89" stroke-dashoffset="263.89" style="transition:stroke-dashoffset 1s var(--ease)"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <span id="ring-num" style="font-size:24px;font-weight:800;font-family:var(--font-display);line-height:1"></span>
        <span style="font-size:10px;color:rgba(0,0,68,0.4)">of 10</span>
      </div>
    </div>
    <!-- Text -->
    <div style="flex:1;min-width:0">
      <p id="ring-pct" style="font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(0,0,68,0.4);text-transform:uppercase;margin-bottom:4px"></p>
      <p id="ring-msg" style="font-size:15px;color:var(--text);font-weight:700;font-family:var(--font-display);line-height:1.3"></p>
    </div>
  </div>
  <div id="dash-dots" class="dots" style="margin-top:14px"></div>
  <p id="dash-reward" style="font-size:13px;color:rgba(0,0,68,0.5);margin-top:8px;text-align:center"></p>
</div>
```

**Important:** Update the ring JS to use the new radius. The circumference for r=42 is `2 * π * 42 = 263.89`. In `renderDashboard()`, find where `stroke-dasharray` and `stroke-dashoffset` are calculated and change:
- `ring.setAttribute('stroke-dasharray', circ)` where `circ = 2 * Math.PI * 42` (= 263.89)
- `ring.setAttribute('stroke-dashoffset', circ - (circ * pct))` where pct = stamps/10

If the code uses hardcoded `326.73` (the old r=52 circumference), replace all references with `263.89`.

---

## Fix 4: Avatar → user initials or profile icon

**File:** `public/index.html`

The `#dash-avatar` circle (line ~210) currently shows a random number. It should show:
- The user's **initials** if they have a name (e.g. "SM" for Sarah Miller)
- A **profile icon** (👤) if no name is set

In the `renderDashboard()` function, find where `dash-avatar` is set and change to:
```js
const avatar = document.getElementById('dash-avatar');
if (member.name) {
  const parts = member.name.trim().split(/\s+/);
  avatar.textContent = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
} else {
  avatar.textContent = '👤';
}
```

**Also** make the avatar clickable — it should navigate to the Profile screen:
```js
avatar.style.cursor = 'pointer';
avatar.onclick = () => show('profile');
```

---

## Fix 5: 🌱 icon next to % COMPLETE

**File:** `public/index.html`

In the `renderDashboard()` function, where `ring-pct` text is set (something like `document.getElementById('ring-pct').textContent = ...`), prepend a 🌱 emoji:

```js
document.getElementById('ring-pct').textContent = '🌱 ' + pct + '% COMPLETE';
```

(Where `pct` = `Math.round(stamps * 10)`.)

---

## Fix 6: "1 spots" → "1 spot" (grammar fix)

**File:** `public/index.html`

In the `renderDashboard()` function where class rows are rendered, find where `spots` is displayed (something like `` `${teacher} · ${spots} spots` ``). Change to:

```js
`${teacher} · ${spots} ${spots === 1 ? 'spot' : 'spots'}`
```

Also check `schedule.js` — if spots is returned as a number, the comparison works directly. If it's a string, use `parseInt(spots) === 1`.

---

## Fix 7: Blue notification bubbles

**File:** `public/index.html`

### 7a. New CSS for blue notification bubble

Replace the existing `.toast` CSS (line ~90) with a notification bubble system. Keep the old toast as a fallback, but add a new blue bubble:

```css
/* Notification bubble */
.notif{position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);z-index:200;
  background:var(--blue);color:var(--white);padding:12px 24px;border-radius:16px;
  font-size:14px;font-weight:600;font-family:var(--font-display);
  box-shadow:0 8px 24px rgba(0,29,162,0.25);
  transition:transform .4s var(--ease),opacity .4s var(--ease);opacity:0;pointer-events:none;
  max-width:340px;text-align:center}
.notif.show{transform:translateX(-50%) translateY(0);opacity:1}
.notif.success{background:var(--blue)}
.notif.info{background:rgba(0,29,162,0.9)}
```

### 7b. New HTML element

Add after the existing toast div (line ~151):
```html
<div id="notif" class="notif"></div>
```

### 7c. New JS function

Add a `showNotif()` function alongside (or replacing) the existing `showToast()`:

```js
function showNotif(msg, duration = 3000) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}
```

### 7d. Use the blue notification for key actions

Replace `showToast(...)` calls with `showNotif(...)` for these events:
- **After check-in (first time):** `showNotif('✓ You're checked in!')` — call this in the first-time checkin flow, right before showing the checkin screen
- **After saving phone:** `showNotif('📱 Progress saved!')` — in the `savePhone()` success handler (currently shows toast "Saved! We'll remember you next time.")
- **Already checked in today:** `showNotif('✓ Already checked in today')` — in the returning user flow when `data.already_checked_in` is true
- **Cached data fallback:** keep as the subtle terracotta toast: `showToast('Showing cached data — check your connection')`

---

## Fix 8: Profile screen (new screen)

This is a **new screen** that the dashboard avatar links to. It shows the user's profile info with editable fields.

### 8a. New HTML screen

Add this screen block after the `#screen-card` closing div (after line ~322):

```html
<!-- ════ SCREEN: PROFILE ════ -->
<div id="screen-profile" class="screen">
  <div style="width:100%;max-width:380px">
    <!-- Header -->
    <div class="fade-up" style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <button onclick="goHome()" style="background:none;border:none;font-size:14px;color:var(--red);font-weight:600;font-family:var(--font-display);cursor:pointer">← Back</button>
    </div>

    <!-- Avatar + title -->
    <div class="fade-up" style="text-align:center;margin-bottom:24px">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--beige);border:2px solid rgba(176,72,45,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:28px">👤</div>
      <h1 style="font-size:20px">Your Profile</h1>
      <p style="font-size:12px;color:rgba(0,0,68,0.45)">Complete your info for a personalised experience</p>
    </div>

    <!-- Completion bar -->
    <div class="fade-up d1" style="background:rgba(176,72,45,0.08);border-radius:10px;padding:10px 16px;margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div class="pbar" style="flex:1;margin-right:12px"><div id="prof-bar" class="fill" style="width:20%"></div></div>
        <span id="prof-count" style="font-size:11px;font-weight:700;color:var(--red)">1/5</span>
      </div>
    </div>

    <!-- Fields card -->
    <div class="glass fade-up d1" style="padding:0;overflow:hidden;margin-bottom:20px">
      <!-- Phone (verified) -->
      <div style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--beige)">
        <span style="font-size:18px;margin-right:12px">📱</span>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;color:rgba(0,0,68,0.4);text-transform:uppercase;letter-spacing:1px">Phone</div>
          <div id="prof-phone" style="font-size:13px;font-weight:600;color:var(--text)"></div>
        </div>
        <div style="width:22px;height:22px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center"><span style="color:white;font-size:12px">✓</span></div>
      </div>

      <!-- Name -->
      <div id="prof-name-row" style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--beige);cursor:pointer" onclick="editProfileField('name')">
        <span style="font-size:18px;margin-right:12px">👤</span>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;color:rgba(0,0,68,0.4);text-transform:uppercase;letter-spacing:1px">Name</div>
          <div id="prof-name" style="font-size:13px;color:var(--beige);font-style:italic">Add your name</div>
        </div>
        <span style="font-size:12px;font-weight:600;color:var(--red)">Add →</span>
      </div>

      <!-- Email -->
      <div id="prof-email-row" style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--beige);cursor:pointer" onclick="editProfileField('email')">
        <span style="font-size:18px;margin-right:12px">✉️</span>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;color:rgba(0,0,68,0.4);text-transform:uppercase;letter-spacing:1px">Email</div>
          <div id="prof-email" style="font-size:13px;color:var(--beige);font-style:italic">Add your email</div>
        </div>
        <span style="font-size:12px;font-weight:600;color:var(--red)">Add →</span>
      </div>

      <!-- Birthday -->
      <div id="prof-bday-row" style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--beige);cursor:pointer" onclick="editProfileField('birthday')">
        <span style="font-size:18px;margin-right:12px">🎂</span>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;color:rgba(0,0,68,0.4);text-transform:uppercase;letter-spacing:1px">Birthday</div>
          <div id="prof-bday" style="font-size:13px;color:var(--beige);font-style:italic">Add for a birthday surprise</div>
        </div>
        <span style="font-size:12px;font-weight:600;color:var(--red)">Add →</span>
      </div>

      <!-- Preferred Class -->
      <div id="prof-class-row" style="display:flex;align-items:center;padding:16px 20px;cursor:pointer" onclick="editProfileField('preferred_class')">
        <span style="font-size:18px;margin-right:12px">🧘</span>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;color:rgba(0,0,68,0.4);text-transform:uppercase;letter-spacing:1px">Preferred Class</div>
          <div id="prof-pref" style="font-size:13px;color:var(--beige);font-style:italic">e.g. Morning Flow, Barre</div>
        </div>
        <span style="font-size:12px;font-weight:600;color:var(--red)">Add →</span>
      </div>
    </div>

    <!-- Explainer -->
    <div class="fade-up d2" style="background:rgba(176,72,45,0.06);border:1px solid rgba(176,72,45,0.1);border-radius:12px;padding:14px 16px;margin-bottom:24px">
      <p style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px">Why we ask</p>
      <p style="font-size:12px;color:rgba(0,0,68,0.5);line-height:1.5">Your name and email help us link visits to Mindbody. Birthday lets us surprise you.</p>
    </div>
  </div>
</div>
```

### 8b. Profile edit inline modal

When a user taps a field row, show a simple inline input. Add this JS:

```js
function editProfileField(field) {
  const labels = {
    name: 'Your name',
    email: 'Email address',
    birthday: 'Birthday (DD.MM)',
    preferred_class: 'Preferred class type'
  };
  const inputTypes = {
    name: 'text',
    email: 'email',
    birthday: 'text',
    preferred_class: 'text'
  };
  const current = member?.[field] || '';
  const val = prompt(labels[field], current);
  if (val === null) return; // cancelled

  // Save to server
  const phone = member?.phone || localStorage.getItem('tapin_phone');
  if (!phone) return;

  fetch('/api/member/' + encodeURIComponent(phone) + '/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [field]: val })
  })
  .then(r => r.json())
  .then(data => {
    if (data.member) {
      member = data.member;
      localStorage.setItem('tapin_member', JSON.stringify(member));
      renderProfile();
      showNotif('✓ Updated!');
    }
  })
  .catch(() => showNotif('Could not save — try again'));
}

function renderProfile() {
  if (!member) return;

  // Phone
  const ph = member.phone || '';
  document.getElementById('prof-phone').textContent = ph ? ph.replace(/(\d{3})(\d+)(\d{2})/, '+49 $1 •••• $3') : 'Not set';

  // Name
  const nameEl = document.getElementById('prof-name');
  const nameAction = document.querySelector('#prof-name-row span:last-child');
  if (member.name) {
    nameEl.textContent = member.name;
    nameEl.style.color = 'var(--text)';
    nameEl.style.fontStyle = 'normal';
    nameAction.textContent = 'Edit →';
  }

  // Email
  const emailEl = document.getElementById('prof-email');
  const emailAction = document.querySelector('#prof-email-row span:last-child');
  if (member.email) {
    emailEl.textContent = member.email;
    emailEl.style.color = 'var(--text)';
    emailEl.style.fontStyle = 'normal';
    emailAction.textContent = 'Edit →';
  }

  // Birthday
  const bdayEl = document.getElementById('prof-bday');
  const bdayAction = document.querySelector('#prof-bday-row span:last-child');
  if (member.birthday) {
    bdayEl.textContent = member.birthday;
    bdayEl.style.color = 'var(--text)';
    bdayEl.style.fontStyle = 'normal';
    bdayAction.textContent = 'Edit →';
  }

  // Preferred class
  const prefEl = document.getElementById('prof-pref');
  const prefAction = document.querySelector('#prof-class-row span:last-child');
  if (member.preferred_class) {
    prefEl.textContent = member.preferred_class;
    prefEl.style.color = 'var(--text)';
    prefEl.style.fontStyle = 'normal';
    prefAction.textContent = 'Edit →';
  }

  // Completion bar
  let filled = 1; // phone always counts
  if (member.name) filled++;
  if (member.email) filled++;
  if (member.birthday) filled++;
  if (member.preferred_class) filled++;
  document.getElementById('prof-bar').style.width = (filled * 20) + '%';
  document.getElementById('prof-count').textContent = filled + '/5';
}
```

### 8c. Backend: support new profile fields

**File:** `db.js` — add columns `birthday` and `preferred_class` to the members table (use the same migration pattern as the rebuild). These are nullable TEXT columns.

**File:** `server.js` — update the `POST /api/member/:phone/profile` endpoint to accept `birthday` and `preferred_class` in addition to existing `name` and `email`.

---

## Don't touch

- Admin page — no changes needed
- `schedule.js` — no changes (teacher/spots already added in rebuild)
- Celebration, reward code, my card, offline screens — all fine
- Service worker — no changes
- The beige gradient background and organic blob shapes — keep as-is

---

## Testing checklist

1. Open `/reset` → get first check-in screen → see blue class pill badge (or grey "General check-in")
2. "Save & Continue" button is outline style with arrow (→)
3. After saving phone, blue notification bubble pops down from top: "📱 Progress saved!"
4. Reload page → dashboard loads with ring on LEFT, text on RIGHT
5. Avatar shows 👤 (no name) or initials (if name set)
6. 🌱 icon visible next to "% COMPLETE"
7. Class with 1 spot says "1 spot" (not "1 spots")
8. Tap avatar → Profile screen opens with fields
9. Edit a field (e.g. name) → saves, blue notification "✓ Updated!"
10. Already-checked-in-today → blue notification bubble "✓ Already checked in today"

---

## Deployment

After all changes, commit and push to `main`:
```bash
git add -A && git commit -m "Polish round 2: profile screen, blue notifications, 6 visual fixes"
git push origin main
```

Then deploy:
```bash
railway up
```

Verify at: https://tapin-pwa-production.up.railway.app/reset

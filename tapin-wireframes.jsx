import { useState } from "react";

const W = {
  bg: "#F5F5F5", card: "#FFFFFF", border: "#DDDDDD",
  text: "#333333", light: "#999999", filled: "#BBBBBB",
  empty: "#EEEEEE", darkBg: "#E8E8E8",
};
const font = "'Inter', system-ui, sans-serif";

const journeyColors = { "1": "#3D7B5F", "2": "#5577AA", "3": "#AA7755" };
const journeyLabels = {
  "1": "Journey 1 · First Check-in",
  "2": "Journey 2 · Progressive Check-ins",
  "3": "Journey 3 · Reward & Redemption",
};

// ─── Reusable Components ────────────────────────────

function Phone({ children, label, journeyId }) {
  const color = journeyColors[journeyId];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {/* Journey badge */}
      <div style={{
        padding: "3px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700,
        fontFamily: font, letterSpacing: 0.8, textTransform: "uppercase",
        background: color, color: "#fff",
      }}>
        Journey {journeyId}
      </div>
      <div style={{
        width: 280, height: 580, borderRadius: 32, border: `2px solid ${W.border}`,
        background: W.bg, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}>
        {/* Status bar */}
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${W.border}` }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: W.border }} />
        </div>
        <div style={{ height: 536, overflowY: "auto" }}>{children}</div>
      </div>
      <div style={{ fontSize: 11, color: color, fontFamily: font, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>
        {label}
      </div>
    </div>
  );
}

function StampGrid({ filled, total = 10 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          aspectRatio: "1", borderRadius: 8, border: `1.5px solid ${W.border}`,
          background: i < filled ? W.filled : W.empty,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontFamily: font, color: i < filled ? W.card : W.light, fontWeight: 600,
        }}>
          {i < filled ? "✓" : i + 1}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, max = 10 }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: W.empty, marginTop: 10 }}>
      <div style={{ height: "100%", borderRadius: 3, background: W.filled, width: `${(value / max) * 100}%` }} />
    </div>
  );
}

function WireButton({ children, bold }) {
  return (
    <div style={{
      width: "100%", padding: "12px 0", borderRadius: 10,
      border: bold ? `2px solid ${W.text}` : `1.5px solid ${W.border}`,
      background: W.card, textAlign: "center", fontSize: 13,
      fontWeight: bold ? 700 : 600, fontFamily: font, color: W.text, cursor: "pointer",
    }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// JOURNEY 1: FIRST CHECK-IN
// Customer taps NFC for the first time.
// TapIn doesn't know them yet — captures phone number.
// ═══════════════════════════════════════════════════

function J1_PhoneEntry() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      {/* Studio badge */}
      <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "4px 10px", borderRadius: 20, border: `1px solid ${W.border}`, fontSize: 10, color: W.light, fontFamily: font }}>
        Studio Name
      </div>

      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: W.text, fontFamily: font, lineHeight: 1.2 }}>Welcome!</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: W.text, fontFamily: font, lineHeight: 1.2 }}>Enter your number</div>
      </div>

      <div style={{ fontSize: 12, color: W.light, fontFamily: font, lineHeight: 1.5 }}>
        We'll use this to track your visits. Your 10th class is free.
      </div>

      {/* Phone input */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${W.border}`, background: W.card,
      }}>
        <span style={{ fontSize: 12, color: W.light, fontFamily: font }}>+49</span>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: W.empty }} />
        <div style={{ width: 32, height: 32, borderRadius: 8, background: W.filled, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: W.card }}>→</div>
      </div>

      <div style={{ fontSize: 9, color: W.light, fontFamily: font }}>
        We only store your phone number. No spam.
      </div>

      <div style={{ flex: 1 }} />

      {/* Blob placeholders */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", opacity: 0.25 }}>
        <div style={{ width: 80, height: 60, borderRadius: "50% 40% 50% 60%", background: W.border }} />
        <div style={{ width: 60, height: 50, borderRadius: "40% 50% 60% 50%", background: W.border }} />
      </div>
    </div>
  );
}

function J1_FirstCheckin() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, height: "100%" }}>
      <div style={{ height: 24 }} />

      <div style={{
        width: 64, height: 64, borderRadius: "50%", border: `2px solid ${W.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: W.filled,
      }}>✓</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: W.text, fontFamily: font }}>You're checked in!</div>
        <div style={{ fontSize: 13, color: W.light, fontFamily: font, marginTop: 4 }}>Visit 1 of 10 — welcome!</div>
      </div>

      <div style={{ width: "100%", padding: 16, borderRadius: 14, border: `1.5px solid ${W.border}`, background: W.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>Your Progress</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>1/10</span>
        </div>
        <StampGrid filled={1} />
        <ProgressBar value={1} />
      </div>

      <div style={{ fontSize: 11, color: W.light, fontFamily: font }}>9 more visits to your free class!</div>

      <div style={{ flex: 1 }} />
      <WireButton>Done</WireButton>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// JOURNEY 2: PROGRESSIVE CHECK-INS
// Visits 2–9. TapIn recognises them instantly.
// No phone entry — one tap, done.
// ═══════════════════════════════════════════════════

function J2_InstantCheckin() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, height: "100%" }}>
      <div style={{ height: 12 }} />

      <div style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${W.border}`, fontSize: 10, color: W.light, fontFamily: font }}>
        Welcome back — instant check-in
      </div>

      <div style={{
        width: 64, height: 64, borderRadius: "50%", border: `2px solid ${W.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: W.filled,
      }}>✓</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: W.text, fontFamily: font }}>You're checked in!</div>
        <div style={{ fontSize: 13, color: W.light, fontFamily: font, marginTop: 4 }}>Visit 7 of 10 — keep going!</div>
      </div>

      <div style={{ width: "100%", padding: 16, borderRadius: 14, border: `1.5px solid ${W.border}`, background: W.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>Your Progress</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>7/10</span>
        </div>
        <StampGrid filled={7} />
        <ProgressBar value={7} />
      </div>

      <div style={{ fontSize: 11, color: W.light, fontFamily: font }}>3 more visits to your free class!</div>

      <div style={{ flex: 1 }} />
      <WireButton>Done</WireButton>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// JOURNEY 3: REWARD & REDEMPTION
// The 10th visit. Celebration → auto-credit →
// stamp reset → optional email capture.
// ═══════════════════════════════════════════════════

function J3_RewardUnlocked() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, height: "100%", background: W.darkBg }}>
      <div style={{ height: 24 }} />

      {/* Celebration placeholder */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%", border: `2px dashed ${W.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color: W.light, fontFamily: font, textAlign: "center",
      }}>confetti<br />animation</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: W.text, fontFamily: font }}>Free class earned!</div>
        <div style={{ fontSize: 12, color: W.light, fontFamily: font, marginTop: 4, lineHeight: 1.5 }}>
          10 visits completed — you're amazing.
        </div>
      </div>

      {/* Full stamp card */}
      <div style={{ width: "100%", padding: 16, borderRadius: 14, border: `1.5px solid ${W.border}`, background: W.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>Complete!</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>10/10</span>
        </div>
        <StampGrid filled={10} />
        <ProgressBar value={10} />
      </div>

      {/* Auto-credit confirmation */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 12,
        border: `1.5px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: W.filled, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: W.card, flexShrink: 0 }}>✓</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: W.text, fontFamily: font }}>Free class added to your account</div>
          <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 2 }}>Credited automatically via Mindbody</div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <WireButton bold>Show at Reception →</WireButton>
    </div>
  );
}

function J3_Confirmed() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, height: "100%" }}>
      <div style={{ height: 24 }} />

      <div style={{
        width: 56, height: 56, borderRadius: "50%", border: `2px solid ${W.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
      }}>🎁</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: W.text, fontFamily: font }}>You're all set</div>
        <div style={{ fontSize: 12, color: W.light, fontFamily: font, marginTop: 4, lineHeight: 1.5 }}>
          Your free class is ready. Book your next session on Mindbody or Urban Sports Club.
        </div>
      </div>

      {/* Reset stamp card */}
      <div style={{
        width: "100%", padding: 16, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card, textAlign: "center",
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Stamp card reset
        </div>
        <StampGrid filled={0} />
        <ProgressBar value={0} />
        <div style={{ fontSize: 11, color: W.light, fontFamily: font, marginTop: 10 }}>
          See you for the next 10!
        </div>
      </div>

      {/* Email upsell */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 12,
        border: `1px dashed ${W.border}`, background: W.card,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 4 }}>
          Want studio updates?
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{
            flex: 1, padding: "8px 10px", borderRadius: 8,
            border: `1px solid ${W.border}`, background: W.bg,
          }}>
            <div style={{ height: 8, width: "60%", borderRadius: 4, background: W.empty }} />
          </div>
          <div style={{
            padding: "8px 12px", borderRadius: 8, background: W.filled,
            fontSize: 11, fontWeight: 600, color: W.card, fontFamily: font,
            display: "flex", alignItems: "center",
          }}>Save</div>
        </div>
        <div style={{ fontSize: 9, color: W.light, fontFamily: font, marginTop: 4 }}>
          Optional · add your email for event invites
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <WireButton>Done</WireButton>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════
export default function TapInWireframes() {
  const [view, setView] = useState("all");

  const screens = [
    { id: "1a", label: "Phone Entry", component: <J1_PhoneEntry />, journey: "1" },
    { id: "1b", label: "Check-in (1/10)", component: <J1_FirstCheckin />, journey: "1" },
    { id: "2",  label: "Instant Check-in (7/10)", component: <J2_InstantCheckin />, journey: "2" },
    { id: "3a", label: "Reward Unlocked (10/10)", component: <J3_RewardUnlocked />, journey: "3" },
    { id: "3b", label: "Confirmed + Reset", component: <J3_Confirmed />, journey: "3" },
  ];

  const filtered = view === "all" ? screens : screens.filter(s => s.journey === view);

  const filters = [
    { id: "all", label: "All 5 Screens" },
    { id: "1", label: "Journey 1" },
    { id: "2", label: "Journey 2" },
    { id: "3", label: "Journey 3" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "40px 20px", fontFamily: font }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: W.text, margin: "0 0 8px" }}>TapIn — Wireframes</h1>
        <p style={{ fontSize: 13, color: W.light, margin: "0 0 16px" }}>Step 3 · Lo-fi wireframes — layout and structure, no branding</p>

        {/* Journey legend */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
          {["1", "2", "3"].map(j => (
            <div key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: journeyColors[j] }} />
              <span style={{ fontSize: 11, color: W.text, fontFamily: font }}>{journeyLabels[j]}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setView(f.id)} style={{
              padding: "6px 14px", borderRadius: 20,
              border: `1.5px solid ${view === f.id ? W.text : W.border}`,
              background: view === f.id ? W.text : W.card,
              color: view === f.id ? W.card : W.text,
              fontSize: 12, fontWeight: 600, fontFamily: font, cursor: "pointer",
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Screens ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "center", alignItems: "flex-start" }}>
        {/* Add journey group separators when viewing all */}
        {view === "all" ? (
          <>
            {/* Journey 1 */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 700 }}>
                <div style={{ height: 1, flex: 1, background: W.border }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: journeyColors["1"], fontFamily: font, textTransform: "uppercase", letterSpacing: 1.5 }}>
                  Journey 1 · First Check-in
                </span>
                <div style={{ height: 1, flex: 1, background: W.border }} />
              </div>
              <div style={{ fontSize: 11, color: W.light, fontFamily: font, textAlign: "center", marginTop: -12 }}>
                Customer taps NFC for the first time → enters phone number → visit 1 logged
              </div>
              <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
                {/* Arrow between screens */}
                <Phone label="Phone Entry" journeyId="1"><J1_PhoneEntry /></Phone>
                <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: W.border }}>→</div>
                <Phone label="Check-in (1/10)" journeyId="1"><J1_FirstCheckin /></Phone>
              </div>
            </div>

            {/* Journey 2 */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 700 }}>
                <div style={{ height: 1, flex: 1, background: W.border }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: journeyColors["2"], fontFamily: font, textTransform: "uppercase", letterSpacing: 1.5 }}>
                  Journey 2 · Progressive Check-ins
                </span>
                <div style={{ height: 1, flex: 1, background: W.border }} />
              </div>
              <div style={{ fontSize: 11, color: W.light, fontFamily: font, textAlign: "center", marginTop: -12 }}>
                Visits 2–9 · TapIn recognises them instantly · no phone entry · one tap, done
              </div>
              <div style={{ display: "flex", gap: 28, justifyContent: "center" }}>
                <Phone label="Instant Check-in (7/10)" journeyId="2"><J2_InstantCheckin /></Phone>
              </div>
            </div>

            {/* Journey 3 */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 700 }}>
                <div style={{ height: 1, flex: 1, background: W.border }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: journeyColors["3"], fontFamily: font, textTransform: "uppercase", letterSpacing: 1.5 }}>
                  Journey 3 · Reward & Redemption
                </span>
                <div style={{ height: 1, flex: 1, background: W.border }} />
              </div>
              <div style={{ fontSize: 11, color: W.light, fontFamily: font, textAlign: "center", marginTop: -12 }}>
                Visit 10 · celebration · free class auto-credited to Mindbody · stamp card resets
              </div>
              <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
                <Phone label="Reward Unlocked (10/10)" journeyId="3"><J3_RewardUnlocked /></Phone>
                <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: W.border }}>→</div>
                <Phone label="Confirmed + Reset" journeyId="3"><J3_Confirmed /></Phone>
              </div>
            </div>
          </>
        ) : (
          filtered.map(s => (
            <Phone key={s.id} label={s.label} journeyId={s.journey}>
              {s.component}
            </Phone>
          ))
        )}
      </div>

      {/* ── Flow Summary ── */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "24px", background: W.card, borderRadius: 12, border: `1px solid ${W.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 16 }}>Flow Summary</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { j: "1", flow: "NFC Tap → Phone Entry → Check-in (1/10)", note: "Captures phone number. Links to their USC/Mindbody ghost account." },
            { j: "2", flow: "NFC Tap → Instant Check-in (n/10)", note: "Zero friction. Stamps fill up visit by visit. This is the most common screen." },
            { j: "3", flow: "NFC Tap → Reward (10/10) → Confirmed + Reset", note: "Free class auto-credited to Mindbody. Show at reception as backup. Stamp card resets. Optional email capture." },
          ].map(item => (
            <div key={item.j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
                background: journeyColors[item.j], display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: font,
              }}>{item.j}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: W.text, fontFamily: font }}>{item.flow}</div>
                <div style={{ fontSize: 11, color: W.light, fontFamily: font, marginTop: 2 }}>{item.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Key insight */}
        <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 8, background: "#F8F8F8", border: `1px solid ${W.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 4 }}>Why this matters</div>
          <div style={{ fontSize: 11, color: W.light, fontFamily: font, lineHeight: 1.6 }}>
            Most customers come via Urban Sports Club with ghost Mindbody accounts (name only). TapIn captures real contact details and merges them back — giving the studio a direct relationship with their regulars for the first time.
          </div>
        </div>
      </div>
    </div>
  );
}

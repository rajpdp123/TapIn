import { useState } from "react";

// ─── Wire palette (greyscale — no branding yet) ───
const W = {
  bg: "#F5F5F5", card: "#FFFFFF", border: "#DDDDDD",
  text: "#333333", light: "#999999", filled: "#BBBBBB",
  empty: "#EEEEEE", darkBg: "#E8E8E8",
};
const font = "'Inter', system-ui, sans-serif";
const J2 = "#5577AA";

// ─── Reusable Components ───

function Phone({ children, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        padding: "3px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700,
        fontFamily: font, letterSpacing: 0.8, textTransform: "uppercase",
        background: J2, color: "#fff",
      }}>Journey 2</div>
      <div style={{
        width: 300, height: 600, borderRadius: 36, border: `2px solid ${W.border}`,
        background: W.bg, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${W.border}` }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: W.border }} />
        </div>
        <div style={{ height: 556, overflowY: "auto" }}>{children}</div>
      </div>
      <div style={{ fontSize: 11, color: J2, fontFamily: font, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>
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
          aspectRatio: "1", borderRadius: 8,
          border: `1.5px solid ${i < filled ? W.filled : W.border}`,
          background: i < filled ? W.filled : W.empty,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontFamily: font,
          color: i < filled ? W.card : W.light, fontWeight: 600,
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

// ═══════════════════════════════════════════════════
// SINGLE SCREEN: INSTANT CHECK-IN
// Returning customer taps NFC → TapIn recognises
// their phone number → instant check-in → stamp
// card updates → done. Zero friction.
// This is the MOST COMMON screen in the product.
// ═══════════════════════════════════════════════════

function J2_InstantCheckin({ visitNumber }) {
  const remaining = 10 - visitNumber;
  const messages = {
    2: "great start!",
    3: "you're on a roll!",
    4: "almost halfway!",
    5: "halfway there!",
    6: "keep it up!",
    7: "keep going!",
    8: "so close!",
    9: "one more to go!",
  };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, height: "100%" }}>
      <div style={{ height: 8 }} />

      {/* Instant badge */}
      <div style={{
        padding: "4px 12px", borderRadius: 20,
        border: `1px solid ${W.border}`, fontSize: 10,
        color: W.light, fontFamily: font,
      }}>
        Welcome back — instant check-in
      </div>

      {/* Check mark */}
      <div style={{
        width: 60, height: 60, borderRadius: "50%",
        border: `2px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, color: W.filled,
      }}>✓</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: W.text, fontFamily: font }}>
          You're checked in!
        </div>
        <div style={{ fontSize: 13, color: W.light, fontFamily: font, marginTop: 4 }}>
          Visit {visitNumber} of 10 — {messages[visitNumber] || "keep going!"}
        </div>
      </div>

      {/* Stamp card */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>
            Your Progress
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>
            {visitNumber}/10
          </span>
        </div>
        <StampGrid filled={visitNumber} />
        <ProgressBar value={visitNumber} />
      </div>

      <div style={{ fontSize: 11, color: W.light, fontFamily: font }}>
        {remaining} more visit{remaining > 1 ? "s" : ""} to your free class!
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        width: "100%", padding: "14px 0", borderRadius: 10,
        border: `2px solid ${W.text}`, background: W.text,
        color: W.card, textAlign: "center", fontSize: 14,
        fontWeight: 700, fontFamily: font,
      }}>
        Done
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN LAYOUT
// Shows the same screen at different visit stages
// ═══════════════════════════════════════════════════

export default function J2Wireframe() {
  const [selectedVisit, setSelectedVisit] = useState(7);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "40px 20px", fontFamily: font }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: W.text, margin: "0 0 6px" }}>
          TapIn — Journey 2: Progressive Check-ins
        </h1>
        <p style={{ fontSize: 13, color: W.light, margin: "0 0 4px" }}>
          Step 3 · Lo-fi wireframe — single screen, visits 2–9
        </p>
      </div>

      {/* Journey description */}
      <div style={{
        maxWidth: 540, margin: "0 auto 24px", padding: 16, borderRadius: 12,
        background: W.card, border: `1px solid ${W.border}`, textAlign: "center",
      }}>
        <div style={{ fontSize: 12, color: W.text, fontFamily: font, lineHeight: 1.7 }}>
          <strong>Scenario:</strong> Returning customer taps NFC → TapIn recognises their phone number →
          instant check-in → stamp card fills up → done. Zero friction.
          This is the most common screen in the product.
        </div>
      </div>

      {/* Visit selector */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
        {[2, 3, 4, 5, 6, 7, 8, 9].map(v => (
          <button key={v} onClick={() => setSelectedVisit(v)} style={{
            width: 36, height: 36, borderRadius: 10,
            border: `1.5px solid ${selectedVisit === v ? J2 : W.border}`,
            background: selectedVisit === v ? J2 : W.card,
            color: selectedVisit === v ? "#fff" : W.text,
            fontSize: 13, fontWeight: 700, fontFamily: font, cursor: "pointer",
          }}>
            {v}
          </button>
        ))}
        <span style={{ alignSelf: "center", fontSize: 10, color: W.light, fontFamily: font, marginLeft: 4 }}>
          ← tap to preview visit
        </span>
      </div>

      {/* ── Single screen ── */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Phone label={`Instant Check-in (${selectedVisit}/10)`}>
          <J2_InstantCheckin visitNumber={selectedVisit} />
        </Phone>
      </div>

      {/* ── Flow Summary ── */}
      <div style={{
        maxWidth: 540, margin: "48px auto 0", padding: 20, background: W.card,
        borderRadius: 12, border: `1px solid ${W.border}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 12 }}>
          Screen Breakdown
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Top", desc: "\"Welcome back — instant check-in\" badge. No phone entry needed." },
            { label: "Middle", desc: "Check-in confirmation + stamp card with progress. Visit count and motivational message update each visit." },
            { label: "Bottom", desc: "\"Done\" button. Customer puts phone away and walks into class." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{
                padding: "2px 6px", borderRadius: 4, flexShrink: 0,
                background: J2, fontSize: 8, fontWeight: 700,
                color: "#fff", fontFamily: font, marginTop: 1,
              }}>{item.label}</div>
              <span style={{ fontSize: 11, color: W.light, fontFamily: font, lineHeight: 1.6 }}>{item.desc}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 10, borderRadius: 8, background: "#F8F8F8", border: `1px solid ${W.border}` }}>
          <div style={{ fontSize: 11, color: W.light, fontFamily: font, lineHeight: 1.6 }}>
            <strong style={{ color: W.text }}>Why this matters:</strong> This is the screen 80% of customers see 80% of the time.
            One tap, instant recognition, stamp fills up, done. The entire interaction takes under 3 seconds.
            The motivational message changes each visit to keep it fresh.
          </div>
        </div>
      </div>
    </div>
  );
}

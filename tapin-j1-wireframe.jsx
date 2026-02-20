import { useState } from "react";

// ─── Wire palette (greyscale — no branding yet) ───
const W = {
  bg: "#F5F5F5", card: "#FFFFFF", border: "#DDDDDD",
  text: "#333333", light: "#999999", filled: "#BBBBBB",
  empty: "#EEEEEE", darkBg: "#E8E8E8",
};
const font = "'Inter', system-ui, sans-serif";
const J1 = "#3D7B5F";

// ─── Reusable Components ───

function Phone({ children, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        padding: "3px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700,
        fontFamily: font, letterSpacing: 0.8, textTransform: "uppercase",
        background: J1, color: "#fff",
      }}>Journey 1</div>
      <div style={{
        width: 300, height: 600, borderRadius: 36, border: `2px solid ${W.border}`,
        background: W.bg, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${W.border}` }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: W.border }} />
        </div>
        <div style={{ height: 556, overflowY: "auto" }}>{children}</div>
      </div>
      <div style={{ fontSize: 11, color: J1, fontFamily: font, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>
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
// SINGLE SCREEN: CHECK-IN + PHONE ENTRY
// Customer taps NFC → lands here → sees check-in
// confirmation → enters phone number to save progress.
// All on one screen. Phone is required to proceed.
// ═══════════════════════════════════════════════════

function J1_SingleScreen() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, height: "100%" }}>
      {/* Studio badge */}
      <div style={{
        padding: "4px 10px", borderRadius: 20,
        border: `1px solid ${W.border}`, fontSize: 10, color: W.light, fontFamily: font,
      }}>
        Studio Name
      </div>

      {/* Check-in confirmation */}
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        border: `2px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, color: W.filled,
      }}>✓</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: W.text, fontFamily: font }}>
          You're checked in!
        </div>
        <div style={{ fontSize: 12, color: W.light, fontFamily: font, marginTop: 2 }}>
          Visit 1 of 10 — welcome!
        </div>
      </div>

      {/* Stamp card */}
      <div style={{
        width: "100%", padding: 12, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>
            Your Progress
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>1/10</span>
        </div>
        <StampGrid filled={1} />
        <ProgressBar value={1} />
      </div>

      {/* Divider */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ height: 1, flex: 1, background: W.border }} />
        <span style={{ fontSize: 9, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>
          Save your progress
        </span>
        <div style={{ height: 1, flex: 1, background: W.border }} />
      </div>

      {/* Phone entry — required */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: W.text, fontFamily: font }}>
          Enter your phone number
        </div>
        <div style={{ fontSize: 10, color: W.light, fontFamily: font, lineHeight: 1.5 }}>
          So we remember you next time. No app needed.
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 14px", borderRadius: 10,
          border: `1.5px solid ${W.border}`, background: W.card,
          marginTop: 2,
        }}>
          <span style={{ fontSize: 12, color: W.light, fontFamily: font }}>🇩🇪 +49</span>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: W.empty }} />
        </div>

        <div style={{ fontSize: 9, color: W.light, fontFamily: font }}>
          Only stored as a hash · no spam · text DELETE to remove
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Submit — requires phone to proceed */}
      <div style={{
        width: "100%", padding: "14px 0", borderRadius: 10,
        border: `2px solid ${W.text}`, background: W.text,
        color: W.card, textAlign: "center", fontSize: 14,
        fontWeight: 700, fontFamily: font,
      }}>
        Save & Continue →
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════════════

export default function J1Wireframe() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "40px 20px", fontFamily: font }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: W.text, margin: "0 0 6px" }}>
          TapIn — Journey 1: First Check-in
        </h1>
        <p style={{ fontSize: 13, color: W.light, margin: "0 0 4px" }}>
          Step 3 · Lo-fi wireframe — single screen
        </p>
      </div>

      {/* Journey description */}
      <div style={{
        maxWidth: 540, margin: "0 auto 32px", padding: 16, borderRadius: 12,
        background: W.card, border: `1px solid ${W.border}`, textAlign: "center",
      }}>
        <div style={{ fontSize: 12, color: W.text, fontFamily: font, lineHeight: 1.7 }}>
          <strong>Scenario:</strong> New customer taps NFC → sees they're checked in (visit 1) →
          enters phone number to save progress → done.
          All on one screen. Phone is required to continue.
        </div>
      </div>

      {/* ── Single screen ── */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Phone label="First Check-in">
          <J1_SingleScreen />
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
            { label: "Top", desc: "Check-in confirmation — ✓ icon, \"You're checked in!\", visit 1 of 10" },
            { label: "Middle", desc: "Stamp card — 1/10 filled, progress bar" },
            { label: "Bottom", desc: "Phone entry — required to save progress. \"Save & Continue\" button." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{
                padding: "2px 6px", borderRadius: 4, flexShrink: 0,
                background: J1, fontSize: 8, fontWeight: 700,
                color: "#fff", fontFamily: font, marginTop: 1,
              }}>{item.label}</div>
              <span style={{ fontSize: 11, color: W.light, fontFamily: font, lineHeight: 1.6 }}>{item.desc}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 10, borderRadius: 8, background: "#F8F8F8", border: `1px solid ${W.border}` }}>
          <div style={{ fontSize: 11, color: W.light, fontFamily: font, lineHeight: 1.6 }}>
            <strong style={{ color: W.text }}>Why one screen:</strong> The customer sees immediate value (checked in + stamp card)
            before being asked for their phone number. The phone input feels like saving their progress,
            not creating an account. No skip — phone is the identity layer.
          </div>
        </div>
      </div>
    </div>
  );
}

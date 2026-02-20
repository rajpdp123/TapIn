import { useState } from "react";

// ─── Wire palette (greyscale — no branding yet) ───
const W = {
  bg: "#F5F5F5", card: "#FFFFFF", border: "#DDDDDD",
  text: "#333333", light: "#999999", filled: "#BBBBBB",
  empty: "#EEEEEE", darkBg: "#E8E8E8",
};
const font = "'Inter', system-ui, sans-serif";
const J3 = "#AA7755";

// ─── Reusable Components ───

function Phone({ children, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        padding: "3px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700,
        fontFamily: font, letterSpacing: 0.8, textTransform: "uppercase",
        background: J3, color: "#fff",
      }}>Journey 3</div>
      <div style={{
        width: 300, height: 600, borderRadius: 36, border: `2px solid ${W.border}`,
        background: W.bg, overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${W.border}` }}>
          <div style={{ width: 80, height: 6, borderRadius: 3, background: W.border }} />
        </div>
        <div style={{ height: 556, overflowY: "auto" }}>{children}</div>
      </div>
      <div style={{ fontSize: 11, color: J3, fontFamily: font, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>
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
// SCREEN 3A: REWARD UNLOCKED + EMAIL CAPTURE
// 10th visit → celebration → stamps verified →
// email required to merge TapIn ↔ Mindbody →
// "Claim Free Class" button.
// ═══════════════════════════════════════════════════

function J3_RewardUnlocked() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, height: "100%", background: W.darkBg }}>
      <div style={{ height: 8 }} />

      {/* Celebration placeholder */}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        border: `2px dashed ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color: W.light, fontFamily: font, textAlign: "center",
      }}>confetti<br />animation</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: W.text, fontFamily: font }}>
          Free class earned!
        </div>
        <div style={{ fontSize: 12, color: W.light, fontFamily: font, marginTop: 4, lineHeight: 1.5 }}>
          10 visits completed — you're amazing.
        </div>
      </div>

      {/* Full stamp card */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 14,
        border: `1.5px solid ${W.border}`, background: W.card,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>
            Complete!
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>10/10</span>
        </div>
        <StampGrid filled={10} />
        <ProgressBar value={10} />
      </div>

      {/* Mindbody verification */}
      <div style={{
        width: "100%", padding: 10, borderRadius: 10,
        border: `1px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: W.filled, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 10, color: W.card, flexShrink: 0,
        }}>✓</div>
        <div style={{ fontSize: 10, color: W.light, fontFamily: font, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600, color: W.text }}>Visits verified</span> — 10 stamps matched to Mindbody class history
        </div>
      </div>

      {/* Divider — email required to proceed */}
      <div style={{
        width: "100%", display: "flex", alignItems: "center", gap: 8,
        padding: "2px 0",
      }}>
        <div style={{ flex: 1, height: 1, background: W.border }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>
          One more step
        </span>
        <div style={{ flex: 1, height: 1, background: W.border }} />
      </div>

      {/* Name + Email — required to merge accounts */}
      <div style={{
        width: "100%", padding: 12, borderRadius: 12,
        border: `1.5px solid ${W.text}`, background: W.card,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 4 }}>
          Claim your free class
        </div>
        <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginBottom: 10, lineHeight: 1.5 }}>
          Enter your name so we can find your Mindbody account, and your email so we can send your booking confirmation.
        </div>

        {/* Name field */}
        <div style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 4 }}>Name</div>
        <div style={{
          padding: "10px 12px", borderRadius: 8,
          border: `1.5px solid ${W.border}`, background: W.bg,
          display: "flex", alignItems: "center", gap: 8,
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 12, color: W.light }}>👤</span>
          <div style={{ height: 8, width: "50%", borderRadius: 4, background: W.empty }} />
        </div>

        {/* Email field */}
        <div style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 4 }}>Email</div>
        <div style={{
          padding: "10px 12px", borderRadius: 8,
          border: `1.5px solid ${W.border}`, background: W.bg,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 12, color: W.light }}>✉</span>
          <div style={{ height: 8, width: "60%", borderRadius: 4, background: W.empty }} />
        </div>
        <div style={{ fontSize: 9, color: W.light, fontFamily: font, marginTop: 4 }}>
          Name must match your Mindbody / Urban Sports Club account
        </div>
      </div>

      <div style={{
        width: "100%", padding: "14px 0", borderRadius: 10,
        border: `2px solid ${W.text}`, background: W.text,
        color: W.card, textAlign: "center", fontSize: 14,
        fontWeight: 700, fontFamily: font,
      }}>
        Claim Free Class →
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN 3B: ACCOUNTS MERGED + FREE CLASS CREDITED
// Email matched → TapIn ↔ Mindbody merged →
// free class credited → stamp card resets →
// new cycle begins.
// ═══════════════════════════════════════════════════

function J3_Confirmed() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, height: "100%" }}>
      <div style={{ height: 16 }} />

      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        border: `2px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
      }}>🎁</div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: W.text, fontFamily: font }}>
          You're all set!
        </div>
        <div style={{ fontSize: 12, color: W.light, fontFamily: font, marginTop: 4, lineHeight: 1.5 }}>
          Your accounts are linked and your free class is ready.
        </div>
      </div>

      {/* Account merge confirmation */}
      <div style={{
        width: "100%", padding: 12, borderRadius: 12,
        border: `1.5px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: W.filled, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14, color: W.card, flexShrink: 0,
        }}>✓</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: W.text, fontFamily: font }}>
            TapIn → Mindbody linked
          </div>
          <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 2 }}>
            Your visits are now connected to your account
          </div>
        </div>
      </div>

      {/* Free class credited */}
      <div style={{
        width: "100%", padding: 12, borderRadius: 12,
        border: `1.5px solid ${W.border}`, background: W.card,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: W.filled, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14, color: W.card, flexShrink: 0,
        }}>✓</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: W.text, fontFamily: font }}>
            Free class added
          </div>
          <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 2 }}>
            Credited to your Mindbody account — book anytime
          </div>
        </div>
      </div>

      {/* Reset stamp card */}
      <div style={{
        width: "100%", padding: 14, borderRadius: 14,
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

      <div style={{ flex: 1 }} />

      <div style={{
        width: "100%", padding: "14px 0", borderRadius: 10,
        border: `2px solid ${W.text}`, background: W.text,
        color: W.card, textAlign: "center", fontSize: 14,
        fontWeight: 700, fontFamily: font,
      }}>
        Done ✓
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════════════

export default function J3Wireframe() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "40px 20px", fontFamily: font }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: W.text, margin: "0 0 6px" }}>
          TapIn — Journey 3: Reward & Redemption
        </h1>
        <p style={{ fontSize: 13, color: W.light, margin: "0 0 4px" }}>
          Step 3 · Lo-fi wireframes — 2 screens
        </p>
      </div>

      {/* Journey description */}
      <div style={{
        maxWidth: 640, margin: "0 auto 32px", padding: 16, borderRadius: 12,
        background: W.card, border: `1px solid ${W.border}`, textAlign: "center",
      }}>
        <div style={{ fontSize: 12, color: W.text, fontFamily: font, lineHeight: 1.7 }}>
          <strong>Scenario:</strong> Customer taps NFC for the 10th time → celebration →
          stamps verified against Mindbody → name + email collected to merge TapIn ↔ Mindbody accounts →
          free class credited → stamp card resets → new cycle begins.
        </div>
      </div>

      {/* ── Two screens ── */}
      <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start" }}>
        <Phone label="3A · Reward + Account Link">
          <J3_RewardUnlocked />
        </Phone>

        <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: W.border, alignSelf: "center" }}>→</div>

        <Phone label="3B · Linked + Credited">
          <J3_Confirmed />
        </Phone>
      </div>

      {/* ── Flow Summary ── */}
      <div style={{
        maxWidth: 640, margin: "48px auto 0", padding: 20, background: W.card,
        borderRadius: 12, border: `1px solid ${W.border}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 12 }}>
          Journey 3 · Flow Summary
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { screen: "3A", title: "Reward + Account Link", desc: "10th NFC tap → celebration → full stamp card (10/10) → stamps verified against Mindbody → name to find Mindbody account + email to complete profile → \"Claim Free Class\" button." },
            { screen: "3B", title: "Linked + Credited", desc: "Accounts merged → free class credited to Mindbody → stamp card resets to 0/10 → \"Done\". New loyalty cycle begins." },
          ].map(item => (
            <div key={item.screen} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                padding: "2px 7px", borderRadius: 4, flexShrink: 0,
                background: J3, fontSize: 9, fontWeight: 700,
                color: "#fff", fontFamily: font,
              }}>{item.screen}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: W.text, fontFamily: font }}>{item.title}</div>
                <div style={{ fontSize: 11, color: W.light, fontFamily: font, marginTop: 2, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 10, borderRadius: 8, background: "#F8F8F8", border: `1px solid ${W.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 4 }}>
            Design Decisions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              "Name is the MATCH KEY — finds the customer's existing Mindbody account (USC ghost accounts have names)",
              "Email is NEW DATA — we don't have it yet, collected here to complete the customer profile",
              "TapIn stamps verified one-way against Mindbody class history — ensures legitimacy",
              "Free class is only credited AFTER accounts are linked — not before",
              "Hint on name: 'Must match your Mindbody / USC account' — reduces lookup errors",
              "Celebration screen is separate — the reward moment deserves its own space",
              "Stamp card resets after credit confirmation — new cycle starts immediately",
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 9, color: J3, fontFamily: font, marginTop: 1 }}>●</span>
                <span style={{ fontSize: 11, color: W.light, fontFamily: font, lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

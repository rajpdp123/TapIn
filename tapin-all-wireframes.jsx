import { useState } from "react";

// ─── Wire palette (greyscale — no branding yet) ───
const W = {
  bg: "#F5F5F5", card: "#FFFFFF", border: "#DDDDDD",
  text: "#333333", light: "#999999", filled: "#BBBBBB",
  empty: "#EEEEEE", darkBg: "#E8E8E8",
};
const font = "'Inter', system-ui, sans-serif";

// Journey colours
const C = {
  home: "#557799",
  j1: "#3D7B5F",
  j2: "#5577AA",
  j3: "#AA7755",
  profile: "#886699",
};

// ─── Shared Phone Frame (compact) ───
function Phone({ children, label, color, size = "normal" }) {
  const w = size === "small" ? 240 : 260;
  const h = size === "small" ? 480 : 520;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: w, height: h, borderRadius: 28, border: `2px solid ${W.border}`,
        background: W.bg, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${W.border}` }}>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: W.border }} />
        </div>
        <div style={{ height: h - 32, overflowY: "auto" }}>{children}</div>
      </div>
      <div style={{ fontSize: 9, color, fontFamily: font, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, textAlign: "center", maxWidth: w }}>
        {label}
      </div>
    </div>
  );
}

// ─── Stamp Grid (5-col for journey screens) ───
function StampGrid({ filled, total = 10, mini = false }) {
  if (mini) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 2 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: 3,
            border: `1px solid ${i < filled ? W.filled : W.border}`,
            background: i < filled ? W.filled : W.empty,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 6, fontFamily: font, color: i < filled ? W.card : W.light, fontWeight: 700,
          }}>{i < filled ? "✓" : ""}</div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          aspectRatio: "1", borderRadius: 6,
          border: `1px solid ${i < filled ? W.filled : W.border}`,
          background: i < filled ? W.filled : W.empty,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontFamily: font, color: i < filled ? W.card : W.light, fontWeight: 600,
        }}>{i < filled ? "✓" : i + 1}</div>
      ))}
    </div>
  );
}

function Bar({ value, max = 10 }) {
  return (
    <div style={{ height: 4, borderRadius: 2, background: W.empty, marginTop: 6 }}>
      <div style={{ height: "100%", borderRadius: 2, background: W.filled, width: `${(value / max) * 100}%` }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// HOME SCREEN (compact)
// ═══════════════════════════════════════════════════
function HomeScreen() {
  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 8, color: W.light, fontFamily: font }}>Welcome back</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: W.text, fontFamily: font }}>Good Moves</div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: W.filled, border: `2px solid ${W.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: W.card, position: "relative",
        }}>
          👤
          <div style={{ position: "absolute", top: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#DD6644", border: `1.5px solid ${W.bg}` }} />
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: 10, borderRadius: 10, border: `1px solid ${W.border}`, background: W.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: W.text, fontFamily: font }}>Your Progress</span>
          <span style={{ fontSize: 9, color: W.light, fontFamily: font }}>4/10</span>
        </div>
        <StampGrid filled={4} mini />
        <Bar value={4} />
        <div style={{ fontSize: 8, color: W.light, fontFamily: font, marginTop: 4 }}>Nice momentum — keep going!</div>
        <div style={{ marginTop: 6, padding: "4px 8px", borderRadius: 6, background: W.darkBg, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10 }}>🎁</span>
          <span style={{ fontSize: 8, color: W.text, fontFamily: font }}><strong>Reward:</strong> Free class at visit 10</span>
        </div>
      </div>

      {/* Schedule */}
      <div style={{ padding: 10, borderRadius: 10, border: `1px solid ${W.border}`, background: W.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: W.text, fontFamily: font }}>Today's Classes</span>
          <span style={{ fontSize: 7, color: C.home, fontFamily: font, fontWeight: 600 }}>View all →</span>
        </div>
        {[
          { time: "07:00", name: "Morning Flow", teacher: "Tara", spots: 3 },
          { time: "09:30", name: "Reformer Basics", teacher: "Elena", spots: 1 },
          { time: "12:00", name: "Power Mat", teacher: "Petra", spots: 5 },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 6px", borderRadius: 6, background: i === 0 ? W.darkBg : "transparent", marginBottom: 3 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: W.text, fontFamily: font, width: 30 }}>{s.time}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: W.text, fontFamily: font }}>{s.name}</div>
              <div style={{ fontSize: 7, color: W.light, fontFamily: font }}>{s.teacher} · {s.spots} spots</div>
            </div>
            <div style={{ padding: "2px 6px", borderRadius: 4, border: `1px solid ${W.border}`, fontSize: 7, fontWeight: 600, color: W.text, fontFamily: font }}>Book</div>
          </div>
        ))}
      </div>

      {/* Deals */}
      <div style={{ padding: 10, borderRadius: 10, border: `1px solid ${W.border}`, background: W.card }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 6 }}>Deals & Perks</div>
        {[
          { emoji: "☕", title: "Early Bird Perk", desc: "5 morning classes → free coffee" },
          { emoji: "🧘", title: "Bring a Friend", desc: "3 classes with a friend → both get 1 free" },
        ].map((d, i) => (
          <div key={i} style={{ display: "flex", gap: 6, padding: "6px 8px", borderRadius: 6, border: `1px solid ${W.border}`, background: W.bg, marginBottom: 4 }}>
            <span style={{ fontSize: 14 }}>{d.emoji}</span>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: W.text, fontFamily: font }}>{d.title}</div>
              <div style={{ fontSize: 8, color: W.light, fontFamily: font }}>{d.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PROFILE SCREEN (compact)
// ═══════════════════════════════════════════════════
function ProfileScreen() {
  const fields = [
    { icon: "📱", label: "Phone", value: "+49 170 •••• 89", filled: true },
    { icon: "👤", label: "Name", placeholder: "Add your name", filled: false },
    { icon: "✉", label: "Email", placeholder: "Add your email", filled: false },
    { icon: "🎂", label: "Birthday", placeholder: "Add for a surprise", filled: false },
    { icon: "🧘", label: "Preferred class", placeholder: "e.g. Morning Flow", filled: false },
  ];
  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 12, color: W.text }}>←</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>Back</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: W.filled, border: `2px solid ${W.border}`, margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: W.card }}>👤</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: W.text, fontFamily: font }}>Your Profile</div>
        <div style={{ fontSize: 8, color: W.light, fontFamily: font }}>Complete your info</div>
      </div>
      <div style={{ padding: "6px 10px", borderRadius: 6, background: W.darkBg, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: W.empty }}>
          <div style={{ height: "100%", borderRadius: 2, background: W.filled, width: "20%" }} />
        </div>
        <span style={{ fontSize: 8, fontWeight: 600, color: W.text, fontFamily: font }}>1/5</span>
      </div>
      <div style={{ borderRadius: 10, border: `1px solid ${W.border}`, background: W.card, overflow: "hidden" }}>
        {fields.map((f, i) => (
          <div key={i} style={{ padding: "8px 10px", borderBottom: i < fields.length - 1 ? `1px solid ${W.empty}` : "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>{f.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
              {f.filled
                ? <div style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font, marginTop: 1 }}>{f.value}</div>
                : <div style={{ fontSize: 9, color: W.border, fontFamily: font, fontStyle: "italic", marginTop: 1 }}>{f.placeholder}</div>
              }
            </div>
            {f.filled
              ? <div style={{ width: 16, height: 16, borderRadius: "50%", background: W.filled, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: W.card }}>✓</div>
              : <span style={{ fontSize: 8, color: C.home, fontWeight: 600, fontFamily: font }}>Add →</span>
            }
          </div>
        ))}
      </div>
      <div style={{ padding: 8, borderRadius: 8, background: W.darkBg, border: `1px solid ${W.border}` }}>
        <div style={{ fontSize: 8, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 2 }}>Why we ask</div>
        <div style={{ fontSize: 8, color: W.light, fontFamily: font, lineHeight: 1.4 }}>Name + email link visits to Mindbody for rewards. We never share your data.</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// J1: FIRST CHECK-IN (compact)
// ═══════════════════════════════════════════════════
function J1Screen() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: "100%" }}>
      <div style={{ padding: "3px 8px", borderRadius: 14, border: `1px solid ${W.border}`, fontSize: 8, color: W.light, fontFamily: font }}>Studio Name</div>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${W.border}`, background: W.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: W.filled }}>✓</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: W.text, fontFamily: font }}>You're checked in!</div>
        <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 2 }}>Visit 1 of 10 — welcome!</div>
      </div>
      <div style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${W.border}`, background: W.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.8 }}>Your Progress</span>
          <span style={{ fontSize: 8, fontWeight: 600, color: W.text, fontFamily: font }}>1/10</span>
        </div>
        <StampGrid filled={1} />
        <Bar value={1} />
      </div>
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ height: 1, flex: 1, background: W.border }} />
        <span style={{ fontSize: 7, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.8 }}>Save your progress</span>
        <div style={{ height: 1, flex: 1, background: W.border }} />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: W.text, fontFamily: font }}>Enter your phone number</div>
        <div style={{ fontSize: 8, color: W.light, fontFamily: font }}>So we remember you next time.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 8, border: `1px solid ${W.border}`, background: W.card }}>
          <span style={{ fontSize: 10, color: W.light, fontFamily: font }}>🇩🇪 +49</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: W.empty }} />
        </div>
        <div style={{ fontSize: 7, color: W.light, fontFamily: font }}>Only stored as hash · no spam · text DELETE to remove</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: W.text, color: W.card, textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: font }}>Save & Continue →</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// J2: INSTANT CHECK-IN (compact)
// ═══════════════════════════════════════════════════
function J2Screen() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: "100%" }}>
      <div style={{ height: 6 }} />
      <div style={{ padding: "3px 10px", borderRadius: 14, border: `1px solid ${W.border}`, fontSize: 8, color: W.light, fontFamily: font }}>Welcome back — instant check-in</div>
      <div style={{ width: 46, height: 46, borderRadius: "50%", border: `2px solid ${W.border}`, background: W.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: W.filled }}>✓</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: W.text, fontFamily: font }}>You're checked in!</div>
        <div style={{ fontSize: 10, color: W.light, fontFamily: font, marginTop: 2 }}>Visit 7 of 10 — keep going!</div>
      </div>
      <div style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${W.border}`, background: W.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.8 }}>Your Progress</span>
          <span style={{ fontSize: 8, fontWeight: 600, color: W.text, fontFamily: font }}>7/10</span>
        </div>
        <StampGrid filled={7} />
        <Bar value={7} />
      </div>
      <div style={{ fontSize: 9, color: W.light, fontFamily: font }}>3 more visits to your free class!</div>
      <div style={{ flex: 1 }} />
      <div style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: W.text, color: W.card, textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: font }}>Done</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// J3A: REWARD + ACCOUNT LINK (compact)
// ═══════════════════════════════════════════════════
function J3AScreen() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", background: W.darkBg }}>
      <div style={{ height: 4 }} />
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px dashed ${W.border}`, background: W.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: W.light, fontFamily: font, textAlign: "center" }}>confetti</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: W.text, fontFamily: font }}>Free class earned!</div>
        <div style={{ fontSize: 9, color: W.light, fontFamily: font, marginTop: 2 }}>10 visits completed</div>
      </div>
      <div style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${W.border}`, background: W.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase" }}>Complete!</span>
          <span style={{ fontSize: 8, fontWeight: 600, color: W.text, fontFamily: font }}>10/10</span>
        </div>
        <StampGrid filled={10} />
        <Bar value={10} />
      </div>
      {/* Verified */}
      <div style={{ width: "100%", padding: 6, borderRadius: 6, border: `1px solid ${W.border}`, background: W.card, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, background: W.filled, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: W.card }}>✓</div>
        <span style={{ fontSize: 8, color: W.light, fontFamily: font }}><strong style={{ color: W.text }}>Verified</strong> — matched to Mindbody</span>
      </div>
      {/* Divider */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ height: 1, flex: 1, background: W.border }} />
        <span style={{ fontSize: 7, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.8 }}>One more step</span>
        <div style={{ height: 1, flex: 1, background: W.border }} />
      </div>
      {/* Name + Email */}
      <div style={{ width: "100%", padding: 10, borderRadius: 10, border: `1.5px solid ${W.text}`, background: W.card }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 2 }}>Claim your free class</div>
        <div style={{ fontSize: 8, color: W.light, fontFamily: font, marginBottom: 6, lineHeight: 1.4 }}>Name to find your Mindbody account, email for confirmation.</div>
        <div style={{ fontSize: 8, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 2 }}>Name</div>
        <div style={{ padding: "6px 8px", borderRadius: 6, border: `1px solid ${W.border}`, background: W.bg, display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: W.light }}>👤</span>
          <div style={{ height: 6, width: "50%", borderRadius: 3, background: W.empty }} />
        </div>
        <div style={{ fontSize: 8, fontWeight: 600, color: W.text, fontFamily: font, marginBottom: 2 }}>Email</div>
        <div style={{ padding: "6px 8px", borderRadius: 6, border: `1px solid ${W.border}`, background: W.bg, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: W.light }}>✉</span>
          <div style={{ height: 6, width: "60%", borderRadius: 3, background: W.empty }} />
        </div>
        <div style={{ fontSize: 7, color: W.light, fontFamily: font, marginTop: 3 }}>Name must match Mindbody / USC account</div>
      </div>
      <div style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: W.text, color: W.card, textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: font }}>Claim Free Class →</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// J3B: LINKED + CREDITED (compact)
// ═══════════════════════════════════════════════════
function J3BScreen() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: "100%" }}>
      <div style={{ height: 10 }} />
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${W.border}`, background: W.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎁</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: W.text, fontFamily: font }}>You're all set!</div>
        <div style={{ fontSize: 9, color: W.light, fontFamily: font, marginTop: 2, lineHeight: 1.4 }}>Accounts linked, free class ready.</div>
      </div>
      {/* Confirmations */}
      {[
        { title: "TapIn → Mindbody linked", sub: "Visits connected to your account" },
        { title: "Free class added", sub: "Credited to Mindbody — book anytime" },
      ].map((item, i) => (
        <div key={i} style={{ width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${W.border}`, background: W.card, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: W.filled, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: W.card }}>✓</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: W.text, fontFamily: font }}>{item.title}</div>
            <div style={{ fontSize: 8, color: W.light, fontFamily: font }}>{item.sub}</div>
          </div>
        </div>
      ))}
      {/* Reset card */}
      <div style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${W.border}`, background: W.card, textAlign: "center" }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: W.light, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Stamp card reset</div>
        <StampGrid filled={0} />
        <Bar value={0} />
        <div style={{ fontSize: 9, color: W.light, fontFamily: font, marginTop: 6 }}>See you for the next 10!</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: W.text, color: W.card, textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: font }}>Done ✓</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════════
function SectionHeader({ color, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <div style={{ padding: "4px 14px", borderRadius: 8, background: color, color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: font, letterSpacing: 0.8, textTransform: "uppercase", display: "inline-block", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 11, color: W.light, fontFamily: font }}>{subtitle}</div>
    </div>
  );
}

function Arrow() {
  return <div style={{ display: "flex", alignItems: "center", fontSize: 20, color: W.border, alignSelf: "center", padding: "0 4px" }}>→</div>;
}

// ═══════════════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════════════
export default function AllWireframes() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "40px 20px", fontFamily: font }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: W.text, margin: "0 0 6px" }}>
          TapIn — All Wireframes
        </h1>
        <p style={{ fontSize: 13, color: W.light, margin: 0 }}>Step 3 · Complete lo-fi wireframe overview · 6 screens</p>
      </div>

      {/* Flow description */}
      <div style={{ maxWidth: 800, margin: "0 auto 40px", padding: 16, borderRadius: 12, background: W.card, border: `1px solid ${W.border}`, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: W.text, fontFamily: font, lineHeight: 1.7 }}>
          <strong>Complete flow:</strong> Home (dashboard + profile) → J1: First NFC tap + phone capture →
          J2: Instant check-ins (visits 2–9) → J3: Reward + account link → free class credited → reset
        </div>
      </div>

      {/* ═══ ROW 1: HOME + PROFILE ═══ */}
      <SectionHeader color={C.home} title="Home" subtitle="Dashboard + User Profile (click avatar)" />
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start", marginBottom: 48 }}>
        <Phone label="Home · Dashboard" color={C.home}>
          <HomeScreen />
        </Phone>
        <Arrow />
        <Phone label="User Profile" color={C.profile}>
          <ProfileScreen />
        </Phone>
      </div>

      {/* ═══ ROW 2: JOURNEY 1 ═══ */}
      <SectionHeader color={C.j1} title="Journey 1" subtitle="First Check-in — NFC tap → phone capture (1 screen)" />
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start", marginBottom: 48 }}>
        <Phone label="First Check-in" color={C.j1}>
          <J1Screen />
        </Phone>
      </div>

      {/* ═══ ROW 3: JOURNEY 2 ═══ */}
      <SectionHeader color={C.j2} title="Journey 2" subtitle="Progressive Check-ins — visits 2–9, zero friction (1 screen)" />
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start", marginBottom: 48 }}>
        <Phone label="Instant Check-in (7/10)" color={C.j2}>
          <J2Screen />
        </Phone>
      </div>

      {/* ═══ ROW 4: JOURNEY 3 ═══ */}
      <SectionHeader color={C.j3} title="Journey 3" subtitle="Reward & Redemption — name/email to merge accounts (2 screens)" />
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start", marginBottom: 48 }}>
        <Phone label="3A · Reward + Account Link" color={C.j3}>
          <J3AScreen />
        </Phone>
        <Arrow />
        <Phone label="3B · Linked + Credited" color={C.j3}>
          <J3BScreen />
        </Phone>
      </div>

      {/* ═══ SUMMARY ═══ */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 24, background: W.card, borderRadius: 14, border: `1px solid ${W.border}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: W.text, fontFamily: font, marginBottom: 16, textAlign: "center" }}>
          Screen Inventory
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "8px 14px", alignItems: "center" }}>
          {[
            { badge: "Home", color: C.home, name: "Dashboard", data: "Progress, schedule, deals" },
            { badge: "Profile", color: C.profile, name: "User Profile", data: "Phone (filled), name, email, birthday, pref class" },
            { badge: "J1", color: C.j1, name: "First Check-in", data: "Check-in + phone capture (required)" },
            { badge: "J2", color: C.j2, name: "Instant Check-in", data: "Visits 2–9, zero friction" },
            { badge: "J3·A", color: C.j3, name: "Reward + Account Link", data: "10/10, verified, name + email → claim" },
            { badge: "J3·B", color: C.j3, name: "Linked + Credited", data: "Merged, free class added, reset to 0/10" },
          ].map((r, i) => (
            <>
              <div key={`b${i}`} style={{ padding: "2px 8px", borderRadius: 4, background: r.color, fontSize: 8, fontWeight: 700, color: "#fff", fontFamily: font, textAlign: "center" }}>{r.badge}</div>
              <div key={`n${i}`} style={{ fontSize: 12, fontWeight: 600, color: W.text, fontFamily: font }}>{r.name}</div>
              <div key={`d${i}`} style={{ fontSize: 10, color: W.light, fontFamily: font }}>{r.data}</div>
            </>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: "#F8F8F8", border: `1px solid ${W.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: W.text, fontFamily: font, marginBottom: 8 }}>Data Collection Strategy</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "6px 12px", fontSize: 10, fontFamily: font }}>
            <div style={{ fontWeight: 700, color: W.text }}>When</div>
            <div style={{ fontWeight: 700, color: W.text }}>What</div>
            <div style={{ fontWeight: 700, color: W.text }}>Why</div>

            <div style={{ color: C.j1 }}>J1 (visit 1)</div>
            <div style={{ color: W.light }}>Phone number</div>
            <div style={{ color: W.light }}>Identity layer — persist across visits</div>

            <div style={{ color: C.home }}>Profile (anytime)</div>
            <div style={{ color: W.light }}>Name, email, birthday, pref</div>
            <div style={{ color: W.light }}>Optional early — pre-fills J3</div>

            <div style={{ color: C.j3 }}>J3 (visit 10)</div>
            <div style={{ color: W.light }}>Name (match) + email (new)</div>
            <div style={{ color: W.light }}>Merge TapIn ↔ Mindbody → credit free class</div>
          </div>
        </div>
      </div>
    </div>
  );
}
